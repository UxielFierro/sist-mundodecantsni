import { PrismaClient } from "@prisma/client";

async function checkSupabase() {
  const p = new PrismaClient();
  const r = await p.$transaction([
    p.product.count(),
    p.productVariant.count(),
    p.productImage.count(),
    p.location.count(),
    p.inventoryMovement.count(),
    p.locationDelivery.count(),
    p.salesReport.count(),
    p.giftConversion.count(),
  ]);
  console.log("=== SUPABASE (remoto) ===");
  console.log("  Productos:", r[0]);
  console.log("  Variantes:", r[1]);
  console.log("  Imágenes:", r[2]);
  console.log("  Espacios:", r[3]);
  console.log("  Movimientos:", r[4]);
  console.log("  Entregas:", r[5]);
  console.log("  Reportes:", r[6]);
  console.log("  Regalías:", r[7]);

  const imgs = await p.productImage.findMany({ take: 5 });
  if (imgs.length > 0) {
    console.log("\n  Primeras imágenes:");
    imgs.forEach(i => console.log(`    [${i.id}] ${i.url} (producto ${i.productId})`));
  }

  await p.$disconnect();
}

async function main() {
  process.env.DATABASE_URL = "postgresql://fruxiel:1201@localhost:5432/bd_mundodecantsni";
  const p = new PrismaClient();
  const r = await p.$transaction([
    p.product.count(),
    p.productVariant.count(),
    p.productImage.count(),
    p.location.count(),
    p.inventoryMovement.count(),
    p.locationDelivery.count(),
    p.salesReport.count(),
    p.giftConversion.count(),
  ]);
  console.log("=== LOCAL ===");
  console.log("  Productos:", r[0]);
  console.log("  Variantes:", r[1]);
  console.log("  Imágenes:", r[2]);
  console.log("  Espacios:", r[3]);
  console.log("  Movimientos:", r[4]);
  console.log("  Entregas:", r[5]);
  console.log("  Reportes:", r[6]);
  console.log("  Regalías:", r[7]);

  await p.$disconnect();
  console.log();

  await checkSupabase();
}

main().catch(e => {
  console.error("Error:", e.message);
  process.exit(1);
});
