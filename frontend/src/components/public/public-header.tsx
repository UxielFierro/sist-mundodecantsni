import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { SearchBar } from "./search-bar";
import { MobileNav } from "./mobile-nav";
import { FileDown } from "lucide-react";

export async function PublicHeader() {
  const categories = await prisma.category.findMany({
    where: {
      products: { some: { active: true, showInCatalog: true } },
    },
    orderBy: { name: "asc" },
  });

  const leftCats = categories.slice(0, Math.ceil(categories.length / 2));
  const rightCats = categories.slice(Math.ceil(categories.length / 2));

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Desktop nav — left side */}
          <nav className="hidden lg:flex items-center gap-6 flex-1">
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Inicio
            </Link>
            {leftCats.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Center logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/images/logo-icon.webp"
              alt="Mundo Decants Nicaragua"
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="flex flex-col items-start">
              <span className="font-serif text-lg font-semibold tracking-tight leading-none">
                Mundo Decants
              </span>
              <span className="text-[8px] uppercase tracking-[0.35em] text-muted-foreground/60 leading-none mt-0.5">
                Nicaragua
              </span>
            </div>
          </Link>

          {/* Desktop nav — right side */}
          <div className="hidden lg:flex items-center gap-6 flex-1 justify-end">
            {rightCats.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {cat.name}
              </Link>
            ))}
            <a
              href="/catalogo.pdf"
              className="text-xs uppercase tracking-[0.15em] text-gold hover:text-gold/80 transition-colors duration-300 flex items-center gap-1"
            >
              <FileDown className="h-3.5 w-3.5" />
              PDF
            </a>
            <SearchBar />
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 lg:hidden">
            <SearchBar />
            <MobileNav
              categories={categories.map((c) => ({
                slug: c.slug,
                name: c.name,
              }))}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
