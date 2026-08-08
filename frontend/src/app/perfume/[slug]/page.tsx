import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
import { formatCurrency, isSCCode } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Package, Sparkles, FlaskConical, SprayCan as Spray, ShieldCheck, MessageCircle, Camera, FileDown, Droplets, Award } from "lucide-react";

const categoryIcon: Record<string, typeof Sparkles> = {
  nicho: Sparkles,
  disenador: Spray,
  arabe: FlaskConical,
  damas: Sparkles,
  insumos: Package,
};

function getCategoryGradient(slug?: string): string {
  switch (slug) {
    case "nicho": return "from-amber-50 to-amber-100/50";
    case "disenador": return "from-blue-50 to-blue-100/50";
    case "arabe": return "from-emerald-50 to-emerald-100/50";
    case "insumos": return "from-slate-50 to-slate-100/50";
    default: return "from-primary/5 to-primary/[0.02]";
  }
}

function getCategoryBorder(slug?: string): string {
  switch (slug) {
    case "nicho": return "border-amber-200/50";
    case "disenador": return "border-blue-200/50";
    case "arabe": return "border-emerald-200/50";
    default: return "border-border";
  }
}

function getBadgeColor(slug?: string): string {
  switch (slug) {
    case "nicho": return "bg-amber-100 text-amber-800 border-amber-200";
    case "disenador": return "bg-blue-100 text-blue-800 border-blue-200";
    case "arabe": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    default: return "bg-primary/10 text-primary";
  }
}

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
  const gradient = product.category ? getCategoryGradient(product.category.slug) : "from-primary/5 to-primary/[0.02]";
  const borderColor = product.category ? getCategoryBorder(product.category.slug) : "border-border";
  const badgeColor = product.category ? getBadgeColor(product.category.slug) : "bg-primary/10 text-primary";

  const variants = product.variants.filter((v) => ["5ml", "10ml", "2ml", "25ml"].includes(v.presentation.slug));
  const otherVariants = product.variants.filter((v) => !["5ml", "10ml", "2ml", "25ml"].includes(v.presentation.slug));
  const hasStock = product.variants.some((v) => (v.globalInventory?.quantity ?? 0) > 0);
  const totalStock = product.variants.reduce((acc, v) => acc + (v.globalInventory?.quantity ?? 0), 0);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-sm tracking-tight">Mundo Decants Nicaragua</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-input hover:border-primary/50 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Volver
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-6 sm:py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>

          <div className={`bg-gradient-to-br ${gradient} border ${borderColor} rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg`}>
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-2 relative bg-white/40 flex items-center justify-center p-8 sm:p-10 min-h-[300px] sm:min-h-[400px]">
                {product.images[0] ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-contain transition-transform duration-500 hover:scale-105"
                      style={{ maxHeight: "380px" }}
                    />
                    {!hasStock && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px] rounded-2xl">
                        <span className="text-white font-bold text-sm tracking-widest bg-red-600/90 px-4 py-2 rounded-lg shadow-lg">
                          SOLD OUT
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-8xl text-muted-foreground/10 font-bold select-none">
                    {product.name.charAt(0)}
                  </div>
                )}
                {hasStock && totalStock > 0 && totalStock <= 5 && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-md">
                    Últimas unidades
                  </div>
                )}
              </div>

              <div className="md:col-span-3 p-6 sm:p-10 flex flex-col justify-between bg-white/60 backdrop-blur-sm">
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                          {product.category?.name || "General"}
                        </span>
                        {(product.isFullBottle || product.isSupply) && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-mono tracking-wider bg-muted/50 px-2 py-0.5 rounded-full">
                            <span>{product.codigo}</span>
                            {isSCCode(product.codigo) && (
                              <span className="text-[8px] font-medium text-yellow-700 bg-yellow-100 px-1 py-0.5 rounded">SC</span>
                            )}
                          </span>
                        )}
                        {isSupply && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-slate-100 text-slate-700 border-slate-200">
                            Insumo
                          </span>
                        )}
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                        {product.name}
                      </h1>
                    </div>
                  </div>

                  {product.description && (
                    <div className="bg-white/70 border rounded-xl p-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  )}

                  {!isSupply && product.olfactoryNotes && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2 flex items-center gap-1.5">
                        <Droplets className="h-3 w-3" />
                        Notas Olfativas
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {product.olfactoryNotes.split(",").map((note) => (
                          <span
                            key={note.trim()}
                            className="px-3 py-1.5 bg-white/80 border rounded-full text-xs font-medium text-muted-foreground shadow-sm"
                          >
                            {note.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.variants.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3 flex items-center gap-1.5">
                        <Award className="h-3 w-3" />
                        Presentaciones y Precios
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {variants.map((v) => {
                          const cost = v.costs[0];
                          const stock = v.globalInventory?.quantity ?? 0;
                          return (
                            <div
                              key={v.id}
                              className={`border rounded-xl p-3 text-center transition-all ${
                                stock > 0
                                  ? "bg-white/80 hover:shadow-md hover:border-primary/30"
                                  : "bg-muted/30 opacity-60"
                              }`}
                            >
                              <p className="text-lg font-bold text-primary">
                                {v.presentation.slug === "2ml" ? "2 ml" :
                                 v.presentation.slug === "5ml" ? "5 ml" :
                                 v.presentation.slug === "10ml" ? "10 ml" :
                                 v.presentation.slug === "25ml" ? "25 ml" : v.presentation.name}
                              </p>
                              {cost && (
                                <p className="text-sm font-semibold mt-1">
                                  {formatCurrency(Number(cost.finalPrice))}
                                </p>
                              )}
                              <p className="text-[8px] text-muted-foreground/40 font-mono mt-1">
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
                            <span key={v.id} className="text-[11px] text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                              {v.presentation.name}{cost ? `: ${formatCurrency(Number(cost.finalPrice))}` : ""}
                              <span className="text-[8px] text-muted-foreground/40 font-mono ml-1">{v.codigo}</span>
                            </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 sm:mt-8 pt-5 border-t">
                  <div className="bg-gradient-to-r from-primary/5 to-primary/[0.02] border rounded-xl p-4">
                    <p className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-3">
                      Hacer tu pedido
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <a
                        href="https://wa.me/message/7ZODFUDVVJZSH1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </a>
                      <a
                        href="https://www.instagram.com/mundodecants_nicaragua"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 border bg-white/80 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-accent transition-colors"
                      >
                        <Camera className="h-4 w-4" />
                        Instagram
                      </a>
                      <a
                        href="/catalogo.pdf"
                        className="inline-flex items-center gap-1.5 border bg-white/80 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-accent transition-colors"
                      >
                        <FileDown className="h-4 w-4" />
                        Catálogo PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground/40">
              Mundo Decants Nicaragua · Perfumes originales en presentaciones de decant · Envíos a todo el país
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
