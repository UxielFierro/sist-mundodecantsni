import { PrismaClient } from "@prisma/client";

const LOCAL_URL = "postgresql://fruxiel:1201@localhost:5432/bd_mundodecantsni";

async function main() {
  const local = new PrismaClient({ datasourceUrl: LOCAL_URL });
  const remote = new PrismaClient();

  const tables = [
    "category", "brand", "presentation", "product", "productVariant",
    "cost", "globalInventory", "locationInventory", "inventoryMovement",
    "locationDelivery", "deliveryItem", "productImage", "salesReport",
    "saleReportItem", "giftConversion", "user", "systemConfig", "supplier",
    "purchaseOrder", "purchaseOrderItem", "priceHistory",
  ] as const;

  console.log("Tabla".padEnd(25), "Local", "Remoto", "Match");
  console.log("-".repeat(55));

  let allMatch = true;
  for (const table of tables) {
    const localCount = await (local as any)[table].count();
    const remoteCount = await (remote as any)[table].count();
    const match = localCount === remoteCount ? "✅" : "❌";
    if (!match) allMatch = false;
    console.log(table.padEnd(25), String(localCount).padEnd(6), String(remoteCount).padEnd(6), match);
  }

  // Verify some specific data
  const localProducts = await local.product.findMany({ where: { categoryId: { not: null } }, select: { codigo: true, name: true, categoryId: true } });
  const remoteProducts = await remote.product.findMany({ where: { categoryId: { not: null } }, select: { codigo: true, name: true, categoryId: true } });
  
  console.log("\n📊 Verificación de categorías asignadas:");
  console.log(`  Local: ${localProducts.length} productos con categoría`);
  console.log(`  Remoto: ${remoteProducts.length} productos con categoría`);

  // Check stock
  const localStock = await local.globalInventory.findMany({ where: { quantity: { gt: 0 } } });
  const remoteStock = await remote.globalInventory.findMany({ where: { quantity: { gt: 0 } } });
  console.log(`\n📦 Variantes con stock > 0:`);
  console.log(`  Local: ${localStock.length}`);
  console.log(`  Remoto: ${remoteStock.length}`);

  // Check a specific product
  const sample = await local.product.findFirst({ where: { categoryId: { not: null } }, include: { category: true, brand: true } });
  if (sample) {
    const remoteSample = await remote.product.findUnique({ where: { codigo: sample.codigo }, include: { category: true, brand: true } });
    console.log(`\n🔍 Muestra: ${sample.codigo} - ${sample.name}`);
    console.log(`  Local: categoría="${sample.category?.name}", marca="${sample.brand?.name}"`);
    console.log(`  Remoto: categoría="${remoteSample?.category?.name}", marca="${remoteSample?.brand?.name}"`);
  }

  await local.$disconnect();
  await remote.$disconnect();

  console.log(`\n${allMatch ? "🎉 TODOS los datos coinciden" : "⚠️ Hay diferencias"}`);
}

main().catch(e => { console.error(e); process.exit(1); });
