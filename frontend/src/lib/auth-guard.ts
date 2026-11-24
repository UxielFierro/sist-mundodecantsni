import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

/**
 * Ensures the caller has an active authenticated session.
 * Throws if unauthorized and returns a readable actor identifier for audit logs.
 */
export async function requireAdmin(): Promise<string> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("No autorizado. Iniciá sesión para continuar.");
  }
  return session.user.email ?? session.user.name ?? "admin";
}

type SlugModel = "product" | "category" | "brand" | "presentation" | "location";

/**
 * Generates a unique slug for the given Prisma model, appending -2, -3, ... if needed.
 */
export async function generateUniqueSlug(
  model: SlugModel,
  baseText: string,
  excludeId?: number
): Promise<string> {
  const base = slugify(baseText) || "item";
  let candidate = base;
  let counter = 2;

  while (true) {
    let existing: { id: number } | null = null;

    switch (model) {
      case "product":
        existing = await prisma.product.findUnique({
          where: { slug: candidate },
          select: { id: true },
        });
        break;
      case "category":
        existing = await prisma.category.findUnique({
          where: { slug: candidate },
          select: { id: true },
        });
        break;
      case "brand":
        existing = await prisma.brand.findUnique({
          where: { slug: candidate },
          select: { id: true },
        });
        break;
      case "presentation":
        existing = await prisma.presentation.findUnique({
          where: { slug: candidate },
          select: { id: true },
        });
        break;
      case "location":
        existing = await prisma.location.findUnique({
          where: { slug: candidate },
          select: { id: true },
        });
        break;
    }

    if (!existing || (excludeId !== undefined && existing.id === excludeId)) {
      return candidate;
    }

    candidate = `${base}-${counter}`;
    counter++;
  }
}

export const MOVEMENT_TYPE_LABELS: Record<string, string> = {
  purchase: "Compra / Ingreso",
  delivery_to_location: "Entrega a espacio",
  sale: "Venta",
  return: "Devolución",
  conversion_to_gift: "Conversión a regalía",
  adjustment: "Ajuste manual",
};
