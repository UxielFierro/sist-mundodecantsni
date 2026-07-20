import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { uploadImage, isStorageConfigured } from "@/lib/supabase-storage";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productId = Number(formData.get("productId"));
    const file = formData.get("image") as File | null;

    if (!productId || !file) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "La imagen excede el tamaño máximo de 5MB" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Formato de imagen no válido. Permitidos: JPEG, PNG, WebP" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `mdn_${productId}_${Date.now()}.${ext}`;

    let publicUrl: string | null = null;

    if (isStorageConfigured()) {
      publicUrl = await uploadImage(buffer, filename, file.type);
    } else {
      const dir = path.join(process.cwd(), "public", "images", "products");
      const filepath = path.join(dir, filename);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filepath, buffer);
      publicUrl = `/images/products/${filename}`;
    }

    if (!publicUrl) {
      return NextResponse.json({ error: "Error al guardar la imagen" }, { status: 500 });
    }

    const existingImages = await prisma.productImage.findMany({
      where: { productId },
      orderBy: { sortOrder: "desc" },
      take: 1,
    });

    await prisma.productImage.create({
      data: {
        productId,
        url: publicUrl,
        altText: formData.get("altText") as string || null,
        isPrimary: existingImages.length === 0,
        sortOrder: (existingImages[0]?.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json({ success: true, filename, url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 });
  }
}
