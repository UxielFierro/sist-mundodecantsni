"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
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

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: { codigo: "asc" },
    include: {
      category: true,
      brand: true,
      variants: {
        include: { presentation: true, costs: { take: 1, orderBy: { effectiveDate: "desc" } } },
      },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
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
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getNextCodigo(prefix: string = "MDN") {
  const last = await prisma.product.findFirst({
    where: { codigo: { startsWith: prefix } },
    orderBy: { codigo: "desc" },
    select: { codigo: true },
  });
  const num = last ? parseInt(last.codigo.replace(prefix, "")) + 1 : 1;
  return `${prefix}${String(num).padStart(4, "0")}`;
}

export async function createProduct(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = productSchema.parse(raw);
  const sinCodigo = formData.get("sinCodigo") === "true";

  const codigo = await getNextCodigo(sinCodigo ? "SC" : "MDN");

  const product = await prisma.product.create({
    data: {
      codigo,
      name: parsed.name,
      slug: slugify(parsed.name),
      categoryId: parsed.categoryId || null,
      brandId: parsed.brandId || null,
      description: parsed.description || null,
      olfactoryNotes: parsed.olfactoryNotes || null,
      isSupply: parsed.isSupply,
      isFullBottle: parsed.isFullBottle,
      isGift: parsed.isGift || parsed.isSupply,
      notes: parsed.notes || null,
      active: parsed.active,
      showInCatalog: parsed.showInCatalog,
    },
  });

  revalidatePath("/admin/productos");
  return product;
}

export async function updateProduct(id: number, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = productSchema.parse(raw);

  await prisma.product.update({
    where: { id },
    data: {
      name: parsed.name,
      slug: slugify(parsed.name),
      categoryId: parsed.categoryId || null,
      brandId: parsed.brandId || null,
      description: parsed.description || null,
      olfactoryNotes: parsed.olfactoryNotes || null,
      isSupply: parsed.isSupply,
      isFullBottle: parsed.isFullBottle,
      isGift: parsed.isGift || parsed.isSupply,
      notes: parsed.notes || null,
      active: parsed.active,
      showInCatalog: parsed.showInCatalog,
    },
  });

  revalidatePath("/admin/productos");
}

export async function updateProductCodigo(id: number, codigo: string) {
  const trimmed = codigo.trim().toUpperCase();
  await prisma.product.update({ where: { id }, data: { codigo: trimmed } });
  revalidatePath("/admin/productos");
}

export async function toggleProductActive(id: number, active: boolean) {
  await prisma.product.update({ where: { id }, data: { active } });
  revalidatePath("/admin/productos");
}

export async function toggleShowInCatalog(id: number, showInCatalog: boolean) {
  await prisma.product.update({ where: { id }, data: { showInCatalog } });
  revalidatePath("/admin/productos");
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
