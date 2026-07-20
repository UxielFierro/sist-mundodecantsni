import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    const products = await prisma.product.findMany({
      include: { category: true, brand: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
      orderBy: { codigo: "asc" }
    });
    console.log(JSON.stringify(products, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}
main();
