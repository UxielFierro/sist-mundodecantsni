/**
 * 1. Corrige códigos de variantes según Codigos MDN.xlsx
 * 2. Limpia costos corruptos
 * 3. Importa precios correctos desde ambos Excel
 *
 * Uso: npx tsx scripts/import-prices.mjs --dry-run
 *      npx tsx scripts/import-prices.mjs --apply
 */

import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";

const prisma = new PrismaClient();
const isDryRun = process.argv.includes("--dry-run") || !process.argv.includes("--apply");
const EXCEL_DIR = "E:\\Documentos NoLocal\\Desarrollo\\Sist_MundoDecantsNI\\ArchivosExcel\\";

if (isDryRun) console.log("⚠️  DRY-RUN\n");

// ============================================================
// 1. LEER Codigos MDN.xlsx → todas las filas
// ============================================================
const wb = await new ExcelJS.Workbook().xlsx.readFile(EXCEL_DIR + "Codigos MDN.xlsx");
const sheet = wb.getWorksheet(1);

// Excel rows: cada fila es (código, nombre, presentación, precio)
const excelRows = [];
sheet.eachRow((row, rowNum) => {
  if (rowNum <= 2) return;
  const code = String(row.getCell(1)?.value ?? "").trim();
  const name = String(row.getCell(2)?.value ?? "").trim();
  const pres = String(row.getCell(3)?.value ?? "").trim().toLowerCase();
  const price = Number(row.getCell(4)?.value);

  if (!code || !name || code >= "MDN0175" || name === "NONAME" || name === "RETIROS EN EL LOCAL") return;
  excelRows.push({ code, name, pres, price: isNaN(price) ? null : price });
});

function normalize(n) {
  return n.toLowerCase().replace(/[^a-z0-9áéíóúñ\s]/g, " ").replace(/\s+/g, " ").trim();
}

// Índice: por nombre normalizado → lista de {code, pres, price}
const excelByName = new Map();
for (const r of excelRows) {
  const key = normalize(r.name);
  if (!excelByName.has(key)) excelByName.set(key, []);
  excelByName.get(key).push(r);
}

// Mapa: código Excel → precio de venta
const finalPriceMap = new Map();
for (const r of excelRows) {
  if (r.price !== null && r.price > 0) finalPriceMap.set(r.code, r.price);
}

// Mapa: presentación Excel → slug presentación
const presMap = {
  "5ml": "5ml", "10ml": "10ml", "100ml": "100ml",
  "induvidual": "individual", "individual": "individual", "unidad": "individual",
  "docena": "docena", "paquete de 10": "paquete-10",
};

console.log(`📊 Codigos MDN: ${excelRows.length} filas, ${finalPriceMap.size} con precio\n`);

// ============================================================
// 2. LEER PRECIOS.xlsx
// ============================================================
const wb2 = await new ExcelJS.Workbook().xlsx.readFile(EXCEL_DIR + "PRECIOS.xlsx");
const ps = wb2.getWorksheet(1);

const costMap = new Map();
ps.eachRow((row, rowNum) => {
  if (rowNum <= 2) return;
  const name = String(row.getCell(1)?.value ?? "").trim();
  if (!name) return;
  costMap.set(normalize(name), {
    unitCost: Number(row.getCell(2)?.value) || 0,
    suppliesCost: Number(row.getCell(3)?.value) || 733,
    shippingCost: Number(row.getCell(4)?.value) || 185,
  });
});

console.log(`💰 PRECIOS.xlsx: ${costMap.size} con costos\n`);

// ============================================================
// 3. LEER BD
// ============================================================
const products = await prisma.product.findMany({
  include: {
    variants: {
      include: { presentation: true, costs: { orderBy: { effectiveDate: "desc" } } },
    },
  },
  orderBy: { codigo: "asc" },
});

console.log(`🗄️  BD: ${products.length} productos, ${products.reduce((s, p) => s + p.variants.length, 0)} variantes\n`);

// ============================================================
// 4. PLAN: asignar códigos correctos a variantes
// ============================================================
const variantFixes = [];

for (const product of products) {
  const key = normalize(product.name);
  const excelVariants = excelByName.get(key);

  if (!excelVariants) continue;

  // Para cada variante del producto, buscar el código Excel correcto
  for (const variant of product.variants) {
    const presSlug = variant.presentation.slug;
    // Buscar en Excel: fila con este nombre y presentación que coincida
    const match = excelVariants.find(ev => presMap[ev.pres] === presSlug);
    if (match && variant.codigo !== match.code) {
      // Verificar si el destino está ocupado por otra variante del MISMO producto (swap)
      const sameProductConflict = product.variants.some(v => v.codigo === match.code && v.id !== variant.id);
      const otherProductConflict = products.some(p =>
        p.id !== product.id && p.variants.some(v => v.codigo === match.code)
      );
      if (!otherProductConflict) {
        variantFixes.push({ variant, oldCode: variant.codigo, newCode: match.code });
        if (sameProductConflict) {
          console.log(`  🔄 Swap detectado: ${variant.codigo} ↔ ${match.code} (${product.name})`);
        }
      } else {
        console.log(`  ⛔ Conflicto: ${match.code} usado por otro producto (${product.name} ${variant.presentation.name})`);
      }
    }
  }
}

if (variantFixes.length > 0) {
  console.log("=== CORRECCIÓN DE CÓDIGOS DE VARIANTES ===");
  for (const f of variantFixes) {
    console.log(`  ${f.oldCode} → ${f.newCode} (${f.variant.product?.name ?? "?"} ${f.variant.presentation.name})`);
  }
  console.log("");
}

