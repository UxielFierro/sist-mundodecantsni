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

      <main className="flex-1 py-4 md:py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb - desktop only */}
          <nav className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 mb-10">
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

          {/* Mobile Back Button - super compact */}
          <div className="md:hidden flex items-center mb-4">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground border border-border/50 bg-stone-50 px-3 py-1.5 rounded-full shadow-sm">
              <ArrowLeft className="h-3 w-3" />
              Volver
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-5 md:gap-12 lg:gap-20">
            {/* Left: Images */}
            <div className="w-full">
              <div className="h-64 sm:h-80 md:h-auto md:aspect-[4/5] bg-gradient-to-b from-stone-50 to-stone-100 rounded-2xl relative flex items-center justify-center p-4 lg:p-16 overflow-hidden border border-border/50">
                {product.images[0] ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain drop-shadow-xl md:drop-shadow-2xl"
                      style={{ maxHeight: "90%" }}
                    />
                  </div>
                ) : (
                  <div className="text-7xl md:text-9xl text-stone-200 font-serif font-light select-none">
                    {product.name.charAt(0)}
                  </div>
                )}
                {!hasStock && (
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-foreground border border-foreground px-4 py-2 md:px-6 md:py-3 text-[10px] md:text-xs uppercase tracking-[0.25em] font-medium bg-white/80">
                      Agotado
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex flex-col md:pt-4 lg:pt-10">
              
              {/* Badge & Title */}
              <div className="mb-4">
                {product.category && (
                  <div className="mb-2.5">
                    <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 shadow-sm">
                      {product.category.name}
                    </span>
                  </div>
                )}
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-medium tracking-tight text-foreground leading-[1.1]">
                  {product.brand ? (
                    <span className="block text-[10px] md:text-sm uppercase tracking-[0.2em] text-muted-foreground font-sans mb-1 md:mb-2">{product.brand.name}</span>
                  ) : null}
                  {product.name}
                </h1>
              </div>

              {/* Description Box - Moved up for screenshots */}
              {product.description && (
                <div className="border border-border/60 rounded-xl p-3 md:p-4 mb-4 bg-white shadow-sm">
                  <p className="text-sm text-foreground/80 leading-relaxed font-light whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Olfactory Notes */}
              {!isSupply && product.olfactoryNotes && (
                <div className="mb-5">
                  <h3 className="text-[10px] md:text-xs uppercase tracking-[0.15em] font-semibold text-muted-foreground/60 mb-2.5 flex items-center gap-1.5">
                    <Droplets className="h-3 w-3" /> Notas Olfativas
                  </h3>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {product.olfactoryNotes.split(",").map((note) => (
                      <span
                        key={note.trim()}
                        className="px-2.5 py-1.5 md:px-4 md:py-2 border border-border/60 rounded-full text-[11px] md:text-xs text-foreground/80 font-light bg-stone-50 shadow-sm"
                      >
                        {note.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants / Prices */}
              {product.variants.length > 0 && (
                <div className="mb-6 md:mb-10">
                  <h3 className="hidden md:block text-xs uppercase tracking-[0.2em] font-medium text-foreground mb-4">
                    Tamaños Disponibles
                  </h3>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {variants.map((v) => {
                      const cost = v.costs[0];
                      const stock = v.globalInventory?.quantity ?? 0;
                      return (
                        <div
                          key={v.id}
                          className={`border rounded-xl p-2.5 md:p-4 text-center bg-white transition-all ${
                            stock > 0
                              ? "border-border shadow-sm hover:border-gold"
                              : "border-border/50 bg-stone-50 opacity-50"
                          }`}
                        >
                          <p className="text-sm md:text-lg font-serif mb-0.5">
                            {v.presentation.slug === "2ml" ? "2 ml" :
                             v.presentation.slug === "5ml" ? "5 ml" :
                             v.presentation.slug === "10ml" ? "10 ml" :
                             v.presentation.slug === "25ml" ? "25 ml" : v.presentation.name}
                          </p>
                          {cost && (
                            <p className="text-[13px] md:text-sm font-medium text-gold">
                              {formatCurrency(Number(cost.finalPrice))}
                            </p>
                          )}
                          <p className="text-[8px] text-stone-200 hover:text-stone-300 font-mono mt-1 select-all transition-colors cursor-text">
                            {v.codigo}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  {otherVariants.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {otherVariants.map((v) => {
                        const cost = v.costs[0];
                        return (
                          <div key={v.id} className="flex flex-col items-center bg-stone-50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-border/50">
                            <span className="text-[11px] md:text-xs text-muted-foreground/80">
                              {v.presentation.name}{cost ? ` · ${formatCurrency(Number(cost.finalPrice))}` : ""}
                            </span>
                            <span className="text-[8px] text-stone-200 hover:text-stone-300 font-mono mt-0.5 select-all transition-colors cursor-text">
                              {v.codigo}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto space-y-3 pt-6 md:pt-10 border-t border-border/60">
                <a
                  href="https://wa.me/message/7ZODFUDVVJZSH1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 md:py-4 text-sm font-medium hover:bg-[#20bd5a] transition-colors w-full tracking-wide rounded-xl md:rounded-none shadow-sm"
                >
                  <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                  Consultar disponibilidad
                </a>
                <a
                  href="https://www.instagram.com/mundodecants_nicaragua"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 md:py-4 text-sm font-medium hover:bg-gold transition-colors w-full tracking-wide rounded-xl md:rounded-none shadow-sm"
                >
                  <Camera className="h-4 w-4 md:h-5 md:w-5" />
                  Instagram
                </a>
              </div>

            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
