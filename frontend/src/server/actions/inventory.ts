"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { z } from "zod";

const inventorySchema = z.object({
  variantId: z.coerce.number(),
  quantity: z.coerce.number(),
  minStock: z.coerce.number().default(0),
  maxStock: z.coerce.number().optional(),
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
  const raw = Object.fromEntries(formData);
  const parsed = inventorySchema.parse(raw);

  await prisma.$transaction(async (tx) => {
    const existing = await tx.globalInventory.findUnique({
      where: { variantId: parsed.variantId },
    });

    if (existing) {
      await tx.globalInventory.update({
        where: { variantId: parsed.variantId },
        data: {
          quantity: parsed.quantity,
          minStock: parsed.minStock,
          maxStock: parsed.maxStock,
        },
      });
    } else {
      await tx.globalInventory.create({
        data: {
          variantId: parsed.variantId,
          quantity: parsed.quantity,
          minStock: parsed.minStock,
          maxStock: parsed.maxStock,
        },
      });
    }

    await tx.inventoryMovement.create({
      data: {
        variantId: parsed.variantId,
        movementType: "adjustment",
        quantity: parsed.quantity - (existing?.quantity ?? 0),
        notes: `Ajuste manual a ${parsed.quantity}`,
        createdBy: "admin",
      },
    });
  });

  revalidatePath("/admin/inventario");
}
