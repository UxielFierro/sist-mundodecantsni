"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin, generateUniqueSlug } from "@/lib/auth-guard";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido").max(100),
  description: z.string().trim().max(300).optional(),
});

const brandSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido").max(100),
});

const presentationSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido").max(80),
  unitType: z.string().trim().max(30).optional(),
  unitValue: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce.number().positive().optional()
  ),
  quantity: z.coerce.number().int().min(1).default(1),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

const systemConfigSchema = z.object({
  standardSuppliesCost: z.coerce.number().min(0),
  standardShippingCost: z.coerce.number().min(0),
  posFeePercentage: z.coerce.number().min(0).max(100),
  currency: z.string().trim().min(1).max(40).default("Córdobas"),
});

function revalidateCatalogPaths() {
  revalidatePath("/admin/catalogos");
  revalidatePath("/admin/productos");
  revalidatePath("/admin/productos/nuevo");
  revalidatePath("/admin/precios");
  revalidatePath("/admin");
  revalidatePath("/");
}

// ==================== CATEGORIES ====================

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const parsed = categorySchema.parse(Object.fromEntries(formData));
  const slug = await generateUniqueSlug("category", parsed.name);

  const category = await prisma.category.create({
    data: {
      name: parsed.name,
      slug,
      description: parsed.description || null,
    },
  });

  revalidateCatalogPaths();
  return category;
}

export async function updateCategory(id: number, formData: FormData) {
  await requireAdmin();
  const parsed = categorySchema.parse(Object.fromEntries(formData));
  const slug = await generateUniqueSlug("category", parsed.name, id);

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: parsed.name,
      slug,
      description: parsed.description || null,
    },
  });

  revalidateCatalogPaths();
  revalidatePath(`/categoria/${category.slug}`);
  return category;
}

export async function deleteCategory(id: number) {
  await requireAdmin();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    throw new Error(
      `No se puede eliminar: esta categoría tiene ${count} producto${count === 1 ? "" : "s"} asignado${count === 1 ? "" : "s"}. Reasignalos primero.`
    );
  }

  await prisma.category.delete({ where: { id } });
  revalidateCatalogPaths();
}

// ==================== BRANDS ====================

export async function createBrand(formData: FormData) {
  await requireAdmin();
  const parsed = brandSchema.parse(Object.fromEntries(formData));
  const slug = await generateUniqueSlug("brand", parsed.name);

  const brand = await prisma.brand.create({
    data: {
      name: parsed.name,
      slug,
    },
  });

  revalidateCatalogPaths();
  return brand;
}

export async function updateBrand(id: number, formData: FormData) {
  await requireAdmin();
  const parsed = brandSchema.parse(Object.fromEntries(formData));
  const slug = await generateUniqueSlug("brand", parsed.name, id);

  const brand = await prisma.brand.update({
    where: { id },
    data: {
      name: parsed.name,
      slug,
    },
  });

  revalidateCatalogPaths();
  return brand;
}

export async function deleteBrand(id: number) {
  await requireAdmin();
  const count = await prisma.product.count({ where: { brandId: id } });
  if (count > 0) {
    throw new Error(
      `No se puede eliminar: esta marca tiene ${count} producto${count === 1 ? "" : "s"} asignado${count === 1 ? "" : "s"}. Reasignalos primero.`
    );
  }

  await prisma.brand.delete({ where: { id } });
  revalidateCatalogPaths();
}

// ==================== PRESENTATIONS ====================

export async function createPresentation(formData: FormData) {
  await requireAdmin();
  const parsed = presentationSchema.parse(Object.fromEntries(formData));
  const slug = await generateUniqueSlug("presentation", parsed.name);

  const presentation = await prisma.presentation.create({
    data: {
      name: parsed.name,
      slug,
      unitType: parsed.unitType || "ml",
      unitValue: parsed.unitValue ?? parsed.quantity,
      quantity: parsed.quantity,
      sortOrder: parsed.sortOrder,
    },
  });

  revalidateCatalogPaths();
  return presentation;
}

export async function updatePresentation(id: number, formData: FormData) {
  await requireAdmin();
  const parsed = presentationSchema.parse(Object.fromEntries(formData));
  const slug = await generateUniqueSlug("presentation", parsed.name, id);

  const presentation = await prisma.presentation.update({
    where: { id },
    data: {
      name: parsed.name,
      slug,
      unitType: parsed.unitType || "ml",
      unitValue: parsed.unitValue ?? parsed.quantity,
      quantity: parsed.quantity,
      sortOrder: parsed.sortOrder,
    },
  });

  revalidateCatalogPaths();
  return presentation;
}

export async function deletePresentation(id: number) {
  await requireAdmin();
  const [variantCount, giftCount] = await Promise.all([
    prisma.productVariant.count({ where: { presentationId: id } }),
    prisma.giftConversion.count({ where: { giftPresentationId: id } }),
  ]);

  if (variantCount > 0 || giftCount > 0) {
    throw new Error(
      `No se puede eliminar: esta presentación está en uso por ${variantCount} variante(s) y ${giftCount} regalía(s).`
    );
  }

  await prisma.presentation.delete({ where: { id } });
  revalidateCatalogPaths();
}

// ==================== SYSTEM CONFIG ====================

export async function updateSystemConfig(formData: FormData) {
  await requireAdmin();
  const parsed = systemConfigSchema.parse(Object.fromEntries(formData));

  const existing = await prisma.systemConfig.findFirst();
  if (existing) {
    await prisma.systemConfig.update({
      where: { id: existing.id },
      data: {
        standardSuppliesCost: parsed.standardSuppliesCost,
        standardShippingCost: parsed.standardShippingCost,
        posFeePercentage: parsed.posFeePercentage,
        currency: parsed.currency,
      },
    });
  } else {
    await prisma.systemConfig.create({
      data: {
        standardSuppliesCost: parsed.standardSuppliesCost,
        standardShippingCost: parsed.standardShippingCost,
        posFeePercentage: parsed.posFeePercentage,
        currency: parsed.currency,
      },
    });
  }

  revalidateCatalogPaths();
}
