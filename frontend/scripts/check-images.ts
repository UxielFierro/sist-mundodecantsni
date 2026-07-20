import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

async function main() {
  const images = await p.productImage.findMany({ take: 5, orderBy: { id: "asc" } });
  if (images.length === 0) {
    console.log("No hay imágenes en la BD");
  } else {
    console.log("URLs de imágenes:");
    images.forEach(i => console.log(`  [${i.id}] ${i.url}`));
  }

  const total = await p.productImage.count();
  console.log(`\nTotal imágenes: ${total}`);

  const products = await p.product.findMany({ where: { images: { none: {} } }, take: 5 });
  console.log(`\nProductos sin imágenes (primeros 5): ${products.length > 0 ? products.map(p => p.name).join(", ") : "Ninguno"}`);

  await p.$disconnect();
}
main();
