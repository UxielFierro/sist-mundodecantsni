import { PrismaClient } from "@prisma/client";

const LOCAL_URL = "postgresql://fruxiel:1201@localhost:5432/bd_mundodecantsni";

async function main() {
  // Read all data from local database
  const local = new PrismaClient({ datasourceUrl: LOCAL_URL });
  const remote = new PrismaClient();

  // Check what exists in remote
  const remoteProducts = await remote.product.count();
  console.log("Remoto - Productos:", remoteProducts);

  // Get all product images from local
  const images = await local.productImage.findMany();
  console.log(`\n📸 Imágenes a migrar: ${images.length}`);

  for (const img of images) {
    const existing = await remote.productImage.findFirst({
      where: { productId: img.productId, url: img.url },
    });
    if (!existing) {
      await remote.productImage.create({
        data: {
          productId: img.productId,
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
        },
      });
      console.log(`  ✅ Imagen ${img.id} -> producto ${img.productId}`);
    }
  }

  // Get all inventory movements
  const movements = await local.inventoryMovement.findMany();
  console.log(`\n📦 Movimientos a migrar: ${movements.length}`);
  for (const m of movements) {
    const existing = await remote.inventoryMovement.findFirst({
      where: { variantId: m.variantId, createdAt: m.createdAt, movementType: m.movementType, quantity: m.quantity },
    });
    if (!existing) {
      await remote.inventoryMovement.create({ data: m });
    }
  }
  console.log(`  ✅ Movimientos migrados`);

  // Get all location deliveries
  const deliveries = await local.locationDelivery.findMany({ include: { items: true } });
  console.log(`\n📋 Entregas a migrar: ${deliveries.length}`);
  for (const d of deliveries) {
    const existing = await remote.locationDelivery.findFirst({
      where: { locationId: d.locationId, deliveryDate: d.deliveryDate },
    });
    if (!existing) {
      const { items, ...delivery } = d;
      await remote.locationDelivery.create({
        data: {
          ...delivery,
          items: { create: items },
        },
      });
      console.log(`  ✅ Entrega ${d.id} -> ubicación ${d.locationId}`);
    }
  }

  // Get all sales reports
  const reports = await local.salesReport.findMany({ include: { items: true } });
  console.log(`\n📊 Reportes a migrar: ${reports.length}`);
  for (const r of reports) {
    const existing = await remote.salesReport.findFirst({
      where: { locationId: r.locationId, reportDate: r.reportDate },
    });
    if (!existing) {
      const { items, ...report } = r;
      await remote.salesReport.create({
        data: {
          ...report,
          items: { create: items },
        },
      });
      console.log(`  ✅ Reporte ${r.id}`);
    }
  }

  // Get all gift conversions
  const gifts = await local.giftConversion.findMany();
  console.log(`\n🎁 Regalías a migrar: ${gifts.length}`);
  for (const g of gifts) {
    const existing = await remote.giftConversion.findFirst({
      where: { productId: g.productId, convertedAt: g.convertedAt },
    });
    if (!existing) {
      await remote.giftConversion.create({ data: g });
    }
  }
  console.log(`  ✅ Regalías migradas`);

  // Final counts
  const counts = await remote.$transaction([
    remote.productImage.count(),
    remote.inventoryMovement.count(),
    remote.locationDelivery.count(),
    remote.salesReport.count(),
    remote.giftConversion.count(),
  ]);
  console.log(`\n🎉 Resumen final en Supabase:`);
  console.log(`  Imágenes:     ${counts[0]}`);
  console.log(`  Movimientos:  ${counts[1]}`);
  console.log(`  Entregas:     ${counts[2]}`);
  console.log(`  Reportes:     ${counts[3]}`);
  console.log(`  Regalías:     ${counts[4]}`);

  await local.$disconnect();
  await remote.$disconnect();
}

main().catch(e => {
  console.error("Error:", e);
  process.exit(1);
});
