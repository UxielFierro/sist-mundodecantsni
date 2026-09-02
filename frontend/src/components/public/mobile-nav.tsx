"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, FileDown } from "lucide-react";

interface MobileNavProps {
  categories: { slug: string; name: string }[];
}

export function MobileNav({ categories }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full text-foreground/70 hover:text-foreground transition-colors"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 bg-white border-b shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
            <nav className="max-w-7xl mx-auto px-6 py-6 space-y-1">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="block py-2.5 text-sm font-medium hover:text-gold transition-colors"
              >
                Inicio
              </Link>
              <div className="border-t my-2" />
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
              <div className="border-t my-2" />
              <a
                href="/catalogo.pdf"
                className="flex items-center gap-2 py-2.5 text-sm text-gold font-medium"
                onClick={() => setOpen(false)}
              >
                <FileDown className="h-4 w-4" />
                Descargar Catálogo PDF
              </a>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
