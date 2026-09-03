import { prisma } from "@/lib/db";
import { deepSerialize } from "@/lib/utils";
import Link from "next/link";
import { Plus, Download } from "lucide-react";
import { ProductsTable } from "./_components/products-table";
import { ProductFilters } from "./_components/product-filters";

const ITEMS_PER_PAGE = 25;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; page?: string }>;
}) {
  const { q, cat, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1"));
  const search = q?.trim() || "";
  const categoryFilter = cat?.trim() || "";

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { codigo: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryFilter) {
    where.categoryId = parseInt(categoryFilter);
  }

  const [total, rawProducts, categories] = await Promise.all([
    prisma.product.count({ where: where as any }),
    prisma.product.findMany({
      where: where as any,
      orderBy: { codigo: "asc" },
      include: {
        category: true,
        brand: true,
        variants: {
          include: { presentation: true, costs: { take: 1, orderBy: { effectiveDate: "desc" } } },
        },
        images: { take: 1, orderBy: { sortOrder: "asc" } },
      },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const products = deepSerialize(rawProducts) as any[];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-stone-900">Productos</h1>
          <p className="text-sm text-muted-foreground mt-1 font-light">{total} productos registrados en el sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/export/catalogo"
            className="inline-flex items-center gap-2 border border-stone-200 bg-white px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold text-stone-600 hover:border-gold hover:text-gold transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            Exportar
          </a>
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex items-center gap-2 bg-stone-950 text-white px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-gold transition-colors shadow-md"
          >
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Link>
        </div>
      </div>

      <div className="bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm">
        <ProductFilters search={search} categoryFilter={categoryFilter} categories={categories} />

        <ProductsTable products={products} />

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100 bg-stone-50/30 text-sm">
            <p className="text-muted-foreground font-light">
              Mostrando página <span className="font-medium text-stone-700">{currentPage}</span> de {totalPages} ({total} productos)
            </p>
            <div className="flex items-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={{
                    pathname: "/admin/productos",
                    query: { ...(search && { q: search }), ...(categoryFilter && { cat: categoryFilter }), page: String(currentPage - 1) },
                  }}
                  className="px-4 py-2 bg-white border border-stone-200 rounded-lg hover:border-gold hover:text-gold transition-colors shadow-sm text-xs uppercase tracking-wider font-medium text-stone-600"
                >
                  Anterior
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={{
                    pathname: "/admin/productos",
                    query: { ...(search && { q: search }), ...(categoryFilter && { cat: categoryFilter }), page: String(currentPage + 1) },
                  }}
                  className="px-4 py-2 bg-white border border-stone-200 rounded-lg hover:border-gold hover:text-gold transition-colors shadow-sm text-xs uppercase tracking-wider font-medium text-stone-600"
                >
                  Siguiente
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
