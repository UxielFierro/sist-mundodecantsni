"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin, generateUniqueSlug } from "@/lib/auth-guard";
import { z } from "zod";

const boolCoerce = z.preprocess((v) => v === "true" || v === true, z.boolean());

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  categoryId: z.coerce.number().optional(),
  brandId: z.coerce.number().optional(),
  description: z.string().optional(),
  olfactoryNotes: z.string().optional(),
  notes: z.string().optional(),
  isSupply: boolCoerce.default(false),
  isFullBottle: boolCoerce.default(false),
  isGift: boolCoerce.default(false),
  active: boolCoerce.default(true),
  showInCatalog: boolCoerce.default(true),
});

function parseNumericSuffix(codigo: string, prefix: string): number {
  const num = parseInt(codigo.slice(prefix.length), 10);
  return Number.isFinite(num) ? num : 0;
}

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: { codigo: "asc" },
    include: {
      category: true,
      brand: true,
      variants: {
        include: { presentation: true, costs: { take: 1, orderBy: { effectiveDate: "desc" } } },
      },
      images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 },
    },
  });
}

export type ProductListData = Awaited<ReturnType<typeof getProducts>>;

export async function getProduct(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      variants: {
        include: {
          presentation: true,
          costs: { orderBy: { effectiveDate: "desc" }, take: 1 },
        },
        orderBy: { codigo: "asc" },
      },
      images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
    },
  });
}

export async function getNextCodigo(prefix: string = "MDN") {
  const [products, variants] = await Promise.all([
    prisma.product.findMany({
      where: { codigo: { startsWith: prefix } },
      select: { codigo: true },
    }),
    prisma.productVariant.findMany({
      where: { codigo: { startsWith: prefix } },
      select: { codigo: true },
    }),
  ]);

  let maxNum = 0;
  for (const p of products) {
    maxNum = Math.max(maxNum, parseNumericSuffix(p.codigo, prefix));
  }
  for (const v of variants) {
    maxNum = Math.max(maxNum, parseNumericSuffix(v.codigo, prefix));
  }

  return `${prefix}${String(maxNum + 1).padStart(4, "0")}`;
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const raw = Object.fromEntries(formData);
  const parsed = productSchema.parse(raw);
  const sinCodigo = formData.get("sinCodigo") === "true";

  const codigo = await getNextCodigo(sinCodigo ? "SC" : "MDN");
  const slug = await generateUniqueSlug("product", parsed.name);

  const product = await prisma.product.create({
    data: {
      codigo,
      name: parsed.name.trim(),
      slug,
      categoryId: parsed.categoryId || null,
      brandId: parsed.brandId || null,
      description: parsed.description?.trim() || null,
      olfactoryNotes: parsed.olfactoryNotes?.trim() || null,
      isSupply: parsed.isSupply,
      isFullBottle: parsed.isFullBottle,
      isGift: parsed.isGift || parsed.isSupply,
      notes: parsed.notes?.trim() || null,
      active: parsed.active,
      showInCatalog: parsed.showInCatalog,
    },
  });

  revalidatePath("/admin/productos");
  revalidatePath("/admin");
  revalidatePath("/");
  return product;
}

export async function updateProduct(id: number, formData: FormData) {
  await requireAdmin();
  const raw = Object.fromEntries(formData);
  const parsed = productSchema.parse(raw);
  const slug = await generateUniqueSlug("product", parsed.name, id);

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: parsed.name.trim(),
      slug,
      categoryId: parsed.categoryId || null,
      brandId: parsed.brandId || null,
      description: parsed.description?.trim() || null,
      olfactoryNotes: parsed.olfactoryNotes?.trim() || null,
      isSupply: parsed.isSupply,
      isFullBottle: parsed.isFullBottle,
      isGift: parsed.isGift || parsed.isSupply,
      notes: parsed.notes?.trim() || null,
      active: parsed.active,
      showInCatalog: parsed.showInCatalog,
    },
    include: { category: { select: { slug: true } } },
  });

  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}`);
  revalidatePath("/");
  revalidatePath(`/perfume/${updated.slug}`);
  if (updated.category?.slug) {
    revalidatePath(`/categoria/${updated.category.slug}`);
  }
}

export async function updateProductCodigo(id: number, codigo: string) {
  await requireAdmin();
  const trimmed = codigo.trim().toUpperCase();
  if (!trimmed) throw new Error("El código no puede estar vacío");
  await prisma.product.update({ where: { id }, data: { codigo: trimmed } });
  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}`);
}

export async function toggleProductActive(id: number, active: boolean) {
  await requireAdmin();
  const updated = await prisma.product.update({
    where: { id },
    data: { active },
    include: { category: { select: { slug: true } } },
  });
  revalidatePath("/admin/productos");
  revalidatePath("/admin");
  revalidatePath("/");
  if (updated.category?.slug) revalidatePath(`/categoria/${updated.category.slug}`);
}

export async function toggleShowInCatalog(id: number, showInCatalog: boolean) {
  await requireAdmin();
  const updated = await prisma.product.update({
    where: { id },
    data: { showInCatalog },
    include: { category: { select: { slug: true } } },
  });
  revalidatePath("/admin/productos");
  revalidatePath("/");
  if (updated.category?.slug) revalidatePath(`/categoria/${updated.category.slug}`);
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getBrands() {
  return prisma.brand.findMany({ orderBy: { name: "asc" } });
}

export async function getPresentations() {
  return prisma.presentation.findMany({ orderBy: { sortOrder: "asc" } });
}
