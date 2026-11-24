"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { z } from "zod";

const deliverySchema = z.object({
  locationId: z.coerce.number().int().positive(),
  period: z.string().min(1, "El período es requerido"),
  notes: z.string().optional(),
});

const deliveryItemSchema = z.object({
  variantId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1),
  unitCost: z.coerce.number().min(0),
});

export async function getDeliveries() {
  return prisma.locationDelivery.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      location: true,
      items: {
        include: {
          variant: {
            include: { product: true, presentation: true },
          },
        },
      },
    },
  });
}

export async function createDelivery(formData: FormData) {
  const user = await requireAdmin();
  const itemsRaw = formData.getAll("items");
  const parsed = deliverySchema.parse(Object.fromEntries(formData));
  const items: z.infer<typeof deliveryItemSchema>[] = [];

  for (const raw of itemsRaw) {
    try {
      const item = deliveryItemSchema.parse(JSON.parse(raw as string));
      items.push(item);
    } catch {
      continue;
    }
  }

  if (items.length === 0) {
    throw new Error("Debes agregar al menos un producto a la entrega");
  }

  await prisma.$transaction(async (tx) => {
    const delivery = await tx.locationDelivery.create({
      data: {
        locationId: parsed.locationId,
        period: parsed.period.trim(),
        notes: parsed.notes?.trim() || null,
        createdBy: user,
        items: {
          create: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
            unitCost: i.unitCost,
          })),
        },
      },
    });

    for (const item of items) {
      const existing = await tx.globalInventory.findUnique({
        where: { variantId: item.variantId },
        include: { variant: { include: { product: true, presentation: true } } },
      });

      if (!existing || existing.quantity < item.quantity) {
        const label = existing
          ? `${existing.variant.product.name} (${existing.variant.presentation.name})`
          : `variante #${item.variantId}`;
        throw new Error(
          `Stock insuficiente en bodega para ${label}. Disponible: ${existing?.quantity ?? 0}, solicitado: ${item.quantity}`
        );
      }

      await tx.globalInventory.update({
        where: { variantId: item.variantId },
        data: { quantity: { decrement: item.quantity } },
      });

      await tx.locationInventory.upsert({
        where: {
          locationId_variantId: {
            locationId: parsed.locationId,
            variantId: item.variantId,
          },
        },
        update: { quantity: { increment: item.quantity } },
        create: {
          locationId: parsed.locationId,
          variantId: item.variantId,
          quantity: item.quantity,
        },
      });

      await tx.inventoryMovement.create({
        data: {
          variantId: item.variantId,
          movementType: "delivery_to_location",
          quantity: -item.quantity,
          referenceType: "location_delivery",
          referenceId: delivery.id,
          locationId: parsed.locationId,
          createdBy: user,
        },
      });
    }
  });

  revalidatePath("/admin/entregas");
  revalidatePath("/admin/inventario");
  revalidatePath("/admin/espacios");
  revalidatePath(`/admin/espacios/${parsed.locationId}`);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function revertDelivery(formData: FormData) {
  const user = await requireAdmin();
  const deliveryId = z.coerce.number().parse(formData.get("deliveryId"));

  let locationId = 0;

  await prisma.$transaction(async (tx) => {
    const delivery = await tx.locationDelivery.findUnique({
      where: { id: deliveryId },
      include: { items: true },
    });

    if (!delivery) throw new Error("Entrega no encontrada");
    locationId = delivery.locationId;

    for (const item of delivery.items) {
      await tx.globalInventory.upsert({
        where: { variantId: item.variantId },
        update: { quantity: { increment: item.quantity } },
        create: { variantId: item.variantId, quantity: item.quantity, minStock: 0 },
      });

      const locInv = await tx.locationInventory.findUnique({
        where: {
          locationId_variantId: {
            locationId: delivery.locationId,
            variantId: item.variantId,
          },
        },
      });

      if (locInv) {
        const newQty = locInv.quantity - item.quantity;
        if (newQty <= 0) {
          await tx.locationInventory.delete({
            where: { id: locInv.id },
          });
        } else {
          await tx.locationInventory.update({
            where: { id: locInv.id },
            data: { quantity: { decrement: item.quantity } },
          });
        }
      }

      await tx.inventoryMovement.create({
        data: {
          variantId: item.variantId,
          movementType: "return",
          quantity: item.quantity,
          referenceType: "location_delivery",
          referenceId: delivery.id,
          locationId: delivery.locationId,
          createdBy: user,
          notes: "Entrega revertida",
        },
      });
    }

    await tx.deliveryItem.deleteMany({ where: { deliveryId } });
    await tx.locationDelivery.delete({ where: { id: deliveryId } });
  });

  revalidatePath("/admin/entregas");
  revalidatePath("/admin/inventario");
  revalidatePath("/admin/espacios");
  if (locationId) revalidatePath(`/admin/espacios/${locationId}`);
  revalidatePath("/admin");
  revalidatePath("/");
}
