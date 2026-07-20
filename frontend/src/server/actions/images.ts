"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

export async function uploadImage(formData: FormData) {
  const productId = Number(formData.get("productId"));
  const file = formData.get("image") as File;

  if (!productId || !file) throw new Error("Faltan datos requeridos");

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `mdn_${productId}_${Date.now()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "images", "products");
  const filepath = path.join(dir, filename);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filepath, buffer);

  const existingImages = await prisma.productImage.findMany({
    where: { productId },
    orderBy: { sortOrder: "desc" },
    take: 1,
  });

  await prisma.productImage.create({
    data: {
      productId,
      url: `/images/products/${filename}`,
      altText: formData.get("altText") as string || null,
      isPrimary: existingImages.length === 0,
      sortOrder: (existingImages[0]?.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath(`/admin/productos/${productId}`);
}

export async function setPrimaryImage(imageId: number, productId: number) {
  await prisma.$transaction([
    prisma.productImage.updateMany({
      where: { productId, isPrimary: true },
      data: { isPrimary: false },
    }),
    prisma.productImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    }),
  ]);
  revalidatePath(`/admin/productos/${productId}`);
}

export async function deleteImage(imageId: number, productId: number) {
  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image) return;

  await prisma.productImage.delete({ where: { id: imageId } });

  const filepath = path.join(process.cwd(), "public", image.url);
  try { await fs.unlink(filepath); } catch {}

  revalidatePath(`/admin/productos/${productId}`);
}

export async function reorderImages(productId: number, imageIds: number[]) {
  for (let i = 0; i < imageIds.length; i++) {
    await prisma.productImage.update({
      where: { id: imageIds[i] },
      data: { sortOrder: i },
    });
  }
  revalidatePath(`/admin/productos/${productId}`);
}
