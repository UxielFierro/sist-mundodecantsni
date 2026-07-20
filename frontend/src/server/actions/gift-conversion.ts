"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { auth } from "@/lib/auth";

const giftConversionSchema = z.object({
  productId: z.coerce.number(),
  variantId: z.coerce.number(),
  quantityMl: z.coerce.number().positive(),
  giftPresentationId: z.coerce.number(),
  reason: z.string().optional(),
});

export async function getGiftConversions() {
  return prisma.giftConversion.findMany({
    orderBy: { convertedAt: "desc" },
    include: {
      product: { select: { id: true, name: true, codigo: true, brand: { select: { name: true } } } },
      variant: { include: { presentation: true } },
      giftPresentation: { select: { id: true, name: true, quantity: true } },
    },
  });
}

export async function getConvertibleVariants() {
  const variants = await prisma.productVariant.findMany({
    where: {
      active: true,
      product: { active: true, isSupply: false },
      globalInventory: { quantity: { gt: 0 } },
    },
    include: {
      product: { select: { id: true, name: true, codigo: true } },
      presentation: true,
      globalInventory: true,
    },
    orderBy: { codigo: "asc" },
  });
  return variants.filter((v) => v.presentation.unitType !== "unidad" && v.presentation.quantity);
}

export async function createGiftConversion(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("No autorizado");

  const raw = Object.fromEntries(formData);
  const parsed = giftConversionSchema.parse(raw);

  const variant = await prisma.productVariant.findUnique({
    where: { id: parsed.variantId },
    include: {
      presentation: true,
      globalInventory: true,
      product: true,
    },
  });

  if (!variant) throw new Error("Variante no encontrada");
  if (!variant.presentation.quantity) throw new Error("La presentación no tiene cantidad definida");

  const giftPres = await prisma.presentation.findUnique({
    where: { id: parsed.giftPresentationId },
  });
  if (!giftPres?.quantity) throw new Error("Presentación de regalo no válida");

  const unitsToTake = Math.ceil(parsed.quantityMl / Number(variant.presentation.quantity));
  const currentStock = variant.globalInventory?.quantity ?? 0;

  if (unitsToTake > currentStock) {
    throw new Error(
      `Stock insuficiente. Disponible: ${currentStock} unidades (${currentStock * Number(variant.presentation.quantity)}ml), necesitas: ${unitsToTake} unidades (${parsed.quantityMl}ml)`
    );
  }

  const estimatedUnits = Math.floor(parsed.quantityMl / Number(giftPres.quantity));

  await prisma.$transaction(async (tx) => {
    await tx.globalInventory.update({
      where: { variantId: parsed.variantId },
      data: { quantity: { decrement: unitsToTake } },
    });

    await tx.inventoryMovement.create({
      data: {
        variantId: parsed.variantId,
        movementType: "conversion_to_gift",
        quantity: -unitsToTake,
        notes: `Conversión a regalías: ${parsed.quantityMl}ml → ~${estimatedUnits} x ${giftPres.name}`,
        createdBy: session.user!.email!,
      },
    });

    await tx.giftConversion.create({
      data: {
        productId: parsed.productId,
        variantId: parsed.variantId,
        quantityMl: parsed.quantityMl,
        giftPresentationId: parsed.giftPresentationId,
        estimatedUnits,
        reason: parsed.reason || null,
        createdBy: session.user.email,
      },
    });
  });

  revalidatePath("/admin/regalias");
}

export type GiftConversionList = Awaited<ReturnType<typeof getGiftConversions>>;
export type ConvertibleVariants = Awaited<ReturnType<typeof getConvertibleVariants>>;
