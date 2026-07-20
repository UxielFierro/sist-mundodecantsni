import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";
import path from "path";

const prisma = new PrismaClient();
const EXCEL_DIR = path.resolve(__dirname, "../../ArchivosExcel");

async function loadWorkbook(filename: string) {
  return await new ExcelJS.Workbook().xlsx.readFile(path.join(EXCEL_DIR, filename));
}

function normalizePresentation(text: string): string {
  const t = text.toLowerCase().trim();
  if (t.includes("5ml") || t === "5ml") return "5ml";
  if (t.includes("10ml") || t === "10ml") return "10ml";
  if (t.includes("25ml")) return "25ml";
  if (t.includes("100ml")) return "100ml";
  if (t.includes("docena") || t === "docena") return "docena";
  if (t.includes("paquete")) return "paquete-10";
  if (t.includes("indiv") || t === "individual" || t === "induvidual" || t === "unidad") return "individual";
  return "individual";
}

function isSupply(name: string): boolean {
  const s = name.toLowerCase();
  return s.includes("jeringa") || s.includes("frasco") || s.includes("bolsa") || s.includes("dispensador");
}

async function migrateCodigos() {
  console.log("📄 Migrando Códigos MDN...");
  const workbook = await loadWorkbook("Codigos MDN.xlsx");
  const sheet = workbook.getWorksheet("Códigos");
  if (!sheet) { console.log("  Hoja 'Códigos' no encontrada"); return; }

  let created = 0, skipped = 0;

  for (let i = 4; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    const codigo = String(row.getCell(1).value ?? "").trim();
    const descripcion = String(row.getCell(2).value ?? "").trim();
    const presentacionText = String(row.getCell(3).value ?? "").trim();
    const precio = Number(row.getCell(4).value) || 0;

    if (!codigo || !descripcion) continue;

    // Find or create product by name
    let product = await prisma.product.findFirst({
      where: { name: descripcion },
    });

    if (!product) {
      // Check if name exists with a suffix
      const similar = await prisma.product.findMany({
        where: { name: { startsWith: descripcion.substring(0, Math.min(descripcion.length, 30)) } },
      });
      product = similar[0] || null;
    }

    if (!product) {
      product = await prisma.product.create({
        data: {
          codigo: codigo.split("-")[0],
          name: descripcion,
          slug: descripcion.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
          isSupply: isSupply(descripcion),
          notes: "Migrado desde Excel",
        },
      });
    }

    // Determine presentation
    let presSlug = normalizePresentation(presentacionText);
    const presentation = await prisma.presentation.findUnique({ where: { slug: presSlug } });
    if (!presentation) { skipped++; continue; }

    // Create variant with the full codigo
    // Check if variant already exists (by codigo or by product+presentation)
    const existingByCodigo = await prisma.productVariant.findUnique({ where: { codigo } });
    if (existingByCodigo) { skipped++; continue; }

    const existingByProduct = await prisma.productVariant.findFirst({
      where: { productId: product.id, presentationId: presentation.id },
    });
    if (existingByProduct) {
      // Reuse the existing variant codigo but log it
      console.log(`  ⚠️  ${descripcion} - ${presentation.name} ya existe como ${existingByProduct.codigo}, saltando`);
      skipped++;
      continue;
    }

    const variant = await prisma.productVariant.create({
      data: {
        codigo,
        productId: product.id,
        presentationId: presentation.id,
      },
    });

    // Create initial cost
    const supplies = isSupply(descripcion) ? 0 : 733;
    const shipping = 185;
    await prisma.cost.create({
      data: {
        variantId: variant.id,
        unitCost: precio,
        suppliesCost: supplies,
        shippingCost: shipping,
        finalPrice: precio,
        effectiveDate: new Date(),
      },
    });

    // Create inventory record
    await prisma.globalInventory.upsert({
      where: { variantId: variant.id },
      update: {},
      create: { variantId: variant.id, quantity: 0, minStock: 0 },
    });

    created++;
    if (created % 20 === 0) console.log(`  ${created} variantes creadas...`);
  }
  console.log(`✅ Códigos migrados: ${created} creadas, ${skipped} omitidas`);
}

