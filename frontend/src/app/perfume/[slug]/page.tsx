import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, MessageCircle, Camera, Droplets } from "lucide-react";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { brand: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
  });
  if (!product) return { title: "Perfume no encontrado - Mundo Decants Nicaragua" };
  return {
    title: `${product.name} - Mundo Decants Nicaragua`,
    description: product.olfactoryNotes || `Compra ${product.name} en decants de 5ml y 10ml. Envíos a todo Nicaragua.`,
    openGraph: {
      title: `${product.name} | Mundo Decants Nicaragua`,
      description: product.description || product.olfactoryNotes || `Decant de ${product.name}`,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function PerfumeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, active: true, showInCatalog: true },
    include: {
      category: true,
      brand: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: {
        where: { active: true },
        include: {
          presentation: true,
          costs: { take: 1, orderBy: { effectiveDate: "desc" } },
          globalInventory: true,
        },
      },
    },
  });

  if (!product) notFound();

  const isSupply = product.isSupply;
  const variants = product.variants.filter((v) => ["5ml", "10ml", "2ml", "25ml"].includes(v.presentation.slug));
  const otherVariants = product.variants.filter((v) => !["5ml", "10ml", "2ml", "25ml"].includes(v.presentation.slug));
  const hasStock = product.variants.some((v) => (v.globalInventory?.quantity ?? 0) > 0);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 mb-10">
            <Link href="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <span>/</span>
            {product.category && (
              <>
                <Link href={`/categoria/${product.category.slug}`} className="hover:text-foreground transition-colors">
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Images */}
            <div className="space-y-4">
              <div className="aspect-[4/5] bg-gradient-to-b from-stone-50 to-stone-100 rounded-2xl relative flex items-center justify-center p-8 lg:p-16 overflow-hidden border border-border/50">
                {product.images[0] ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain drop-shadow-2xl"
                      style={{ maxHeight: "80%" }}
                    />
                  </div>
                ) : (
                  <div className="text-9xl text-stone-200 font-serif font-light select-none">
                    {product.name.charAt(0)}
                  </div>
                )}
                {!hasStock && (
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-foreground border border-foreground px-6 py-3 text-xs uppercase tracking-[0.25em] font-medium bg-white/80">
                      Agotado
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex flex-col pt-4 lg:pt-10">
              <div className="mb-8 space-y-3">
                {product.brand && (
                  <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    {product.brand.name}
                  </p>
                )}
                <h1 className="text-4xl lg:text-5xl font-serif font-medium tracking-tight text-foreground leading-[1.1]">
                  {product.name}
                </h1>
              </div>

              {!isSupply && product.olfactoryNotes && (
                <div className="mb-10">
                  <div className="flex flex-wrap gap-2">
                    {product.olfactoryNotes.split(",").map((note) => (
                      <span
                        key={note.trim()}
                        className="px-4 py-2 border border-border rounded-full text-xs text-foreground/80 font-light"
                      >
                        {note.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.variants.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-foreground mb-4">
                    Tamaños Disponibles
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {variants.map((v) => {
                      const cost = v.costs[0];
                      const stock = v.globalInventory?.quantity ?? 0;
                      return (
                        <div
                          key={v.id}
                          className={`border rounded-xl p-4 text-center transition-all ${
                            stock > 0
                              ? "border-border hover:border-gold cursor-default"
                              : "border-border/50 bg-stone-50 opacity-50"
                          }`}
                        >
                          <p className="text-lg font-serif mb-1">
                            {v.presentation.slug === "2ml" ? "2 ml" :
                             v.presentation.slug === "5ml" ? "5 ml" :
                             v.presentation.slug === "10ml" ? "10 ml" :
                             v.presentation.slug === "25ml" ? "25 ml" : v.presentation.name}
                          </p>
                          {cost && (
                            <p className="text-sm font-medium text-gold">
                              {formatCurrency(Number(cost.finalPrice))}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {otherVariants.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {otherVariants.map((v) => {
                        const cost = v.costs[0];
                        return (
                          <span key={v.id} className="text-xs text-muted-foreground/80 bg-stone-50 px-4 py-2 rounded-lg border border-border/50">
                            {v.presentation.name}{cost ? ` · ${formatCurrency(Number(cost.finalPrice))}` : ""}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-auto space-y-4 pt-10 border-t border-border">
                <a
                  href="https://wa.me/message/7ZODFUDVVJZSH1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-4 text-sm font-medium hover:bg-[#20bd5a] transition-colors w-full tracking-wide rounded-none"
                >
                  <MessageCircle className="h-5 w-5" />
                  Consultar disponibilidad
                </a>
                <a
                  href="https://www.instagram.com/mundodecants_nicaragua"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-foreground text-background px-8 py-4 text-sm font-medium hover:bg-gold transition-colors w-full tracking-wide rounded-none"
                >
                  <Camera className="h-5 w-5" />
                  Instagram
                </a>
              </div>

              {product.description && (
                <div className="mt-16">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground/60 mb-4">
                    Descripción del Producto
                  </h3>
                  <p className="text-sm text-foreground/80 leading-relaxed font-light whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
