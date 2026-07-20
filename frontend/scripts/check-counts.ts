import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
p.$transaction([
  p.product.count(),
  p.productVariant.count(),
  p.cost.count(),
  p.globalInventory.count(),
]).then(r => {
  console.log("Productos:", r[0]);
  console.log("Variantes:", r[1]);
  console.log("Costos:", r[2]);
  console.log("Inventarios:", r[3]);
  p.$disconnect();
});
