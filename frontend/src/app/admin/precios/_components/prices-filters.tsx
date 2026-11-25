"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function PricesFilters({
  search,
  filter,
  categoryId,
  categories,
}: {
  search: string;
  filter: string;
  categoryId: string;
  categories: { id: number; name: string }[];
}) {
  const router = useRouter();

  function buildUrl(next: { q?: string; filter?: string; cat?: string }) {
    const params = new URLSearchParams();
    const qVal = next.q !== undefined ? next.q : search;
    const fVal = next.filter !== undefined ? next.filter : filter;
    const cVal = next.cat !== undefined ? next.cat : categoryId;

    if (qVal.trim()) params.set("q", qVal.trim());
    if (fVal && fVal !== "all") params.set("filter", fVal);
    if (cVal) params.set("cat", cVal);

    const qs = params.toString();
    return qs ? `/admin/precios?${qs}` : "/admin/precios";
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
    router.push(buildUrl({ q }));
  }

  const hasFilters = Boolean(search || (filter && filter !== "all") || categoryId);

  return (
    <div className="p-4 border-b flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <form onSubmit={handleSearch}>
          <input
            name="q"
            defaultValue={search}
            placeholder="Buscar por código o producto..."
            className="w-full pl-9 pr-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {[
          { key: "all", label: "Todos" },
          { key: "no_price", label: "Sin precio" },
          { key: "low_margin", label: "Margen bajo (<25%)" },
        ].map((pill) => {
          const active = (filter || "all") === pill.key;
          return (
            <button
              key={pill.key}
              type="button"
              onClick={() => router.push(buildUrl({ filter: pill.key }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                active
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      <select
        value={categoryId}
        onChange={(e) => router.push(buildUrl({ cat: e.target.value }))}
        className="px-3 py-2 border rounded-lg bg-background text-xs"
      >
        <option value="">Todas las categorías</option>
        {categories.map((c) => (
          <option key={c.id} value={String(c.id)}>
            {c.name}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          type="button"
          onClick={() => router.push("/admin/precios")}
          className="text-xs text-gold hover:underline shrink-0 font-medium"
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
