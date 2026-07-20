"use client";

import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/buscar?q=${encodeURIComponent(q)}`);
    setOpen(false);
    setQuery("");
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        aria-label="Buscar productos"
      >
        <Search className="h-4 w-4" />
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-1.5 bg-accent rounded-lg px-3 py-1.5 border border-input"
    >
      <Search className="h-4 w-4 text-muted-foreground shrink-0" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos…"
        className="bg-transparent text-sm outline-none w-40 placeholder:text-muted-foreground/50"
        onBlur={() => { if (!query) setOpen(false); }}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </form>
  );
}
