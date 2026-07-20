import ExcelJS from "exceljs";
import { PrismaClient } from "@prisma/client";

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile("E:\\Documentos NoLocal\\Desarrollo\\Sist_MundoDecantsNI\\ArchivosExcel\\PRECIOS.xlsx");
const sheet = wb.getWorksheet(1);

console.log("=== PRECIOS.xlsx ===\n");
console.log("DESCRIPCIÓN | PRECIO(unit) | INSUMOS | ENVÍO | NETO+7% | P.ML | P.5ML | P.10ML | P.NETO5ML | P.NETO10ML\n");

sheet.eachRow((row, rowNum) => {
  if (rowNum <= 2) return;
  const vals = [];
  for (let c = 1; c <= 11; c++) {
    const v = row.getCell(c).value;
    vals.push(v !== null && v !== undefined ? (typeof v === "object" && v.result !== undefined ? v.result : v) : "");
  }
  const name = vals[0];
  if (!name) return;
  console.log(`${String(name).padEnd(35)} | ${String(vals[1]).padStart(8)} | ${String(vals[2]).padStart(6)} | ${String(vals[3]).padStart(5)} | ${String(vals[4]).padStart(8)} | ${String(vals[5]).padStart(6)} | ${String(vals[6]).padStart(7)} | ${String(vals[7]).padStart(8)} | ${String(vals[8]).padStart(9)} | ${String(vals[9]).padStart(9)}`);
});

console.log("\n\n=== COSTOS EN BD ===\n");
const prisma = new PrismaClient();
const costs = await prisma.cost.findMany({
  include: { variant: { include: { product: true, presentation: true } } },
  orderBy: { effectiveDate: "desc" },
  take: 30,
});

for (const c of costs) {
  console.log(`${c.variant.product.codigo} ${c.variant.product.name.padEnd(35)} ${c.variant.presentation.name.padEnd(8)} → unit:${c.unitCost} sum:${c.suppliesCost} ship:${c.shippingCost} net:+7%:${Number(c.netCost).toFixed(0)} final:C$${Number(c.finalPrice).toFixed(0)}`);
}

console.log(`\nTotal costs in DB: ${await prisma.cost.count()}`);
await prisma.$disconnect();
