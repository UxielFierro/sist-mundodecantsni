import { prisma } from "@/lib/db";
import { createInventoryExcel } from "@/lib/excel";
import { NextResponse } from "next/server";

export async function GET() {
  const inventory = await prisma.globalInventory.findMany({
    include: {
      variant: {
        include: { product: true, presentation: true, costs: { take: 1, orderBy: { effectiveDate: "desc" } } },
      },
    },
    orderBy: { variant: { codigo: "asc" } },
  });

  const data = inventory.map((i) => ({
    codigo: i.variant.codigo,
    product: i.variant.product.name,
    presentation: i.variant.presentation.name,
    stock: i.quantity,
    minStock: i.minStock,
    finalPrice: i.variant.costs[0] ? Number(i.variant.costs[0].finalPrice) : 0,
    status:
      i.quantity === 0 ? "Sin stock" :
      i.quantity <= i.minStock ? "Stock bajo" : "Disponible",
  }));

  const workbook = await createInventoryExcel(data);
  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="inventario-mundodecants.xlsx"`,
    },
  });
}
