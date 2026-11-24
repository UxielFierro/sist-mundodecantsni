import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/public/product-card";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { CategoryFilters } from "./_components/category-filters";
import { Package, Sparkles, SprayCan as Spray, FlaskConical } from "lucide-react";

const categoryIcons: Record<string, typeof Sparkles> = {
  nicho: Sparkles,
  disenador: Spray,
  arabe: FlaskConical,
  damas: Sparkles,
  insumos: Package,
};

const ITEMS_PER_PAGE = 24;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    q?: string;
    brand?: string;
    stock?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const { slug } = await params;
  const { q, brand = "", stock = "", sort = "codigo", page } = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) notFound();

  const search = q?.trim() || "";
  const brandIdNum = brand ? parseInt(brand, 10) : null;
  const onlyAvailable = stock === "1";
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const where: Record<string, unknown> = {
    categoryId: category.id,
    active: true,
    showInCatalog: true,
    ...(slug !== "insumos" ? { isGift: false } : {}),
    ...(brandIdNum && Number.isFinite(brandIdNum) ? { brandId: brandIdNum } : {}),
    ...(onlyAvailable
      ? {
          variants: {
            some: {
              active: true,
              globalInventory: { quantity: { gt: 0 } },
            },
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { olfactoryNotes: { contains: search, mode: "insensitive" } },
            { brand: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [allProducts, brands] = await Promise.all([
    prisma.product.findMany({
      where: where as any,
      include: {
        brand: true,
        images: { take: 1, orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
        variants: {
          where: { active: true },
          include: {
            presentation: true,
            costs: { take: 1, orderBy: { effectiveDate: "desc" } },
            globalInventory: true,
          },
          orderBy: { presentation: { sortOrder: "asc" } },
        },
      },
      orderBy: sort === "name" ? { name: "asc" } : { codigo: "asc" },
    }),
    prisma.brand.findMany({
      where: {
        products: {
          some: { categoryId: category.id, active: true, showInCatalog: true },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  // Price sorting when requested
  const sortedProducts = [...allProducts];
  if (sort === "price_asc" || sort === "price_desc") {
    const getMinPrice = (p: (typeof allProducts)[number]) => {
      const prices = p.variants
        .map((v) => (v.costs[0] ? Number(v.costs[0].finalPrice) : null))
        .filter((x): x is number => x !== null && x > 0);
      return prices.length > 0 ? Math.min(...prices) : Number.MAX_SAFE_INTEGER;
    };
    sortedProducts.sort((a, b) =>
      sort === "price_asc" ? getMinPrice(a) - getMinPrice(b) : getMinPrice(b) - getMinPrice(a)
    );
  }

  const total = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const products = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const Icon = categoryIcons[slug] || Sparkles;

  const pageQuery = (targetPage: number) => ({
    ...(search && { q: search }),
    ...(brand && { brand }),
    ...(onlyAvailable && { stock: "1" }),
    ...(sort && sort !== "codigo" && { sort }),
    page: String(targetPage),
  });

  return (
    <>
      <PublicHeader />

      <main className="flex-1 bg-stone-50/20 min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 mb-10">
            <Link href="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-foreground">{category.name}</span>
          </nav>

          <div className="flex flex-col items-center justify-center text-center mb-12">
            <div className="mb-5 text-gold">
              <Icon className="h-9 w-9 stroke-[1.25]" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-medium tracking-tight mb-3">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-muted-foreground/80 font-light max-w-2xl mx-auto mb-4 text-sm">
                {category.description}
              </p>
            )}
            <div className="w-12 h-[1px] bg-gold mx-auto mb-4" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/55">
              {total} {total === 1 ? "opción disponible" : "opciones encontradas"}
            </p>
          </div>

          <CategoryFilters
            slug={slug}
            search={search}
            brandId={brand}
            onlyAvailable={onlyAvailable}
            sort={sort}
            brands={brands.map((b) => ({ id: b.id, name: b.name }))}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-9">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-16 pt-8 border-t border-border/50 text-sm">
              <p className="text-muted-foreground/60 font-light mb-4 sm:mb-0">
                Mostrando página {currentPage} de {totalPages}
              </p>
              <div className="flex items-center gap-3">
                {currentPage > 1 && (
                  <Link
                    href={{ pathname: `/categoria/${slug}`, query: pageQuery(currentPage - 1) }}
                    className="px-5 py-2.5 border border-border/60 bg-white hover:border-gold hover:text-gold transition-colors text-xs uppercase tracking-widest"
                  >
                    Anterior
                  </Link>
                )}
                {currentPage < totalPages && (
                  <Link
                    href={{ pathname: `/categoria/${slug}`, query: pageQuery(currentPage + 1) }}
                    className="px-5 py-2.5 border border-border/60 bg-white hover:border-gold hover:text-gold transition-colors text-xs uppercase tracking-widest"
                  >
                    Siguiente
                  </Link>
                )}
              </div>
            </div>
          )}

          {products.length === 0 && (
            <div className="text-center py-24 text-muted-foreground/50">
              <Package className="h-10 w-10 mx-auto mb-4 opacity-30 stroke-[1]" />
              <p className="font-light">
                {search || brand || onlyAvailable
                  ? "No se encontraron fragancias con los filtros seleccionados"
                  : "Próximamente más productos en esta categoría"}
              </p>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
