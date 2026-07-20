import { prisma } from "@/lib/db";
import Link from "next/link";
import { SearchBar } from "@/components/public/search-bar";
import { ProductCard } from "@/components/public/product-card";
import { ArrowLeft, FileDown, ShieldCheck, Search, X } from "lucide-react";

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
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">Mundo Decants Nicaragua</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-accent transition-colors">
              Inicio
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <SearchBar />
            <a
              href="/catalogo.pdf"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary border border-input hover:border-primary/50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <FileDown className="h-3.5 w-3.5" />
              Catálogo PDF
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-primary/5">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {query ? `Resultados para "${query}"` : "Buscar productos"}
              </h1>
              <p className="text-muted-foreground mt-0.5">
                {query
                  ? `${total} producto${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`
                  : "Escribe algo en el buscador para encontrar productos"}
              </p>
            </div>
          </div>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 text-sm">
                  <p className="text-muted-foreground">
                    Página {currentPage} de {totalPages} ({total} productos)
                  </p>
                  <div className="flex items-center gap-2">
                    {currentPage > 1 && (
                      <Link
                        href={{ pathname: "/buscar", query: { q: query, page: String(currentPage - 1) } }}
                        className="px-3 py-1.5 border rounded-lg hover:bg-accent"
                      >
                        Anterior
                      </Link>
                    )}
                    {currentPage < totalPages && (
                      <Link
                        href={{ pathname: "/buscar", query: { q: query, page: String(currentPage + 1) } }}
                        className="px-3 py-1.5 border rounded-lg hover:bg-accent"
                      >
                        Siguiente
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : query ? (
            <div className="text-center py-20 text-muted-foreground">
              <X className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No se encontraron productos que coincidan con &ldquo;{query}&rdquo;</p>
              <p className="text-sm mt-1">Intentá con otro término</p>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Usá el buscador del header para encontrar productos</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground/60">
          <p>&copy; {new Date().getFullYear()} Mundo Decants Nicaragua. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}
