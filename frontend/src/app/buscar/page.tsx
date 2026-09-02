import { prisma } from "@/lib/db";
import Link from "next/link";
import { ProductCard } from "@/components/public/product-card";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { Search, X } from "lucide-react";

const ITEMS_PER_PAGE = 24;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const query = q?.trim() || "";
  const currentPage = Math.max(1, parseInt(page ?? "1"));

  const whereBase = { active: true, showInCatalog: true, isGift: false } as const;
  const where = query
    ? {
        ...whereBase,
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { codigo: { contains: query, mode: "insensitive" as const } },
          { brand: { name: { contains: query, mode: "insensitive" as const } } },
          { category: { name: { contains: query, mode: "insensitive" as const } } },
          { olfactoryNotes: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : { ...whereBase, id: { equals: 0 } };

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    query
      ? prisma.product.findMany({
          where,
          include: {
            category: true,
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
        })
      : [],
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

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
            <span className="text-foreground">Búsqueda</span>
          </nav>

          <div className="flex flex-col items-center justify-center text-center mb-16">
            <div className="mb-6 text-gold">
              <Search className="h-8 w-8 stroke-[1.5]" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-medium tracking-tight mb-4">
              {query ? `Resultados para "${query}"` : "Buscar Fragancias"}
            </h1>
            <p className="text-muted-foreground/80 font-light max-w-2xl mx-auto mb-4">
              {query
                ? `${total} producto${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`
                : "Escribe algo en el buscador superior para encontrar la fragancia que deseas."}
            </p>
            <div className="w-12 h-[1px] bg-gold mx-auto" />
          </div>

          {products.length > 0 ? (
            <>
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
                        href={{ pathname: "/buscar", query: { q: query, page: String(currentPage - 1) } }}
                        className="px-5 py-2.5 border border-border/60 rounded-none bg-white hover:border-gold hover:text-gold transition-colors text-xs uppercase tracking-widest"
                      >
                        Anterior
                      </Link>
                    )}
                    {currentPage < totalPages && (
                      <Link
                        href={{ pathname: "/buscar", query: { q: query, page: String(currentPage + 1) } }}
                        className="px-5 py-2.5 border border-border/60 rounded-none bg-white hover:border-gold hover:text-gold transition-colors text-xs uppercase tracking-widest"
                      >
                        Siguiente
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : query ? (
            <div className="text-center py-20 text-muted-foreground/50">
              <X className="h-10 w-10 mx-auto mb-4 opacity-30 stroke-[1]" />
              <p className="font-light mb-1">
                No se encontraron fragancias que coincidan con &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs uppercase tracking-[0.1em]">Intentá con otra nota olfativa o marca</p>
            </div>
          ) : null}
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
