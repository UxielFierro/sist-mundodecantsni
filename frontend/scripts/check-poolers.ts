import { PrismaClient } from "@prisma/client";

async function main() {
  // Using transaction pooler (DATABASE_URL - port 6543)
  const p1 = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });
  const i1 = await p1.productImage.count();
  console.log("Via pooler (6543):", i1, "imágenes");
  await p1.$disconnect();

  // Using direct connection (DIRECT_URL - port 5432)
  const p2 = new PrismaClient({ datasourceUrl: process.env.DIRECT_URL });
  const i2 = await p2.productImage.count();
  console.log("Via direct (5432):", i2, "imágenes");
  await p2.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
