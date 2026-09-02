import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/public/product-card";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { ArrowLeft, Package, Sparkles, SprayCan as Spray, FlaskConical } from "lucide-react";

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
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { slug } = await params;
  const { q, page } = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) notFound();

  const search = q?.trim() || "";
  const currentPage = Math.max(1, parseInt(page ?? "1"));

  const where = {
    categoryId: category.id,
    active: true as const,
    showInCatalog: true as const,
    ...(slug !== "insumos" ? { isGift: false as const } : {}),
    ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
  };

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: {
        brand: true,
        images: { take: 1, orderBy: { sortOrder: "asc" } },
        variants: {
          where: { active: true },
          include: {
            presentation: true,
            costs: { take: 1, orderBy: { effectiveDate: "desc" } },
            globalInventory: true,
          },
        },
      },
      orderBy: { codigo: "asc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const Icon = categoryIcons[slug] || Sparkles;

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

          <div className="flex flex-col items-center justify-center text-center mb-16">
            <div className="mb-6 text-gold">
              <Icon className="h-10 w-10 stroke-[1]" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-medium tracking-tight mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-muted-foreground/80 font-light max-w-2xl mx-auto mb-4">
                {category.description}
              </p>
            )}
            <div className="w-12 h-[1px] bg-gold mx-auto mb-4" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
              {total} fragancias disponibles
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
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
                    href={{ pathname: `/categoria/${slug}`, query: { ...(search && { q: search }), page: String(currentPage - 1) } }}
                    className="px-5 py-2.5 border border-border/60 rounded-none bg-white hover:border-gold hover:text-gold transition-colors text-xs uppercase tracking-widest"
                  >
                    Anterior
                  </Link>
                )}
                {currentPage < totalPages && (
                  <Link
                    href={{ pathname: `/categoria/${slug}`, query: { ...(search && { q: search }), page: String(currentPage + 1) } }}
                    className="px-5 py-2.5 border border-border/60 rounded-none bg-white hover:border-gold hover:text-gold transition-colors text-xs uppercase tracking-widest"
                  >
                    Siguiente
                  </Link>
                )}
              </div>
            </div>
          )}

          {products.length === 0 && (
            <div className="text-center py-32 text-muted-foreground/50">
              <Package className="h-10 w-10 mx-auto mb-4 opacity-30 stroke-[1]" />
              <p className="font-light">
                {search
                  ? `No se encontraron resultados para "${search}"`
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
