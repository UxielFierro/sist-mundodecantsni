import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const imageId = Number(formData.get("imageId"));
    const productId = Number(formData.get("productId"));

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
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
