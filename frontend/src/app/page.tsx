import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { ProductCard } from "@/components/public/product-card";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import {
  Package,
  Sparkles,
  FlaskConical,
  SprayCan as Spray,
  FileDown,
  FlaskRound,
  ChevronRight,
  Star,
  Award,
  Heart,
  Droplets,
  ShieldCheck,
  Truck,
  MessageCircle,
} from "lucide-react";

const categoryIcons: Record<string, typeof Sparkles> = {
  nicho: Sparkles,
  disenador: Spray,
  arabe: FlaskConical,
  damas: Sparkles,
  insumos: Package,
};

const fallbackCategoryDescriptions: Record<string, string> = {
  nicho: "Fragancias exclusivas y de alta perfumería",
  disenador: "Perfumes de casas de moda reconocidas",
  arabe: "Fragancias orientales intensas y duraderas",
  damas: "Perfumes para mujer",
  insumos: "Frascos, jeringas, dispensadores y más",
};

function getSeededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let m = shuffled.length,
    t,
    i;
  let currentSeed = seed;

  while (m) {
    const random = Math.sin(currentSeed++) * 10000;
    i = Math.floor((random - Math.floor(random)) * m--);
    t = shuffled[m];
    shuffled[m] = shuffled[i];
    shuffled[i] = t;
  }
  return shuffled;
}

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    where: { products: { some: { active: true, showInCatalog: true } } },
    include: {
      _count: { select: { products: { where: { active: true, showInCatalog: true } } } },
    },
  });

  const allAvailableProducts = await prisma.product.findMany({
    where: {
      active: true,
      showInCatalog: true,
      isGift: false,
      variants: {
        some: {
          active: true,
          globalInventory: {
            quantity: { gt: 0 },
          },
        },
      },
    },
    include: {
      category: true,
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
    orderBy: { codigo: "asc" },
  });

  const now = new Date();
  const dailySeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();

  const shuffledProducts = getSeededShuffle(allAvailableProducts, dailySeed);

  // Prefer a product that has a photo for the Hero hook
  const heroCandidateIndex = shuffledProducts.findIndex((p) => p.images.length > 0);
  const heroProduct =
    heroCandidateIndex >= 0
      ? shuffledProducts[heroCandidateIndex]
      : shuffledProducts[0] ?? null;

  const featuredProducts = shuffledProducts
    .filter((p) => !heroProduct || p.id !== heroProduct.id)
    .slice(0, 15);

  const heroMinPrice = heroProduct
    ? heroProduct.variants
        .map((v) => (v.costs[0] ? Number(v.costs[0].finalPrice) : null))
        .filter((p): p is number => p !== null && p > 0)
        .sort((a, b) => a - b)[0] ?? null
    : null;

  return (
    <>
      <PublicHeader />

      <main className="flex-1">
        {/* HERO SECTION - THE HOOK */}
        <section className="relative overflow-hidden bg-stone-950 py-16 lg:py-28 flex items-center min-h-[82vh]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/15 via-stone-950 to-stone-950 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative w-full z-10">
            {heroProduct ? (
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left content */}
                <div className="space-y-7 text-center lg:text-left animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-semibold text-gold bg-gold/10 px-4 py-1.5 rounded-full border border-gold/25">
                    <Star className="h-3.5 w-3.5 fill-gold" />
                    Fragancia Destacada del Día
                  </div>

                  <div className="space-y-3">
                    {heroProduct.brand && (
                      <h2 className="text-lg md:text-2xl text-gold/90 font-serif italic">
                        {heroProduct.brand.name}
                      </h2>
                    )}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif tracking-tight text-white leading-[1.05]">
                      {heroProduct.name}
                    </h1>
                    {heroMinPrice && (
                      <p className="text-sm md:text-base text-stone-300 font-light pt-1">
                        Disponible en decants desde{" "}
                        <span className="text-gold font-semibold">
                          {formatCurrency(heroMinPrice)}
                        </span>
                      </p>
                    )}
                  </div>

                  {heroProduct.olfactoryNotes && (
                    <div className="text-stone-300 font-light leading-relaxed border-l-2 border-gold/40 pl-4 py-1 max-w-lg mx-auto lg:mx-0 text-left">
                      <p className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest mb-1.5 font-medium">
                        <Droplets className="h-3.5 w-3.5" />
                        Notas Olfativas
                      </p>
                      <p className="text-sm md:text-base italic opacity-90">
                        {heroProduct.olfactoryNotes}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start">
                    <Link
                      href={`/perfume/${heroProduct.slug}`}
                      className="inline-flex items-center justify-center gap-2 bg-gold text-stone-950 px-7 py-4 text-xs font-semibold hover:bg-white hover:text-stone-950 transition-all duration-300 uppercase tracking-widest rounded-sm"
                    >
                      Descubrir Aroma
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <a
                      href={`https://wa.me/message/7ZODFUDVVJZSH1?text=${encodeURIComponent(
                        `Hola, me interesa ${heroProduct.name} que vi destacado en su catálogo.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 border border-stone-700 text-stone-200 hover:text-white hover:border-gold px-7 py-4 text-xs font-medium transition-all duration-300 uppercase tracking-widest rounded-sm"
                    >
                      <MessageCircle className="h-4 w-4 text-[#25D366]" />
                      Pedir por WhatsApp
                    </a>
                  </div>
                </div>

                {/* Right visual */}
                <div className="relative mx-auto w-full max-w-md lg:max-w-none animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
                  <Link
                    href={`/perfume/${heroProduct.slug}`}
                    className="block aspect-[4/5] md:aspect-square relative flex items-center justify-center group"
                  >
                    <div className="absolute inset-8 bg-gold/15 rounded-full blur-[90px] group-hover:bg-gold/25 transition-colors duration-700" />
                    {heroProduct.images[0] ? (
                      <Image
                        src={heroProduct.images[0].url}
                        alt={heroProduct.name}
                        fill
                        sizes="(max-width: 1024px) 90vw, 45vw"
                        className="object-contain p-4 drop-shadow-[0_24px_60px_rgba(0,0,0,0.65)] group-hover:scale-105 transition-transform duration-700"
                        priority
                      />
                    ) : (
                      <div className="w-64 h-64 border border-stone-800 rounded-full flex items-center justify-center text-stone-700">
                        <Sparkles className="h-12 w-12" />
                      </div>
                    )}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-semibold text-gold mb-8">
                  <Star className="h-3.5 w-3.5 fill-gold/20" />
                  Perfumería Auténtica en Nicaragua
                  <Star className="h-3.5 w-3.5 fill-gold/20" />
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight mb-6 text-white">
                  Mundo Decants
                  <span className="block text-3xl md:text-5xl lg:text-6xl mt-2 text-white/80 italic">
                    Nicaragua
                  </span>
                </h1>

                <p className="text-base md:text-lg text-stone-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                  Descubre fragancias de diseñador, nicho y árabes en presentaciones de 5ml y 10ml.
                  El lujo de la alta perfumería al alcance de tus manos.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href="#catalogo"
                    className="inline-flex items-center justify-center gap-2 bg-gold text-stone-950 px-8 py-3.5 font-medium hover:bg-white transition-all duration-300 w-full sm:w-auto uppercase tracking-widest text-xs"
                  >
                    Ver Catálogo
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="bg-stone-900 border-y border-stone-800/80 py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex items-center justify-center gap-2 text-stone-300 text-xs">
                <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
                <span>100% Fragancias Originales</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-stone-300 text-xs">
                <FlaskRound className="h-4 w-4 text-gold shrink-0" />
                <span>Decants desde 5 ml y 10 ml</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-stone-300 text-xs">
                <Truck className="h-4 w-4 text-gold shrink-0" />
                <span>Envíos a toda Nicaragua</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-stone-300 text-xs">
                <MessageCircle className="h-4 w-4 text-gold shrink-0" />
                <span>Asesoría personalizada</span>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="py-20 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold mb-2">
                Explora por estilo
              </p>
              <h2 className="text-4xl font-serif tracking-tight mb-4">Colecciones</h2>
              <div className="w-12 h-[1px] bg-gold mx-auto" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.map((cat) => {
                const Icon = categoryIcons[cat.slug] || Sparkles;
                const desc = cat.description || fallbackCategoryDescriptions[cat.slug] || "";
                return (
                  <Link
                    key={cat.slug}
                    href={`/categoria/${cat.slug}`}
                    className="group flex flex-col items-center p-7 bg-white rounded-2xl border border-stone-200/70 hover:border-gold/40 transition-all duration-300 hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-0.5"
                  >
                    <div className="mb-4 p-3 rounded-full bg-stone-50 text-stone-500 group-hover:bg-gold/10 group-hover:text-gold transition-colors duration-300">
                      <Icon className="h-6 w-6 stroke-[1.5]" />
                    </div>
                    <h3 className="font-serif text-lg tracking-wide mb-1.5 text-center text-stone-900">
                      {cat.name}
                    </h3>
                    {desc && (
                      <p className="text-xs text-muted-foreground/75 text-center font-light leading-relaxed hidden sm:block line-clamp-2">
                        {desc}
                      </p>
                    )}
                    <span className="mt-3 text-[10px] uppercase tracking-[0.18em] text-gold/80 font-medium">
                      {cat._count.products} opciones
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CATALOG SECTION */}
        <section id="catalogo" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold mb-2">
                Entrega Inmediata
              </p>
              <h2 className="text-4xl font-serif tracking-tight mb-3">
                Descubre Nuestras Fragancias
              </h2>
              <p className="text-muted-foreground/75 mb-4 font-light max-w-2xl mx-auto text-sm">
                Selección rotativa diaria de perfumes originales disponibles en Nicaragua.
              </p>
              <div className="w-12 h-[1px] bg-gold mx-auto" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-9">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {featuredProducts.length === 0 && !heroProduct && (
              <div className="text-center py-20 text-muted-foreground/50">
                <Heart className="h-8 w-8 mx-auto mb-4 opacity-30 stroke-[1]" />
                <p className="font-light">Próximamente más fragancias disponibles</p>
              </div>
            )}

            <div className="mt-14 text-center">
              <a
                href="/catalogo.pdf"
                className="inline-flex items-center gap-2 border border-stone-300 bg-white px-8 py-3.5 text-xs uppercase tracking-widest font-medium hover:border-gold hover:text-gold transition-colors duration-300 rounded-sm"
              >
                <FileDown className="h-4 w-4" />
                Descargar Catálogo PDF
              </a>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="py-20 bg-stone-50/70 border-t border-stone-200/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
              <div className="space-y-5">
                <div className="text-gold mb-2">
                  <Award className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h2 className="text-3xl font-serif">Sobre Nosotros</h2>
                <div className="space-y-4 text-sm text-muted-foreground/85 leading-relaxed font-light">
                  <p>
                    Somos tu tienda de confianza en Nicaragua para descubrir y disfrutar una amplia
                    variedad de fragancias auténticas y exclusivas.
                  </p>
                  <p>
                    Ofrecemos decants de perfumes originales de diseñador, nicho y árabes,
                    permitiéndote explorar nuevos aromas sin necesidad de invertir en frascos
                    grandes.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="text-gold mb-2">
                  <FlaskRound className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h2 className="text-3xl font-serif">¿Qué es un Decant?</h2>
                <div className="space-y-4 text-sm text-muted-foreground/85 leading-relaxed font-light">
                  <p>
                    Es una pequeña porción de un perfume original que se transfiere cuidadosamente
                    desde su frasco original a un envase más pequeño.
                  </p>
                  <p>
                    Esta práctica te permite probar diferentes fragancias sin tener que comprar el
                    envase completo, ideal para explorar distintos perfumes de una manera económica.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 bg-stone-900 text-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif tracking-tight mb-4">La Experiencia</h2>
              <div className="w-12 h-[1px] bg-gold mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="w-16 h-16 rounded-full border border-stone-700 group-hover:border-gold text-stone-400 group-hover:text-gold flex items-center justify-center text-xl font-serif mx-auto mb-6 transition-colors duration-500">
                  01
                </div>
                <h3 className="text-lg font-serif mb-3 tracking-wide text-stone-200">
                  Elige tu fragancia
                </h3>
                <p className="text-sm text-stone-400 font-light">Explora nuestro selecto catálogo</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 rounded-full border border-stone-700 group-hover:border-gold text-stone-400 group-hover:text-gold flex items-center justify-center text-xl font-serif mx-auto mb-6 transition-colors duration-500">
                  02
                </div>
                <h3 className="text-lg font-serif mb-3 tracking-wide text-stone-200">
                  Selecciona el tamaño
                </h3>
                <p className="text-sm text-stone-400 font-light">Presentaciones de 5ml o 10ml</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 rounded-full border border-stone-700 group-hover:border-gold text-stone-400 group-hover:text-gold flex items-center justify-center text-xl font-serif mx-auto mb-6 transition-colors duration-500">
                  03
                </div>
                <h3 className="text-lg font-serif mb-3 tracking-wide text-stone-200">Disfruta</h3>
                <p className="text-sm text-stone-400 font-light">Contáctanos y recibe tu decant</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}
