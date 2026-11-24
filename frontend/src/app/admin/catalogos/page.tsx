import { prisma } from "@/lib/db";
import { CatalogsManager } from "./_components/catalogs-manager";

export const dynamic = "force-dynamic";

export default async function CatalogsPage() {
  const [categories, brands, presentations, config] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.presentation.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { variants: true } } },
    }),
    prisma.systemConfig.findFirst(),
  ]);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-medium tracking-tight text-stone-900">
          Catálogos y Configuración
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Administrá tus categorías, marcas, presentaciones y parámetros globales de costos
        </p>
      </div>

      <CatalogsManager
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          productCount: c._count.products,
        }))}
        brands={brands.map((b) => ({
          id: b.id,
          name: b.name,
          slug: b.slug,
          productCount: b._count.products,
        }))}
        presentations={presentations.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          unitType: p.unitType,
          unitValue: p.unitValue ? Number(p.unitValue) : null,
          quantity: p.quantity,
          sortOrder: p.sortOrder,
          variantCount: p._count.variants,
        }))}
        config={{
          standardSuppliesCost: Number(config?.standardSuppliesCost ?? 733),
          standardShippingCost: Number(config?.standardShippingCost ?? 185),
          posFeePercentage: Number(config?.posFeePercentage ?? 7),
          currency: config?.currency ?? "Córdobas",
        }}
      />
    </div>
  );
}
