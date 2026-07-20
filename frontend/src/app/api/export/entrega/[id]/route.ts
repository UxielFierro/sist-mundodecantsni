import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const delivery = await prisma.locationDelivery.findUnique({
    where: { id: parseInt(id) },
    include: {
      location: true,
      items: {
        include: {
          variant: { include: { product: true, presentation: true } },
        },
      },
    },
  });

  if (!delivery) {
    return NextResponse.json({ error: "Entrega no encontrada" }, { status: 404 });
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Entrega");

  // Column widths
  sheet.getColumn(1).width = 14;
  sheet.getColumn(2).width = 40;
  sheet.getColumn(3).width = 16;
  sheet.getColumn(4).width = 14;
  sheet.getColumn(5).width = 12;
  sheet.getColumn(6).width = 14;

  // Title row
  sheet.mergeCells(1, 1, 1, 6);
  const titleCell = sheet.getCell(1, 1);
  titleCell.value = `Entrega a ${delivery.location.name}`;
  titleCell.font = { bold: true, size: 16 };
  titleCell.alignment = { horizontal: "center" };

  // Info rows
  sheet.addRow([]);
  sheet.addRow(["Período:", delivery.period ?? "-"]);
  sheet.addRow(["Fecha:", new Date(delivery.createdAt).toLocaleDateString("es")]);
  if (delivery.notes) sheet.addRow(["Notas:", delivery.notes]);
  sheet.addRow([]);

  // Header row
  const headerRow = sheet.addRow(["Código", "Producto", "Presentación", "Costo Unit.", "Cantidad", "Subtotal"]);
  headerRow.font = { bold: true };
  headerRow.eachCell((c) => {
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F4F6" } };
    c.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Data rows
  let total = 0;
  let totalUnits = 0;
  for (const item of delivery.items) {
    const subtotal = Number(item.unitCost) * item.quantity;
    total += subtotal;
    totalUnits += item.quantity;
    const row = sheet.addRow([
      item.variant.codigo,
      item.variant.product.name,
      item.variant.presentation.name,
      Number(item.unitCost),
      item.quantity,
      subtotal,
    ]);
    row.eachCell((c) => {
      c.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
    row.getCell(4).numFmt = '#,##0.00';
    row.getCell(6).numFmt = '#,##0.00';
  }

  // Total row
  const totalRow = sheet.addRow(["", "", "", "", totalUnits, total]);
  totalRow.font = { bold: true };
  totalRow.eachCell((c) => {
    c.border = {
      top: { style: "medium" },
      bottom: { style: "medium" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });
  totalRow.getCell(5).alignment = { horizontal: "center" };
  totalRow.getCell(6).numFmt = '#,##0.00';

  // Footer
  sheet.addRow([]);
  sheet.addRow([`Generado el ${new Date().toLocaleString("es")}`]);
  sheet.getCell(sheet.rowCount, 1).font = { italic: true, color: { argb: "FF9CA3AF" } };

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="entrega-${delivery.location.name.toLowerCase().replace(/\s+/g, "-")}-${delivery.id}.xlsx"`,
    },
  });
}
