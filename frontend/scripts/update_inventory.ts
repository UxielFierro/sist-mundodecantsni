import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const csvPath = path.join(__dirname, 'inventory.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  
  const lines = csvContent.split('\n').filter(l => l.trim() !== '');
  const headers = lines[0].split(',');
  
  const data = lines.slice(1).map(line => {
    // Basic CSV splitting, assuming no commas in names in this dataset
    const parts = line.split(',');
    return {
      ref: parts[0].trim(),
      nombre: parts[1].trim(),
      categoria: parts[2].trim(),
      precio: parseFloat(parts[3].trim()),
      stock: parseInt(parts[4].trim(), 10)
    };
  });
  
  const location = await prisma.location.findFirst({ where: { name: 'Emprendi2 Colectivo' } });
  if (!location) {
    console.error('Location Emprendi2 Colectivo not found');
    return;
  }

  const discrepancies = [];
  const matches = [];

  for (const item of data) {
    // Find variant
    const variant = await prisma.productVariant.findUnique({
      where: { codigo: item.ref },
      include: { product: true, presentation: true }
    });

    if (!variant) {
      discrepancies.push(`Missing in DB: ${item.ref} - ${item.nombre}`);
      continue;
    }

    const dbName = `${variant.product.name} - ${variant.presentation.name}`;
    matches.push({ variantId: variant.id, ref: item.ref, stock: item.stock, nameInCSV: item.nombre, dbName });
  }

  console.log('--- Discrepancies ---');
  discrepancies.forEach(d => console.log(d));
  
  console.log('\n--- Update Summary ---');
  console.log(`Ready to update stock for ${matches.length} valid items in location: ${location.name}`);
  
  // Actually update stock
  let updateCount = 0;
  for (const match of matches) {
    await prisma.locationInventory.upsert({
      where: {
        locationId_variantId: {
          locationId: location.id,
          variantId: match.variantId
        }
      },
      update: {
        quantity: match.stock
      },
      create: {
        locationId: location.id,
        variantId: match.variantId,
        quantity: match.stock
      }
    });
    
    // Also record an inventory movement for traceability (as adjustment)
    await prisma.inventoryMovement.create({
      data: {
        variantId: match.variantId,
        movementType: 'adjustment',
        quantity: match.stock, // In a real system, you might record the delta, but we'll just record the final value or a note
        locationId: location.id,
        notes: 'Actualización masiva desde Excel',
        createdBy: 'Admin/System'
      }
    });
    
    updateCount++;
  }
  
  console.log(`\nSuccessfully updated ${updateCount} inventory records.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
