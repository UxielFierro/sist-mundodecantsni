import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Usuario administrador por defecto
  const admin = await prisma.user.upsert({
    where: { email: "admin@mundodecants.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@mundodecants.com",
      passwordHash: hashSync("Admin1201!", 10),
      fullName: "Administrador MDN",
      role: "admin",
    },
  });
  console.log("Admin creado:", admin.email);

  // Configuración del sistema
  await prisma.systemConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      standardSuppliesCost: 733,
      standardShippingCost: 185,
      posFeePercentage: 7.0,
      currency: "Córdobas",
    },
  });
  console.log("Configuración del sistema creada");

  // Categorías
  const categories = [
    { name: "Nicho", slug: "nicho" },
    { name: "Diseñador", slug: "disenador" },
    { name: "Árabe", slug: "arabe" },
    { name: "Damas", slug: "damas" },
    { name: "Insumos", slug: "insumos" },
    { name: "Miniatura", slug: "miniatura" },
    { name: "Regalía", slug: "regalia" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Categorías creadas");

  // Presentaciones
  const presentations = [
    { name: "2ml", slug: "2ml", unitType: "ml", unitValue: 2, quantity: 1, sortOrder: 1 },
    { name: "5ml", slug: "5ml", unitType: "ml", unitValue: 5, quantity: 1, sortOrder: 2 },
    { name: "10ml", slug: "10ml", unitType: "ml", unitValue: 10, quantity: 1, sortOrder: 3 },
    { name: "25ml", slug: "25ml", unitType: "ml", unitValue: 25, quantity: 1, sortOrder: 4 },
    { name: "100ml", slug: "100ml", unitType: "ml", unitValue: 100, quantity: 1, sortOrder: 5 },
    { name: "Individual", slug: "individual", unitType: "unit", unitValue: 1, quantity: 1, sortOrder: 6 },
    { name: "Docena", slug: "docena", unitType: "unit", unitValue: 1, quantity: 12, sortOrder: 7 },
    { name: "Paquete de 10", slug: "paquete-10", unitType: "unit", unitValue: 1, quantity: 10, sortOrder: 8 },
  ];

  for (const pres of presentations) {
    await prisma.presentation.upsert({
      where: { slug: pres.slug },
      update: {},
      create: pres,
    });
  }
  console.log("Presentaciones creadas");

  // Marcas de ejemplo
  const brandNames = [
    "Xerjoff", "Parfums de Marly", "BDK Parfums", "Goldfield & Banks",
    "Mancera", "Maison Margiela", "Emporio Armani", "Jean Paul Gaultier",
    "Valentino", "Giorgio Armani", "Dolce&Gabbana", "Montblanc",
    "Guerlain", "Jesus Del Pozo", "Ralph Lauren", "Azzaro",
    "Rasasi", "Afnan", "Lattafa", "French Avenue", "Armaf",
    "Al Haramain", "Rayhaan", "Burberry", "Prada", "Yves Saint Laurent",
    "Ariana Grande", "Moschino", "Paris Corner", "Jo Milano",
    "Zimaya", "Versace", "Creed", "Rabanne", "Bentley",
    "Givenchy", "Club de Nuit",
  ];

  for (const name of brandNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await prisma.brand.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
  }
  console.log("Marcas creadas");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
