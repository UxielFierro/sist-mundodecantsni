import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { ProductCard } from "@/components/public/product-card";
import { PerfumeDetailClient } from "@/components/public/perfume-detail-client";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      images: { take: 1, orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
    },
  });
  if (!product) return { title: "Perfume no encontrado - Mundo Decants Nicaragua" };
  return {
    title: `${product.name} - Mundo Decants Nicaragua`,
    description:
      product.olfactoryNotes ||
      `Compra ${product.name} en decants de 5ml y 10ml. Envíos a todo Nicaragua.`,
    openGraph: {
      title: `${product.name} | Mundo Decants Nicaragua`,
      description: product.description || product.olfactoryNotes || `Decant de ${product.name}`,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function PerfumeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, active: true, showInCatalog: true },
    include: {
      category: true,
      brand: true,
      images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
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
  });

  if (!product) notFound();

  const hasStock = product.variants.some((v) => (v.globalInventory?.quantity ?? 0) > 0);

  // Related products from same category or brand
  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      active: true,
      showInCatalog: true,
      isGift: false,
      ...(product.categoryId
        ? { categoryId: product.categoryId }
        : product.brandId
        ? { brandId: product.brandId }
        : {}),
      variants: {
        some: {
          active: true,
          globalInventory: { quantity: { gt: 0 } },
        },
      },
    },
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
      },
    },
    take: 4,
    orderBy: { codigo: "asc" },
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-4 md:py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb - desktop only */}
          <nav className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <span>/</span>
            {product.category && (
              <>
                <Link
                  href={`/categoria/${product.category.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Mobile Back Button */}
          <div className="md:hidden flex items-center mb-4">
            <Link
              href={product.category ? `/categoria/${product.category.slug}` : "/"}
              className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground border border-border/50 bg-stone-50 px-3 py-1.5 rounded-full shadow-xs"
            >
              <ArrowLeft className="h-3 w-3" />
              Volver
            </Link>
          </div>

          <PerfumeDetailClient
            product={{
              slug: product.slug,
              name: product.name,
              brandName: product.brand?.name ?? null,
              categoryName: product.category?.name ?? null,
              description: product.description,
              olfactoryNotes: product.olfactoryNotes,
              isSupply: product.isSupply,
              isFullBottle: product.isFullBottle,
              hasStock,
              images: product.images.map((img) => ({
                id: img.id,
                url: img.url,
                altText: img.altText,
              })),
              variants: product.variants.map((v) => ({
                id: v.id,
                codigo: v.codigo,
                presentationName: v.presentation.name,
                presentationSlug: v.presentation.slug,
                price: v.costs[0] ? Number(v.costs[0].finalPrice) : null,
                stock: v.globalInventory?.quantity ?? 0,
              })),
            }}
          />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 md:mt-24 pt-12 border-t border-border/50">
              <div className="text-center mb-10">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold mb-1.5">
                  Sugerencias
                </p>
                <h2 className="text-2xl md:text-3xl font-serif tracking-tight">
                  También te puede gustar
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {relatedProducts.map((rel) => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <div className="md:hidden pb-24" />
      <PublicFooter />
    </div>
  );
}
