import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- 1. Actualizando MDN0176 a MDN0071 (Afnan 9pm) ---');
  // First, check if MDN0071 exists to avoid unique constraint errors
  const existing0071 = await prisma.product.findUnique({ where: { codigo: 'MDN0071' } });
  if (existing0071) {
    console.log('MDN0071 ya existe como producto. No se puede renombrar.');
  } else {
    // Update Product Variant first or Product first?
    // Since Product has a unique codigo, and ProductVariant has a unique codigo.
    const product176 = await prisma.product.findUnique({ where: { codigo: 'MDN0176' } });
    if (product176) {
      await prisma.product.update({
        where: { codigo: 'MDN0176' },
        data: { codigo: 'MDN0071' }
      });
      console.log('Producto MDN0176 renombrado a MDN0071');
      
      const variant176 = await prisma.productVariant.findUnique({ where: { codigo: 'MDN0176' } });
      if (variant176) {
        await prisma.productVariant.update({
          where: { codigo: 'MDN0176' },
          data: { codigo: 'MDN0071' }
        });
        console.log('Variante MDN0176 renombrada a MDN0071');
      }
    } else {
      console.log('Producto MDN0176 no encontrado.');
    }
  }

  console.log('\n--- 2. Creando French Avenue Azzure Aoud (MDN0124) ---');
  const existing124 = await prisma.product.findUnique({ where: { codigo: 'MDN0124' } });
  if (existing124) {
    console.log('MDN0124 ya existe.');
  } else {
    // Upsert Brand
    let brand = await prisma.brand.findUnique({ where: { slug: 'french-avenue' } });
    if (!brand) {
      brand = await prisma.brand.create({
        data: {
          name: 'French Avenue',
          slug: 'french-avenue'
        }
      });
    }

    // Upsert Category
    let category = await prisma.category.findUnique({ where: { slug: 'mundo-decants' } });
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: 'Mundo Decants',
          slug: 'mundo-decants'
        }
      });
    }

    // Create Product
    const newProduct = await prisma.product.create({
      data: {
        codigo: 'MDN0124',
        name: 'French Avenue Azzure Aoud',
        slug: 'french-avenue-azzure-aoud',
        description: 'Clon de Oud Maracujá de Maison Crivelli. Contraste atrevido entre notas tropicales, afrutadas (maracuyá) y maderas profundas y resinosas.',
        olfactoryNotes: 'Maracuyá, Rosa Turca, Azafrán, Oud, Pachulí, Cuero, Ámbar, Vainilla',
        categoryId: category.id,
        brandId: brand.id,
        isGift: false,
        isFullBottle: false,
        isSupply: false,
        active: true,
        showInCatalog: true,
        notes: 'Creado a partir de Excel'
      }
    });

    console.log(`Producto creado: ${newProduct.name}`);

    // Get 5ml Presentation
    const presentation = await prisma.presentation.findFirst({ where: { slug: '5ml' } });
    
    if (presentation) {
      const newVariant = await prisma.productVariant.create({
        data: {
          codigo: 'MDN0124',
          productId: newProduct.id,
          presentationId: presentation.id,
          active: true
        }
      });
      console.log(`Variante creada: ${newVariant.codigo}`);

      // Add Stock in Emprendi2 Colectivo
      const location = await prisma.location.findFirst({ where: { name: 'Emprendi2 Colectivo' } });
      if (location) {
        await prisma.locationInventory.create({
          data: {
            locationId: location.id,
            variantId: newVariant.id,
            quantity: 3
          }
        });
        console.log(`Stock añadido: 3 en ${location.name}`);
        
        await prisma.inventoryMovement.create({
          data: {
            variantId: newVariant.id,
            movementType: 'adjustment',
            quantity: 3,
            locationId: location.id,
            notes: 'Apertura desde Excel',
            createdBy: 'Admin/System'
          }
        });
      }
    } else {
      console.log('Error: No se encontró la presentación de 5ml.');
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
