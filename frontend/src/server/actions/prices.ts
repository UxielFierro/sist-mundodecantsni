"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { z } from "zod";

const costSchema = z.object({
  variantId: z.coerce.number().int().positive(),
  unitCost: z.coerce.number().min(0),
  suppliesCost: z.coerce.number().min(0).optional(),
  shippingCost: z.coerce.number().min(0).optional(),
  finalPrice: z.coerce.number().min(0),
  reason: z.string().max(200).optional(),
});

export async function setPrice(formData: FormData) {
  const actor = await requireAdmin();
  const raw = Object.fromEntries(formData);
  const parsed = costSchema.parse(raw);

  const [variant, config] = await Promise.all([
    prisma.productVariant.findUnique({
      where: { id: parsed.variantId },
      include: { presentation: true, product: { select: { slug: true, id: true } } },
    }),
    prisma.systemConfig.findFirst(),
  ]);

  if (!variant) throw new Error("Variante no encontrada");

  const suppliesCost = parsed.suppliesCost ?? Number(config?.standardSuppliesCost ?? 733);
  const shippingCost = parsed.shippingCost ?? Number(config?.standardShippingCost ?? 185);
  const posFeePercent = Number(config?.posFeePercentage ?? 7);

  const unitMl =
    variant.presentation.unitType === "ml"
      ? Number(variant.presentation.unitValue ?? variant.presentation.quantity ?? 1)
      : 1;
  const totalCost = parsed.unitCost + suppliesCost + shippingCost;
  const netCost = totalCost * (1 + posFeePercent / 100);
  const pricePerMl = unitMl > 0 ? netCost / unitMl : null;
  const basePrice5ml = pricePerMl ? pricePerMl * 5 : null;
  const basePrice10ml = pricePerMl ? pricePerMl * 10 : null;

  const current = await prisma.cost.findFirst({
    where: { variantId: parsed.variantId },
    orderBy: { effectiveDate: "desc" },
  });

  await prisma.$transaction(async (tx) => {
    if (current) {
      await tx.priceHistory.create({
        data: {
          variantId: parsed.variantId,
          oldPrice: current.finalPrice,
          newPrice: parsed.finalPrice,
          reason: parsed.reason?.trim() || null,
          changedBy: actor,
        },
      });
    }

    await tx.cost.create({
      data: {
        variantId: parsed.variantId,
        unitCost: parsed.unitCost,
        suppliesCost,
        shippingCost,
        netCost,
        pricePerMl,
        basePrice5ml,
        basePrice10ml,
        finalPrice: parsed.finalPrice,
        effectiveDate: new Date(),
      },
    });
  });

  revalidatePath("/admin/precios");
  revalidatePath(`/admin/productos/${variant.product.id}`);
  revalidatePath(`/perfume/${variant.product.slug}`);
  revalidatePath("/");
}
