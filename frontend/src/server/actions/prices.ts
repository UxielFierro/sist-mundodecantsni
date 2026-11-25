"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { z } from "zod";

const costSchema = z.object({
  variantId: z.coerce.number().int().positive(),
  mode: z.enum(["bottle", "direct"]).default("bottle"),
  // Bottle mode fields
  bottleCost: z.coerce.number().min(0).optional(),
  bottleMl: z.coerce.number().positive().default(100),
  suppliesCost: z.coerce.number().min(0).optional(),
  shippingCost: z.coerce.number().min(0).optional(),
  // Direct mode field
  unitCost: z.coerce.number().min(0).optional(),
  finalPrice: z.coerce.number().min(0),
  reason: z.string().max(200).optional(),
});

const bottlePricingItemSchema = z.object({
  variantId: z.coerce.number().int().positive(),
  unitCost: z.coerce.number().min(0),
  suppliesCost: z.coerce.number().min(0),
  shippingCost: z.coerce.number().min(0),
  finalPrice: z.coerce.number().min(0),
});

const bottlePricingSchema = z.object({
  productId: z.coerce.number().int().positive(),
  bottleMl: z.coerce.number().positive(),
  bottleCost: z.coerce.number().min(0),
  suppliesCost: z.coerce.number().min(0),
  shippingCost: z.coerce.number().min(0),
  reason: z.string().max(200).optional(),
  items: z.array(bottlePricingItemSchema).min(1, "Seleccioná al menos una variante"),
});

const round2 = (n: number) => Math.round(n * 100) / 100;

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

  const posFeePercent = Number(config?.posFeePercentage ?? 7);
  const posMultiplier = 1 + posFeePercent / 100;
  const isMl = variant.presentation.unitType === "ml";
  const variantMl = isMl
    ? Math.max(1, Number(variant.presentation.unitValue ?? variant.presentation.quantity ?? 1))
    : 1;

  let savedUnitCost = 0;
  let savedSuppliesCost = 0;
  let savedShippingCost = 0;
  let netCost = 0;
  let pricePerMl: number | null = null;
  let basePrice5ml: number | null = null;
  let basePrice10ml: number | null = null;

  if (parsed.mode === "bottle" && isMl) {
    const bottleCost = parsed.bottleCost ?? parsed.unitCost ?? 0;
    const bottleMl = Math.max(1, parsed.bottleMl || 100);
    const fullSupplies = parsed.suppliesCost ?? Number(config?.standardSuppliesCost ?? 733);
    const fullShipping = parsed.shippingCost ?? Number(config?.standardShippingCost ?? 185);

    const bottleTotal = bottleCost + fullSupplies + fullShipping;
    const bottleNet = bottleTotal * posMultiplier;
    pricePerMl = round2(bottleNet / bottleMl);
    basePrice5ml = round2((bottleNet / bottleMl) * 5);
    basePrice10ml = round2((bottleNet / bottleMl) * 10);

    const factor = variantMl / bottleMl;
    savedUnitCost = round2(bottleCost * factor);
    savedSuppliesCost = round2(fullSupplies * factor);
    savedShippingCost = round2(fullShipping * factor);
    netCost = round2((bottleNet / bottleMl) * variantMl);
  } else {
    // Direct / fixed price mode (insumos, full bottles, promos, high-demand fixed price)
    savedUnitCost = round2(parsed.unitCost ?? 0);
    savedSuppliesCost = 0;
    savedShippingCost = 0;
    netCost = round2(savedUnitCost * posMultiplier);
    if (isMl && savedUnitCost > 0) {
      pricePerMl = round2(netCost / variantMl);
      basePrice5ml = round2((netCost / variantMl) * 5);
      basePrice10ml = round2((netCost / variantMl) * 10);
    }
  }

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
          reason:
            parsed.reason?.trim() ||
            (parsed.mode === "direct" ? "Precio fijo directo" : null),
          changedBy: actor,
        },
      });
    }

    await tx.cost.create({
      data: {
        variantId: parsed.variantId,
        unitCost: savedUnitCost,
        suppliesCost: savedSuppliesCost,
        shippingCost: savedShippingCost,
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

export async function applyBottlePricing(input: z.infer<typeof bottlePricingSchema>) {
  const actor = await requireAdmin();
  const parsed = bottlePricingSchema.parse(input);

  const [product, config] = await Promise.all([
    prisma.product.findUnique({
      where: { id: parsed.productId },
      select: { id: true, slug: true },
    }),
    prisma.systemConfig.findFirst(),
  ]);

  if (!product) throw new Error("Producto no encontrado");

  const posFeePercent = Number(config?.posFeePercentage ?? 7);
  const bottleTotalCost = parsed.bottleCost + parsed.suppliesCost + parsed.shippingCost;
  const bottleNetCost = bottleTotalCost * (1 + posFeePercent / 100);
  const pricePerMl = round2(bottleNetCost / parsed.bottleMl);
  const basePrice5ml = round2((bottleNetCost / parsed.bottleMl) * 5);
  const basePrice10ml = round2((bottleNetCost / parsed.bottleMl) * 10);

  await prisma.$transaction(async (tx) => {
    for (const item of parsed.items) {
      const current = await tx.cost.findFirst({
        where: { variantId: item.variantId },
        orderBy: { effectiveDate: "desc" },
      });

      const variantNetCost = round2(
        (item.unitCost + item.suppliesCost + item.shippingCost) * (1 + posFeePercent / 100)
      );

      if (current && Number(current.finalPrice) !== item.finalPrice) {
        await tx.priceHistory.create({
          data: {
            variantId: item.variantId,
            oldPrice: current.finalPrice,
            newPrice: item.finalPrice,
            reason:
              parsed.reason?.trim() ||
              `Cálculo desde frasco ${parsed.bottleMl}ml (C$ ${parsed.bottleCost})`,
            changedBy: actor,
          },
        });
      }

      await tx.cost.create({
        data: {
          variantId: item.variantId,
          unitCost: round2(item.unitCost),
          suppliesCost: round2(item.suppliesCost),
          shippingCost: round2(item.shippingCost),
          netCost: variantNetCost,
          pricePerMl,
          basePrice5ml,
          basePrice10ml,
          finalPrice: item.finalPrice,
          effectiveDate: new Date(),
        },
      });
    }
  });

  revalidatePath("/admin/precios");
  revalidatePath(`/admin/productos/${product.id}`);
  revalidatePath(`/perfume/${product.slug}`);
  revalidatePath("/");
}

export async function getVariantPriceHistory(variantId: number) {
  await requireAdmin();
  const rows = await prisma.priceHistory.findMany({
    where: { variantId },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  return rows.map((r) => ({
    id: r.id,
    oldPrice: r.oldPrice !== null ? Number(r.oldPrice) : null,
    newPrice: r.newPrice !== null ? Number(r.newPrice) : null,
    reason: r.reason,
    changedBy: r.changedBy,
    createdAt: r.createdAt.toISOString(),
  }));
}
