import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createSalesReportExcel } from "@/lib/excel";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const reports = await prisma.salesReport.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      location: true,
      items: { include: { variant: { include: { product: true, presentation: true } } } },
    },
  });

  const data = reports.flatMap((r) =>
    r.items.map((i) => ({
      location: r.location.name,
      period: r.period ?? "",
      product: i.variant.product.name,
      presentation: i.variant.presentation.name,
      quantitySold: i.quantitySold,
      unitPrice: Number(i.unitPrice),
      total: Number(i.unitPrice) * i.quantitySold,
    }))
  );

  const workbook = await createSalesReportExcel(data);
  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="reportes-ventas-mundodecants.xlsx"`,
    },
  });
}
