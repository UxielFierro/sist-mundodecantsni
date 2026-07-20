"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { z } from "zod";

const reportSchema = z.object({
  locationId: z.coerce.number(),
  period: z.string().min(1, "El período es requerido"),
  notes: z.string().optional(),
});

const saleItemSchema = z.object({
  variantId: z.coerce.number(),
  quantitySold: z.coerce.number().min(0),
  unitPrice: z.coerce.number().min(0),
});

export async function getSalesReports() {
  return prisma.salesReport.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      location: true,
      items: {
        include: {
          variant: {
            include: { product: true, presentation: true },
          },
        },
      },
    },
  });
}

export async function createSalesReport(formData: FormData) {
  const itemsRaw = formData.getAll("items");
  const parsed = reportSchema.parse(Object.fromEntries(formData));
  const items: z.infer<typeof saleItemSchema>[] = [];

  for (const raw of itemsRaw) {
    try {
      const item = saleItemSchema.parse(JSON.parse(raw as string));
      items.push(item);
    } catch {
      continue;
    }
  }

  await prisma.$transaction(async (tx) => {
    const report = await tx.salesReport.create({
      data: {
        locationId: parsed.locationId,
        period: parsed.period,
        notes: parsed.notes,
        createdBy: "admin",
        items: {
          create: items.map((i) => ({
            variantId: i.variantId,
            quantitySold: i.quantitySold,
            unitPrice: i.unitPrice,
          })),
        },
      },
    });

    for (const item of items) {
      await tx.locationInventory.update({
        where: {
          locationId_variantId: {
            locationId: parsed.locationId,
            variantId: item.variantId,
          },
        },
        data: { quantity: { decrement: item.quantitySold } },
      });

      await tx.inventoryMovement.create({
        data: {
          variantId: item.variantId,
          movementType: "sale",
          quantity: -item.quantitySold,
          referenceType: "sale_report",
          referenceId: report.id,
          locationId: parsed.locationId,
          createdBy: "admin",
        },
      });
    }
  });

  revalidatePath("/admin/reportes");
}
