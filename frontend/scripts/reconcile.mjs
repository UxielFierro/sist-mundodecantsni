/**
 * Script de reconciliación: Sincroniza la BD con el Excel Codigos MDN.xlsx
 *
 * Uso: npx tsx scripts/reconcile.mjs --dry-run   (modo vista)
 *      npx tsx scripts/reconcile.mjs --apply      (ejecutar cambios)
 */

import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();
const isDryRun = process.argv.includes("--dry-run") || !process.argv.includes("--apply");

if (isDryRun) console.log("⚠️  MODO DRY-RUN — No se aplicarán cambios\n");

// ============================================================
// 1. LEER EXCEL
// ============================================================
async function readExcel(filePath) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  return wb;
}

const EXCEL_DIR = "E:\\Documentos NoLocal\\Desarrollo\\Sist_MundoDecantsNI\\ArchivosExcel\\";
const wb = await readExcel(EXCEL_DIR + "Codigos MDN.xlsx");
const sheet = wb.getWorksheet(1);

function normalize(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9áéíóúñ\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Mapa: de cada producto en Excel por su code
const excelByCode = new Map();

sheet.eachRow((row, rowNum) => {
  if (rowNum <= 2) return;
  const code = String(row.getCell(1)?.value ?? "").trim();
  const name = String(row.getCell(2)?.value ?? "").trim();
  const presentation = String(row.getCell(3)?.value ?? "").trim();
  const price = row.getCell(4)?.value;

  if (!name || !code || name === "NONAME" || name === "RETIROS EN EL LOCAL" || code >= "MDN0175") return;

  if (!excelByCode.has(code)) {
    excelByCode.set(code, { code, name, presentations: [], prices: [] });
  }
  const entry = excelByCode.get(code);
  entry.presentations.push(presentation.toLowerCase());
  entry.prices.push(Number(price));
});

// Agrupar productos Excel por NOMBRE (un producto puede tener múltiples códigos en Excel)
const excelByName = new Map();
for (const [code, entry] of excelByCode) {
  const key = normalize(entry.name);
  if (!excelByName.has(key)) {
    excelByName.set(key, { ...entry, excelCodes: [] });
  }
  const existing = excelByName.get(key);
  existing.excelCodes.push(code);
  // Keep the first code as the product code
  if (!existing.code || code < existing.code) existing.code = code;
  existing.presentations = [...new Set([...existing.presentations, ...entry.presentations])];
}

console.log(`📊 Excel: ${excelByName.size} productos distintos\n`);

// Leer PRECIOS.xlsx
const wb2 = await readExcel(EXCEL_DIR + "PRECIOS.xlsx");
const priceSheet = wb2.getWorksheet(1);
const priceMap = new Map();

priceSheet.eachRow((row, rowNum) => {
  if (rowNum <= 2) return;
  const name = String(row.getCell(1)?.value ?? "").trim();
  if (!name) return;
  const key = normalize(name);
  priceMap.set(key, {
    unitCost: Number(row.getCell(2)?.value) || 0,
    suppliesCost: Number(row.getCell(3)?.value) || 733,
    shippingCost: Number(row.getCell(4)?.value) || 185,
    finalPrice5ml: Number(row.getCell(10)?.value) || 0,
    finalPrice10ml: Number(row.getCell(11)?.value) || 0,
  });
});

console.log(`💰 PRECIOS.xlsx: ${priceMap.size} productos con costos\n`);

// ============================================================
// 2. LEER BD
// ============================================================
const dbProducts = await prisma.product.findMany({
  include: {
    category: true,
    brand: true,
    variants: {
      include: { presentation: true, costs: { take: 1, orderBy: { effectiveDate: "desc" } } },
    },
  },
  orderBy: { id: "asc" },
});

console.log(`🗄️  BD actual: ${dbProducts.length} productos\n`);

const dbByName = new Map();
for (const p of dbProducts) {
  const key = normalize(p.name);
  dbByName.set(key, p);
}

// ============================================================
// 3. MAPEAR (exact match by normalized name)
// ============================================================
const matched = [];
const missing = [];
const dbOnly = [];
const partialSuggestions = [];

for (const [norm, excel] of excelByName) {
  if (dbByName.has(norm)) {
    matched.push({ excel, db: dbByName.get(norm), matchType: "exact" });
  } else {
    // Try to find partial match in DB for suggestion
    let suggestion = null;
    for (const [dbNorm, dbP] of dbByName) {
      if (dbNorm.includes(norm) || norm.includes(dbNorm)) {
        suggestion = { dbNorm, db: dbP };
      }
    }
    if (suggestion) {
      partialSuggestions.push({ excel, suggestion });
    } else {
      missing.push({ excel });
    }
  }
}

// DB products not found in Excel (as exact match)
for (const [norm, db] of dbByName) {
  if (!excelByName.has(norm) && !partialSuggestions.some(s => normalize(s.suggestion.db.name) === norm)) {
    dbOnly.push({ db, norm });
  }
}

console.log(`   ✅ Coincidencia exacta: ${matched.length}`);
console.log(`   ❌ Faltan en BD: ${missing.length}`);
console.log(`   ❓ Solo en BD: ${dbOnly.length}`);
console.log(`   🔄 Sugerencia parcial: ${partialSuggestions.length}\n`);

// ============================================================
// 4. MOSTRAR
// ============================================================
console.log("=== COINCIDENCIAS EXACTAS ===");
let codeChanges = 0;
for (const m of matched) {
  const willChange = m.db.codigo !== m.excel.code;
  if (willChange) {
    codeChanges++;
    console.log(`   ${m.db.codigo} → ${m.excel.code} ⚠️  | ${m.db.name}`);
  } else {
    console.log(`   ${m.db.codigo} ✓ | ${m.db.name}`);
  }
}

console.log("\n=== SUGERENCIAS (match parcial - revisar) ===");
for (const s of partialSuggestions) {
  console.log(`   Excel: ${s.excel.code} "${s.excel.name}"`);
  console.log(`   BD:    ${s.suggestion.db.codigo} "${s.suggestion.db.name}"`);
  console.log(`   Pres:  ${s.excel.presentations.join(", ")}`);
  console.log("");
}

console.log("=== FALTANTES EN BD ===");
for (const m of missing) {
  const p = priceMap.get(normalize(m.excel.name));
  console.log(`   ${m.excel.code} | ${m.excel.name} | pres:${m.excel.presentations.join(", ")} ${p ? "💰" : ""}`);
}

if (dbOnly.length > 0) {
  console.log("\n=== SOLO EN BD ===");
  for (const m of dbOnly) {
    console.log(`   ${m.db.codigo} | ${m.db.name}`);
  }
}

console.log(`\n📋 Resumen: ${codeChanges} códigos cambiarán, ${missing.length} productos por crear`);

if (isDryRun) {
  console.log("\n⚠️  DRY-RUN: Pasa --apply para aplicar cambios.");
  await prisma.$disconnect();
  process.exit(0);
}

// ============================================================
// 5. APLICAR
// ============================================================
console.log("\n🔄 APLICANDO...\n");

// Map presentations
const presentations = await prisma.presentation.findMany();
const presBySlug = new Map(presentations.map(p => [p.slug, p]));
const presNameMap = {
  "5ml": "5ml", "10ml": "10ml", "100ml": "100ml",
  "induvidual": "individual", "individual": "individual", "unidad": "individual",
  "docena": "docena", "paquete de 10": "paquete-10",
  "paquete de 10 ": "paquete-10",
};
function getPresSlug(excelPres) { return presNameMap[excelPres?.toLowerCase().trim()] || null; }

// Category mapping by code range
function categoryForCode(codeNum) {
  if (codeNum >= 1 && codeNum <= 22) return "nicho";
  if (codeNum >= 24 && codeNum <= 62) return "disenador";
  if (codeNum >= 63 && codeNum <= 108) return "arabe";
  if (codeNum === 109) return "disenador";
  return null;
}

// 5a. Update existing product codes
for (const m of matched) {
  if (m.db.codigo !== m.excel.code) {
    const conflict = [...dbByName.values()].some(p => p.codigo === m.excel.code && p.id !== m.db.id);
    if (conflict) {
      console.log(`   ⛔ ${m.excel.code} ya en uso (${m.db.name})`);
      continue;
    }
    console.log(`   ✏️  ${m.db.codigo} → ${m.excel.code} | ${m.db.name}`);

    // Update variant codes
    for (const v of m.db.variants) {
      const expected = `${m.excel.code}-${v.presentation.slug.toUpperCase()}`;
      if (v.codigo !== expected) {
        await prisma.productVariant.update({ where: { id: v.id }, data: { codigo: expected } });
      }
    }
    await prisma.product.update({ where: { id: m.db.id }, data: { codigo: m.excel.code } });
  } else {
    // Code correct, just fix variants if needed
    for (const v of m.db.variants) {
      const expected = `${m.excel.code}-${v.presentation.slug.toUpperCase()}`;
      if (v.codigo !== expected && !v.codigo.includes("-")) {
        console.log(`   🔧 Variante ${v.codigo} → ${expected}`);
        await prisma.productVariant.update({ where: { id: v.id }, data: { codigo: expected } });
      }
    }
  }
}

// 5b. Create missing products
const brandNames = [
  "Xerjoff", "Parfums de Marly", "BDK Parfums", "Goldfield & Banks",
  "Mancera", "Maison Margiela", "Emporio Armani", "Jean Paul Gaultier",
  "Valentino", "Giorgio Armani", "Dolce&Gabbana", "Montblanc",
  "Guerlain", "Jesus Del Pozo", "Ralph Lauren", "Azzaro",
  "Rasasi", "Afnan", "Lattafa", "French Avenue", "Armaf",
  "Al Haramain", "Rayhaan", "Burberry", "Prada", "Yves Saint Laurent",
  "Ariana Grande", "Moschino", "Paris Corner", "Jo Milano",
  "Zimaya", "Versace", "Creed", "Rabanne", "Bentley",
  "Givenchy", "Club de Nuit",
];

async function findBrand(productName) {
  for (const bName of brandNames) {
    if (productName.toLowerCase().includes(bName.toLowerCase())) {
      const slug = bName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const brand = await prisma.brand.findUnique({ where: { slug } });
      if (brand) return brand;
    }
  }
  return null;
}

for (const m of missing) {
  const codeNum = parseInt(m.excel.code.replace("MDN", ""));
  const catSlug = categoryForCode(codeNum);
  const category = catSlug ? await prisma.category.findUnique({ where: { slug: catSlug } }) : null;
  const isSupply = normalize(m.excel.name).includes("jeringa") || normalize(m.excel.name).includes("frasco") || normalize(m.excel.name).includes("bolsa") || normalize(m.excel.name).includes("dispensador");
  const brand = isSupply ? null : await findBrand(m.excel.name);

  console.log(`\n   🆕 Creando ${m.excel.code} | ${m.excel.name}`);

  const product = await prisma.product.create({
    data: {
      codigo: m.excel.code,
      name: m.excel.name,
      slug: slugify(m.excel.name),
      categoryId: category?.id ?? (isSupply ? (await prisma.category.findUnique({ where: { slug: "insumos" } }))?.id : null),
      brandId: brand?.id ?? null,
      isSupply,
      isFullBottle: m.excel.presentations.includes("100ml"),
      isGift: isSupply,
      showInCatalog: !isSupply,
      active: true,
    },
  });

  const uniquePres = [...new Set(m.excel.presentations)];
  for (const presName of uniquePres) {
    const presSlug = getPresSlug(presName);
    if (!presSlug) { console.log(`      ⚠️  Pres desconocida: ${presName}`); continue; }
    const presentation = presBySlug.get(presSlug);
    if (!presentation) { console.log(`      ⚠️  Pres no encontrada: ${presSlug}`); continue; }

    const variantCode = `${m.excel.code}-${presentation.slug.toUpperCase()}`;
    const variant = await prisma.productVariant.create({
      data: { codigo: variantCode, productId: product.id, presentationId: presentation.id, active: true },
    });

    const pEntry = priceMap.get(normalize(m.excel.name));
    if (pEntry && (presentation.slug === "5ml" || presentation.slug === "10ml")) {
      const is5 = presentation.slug === "5ml";
      const finalPrice = is5 ? pEntry.finalPrice5ml : pEntry.finalPrice10ml;
      const netCost = (pEntry.unitCost + pEntry.suppliesCost + pEntry.shippingCost) * 1.07;
      await prisma.cost.create({
        data: {
          variantId: variant.id, unitCost: pEntry.unitCost,
          suppliesCost: pEntry.suppliesCost, shippingCost: pEntry.shippingCost,
          netCost, pricePerMl: netCost / 100,
          basePrice5ml: (netCost / 100) * 5, basePrice10ml: (netCost / 100) * 10,
          finalPrice: finalPrice || netCost,
        },
      });
    }
  }
}

// 5c. Create costs for DB-only products if price data exists
for (const m of dbOnly) {
  const pEntry = priceMap.get(m.norm);
  if (pEntry) {
    for (const v of m.db.variants) {
      if (v.costs.length === 0 && (v.presentation.slug === "5ml" || v.presentation.slug === "10ml")) {
        const is5 = v.presentation.slug === "5ml";
        const finalPrice = is5 ? pEntry.finalPrice5ml : pEntry.finalPrice10ml;
        const netCost = (pEntry.unitCost + pEntry.suppliesCost + pEntry.shippingCost) * 1.07;
        await prisma.cost.create({
          data: {
            variantId: v.id, unitCost: pEntry.unitCost,
            suppliesCost: pEntry.suppliesCost, shippingCost: pEntry.shippingCost,
            netCost, pricePerMl: netCost / 100,
            basePrice5ml: (netCost / 100) * 5, basePrice10ml: (netCost / 100) * 10,
            finalPrice: finalPrice || netCost,
          },
        });
        console.log(`   💰 Costo creado ${v.codigo}: C$${finalPrice || netCost}`);
      }
    }
  }
  // Fix variant codes
  for (const v of m.db.variants) {
    const expected = `${m.db.codigo}-${v.presentation.slug.toUpperCase()}`;
    if (v.codigo !== expected && !v.codigo.includes("-")) {
      console.log(`   🔧 Variante ${v.codigo} → ${expected}`);
      await prisma.productVariant.update({ where: { id: v.id }, data: { codigo: expected } });
    }
  }
}

console.log("\n✅ RECONCILIACIÓN COMPLETA");
await prisma.$disconnect();
