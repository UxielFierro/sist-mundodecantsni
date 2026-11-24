"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { z } from "zod";

const reportSchema = z.object({
  locationId: z.coerce.number().int().positive(),
  period: z.string().min(1, "El período es requerido"),
  notes: z.string().optional(),
});

const saleItemSchema = z.object({
  variantId: z.coerce.number().int().positive(),
  quantitySold: z.coerce.number().int().min(1),
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
  const actor = await requireAdmin();
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

  if (items.length === 0) {
    throw new Error("Debes agregar al menos un producto vendido al reporte");
  }

  await prisma.$transaction(async (tx) => {
    const report = await tx.salesReport.create({
      data: {
        locationId: parsed.locationId,
        period: parsed.period.trim(),
        notes: parsed.notes?.trim() || null,
        createdBy: actor,
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
      const locInv = await tx.locationInventory.findUnique({
        where: {
          locationId_variantId: {
            locationId: parsed.locationId,
            variantId: item.variantId,
          },
        },
        include: { variant: { include: { product: true, presentation: true } } },
      });

      if (!locInv || locInv.quantity < item.quantitySold) {
        const label = locInv
          ? `${locInv.variant.product.name} (${locInv.variant.presentation.name})`
          : `variante #${item.variantId}`;
        throw new Error(
          `Stock insuficiente en el espacio para ${label}. Disponible: ${locInv?.quantity ?? 0}, vendido: ${item.quantitySold}`
        );
      }

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
          createdBy: actor,
        },
      });
    }
  });

  revalidatePath("/admin/reportes");
  revalidatePath("/admin/espacios");
  revalidatePath(`/admin/espacios/${parsed.locationId}`);
  revalidatePath("/admin");
}

export async function updateSalesReportStatus(
  reportId: number,
  status: "pending" | "confirmed" | "reconciled"
) {
  await requireAdmin();
  const validStatus = z.enum(["pending", "confirmed", "reconciled"]).parse(status);

  await prisma.salesReport.update({
    where: { id: reportId },
    data: { status: validStatus },
  });

  revalidatePath("/admin/reportes");
  revalidatePath("/admin");
}
