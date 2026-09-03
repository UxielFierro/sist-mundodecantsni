import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const p1 = await prisma.product.findMany({
    where: { name: { contains: 'French Avenue', mode: 'insensitive' } },
  });
  console.log('Search French Avenue:');
  console.log(JSON.stringify(p1, null, 2));

  const p2 = await prisma.product.findMany({
    where: { name: { contains: 'Aoud', mode: 'insensitive' } },
  });
  console.log('\nSearch Aoud:');
  console.log(JSON.stringify(p2, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