// ============================================================
// 5. PLAN: costos
// ============================================================
let toDelete = 0;
let toCreate = 0;

for (const product of products) {
  const costEntry = costMap.get(normalize(product.name));

  for (const variant of product.variants) {
    const effectiveCode = variantFixes.find(f => f.variant.id === variant.id)?.newCode ?? variant.codigo;
    const finalPrice = finalPriceMap.get(effectiveCode);

    // Check if this variant needs a cost update
    const hasCost = variant.costs.length > 0;
    const costOk = hasCost && variant.costs.length === 1 &&
      (!finalPrice || Number(variant.costs[0].finalPrice) === finalPrice) &&
      (!costEntry || Number(variant.costs[0].unitCost) === costEntry.unitCost);

    if (hasCost && !costOk) {
      toDelete += variant.costs.length;
    }
    if (!costOk && (finalPrice || costEntry)) {
      toCreate++;
    }
  }
}

console.log(`📋 ${variantFixes.length} códigos de variante a corregir`);
console.log(`📋 ${toDelete} costos a eliminar, ${toCreate} costos a crear/actualizar\n`);

if (isDryRun) {
  console.log("⚠️  Pasa --apply para ejecutar");
  await prisma.$disconnect();
  process.exit(0);
}

// ============================================================
// 6. APLICAR: corregir códigos de variantes
// ============================================================
console.log("🔄 CORRIGIENDO CÓDIGOS...\n");
const systemConfig = await prisma.systemConfig.findFirst();

// Handle swaps: need temporary codes to avoid unique constraint conflicts
const swaps = [];
const simpleUpdates = [];
const usedCodes = new Set(products.flatMap(p => p.variants.map(v => v.codigo)));

for (const f of variantFixes) {
  if (usedCodes.has(f.newCode)) {
    swaps.push(f);
  } else {
    simpleUpdates.push(f);
    usedCodes.delete(f.oldCode);
    usedCodes.add(f.newCode);
  }
}

// Simple updates first
for (const f of simpleUpdates) {
  await prisma.productVariant.update({ where: { id: f.variant.id }, data: { codigo: f.newCode } });
  console.log(`  ✅ ${f.oldCode} → ${f.newCode}`);
}

// Handle swaps: use temp code
for (const f of swaps) {
  const tempCode = `TMP_${f.newCode}`;
  const other = variantFixes.find(o => o.variant.id !== f.variant.id && o.newCode === f.oldCode && o.variant.productId === f.variant.productId);
  if (other) {
    // Swap: A→temp, B→A, temp→B
    await prisma.productVariant.update({ where: { id: f.variant.id }, data: { codigo: tempCode } });
    await prisma.productVariant.update({ where: { id: other.variant.id }, data: { codigo: f.oldCode } });
    await prisma.productVariant.update({ where: { id: f.variant.id }, data: { codigo: f.newCode } });
    console.log(`  ✅ ${f.oldCode} ↔ ${f.newCode} (swap con variante ${other.variant.codigo})`);
  } else {
    console.log(`  ⛔ No se pudo resolver swap para ${f.oldCode} → ${f.newCode}`);
  }
}

// ============================================================
// 7. APLICAR: eliminar y recrear costos
// ============================================================
console.log("\n🔄 LIMPIANDO COSTOS...");
const deleted = await prisma.cost.deleteMany({});
console.log(`  🗑️  ${deleted.count} costos eliminados\n`);

console.log("🔄 CREANDO COSTOS...\n");
let created = 0;

for (const product of products) {
  const costEntry = costMap.get(normalize(product.name));

  for (const variant of product.variants) {
    const effectiveCode = variantFixes.find(f => f.variant.id === variant.id)?.newCode ?? variant.codigo;
    const finalPrice = finalPriceMap.get(effectiveCode);

    if (!finalPrice && !costEntry) {
      console.log(`  ⏭️  ${variant.codigo}: sin datos`);
      continue;
    }

    const unitCost = costEntry?.unitCost ?? 0;
    const suppliesCost = costEntry?.suppliesCost ?? Number(systemConfig?.standardSuppliesCost ?? 733);
    const shippingCost = costEntry?.shippingCost ?? Number(systemConfig?.standardShippingCost ?? 185);
    const totalCost = unitCost + suppliesCost + shippingCost;
    const netCost = totalCost * 1.07;
    const unitMl = variant.presentation.unitType === "ml" ? Number(variant.presentation.unitValue ?? 1) : 1;
    const pricePerMl = unitMl > 0 && totalCost > 0 ? netCost / unitMl : null;

    await prisma.cost.create({
      data: {
        variantId: variant.id,
        unitCost,
        suppliesCost,
        shippingCost,
        netCost: totalCost > 0 ? netCost : null,
        pricePerMl,
        basePrice5ml: pricePerMl ? pricePerMl * 5 : null,
        basePrice10ml: pricePerMl ? pricePerMl * 10 : null,
        finalPrice: finalPrice ?? netCost,
      },
    });

    console.log(`  ✅ ${variant.codigo} | venta:C$${finalPrice ?? Number(netCost).toFixed(0)} | costo:C$${unitCost} + ins:C$${suppliesCost} + env:C$${shippingCost} = neto:C$${Number(netCost).toFixed(0)} (${product.name} ${variant.presentation.name})`);
    created++;
  }
}

console.log(`\n✅ ${created} costos creados`);
await prisma.$disconnect();
