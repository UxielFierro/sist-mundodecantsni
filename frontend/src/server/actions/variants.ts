"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { z } from "zod";

const variantSchema = z.object({
  productId: z.coerce.number(),
  presentationId: z.coerce.number(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  active: z.boolean().default(true),
});

async function getNextVariantCodigo(productCodigo: string) {
  const existing = await prisma.productVariant.findFirst({
    where: { codigo: productCodigo },
  });

  if (!existing) return productCodigo;

  const lastVariant = await prisma.productVariant.findFirst({
    where: { codigo: { startsWith: "MDN" } },
    orderBy: { codigo: "desc" },
    select: { codigo: true },
  });

  const lastProduct = await prisma.product.findFirst({
    orderBy: { codigo: "desc" },
    select: { codigo: true },
  });

  let maxNum = 0;
  if (lastVariant) maxNum = Math.max(maxNum, parseInt(lastVariant.codigo.replace("MDN", "")));
  if (lastProduct) maxNum = Math.max(maxNum, parseInt(lastProduct.codigo.replace("MDN", "")));

  return `MDN${String(maxNum + 1).padStart(4, "0")}`;
}

async function getNextSCCodigo() {
  const lastVariant = await prisma.productVariant.findFirst({
    where: { codigo: { startsWith: "SC" } },
    orderBy: { codigo: "desc" },
    select: { codigo: true },
  });

  const lastProduct = await prisma.product.findFirst({
    where: { codigo: { startsWith: "SC" } },
    orderBy: { codigo: "desc" },
    select: { codigo: true },
  });

  let maxNum = 0;
  if (lastVariant) maxNum = Math.max(maxNum, parseInt(lastVariant.codigo.replace("SC", "")));
  if (lastProduct) maxNum = Math.max(maxNum, parseInt(lastProduct.codigo.replace("SC", "")));

  return `SC${String(maxNum + 1).padStart(4, "0")}`;
}

export async function createVariant(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = variantSchema.parse(raw);
  const sinCodigo = formData.get("sinCodigo") === "true";

  const product = await prisma.product.findUnique({ where: { id: parsed.productId } });
  const presentation = await prisma.presentation.findUnique({ where: { id: parsed.presentationId } });
  if (!product || !presentation) throw new Error("Producto o presentación no encontrada");

  const variantCodigo = sinCodigo ? await getNextSCCodigo() : await getNextVariantCodigo(product.codigo);

  await prisma.productVariant.create({
    data: {
      codigo: variantCodigo,
      productId: parsed.productId,
      presentationId: parsed.presentationId,
      sku: parsed.sku,
      barcode: parsed.barcode,
      active: parsed.active,
    },
  });

  revalidatePath(`/admin/productos/${parsed.productId}`);
}

export async function assignNextMDNCode(variantId: number) {
  const last = await prisma.productVariant.findFirst({
    where: { codigo: { startsWith: "MDN" } },
    orderBy: { codigo: "desc" },
    select: { codigo: true },
  });
  const lastProduct = await prisma.product.findFirst({
    orderBy: { codigo: "desc" },
    select: { codigo: true },
  });
  let maxNum = 0;
  if (last) maxNum = Math.max(maxNum, parseInt(last.codigo.replace("MDN", "")));
  if (lastProduct) maxNum = Math.max(maxNum, parseInt(lastProduct.codigo.replace("MDN", "")));
  const nextCode = `MDN${String(maxNum + 1).padStart(4, "0")}`;

  const variant = await prisma.productVariant.update({
    where: { id: variantId },
    data: { codigo: nextCode },
    select: { productId: true },
  });
  revalidatePath(`/admin/productos/${variant.productId}`);
  return nextCode;
}

export async function toggleVariantActive(id: number, active: boolean) {
  const variant = await prisma.productVariant.update({
    where: { id },
    data: { active },
    select: { productId: true },
  });
  revalidatePath(`/admin/productos/${variant.productId}`);
}
