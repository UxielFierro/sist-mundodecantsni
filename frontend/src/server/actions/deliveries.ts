"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const deliverySchema = z.object({
  locationId: z.coerce.number(),
  period: z.string().min(1, "El período es requerido"),
  notes: z.string().optional(),
});

const deliveryItemSchema = z.object({
  variantId: z.coerce.number(),
  quantity: z.coerce.number().min(1),
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
  const session = await auth();
  const user = session?.user?.email ?? session?.user?.name ?? "admin";
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

  await prisma.$transaction(async (tx) => {
    const delivery = await tx.locationDelivery.create({
      data: {
        locationId: parsed.locationId,
        period: parsed.period,
        notes: parsed.notes,
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
      });
      if (existing && existing.quantity < item.quantity) {
        throw new Error(`Stock insuficiente para variante ${item.variantId}`);
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
}

export async function revertDelivery(formData: FormData) {
  const session = await auth();
  const user = session?.user?.email ?? session?.user?.name ?? "admin";
  const deliveryId = z.coerce.number().parse(formData.get("deliveryId"));

  await prisma.$transaction(async (tx) => {
    const delivery = await tx.locationDelivery.findUnique({
      where: { id: deliveryId },
      include: { items: true },
    });

    if (!delivery) throw new Error("Entrega no encontrada");

    for (const item of delivery.items) {
      await tx.globalInventory.update({
        where: { variantId: item.variantId },
        data: { quantity: { increment: item.quantity } },
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
          movementType: "delivery_to_location",
          quantity: item.quantity,
          referenceType: "location_delivery",
          referenceId: delivery.id,
          locationId: delivery.locationId,
          createdBy: user,
          notes: "Revertido",
        },
      });
    }

    await tx.deliveryItem.deleteMany({ where: { deliveryId } });
    await tx.locationDelivery.delete({ where: { id: deliveryId } });
  });

  revalidatePath("/admin/entregas");
}
