import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/public/product-card";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import {
  Package, Sparkles, FlaskConical, SprayCan as Spray,
  FileDown, FlaskRound, ChevronRight,
  Star, Award, Heart, Droplets
} from "lucide-react";

const categoryIcons: Record<string, typeof Sparkles> = {
  nicho: Sparkles,
  disenador: Spray,
  arabe: FlaskConical,
  damas: Sparkles,
  insumos: Package,
};

const categoryDescriptions: Record<string, string> = {
  nicho: "Fragancias exclusivas y de alta perfumería",
  disenador: "Perfumes de casas de moda reconocidas",
  arabe: "Fragancias orientales intensas y duraderas",
  damas: "Perfumes para mujer",
  insumos: "Frascos, jeringas, dispensadores y más",
};

// Seeded shuffle to ensure the daily rotation is consistent throughout the entire day
function getSeededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let m = shuffled.length, t, i;
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
  });

  // Fetch only products that have global stock > 0
  const allAvailableProducts = await prisma.product.findMany({
    where: { 
      active: true, 
      showInCatalog: true, 
      isGift: false,
      variants: {
        some: {
          active: true,
          globalInventory: {
            quantity: { gt: 0 }
          }
        }
      }
    },
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
  });

  // Generate a daily seed based on the date (e.g. 20260926)
  const now = new Date();
  // Using local date values to keep the rotation stable for the timezone day
  const dailySeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  
  const shuffledProducts = getSeededShuffle(allAvailableProducts, dailySeed);
  
  // The first product is our Hero "Hook" product
  const heroProduct = shuffledProducts.length > 0 ? shuffledProducts[0] : null;
  // The rest go to the featured catalog
  const featuredProducts = shuffledProducts.slice(heroProduct ? 1 : 0, 13);

  return (
    <>
      <PublicHeader />

      <main className="flex-1">
        {/* HERO SECTION - THE HOOK */}
        <section className="relative overflow-hidden bg-stone-950 py-20 lg:py-32 flex items-center min-h-[85vh]">
          {/* Elegant dark background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-stone-950 to-stone-950 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative w-full z-10">
            {heroProduct ? (
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                
                {/* Left content: The Pitch */}
                <div className="space-y-8 text-center lg:text-left animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-semibold text-gold bg-gold/10 px-4 py-1.5 rounded-full border border-gold/20">
                    <Star className="h-3.5 w-3.5 fill-gold" />
                    Fragancia Destacada del Día
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-xl md:text-2xl text-stone-400 font-serif italic">
                      {heroProduct.brand?.name}
                    </h2>
                    <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-white leading-tight">
                      {heroProduct.name}
                    </h1>
                  </div>

                  {heroProduct.olfactoryNotes && (
                    <div className="text-stone-300 font-light leading-relaxed border-l-2 border-gold/30 pl-4 py-1 max-w-lg mx-auto lg:mx-0 text-left">
                      <p className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest mb-2 font-medium">
                        <Droplets className="h-4 w-4" />
                        Notas Olfativas
                      </p>
                      <p className="text-sm md:text-base italic opacity-90">{heroProduct.olfactoryNotes}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                    <Link
                      href={`/perfume/${heroProduct.slug}`}
                      className="inline-flex items-center justify-center gap-2 bg-gold text-stone-950 px-8 py-4 text-sm font-medium hover:bg-white hover:text-stone-950 transition-all duration-300 uppercase tracking-widest"
                    >
                      Descubrir Aroma
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <a
                      href="#catalogo"
                      className="inline-flex items-center justify-center gap-2 border border-stone-800 text-stone-300 hover:text-white hover:border-gold px-8 py-4 text-sm font-medium transition-all duration-300 uppercase tracking-widest"
                    >
                      Ver Catálogo
                    </a>
                  </div>
                </div>

                {/* Right content: The Visual */}
                <div className="relative mx-auto w-full max-w-md lg:max-w-none animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                  <div className="aspect-[4/5] md:aspect-square relative flex items-center justify-center">
                    {/* Decorative background glow */}
                    <div className="absolute inset-0 bg-gold/10 rounded-full blur-[100px] animate-pulse" />
                    
                    {heroProduct.images[0] ? (
                      <Image
                        src={heroProduct.images[0].url}
                        alt={heroProduct.name}
                        fill
                        className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-110 hover:scale-115 transition-transform duration-700"
                        priority
                      />
                    ) : (
                      <div className="w-64 h-64 border border-stone-800 rounded-full flex items-center justify-center text-stone-800">
                        <Sparkles className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Fallback generic hero if no products are in stock */
              <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-semibold text-gold mb-8">
                  <Star className="h-3.5 w-3.5 fill-gold/20" />
                  Perfumería Auténtica en Nicaragua
                  <Star className="h-3.5 w-3.5 fill-gold/20" />
                </div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight mb-6 text-white">
                  Mundo Decants
                  <span className="block text-3xl md:text-5xl lg:text-6xl mt-2 text-white/80 italic">Nicaragua</span>
                </h1>
                
                <p className="text-base md:text-lg text-stone-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                  Descubre fragancias de diseñador, nicho y árabes en presentaciones de 5ml y 10ml. El lujo de la alta perfumería al alcance de tus manos.
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

        {/* ABOUT SECTION */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
              <div className="space-y-6">
                <div className="text-gold mb-2">
                  <Award className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h2 className="text-3xl font-serif">Sobre Nosotros</h2>
                <div className="space-y-4 text-sm text-muted-foreground/80 leading-relaxed font-light">
                  <p>
                    Somos tu tienda de confianza en Nicaragua para descubrir y disfrutar una amplia
                    variedad de fragancias auténticas y exclusivas.
                  </p>
                  <p>
                    Ofrecemos decants de perfumes originales de diseñador, nicho y
                    árabes, permitiéndote explorar nuevos aromas sin necesidad de invertir en frascos grandes.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="text-gold mb-2">
                  <FlaskRound className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h2 className="text-3xl font-serif">¿Qué es un Decant?</h2>
                <div className="space-y-4 text-sm text-muted-foreground/80 leading-relaxed font-light">
                  <p>
                    Es una pequeña porción de un perfume original que se transfiere cuidadosamente
                    desde su frasco original a un envase más pequeño.
                  </p>
                  <p>
                    Esta práctica te permite probar diferentes fragancias sin tener que comprar el envase
                    completo, ideal para explorar distintos perfumes de una manera económica.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="py-20 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif tracking-tight mb-4">Colecciones</h2>
              <div className="w-12 h-[1px] bg-gold mx-auto" />
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => {
                const Icon = categoryIcons[cat.slug] || Sparkles;
                return (
                  <Link
                    key={cat.slug}
                    href={`/categoria/${cat.slug}`}
                    className="group flex flex-col items-center p-8 bg-white border border-transparent hover:border-gold/20 transition-all duration-500 hover:shadow-xl hover:shadow-gold/5"
                  >
                    <div className="mb-6 text-foreground/40 group-hover:text-gold transition-colors duration-500 transform group-hover:scale-110">
                      <Icon className="h-8 w-8 stroke-[1.5]" />
                    </div>
                    <h3 className="font-serif text-lg tracking-wide mb-2 text-center">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground/60 text-center font-light leading-relaxed hidden sm:block">
                      {categoryDescriptions[cat.slug] || ""}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CATALOG SECTION */}
        <section id="catalogo" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif tracking-tight mb-4">Descubre Nuestras Fragancias</h2>
              <p className="text-muted-foreground/70 mb-4 font-light max-w-2xl mx-auto">
                Selección rotativa de fragancias disponibles con entrega inmediata.
              </p>
              <div className="w-12 h-[1px] bg-gold mx-auto" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
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
            
            <div className="mt-16 text-center">
              <a
                href="/catalogo.pdf"
                className="inline-flex items-center gap-2 border border-border bg-white px-8 py-3.5 text-xs uppercase tracking-widest font-medium hover:border-gold hover:text-gold transition-colors duration-300"
              >
                <FileDown className="h-4 w-4" />
                Descargar Catálogo PDF
              </a>
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
                <h3 className="text-lg font-serif mb-3 tracking-wide text-stone-200">Elige tu fragancia</h3>
                <p className="text-sm text-stone-400 font-light">Explora nuestro selecto catálogo</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 rounded-full border border-stone-700 group-hover:border-gold text-stone-400 group-hover:text-gold flex items-center justify-center text-xl font-serif mx-auto mb-6 transition-colors duration-500">
                  02
                </div>
                <h3 className="text-lg font-serif mb-3 tracking-wide text-stone-200">Selecciona el tamaño</h3>
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