async function migratePrecios() {
  console.log("📄 Migrando Precios desde PRECIOS.xlsx...");
  const workbook = await loadWorkbook("PRECIOS.xlsx");
  const sheet = workbook.getWorksheet("Hoja1");
  if (!sheet) { console.log("  Hoja 'Hoja1' no encontrada"); return; }

  let updated = 0;

  for (let i = 3; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    const descripcion = String(row.getCell(1).value ?? "").trim();
    const precio = Number(row.getCell(2).value) || 0;
    const insumos = Number(row.getCell(3).value) || 733;
    const envio = Number(row.getCell(4).value) || 185;
    const precioNeto5ml = Number(row.getCell(10).value) || 0;
    const precioNeto10ml = Number(row.getCell(11).value) || 0;

    if (!descripcion || !precio) continue;

    const product = await prisma.product.findFirst({
      where: { name: { contains: descripcion } },
    });
    if (!product) continue;

    const variants = await prisma.productVariant.findMany({
      where: { productId: product.id },
      include: { presentation: true },
    });

    for (const v of variants) {
      let finalPrice = precio;
      if (v.presentation.unitType === "ml") {
        if (Number(v.presentation.unitValue) === 5 && precioNeto5ml) finalPrice = precioNeto5ml;
        else if (Number(v.presentation.unitValue) === 10 && precioNeto10ml) finalPrice = precioNeto10ml;
      }

      const totalCost = precio + insumos + envio;
      await prisma.cost.create({
        data: {
          variantId: v.id,
          unitCost: precio,
          suppliesCost: insumos,
          shippingCost: envio,
          netCost: totalCost * 1.07,
          pricePerMl: v.presentation.unitValue ? totalCost / Number(v.presentation.unitValue) : null,
          basePrice5ml: v.presentation.unitValue ? (totalCost / Number(v.presentation.unitValue)) * 5 : null,
          basePrice10ml: v.presentation.unitValue ? (totalCost / Number(v.presentation.unitValue)) * 10 : null,
          finalPrice,
          effectiveDate: new Date(),
        },
      });
      updated++;
    }
  }
  console.log(`✅ Precios migrados: ${updated} costos actualizados`);
}

async function migrateLocations() {
  console.log("📄 Migrando espacios...");
  const existing = await prisma.location.findFirst({
    where: { slug: "emprendi2-colectivo" },
  });
  if (!existing) {
    await prisma.location.create({
      data: {
        name: "Emprendi2 Colectivo",
        slug: "emprendi2-colectivo",
        type: "collectivo",
        contact: "Sara",
      },
    });
    console.log("  Espacio 'Emprendi2 Colectivo' creado");
  } else {
    console.log("  Espacio 'Emprendi2 Colectivo' ya existe");
  }
  console.log("✅ Espacios migrados");
}

async function main() {
  console.log("🚀 Iniciando migración de datos...\n");
  console.log("   Origen:", EXCEL_DIR, "\n");

  await migrateCodigos();
  await migratePrecios();
  await migrateLocations();

  const stats = await prisma.$transaction([
    prisma.product.count(),
    prisma.productVariant.count(),
    prisma.cost.count(),
    prisma.globalInventory.count(),
    prisma.location.count(),
  ]);

  console.log("\n📊 Resumen final:");
  console.log(`   Productos:     ${stats[0]}`);
  console.log(`   Variantes:     ${stats[1]}`);
  console.log(`   Costos:        ${stats[2]}`);
  console.log(`   Inventarios:   ${stats[3]}`);
  console.log(`   Espacios:      ${stats[4]}`);
  console.log("\n🎉 Migración completada!");
}

main()
  .catch((e) => {
    console.error("\n❌ Error durante la migración:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
