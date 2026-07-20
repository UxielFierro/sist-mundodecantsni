"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { z } from "zod";

const costSchema = z.object({
  variantId: z.coerce.number(),
  unitCost: z.coerce.number().min(0),
  suppliesCost: z.coerce.number().default(733),
  shippingCost: z.coerce.number().default(185),
  finalPrice: z.coerce.number().min(0),
});

export async function setPrice(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = costSchema.parse(raw);

  const variant = await prisma.productVariant.findUnique({
    where: { id: parsed.variantId },
    include: { presentation: true },
  });
  if (!variant) throw new Error("Variante no encontrada");

  const unitMl = variant.presentation.unitType === "ml" ? Number(variant.presentation.unitValue ?? 1) : 1;
  const totalCost = parsed.unitCost + parsed.suppliesCost + parsed.shippingCost;
  const netCost = totalCost * 1.07;
  const pricePerMl = unitMl > 0 ? netCost / unitMl : null;
  const basePrice5ml = pricePerMl ? pricePerMl * 5 : null;
  const basePrice10ml = pricePerMl ? pricePerMl * 10 : null;

  const current = await prisma.cost.findFirst({
    where: { variantId: parsed.variantId },
    orderBy: { effectiveDate: "desc" },
  });

  if (current) {
    await prisma.priceHistory.create({
      data: {
        variantId: parsed.variantId,
        oldPrice: current.finalPrice,
        newPrice: parsed.finalPrice,
        changedBy: "admin",
      },
    });
  }

  await prisma.cost.create({
    data: {
      variantId: parsed.variantId,
      unitCost: parsed.unitCost,
      suppliesCost: parsed.suppliesCost,
      shippingCost: parsed.shippingCost,
      netCost,
      pricePerMl,
      basePrice5ml,
      basePrice10ml,
      finalPrice: parsed.finalPrice,
      effectiveDate: new Date(),
    },
  });

  revalidatePath("/admin/precios");
}
