import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { SearchBar } from "@/components/public/search-bar";
import { ProductCard } from "@/components/public/product-card";
import Image from "next/image";
import {
  Package, Sparkles, FlaskConical, SprayCan as Spray,
  FileDown, MessageCircle,
  Music2, MapPin, FlaskRound, Camera, Globe, ChevronRight,
  Star, Award, Heart,
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
    { name: "WhatsApp", href: "https://wa.me/message/7ZODFUDVVJZSH1", icon: MessageCircle, color: "hover:text-green-500" },
    { name: "Instagram", href: "https://www.instagram.com/mundodecants_nicaragua", icon: Camera, color: "hover:text-pink-500" },
    { name: "TikTok", href: "https://www.tiktok.com/@mundodecants_nicaragua", icon: Music2, color: "hover:text-gray-900" },
    { name: "Facebook", href: "https://www.facebook.com/share/1HoTQ938Nn", icon: Globe, color: "hover:text-blue-600" },
  ];

  return (
    <>
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/images/logo-icon.png"
              alt="Mundo Decants"
              width={32}
              height={32}
              className="rounded-lg object-contain"
            />
            <span className="font-bold text-lg tracking-tight">Mundo Decants Nicaragua</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-accent transition-colors">
              Inicio
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="text-sm font-medium px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
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
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.07] via-primary/[0.03] to-background py-16 md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-6">
              <Star className="h-3.5 w-3.5" />
              Perfumes originales · Envíos a todo Nicaragua
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 leading-[1.1]">
              Mundo Decants
              <span className="block text-primary">Nicaragua</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              Descubre fragancias auténticas de diseñador, nicho y árabes en presentaciones de 5ml y 10ml. También proveemos insumos para emprendedores.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a
                href="#catalogo"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:opacity-95 transition-all"
              >
                Ver Catálogo
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="/catalogo.pdf"
                className="inline-flex items-center gap-2 border border-input bg-background/80 backdrop-blur-sm px-6 py-3 rounded-xl font-medium hover:bg-accent transition-colors"
              >
                <FileDown className="h-4 w-4" />
                Descargar PDF
              </a>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-primary/[0.04] to-primary/[0.02] border rounded-2xl p-8 md:p-10">
                <div className="p-2.5 rounded-xl bg-primary/10 w-fit mb-5">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-3">Sobre Nosotros</h2>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Somos tu tienda de confianza en Nicaragua para descubrir y disfrutar una amplia
                    variedad de fragancias auténticas y exclusivas.
                  </p>
                  <p>
                    Ofrecemos <strong className="text-foreground">decants de perfumes originales</strong> de diseñador, nicho y
                    árabes, permitiéndote explorar nuevos aromas sin necesidad de invertir en frascos grandes.
                  </p>
                  <p>
                    También somos proveedores de <strong className="text-foreground">insumos para emprendedores</strong>:
                    frascos, jeringas y bolsas de envío ideales para tu negocio de perfumería.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/[0.04] to-primary/[0.02] border rounded-2xl p-8 md:p-10">
                <div className="p-2.5 rounded-xl bg-primary/10 w-fit mb-5">
                  <FlaskRound className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-3">¿Qué es un Decant?</h2>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
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

        <section className="py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Categorías</h2>
              <p className="text-muted-foreground mt-2">Explora por tipo de fragancia</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat) => {
                const Icon = categoryIcons[cat.slug] || Sparkles;
                return (
                  <Link
                    key={cat.slug}
                    href={`/categoria/${cat.slug}`}
                    className="group flex flex-col items-center p-6 rounded-xl border bg-card hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <div className="p-3.5 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors mb-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm">{cat.name}</h3>
                    <p className="text-[11px] text-muted-foreground text-center mt-1 leading-tight hidden sm:block">
                      {categoryDescriptions[cat.slug] || ""}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section id="catalogo" className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Catálogo de Fragancias</h2>
              <p className="text-muted-foreground mt-2">Nuestra selección de perfumes e insumos</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {featuredProducts.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Heart className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p>Próximamente más fragancias disponibles</p>
              </div>
            )}
            <div className="mt-10 text-center">
              <a
                href="/catalogo.pdf"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
              >
                <FileDown className="h-4 w-4" />
                Descargar Catálogo Completo (PDF)
              </a>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight">¿Cómo funciona?</h2>
              <p className="text-muted-foreground mt-2">Tres pasos para obtener tu fragancia</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-lg shadow-primary/25">
                  1
                </div>
                <h3 className="font-semibold mb-1.5">Elige tu fragancia</h3>
                <p className="text-sm text-muted-foreground">Explora nuestro catálogo</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-lg shadow-primary/25">
                  2
                </div>
                <h3 className="font-semibold mb-1.5">Selecciona 5ml o 10ml</h3>
                <p className="text-sm text-muted-foreground">Según tu preferencia</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-lg shadow-primary/25">
                  3
                </div>
                <h3 className="font-semibold mb-1.5">Contáctanos</h3>
                <p className="text-sm text-muted-foreground">Para tu pedido</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-gradient-to-br from-primary/[0.04] to-primary/[0.02] border rounded-2xl p-8 md:p-10">
              <h2 className="text-2xl font-bold text-center mb-8">Contáctanos</h2>
              <div className="flex justify-center gap-3 mb-8 flex-wrap">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium bg-background hover:border-primary/30 hover:shadow-sm transition-all ${link.color}`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.name}
                    </a>
                  );
                })}
              </div>
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Ubicación
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Estamos ubicados en <strong className="text-foreground">Colectivo Emprendi2</strong>, Calle Principal Colonia
                  Centroamérica. De los semáforos de Lozelsa a 20 varas abajo, contiguo a CF Moto
                  (Frente a Harry Garay Exclusive Design). ¡Esperamos verte pronto!
                </p>
                <a
                  href="https://maps.app.goo.gl/PHtV13cC63ywP6MK7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <MapPin className="h-4 w-4" />
                  Ver en Google Maps
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-center gap-5 mb-5">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-muted-foreground/60 hover:text-foreground ${link.color} transition-colors`}
                  title={link.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
          <p className="text-center text-sm text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Mundo Decants Nicaragua. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  );
}
