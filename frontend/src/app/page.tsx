import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { ProductCard } from "@/components/public/product-card";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import {
  Package, Sparkles, FlaskConical, SprayCan as Spray,
  FileDown, MessageCircle, MapPin, FlaskRound, Camera, Globe, ChevronRight,
  Star, Award, Heart, Music2
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

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    where: { products: { some: { active: true, showInCatalog: true } } },
  });

  const featuredProducts = await prisma.product.findMany({
    where: { active: true, showInCatalog: true, isGift: false },
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
    take: 12,
  });

  const socialLinks = [
    { name: "WhatsApp", href: "https://wa.me/message/7ZODFUDVVJZSH1", icon: MessageCircle },
    { name: "Instagram", href: "https://www.instagram.com/mundodecants_nicaragua", icon: Camera },
    { name: "TikTok", href: "https://www.tiktok.com/@mundodecants_nicaragua", icon: Music2 },
    { name: "Facebook", href: "https://www.facebook.com/share/1HoTQ938Nn", icon: Globe },
  ];

  return (
    <>
      <PublicHeader />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-stone-50/30 py-20 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative">
            <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-semibold text-gold mb-8">
              <Star className="h-3.5 w-3.5 fill-gold/20" />
              Perfumería Auténtica en Nicaragua
              <Star className="h-3.5 w-3.5 fill-gold/20" />
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight mb-6 text-foreground">
              Mundo Decants
              <span className="block text-3xl md:text-5xl lg:text-6xl mt-2 text-foreground/80 italic">Nicaragua</span>
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Descubre fragancias de diseñador, nicho y árabes en presentaciones de 5ml y 10ml. El lujo de la alta perfumería al alcance de tus manos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#catalogo"
                className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-none font-medium hover:bg-gold hover:text-white transition-all duration-300 w-full sm:w-auto uppercase tracking-widest text-xs"
              >
                Ver Catálogo
              </a>
              <a
                href="/catalogo.pdf"
                className="inline-flex items-center justify-center gap-2 border border-border bg-white/50 backdrop-blur-sm px-8 py-3.5 rounded-none font-medium hover:border-gold hover:text-gold transition-all duration-300 w-full sm:w-auto uppercase tracking-widest text-xs text-foreground/80"
              >
                <FileDown className="h-4 w-4" />
                Descargar PDF
              </a>
            </div>
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
                    className="group flex flex-col items-center p-8 bg-white border border-transparent hover:border-gold/20 transition-all duration-500"
                  >
                    <div className="mb-6 text-foreground/40 group-hover:text-gold transition-colors duration-500 transform group-hover:scale-110">
                      <Icon className="h-8 w-8 stroke-[1.5]" />
                    </div>
                    <h3 className="font-serif text-lg tracking-wide mb-2">{cat.name}</h3>
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
              <div className="w-12 h-[1px] bg-gold mx-auto" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {featuredProducts.length === 0 && (
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
