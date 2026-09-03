import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const location = await prisma.location.findFirst({ where: { name: 'Emprendi2 Colectivo' } });
  const variant = await prisma.productVariant.findUnique({ where: { codigo: 'MDN0176' } });
  
  if (location && variant) {
    await prisma.locationInventory.upsert({
      where: {
        locationId_variantId: { locationId: location.id, variantId: variant.id }
      },
      update: { quantity: 5 },
      create: { locationId: location.id, variantId: variant.id, quantity: 5 }
    });
    console.log('Updated MDN0176 stock to 5');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
