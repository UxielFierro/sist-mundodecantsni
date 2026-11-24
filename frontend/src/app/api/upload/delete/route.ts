import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { deleteImage, isStorageConfigured } from "@/lib/supabase-storage";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { imageId } = await request.json();

    const image = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image) {
      return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 });
    }

    await prisma.productImage.delete({ where: { id: imageId } });

    if (isStorageConfigured()) {
      const filename = image.url.split("/").pop();
      if (filename) await deleteImage(filename);
    } else {
      const filepath = path.join(process.cwd(), "public", image.url);
      try { await fs.unlink(filepath); } catch {}
    }

    revalidatePath(`/admin/productos/${image.productId}`);
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
