import { PrismaClient } from "@prisma/client";

const LOCAL_URL = "postgresql://fruxiel:1201@localhost:5432/bd_mundodecantsni";

async function main() {
  const local = new PrismaClient({ datasourceUrl: LOCAL_URL });
  const remote = new PrismaClient();

  // Build ID mappings: local -> remote by codigo
  console.log("Construyendo mapas de IDs...");
  const localProducts = await local.product.findMany();
  const remoteProducts = await remote.product.findMany();

  const productMap = new Map<number, number>();
  for (const lp of localProducts) {
    const rp = remoteProducts.find(r => r.codigo === lp.codigo);
    if (rp) productMap.set(lp.id, rp.id);
  }
  console.log(`  Productos mapeados: ${productMap.size}`);

  const localVariants = await local.productVariant.findMany();
  const remoteVariants = await remote.productVariant.findMany();
  const variantMap = new Map<number, number>();
  for (const lv of localVariants) {
    const rv = remoteVariants.find(r => r.codigo === lv.codigo);
    if (rv) variantMap.set(lv.id, rv.id);
  }
  console.log(`  Variantes mapeadas: ${variantMap.size}`);

  // Migrate images
  console.log("\n📸 Migrando imágenes...");
  const images = await local.productImage.findMany({ orderBy: { id: "asc" } });
  let imgCount = 0;
  for (const img of images) {
    const remoteProductId = productMap.get(img.productId);
    if (!remoteProductId) {
      console.log(`  ⚠️ Imagen ${img.id}: producto ${img.productId} no mapeado`);
      continue;
    }
    const existing = await remote.productImage.findFirst({
      where: { productId: remoteProductId, url: img.url },
    });
    if (!existing) {
      await remote.productImage.create({
        data: {
          productId: remoteProductId,
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
        },
      });
      imgCount++;
    }
  }
  console.log(`  ✅ ${imgCount} imágenes migradas`);

  // Migrate movements
  console.log("\n📦 Migrando movimientos de inventario...");
  const movements = await local.inventoryMovement.findMany({ orderBy: { id: "asc" } });
  let movCount = 0;
  for (const m of movements) {
    const remoteVariantId = variantMap.get(m.variantId);
    if (!remoteVariantId) {
      console.log(`  ⚠️ Movimiento ${m.id}: variante ${m.variantId} no mapeada`);
      continue;
    }
    await remote.inventoryMovement.create({
      data: {
        variantId: remoteVariantId,
        movementType: m.movementType,
        quantity: m.quantity,
        referenceType: m.referenceType,
        referenceId: m.referenceId,
        locationId: m.locationId,
        notes: m.notes,
        createdBy: m.createdBy,
        createdAt: m.createdAt,
      },
    });
    movCount++;
  }
  console.log(`  ✅ ${movCount} movimientos migrados`);

  // Migrate location inventories
  console.log("\n📍 Migrando inventarios por ubicación...");
  const locInv = await local.locationInventory.findMany();
  let liCount = 0;
  for (const li of locInv) {
    const remoteVariantId = variantMap.get(li.variantId);
    if (!remoteVariantId) continue;
    const existing = await remote.locationInventory.findFirst({
      where: { locationId: li.locationId, variantId: remoteVariantId },
    });
    if (!existing) {
      await remote.locationInventory.create({
        data: {
          locationId: li.locationId,
          variantId: remoteVariantId,
          quantity: li.quantity,
        },
      });
      liCount++;
    }
  }
  console.log(`  ✅ ${liCount} inventarios de ubicación migrados`);

  // Migrate deliveries (mapping variant IDs in items)
  console.log("\n📋 Migrando entregas...");
  const deliveries = await local.locationDelivery.findMany({
    include: { items: true },
    orderBy: { id: "asc" },
  });
  let delCount = 0;
  for (const d of deliveries) {
    const mappedItems = d.items
      .filter(item => variantMap.has(item.variantId))
      .map(item => ({
        variantId: variantMap.get(item.variantId)!,
        quantity: item.quantity,
        unitCost: item.unitCost,
      }));
    if (mappedItems.length === 0) continue;

    await remote.locationDelivery.create({
      data: {
        locationId: d.locationId,
        deliveryDate: d.deliveryDate,
        period: d.period,
        notes: d.notes,
        createdBy: d.createdBy,
        createdAt: d.createdAt,
        items: { create: mappedItems },
      },
    });
    delCount++;
  }
  console.log(`  ✅ ${delCount} entregas migradas`);

  // Final counts
  const counts = await remote.$transaction([
    remote.productImage.count(),
    remote.inventoryMovement.count(),
    remote.locationInventory.count(),
    remote.locationDelivery.count(),
  ]);
  console.log(`\n🎉 Resumen final en Supabase:`);
  console.log(`  Imágenes:              ${counts[0]}`);
  console.log(`  Movimientos:           ${counts[1]}`);
  console.log(`  Inventarios x ubic:    ${counts[2]}`);
  console.log(`  Entregas:              ${counts[3]}`);

  await local.$disconnect();
  await remote.$disconnect();
}

main().catch(e => { console.error("Error:", e); process.exit(1); });
