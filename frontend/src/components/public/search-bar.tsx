"use client";

import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/buscar?q=${encodeURIComponent(q)}`);
    setQuery("");
    inputRef.current?.blur();
  }

  return (
    <>
      {/* Desktop: always visible */}
      <form
        onSubmit={handleSubmit}
        className="hidden md:flex items-center gap-2 border border-input rounded-full px-4 py-2 bg-background/50 hover:border-gold/30 focus-within:border-gold/50 focus-within:ring-1 focus-within:ring-gold/20 transition-all duration-300 w-56"
      >
        <Search className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar fragancias…"
          className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground/40"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-muted-foreground/40 hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {/* Mobile: icon toggle */}
      <div className="md:hidden">
        {!focused ? (
          <button
            onClick={() => {
              setFocused(true);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Buscar productos"
          >
            <Search className="h-4 w-4" />
          </button>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-1.5 border border-input rounded-full px-3 py-1.5 bg-background"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar…"
              className="bg-transparent text-sm outline-none w-32 placeholder:text-muted-foreground/40"
              onBlur={() => {
                if (!query) setFocused(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setFocused(false);
                  setQuery("");
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                setFocused(false);
                setQuery("");
              }}
              className="text-muted-foreground/40 hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </div>
    </>
  );
}
