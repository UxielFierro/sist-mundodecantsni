"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const locationSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  type: z.enum(["collectivo", "tienda", "bodega"]).default("collectivo"),
  address: z.string().optional(),
  contact: z.string().optional(),
  phone: z.string().optional(),
  active: z.boolean().default(true),
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
  const raw = Object.fromEntries(formData);
  const parsed = locationSchema.parse(raw);

  await prisma.location.create({
    data: {
      name: parsed.name,
      slug: slugify(parsed.name),
      type: parsed.type,
      address: parsed.address,
      contact: parsed.contact,
      phone: parsed.phone,
      active: parsed.active,
    },
  });

  revalidatePath("/admin/espacios");
}

export async function adjustLocationStock(
  locationId: number,
  variantId: number,
  newQuantity: number,
  reason: string
) {
  // 1. Get current stock
  const current = await prisma.locationInventory.findUnique({
    where: { locationId_variantId: { locationId, variantId } }
  });
  
  const currentQty = current?.quantity || 0;
  const difference = newQuantity - currentQty;
  
  if (difference === 0) return { success: true };

  await prisma.$transaction(async (tx) => {
    // 2. Update stock
    await tx.locationInventory.upsert({
      where: { locationId_variantId: { locationId, variantId } },
      update: { quantity: newQuantity },
      create: { locationId, variantId, quantity: newQuantity }
    });

    // 3. Log the adjustment movement
    await tx.inventoryMovement.create({
      data: {
        variantId,
        locationId,
        movementType: "adjustment",
        quantity: difference,
        notes: reason,
        createdBy: "admin",
      }
    });
  });

  revalidatePath(`/admin/espacios/${locationId}`);
  return { success: true };
}
