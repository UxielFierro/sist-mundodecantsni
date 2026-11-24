"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin, generateUniqueSlug } from "@/lib/auth-guard";
import { z } from "zod";

const locationSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  type: z.enum(["collectivo", "tienda", "bodega"]).default("collectivo"),
  address: z.string().optional(),
  contact: z.string().optional(),
  phone: z.string().optional(),
  active: z.preprocess((v) => v === undefined ? true : v === "true" || v === true, z.boolean()).default(true),
});

export async function getLocations() {
  return prisma.location.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { deliveries: true, salesReports: true } },
    },
  });
}

export async function getLocation(id: number) {
  return prisma.location.findUnique({
    where: { id },
    include: {
      locationInventory: {
        include: {
          variant: {
            include: { product: true, presentation: true },
          },
        },
      },
      _count: { select: { deliveries: true, salesReports: true } },
    },
  });
}

export async function createLocation(formData: FormData) {
  await requireAdmin();
  const raw = Object.fromEntries(formData);
  const parsed = locationSchema.parse(raw);
  const slug = await generateUniqueSlug("location", parsed.name);

  await prisma.location.create({
    data: {
      name: parsed.name.trim(),
      slug,
      type: parsed.type,
      address: parsed.address?.trim() || null,
      contact: parsed.contact?.trim() || null,
      phone: parsed.phone?.trim() || null,
      active: parsed.active,
    },
  });

  revalidatePath("/admin/espacios");
  revalidatePath("/admin");
}

export async function updateLocation(id: number, formData: FormData) {
  await requireAdmin();
  const raw = Object.fromEntries(formData);
  const parsed = locationSchema.parse(raw);
  const slug = await generateUniqueSlug("location", parsed.name, id);

  await prisma.location.update({
    where: { id },
    data: {
      name: parsed.name.trim(),
      slug,
      type: parsed.type,
      address: parsed.address?.trim() || null,
      contact: parsed.contact?.trim() || null,
      phone: parsed.phone?.trim() || null,
      active: parsed.active,
    },
  });

  revalidatePath("/admin/espacios");
  revalidatePath(`/admin/espacios/${id}`);
  revalidatePath("/admin");
}

export async function adjustLocationStock(
  locationId: number,
  variantId: number,
  newQuantity: number,
  reason: string
) {
  const actor = await requireAdmin();
  if (newQuantity < 0) {
    throw new Error("El stock no puede ser negativo");
  }

  const current = await prisma.locationInventory.findUnique({
    where: { locationId_variantId: { locationId, variantId } },
  });

  const currentQty = current?.quantity || 0;
  const difference = newQuantity - currentQty;

  if (difference === 0) return { success: true };

  await prisma.$transaction(async (tx) => {
    await tx.locationInventory.upsert({
      where: { locationId_variantId: { locationId, variantId } },
      update: { quantity: newQuantity },
      create: { locationId, variantId, quantity: newQuantity },
    });

    await tx.inventoryMovement.create({
      data: {
        variantId,
        locationId,
        movementType: "adjustment",
        quantity: difference,
        notes: reason?.trim() || `Ajuste en espacio a ${newQuantity}`,
        createdBy: actor,
      },
    });
  });

  revalidatePath(`/admin/espacios/${locationId}`);
  revalidatePath("/admin/espacios");
  revalidatePath("/admin");
  return { success: true };
}
