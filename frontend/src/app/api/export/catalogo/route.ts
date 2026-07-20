import { prisma } from "@/lib/db";
import { createCatalogExcel } from "@/lib/excel";
import { NextResponse } from "next/server";

export async function GET() {
  const variants = await prisma.productVariant.findMany({
    where: { active: true, product: { active: true } },
    include: {
      product: { include: { category: true, brand: true } },
      presentation: true,
      globalInventory: true,
      costs: { take: 1, orderBy: { effectiveDate: "desc" } },
    },
    orderBy: { codigo: "asc" },
  });

  const data = variants.map((v) => ({
    codigo: v.codigo,
    name: v.product.name,
    category: v.product.category?.name ?? "-",
    brand: v.product.brand?.name ?? "-",
    presentation: v.presentation.name,
    unitCost: v.costs[0] ? Number(v.costs[0].unitCost) : 0,
    finalPrice: v.costs[0] ? Number(v.costs[0].finalPrice) : 0,
    stock: v.globalInventory?.quantity ?? 0,
  }));

  const workbook = await createCatalogExcel(data);
  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="catalogo-mundodecants.xlsx"`,
    },
  });
}
