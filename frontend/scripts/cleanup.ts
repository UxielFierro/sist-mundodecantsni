import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

async function main() {
  await p.deliveryItem.deleteMany({});
  await p.locationDelivery.deleteMany({});
  await p.inventoryMovement.deleteMany({});
  await p.locationInventory.deleteMany({});
  await p.productImage.deleteMany({});
  await p.saleReportItem.deleteMany({});
  await p.salesReport.deleteMany({});
  await p.giftConversion.deleteMany({});
  console.log("Limpieza completada");
  await p.$disconnect();
}

main();
