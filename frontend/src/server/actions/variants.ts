"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { z } from "zod";

const variantSchema = z.object({
  productId: z.coerce.number(),
  presentationId: z.coerce.number(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  active: z.boolean().default(true),
});

function parsePrefixNumber(codigo: string, prefix: string): number {
  const n = parseInt(codigo.slice(prefix.length), 10);
  return Number.isFinite(n) ? n : 0;
}

async function getNextPrefixedCodigo(prefix: "MDN" | "SC"): Promise<string> {
  const [variants, products] = await Promise.all([
    prisma.productVariant.findMany({
      where: { codigo: { startsWith: prefix } },
      select: { codigo: true },
    }),
    prisma.product.findMany({
      where: { codigo: { startsWith: prefix } },
      select: { codigo: true },
    }),
  ]);

  let maxNum = 0;
  for (const v of variants) {
    maxNum = Math.max(maxNum, parsePrefixNumber(v.codigo, prefix));
  }
  for (const p of products) {
    maxNum = Math.max(maxNum, parsePrefixNumber(p.codigo, prefix));
  }

  return `${prefix}${String(maxNum + 1).padStart(4, "0")}`;
}

async function getNextVariantCodigo(productCodigo: string) {
  const existing = await prisma.productVariant.findFirst({
    where: { codigo: productCodigo },
  });

  if (!existing) return productCodigo;
  return getNextPrefixedCodigo("MDN");
}

export async function createVariant(formData: FormData) {
  await requireAdmin();
  const raw = Object.fromEntries(formData);
  const parsed = variantSchema.parse(raw);
  const sinCodigo = formData.get("sinCodigo") === "true";

  const [product, presentation] = await Promise.all([
    prisma.product.findUnique({ where: { id: parsed.productId } }),
    prisma.presentation.findUnique({ where: { id: parsed.presentationId } }),
  ]);
  if (!product || !presentation) throw new Error("Producto o presentación no encontrada");

  const duplicate = await prisma.productVariant.findUnique({
    where: {
      productId_presentationId: {
        productId: parsed.productId,
        presentationId: parsed.presentationId,
      },
    },
  });
  if (duplicate) {
    throw new Error(`Este producto ya tiene la presentación ${presentation.name}`);
  }

  const variantCodigo = sinCodigo
    ? await getNextPrefixedCodigo("SC")
    : await getNextVariantCodigo(product.codigo);

  await prisma.$transaction(async (tx) => {
    const variant = await tx.productVariant.create({
      data: {
        codigo: variantCodigo,
        productId: parsed.productId,
        presentationId: parsed.presentationId,
        sku: parsed.sku?.trim() || null,
        barcode: parsed.barcode?.trim() || null,
        active: parsed.active,
      },
    });

    await tx.globalInventory.create({
      data: {
        variantId: variant.id,
        quantity: 0,
        minStock: 0,
      },
    });
  });

  revalidatePath(`/admin/productos/${parsed.productId}`);
  revalidatePath("/admin/inventario");
  revalidatePath("/admin/precios");
  revalidatePath("/admin");
}

export async function assignNextMDNCode(variantId: number) {
  await requireAdmin();
  const nextCode = await getNextPrefixedCodigo("MDN");

  const variant = await prisma.productVariant.update({
    where: { id: variantId },
    data: { codigo: nextCode },
    select: { productId: true },
  });
  revalidatePath(`/admin/productos/${variant.productId}`);
  revalidatePath("/admin/inventario");
  revalidatePath("/admin/precios");
  return nextCode;
}

export async function toggleVariantActive(id: number, active: boolean) {
  await requireAdmin();
  const variant = await prisma.productVariant.update({
    where: { id },
    data: { active },
    select: { productId: true },
  });
  revalidatePath(`/admin/productos/${variant.productId}`);
  revalidatePath("/admin/inventario");
  revalidatePath("/");
}
