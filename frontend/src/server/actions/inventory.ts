"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { z } from "zod";

const inventorySchema = z.object({
  variantId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  minStock: z.coerce.number().int().min(0, "El stock mínimo no puede ser negativo").default(0),
  maxStock: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce.number().int().min(0).optional()
  ),
  mode: z.enum(["set", "add"]).default("set"),
  movementType: z.enum(["purchase", "adjustment", "return"]).default("adjustment"),
  notes: z.string().max(250).optional(),
});

export async function getGlobalInventory() {
  return prisma.globalInventory.findMany({
    include: {
      variant: {
        include: {
          product: true,
          presentation: true,
          costs: { take: 1, orderBy: { effectiveDate: "desc" } },
        },
      },
    },
    orderBy: { variant: { codigo: "asc" } },
  });
}

export async function adjustInventory(formData: FormData) {
  const actor = await requireAdmin();
  const raw = Object.fromEntries(formData);
  const parsed = inventorySchema.parse(raw);

  await prisma.$transaction(async (tx) => {
    const existing = await tx.globalInventory.findUnique({
      where: { variantId: parsed.variantId },
    });

    const prevQty = existing?.quantity ?? 0;
    const targetQty = parsed.mode === "add" ? prevQty + parsed.quantity : parsed.quantity;
    if (targetQty < 0) {
      throw new Error("El stock resultante no puede ser negativo");
    }

    const delta = targetQty - prevQty;

    if (existing) {
      await tx.globalInventory.update({
        where: { variantId: parsed.variantId },
        data: {
          quantity: targetQty,
          minStock: parsed.minStock,
          ...(parsed.maxStock !== undefined ? { maxStock: parsed.maxStock } : {}),
        },
      });
    } else {
      await tx.globalInventory.create({
        data: {
          variantId: parsed.variantId,
          quantity: targetQty,
          minStock: parsed.minStock,
          maxStock: parsed.maxStock,
        },
      });
    }

    if (delta !== 0 || !existing) {
      const defaultNote =
        parsed.mode === "add"
          ? `Ingreso de ${parsed.quantity} u. (total: ${targetQty})`
          : `Ajuste manual a ${targetQty}`;

      await tx.inventoryMovement.create({
        data: {
          variantId: parsed.variantId,
          movementType: parsed.mode === "add" && parsed.movementType === "adjustment" ? "purchase" : parsed.movementType,
          quantity: delta,
          notes: parsed.notes?.trim() || defaultNote,
          createdBy: actor,
        },
      });
    }
  });

  revalidatePath("/admin/inventario");
  revalidatePath("/admin");
  revalidatePath("/");
}
