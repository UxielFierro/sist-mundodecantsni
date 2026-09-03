import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ take: 5, select: { codigo: true, name: true } });
  console.log('Sample Products:', products);
  
  const variants = await prisma.productVariant.findMany({ 
    take: 5, 
    include: { product: { select: { name: true } }, presentation: { select: { name: true } } } 
  });
  console.log('Sample Variants:', variants.map(v => ({ codigo: v.codigo, name: `${v.product.name} - ${v.presentation.name}` })));
  
  // Search for something like "Afnan 9pm"
  const afnan = await prisma.product.findFirst({ where: { name: { contains: 'Afnan 9pm', mode: 'insensitive' } } });
  console.log('Afnan 9pm Product:', afnan);
  if (afnan) {
    const afnanVariants = await prisma.productVariant.findMany({ where: { productId: afnan.id }, include: { presentation: true }});
    console.log('Afnan 9pm Variants:', afnanVariants.map(v => ({ codigo: v.codigo, presentation: v.presentation.name })));
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
