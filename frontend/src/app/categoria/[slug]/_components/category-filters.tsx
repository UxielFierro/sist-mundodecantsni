"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function CategoryFilters({
  slug,
  search,
  brandId,
  onlyAvailable,
  sort,
  brands,
}: {
  slug: string;
  search: string;
  brandId: string;
  onlyAvailable: boolean;
  sort: string;
  brands: { id: number; name: string }[];
}) {
  const router = useRouter();

  function buildUrl(next: {
    q?: string;
    brand?: string;
    stock?: boolean;
    sort?: string;
  }) {
    const params = new URLSearchParams();
    const qVal = next.q !== undefined ? next.q : search;
    const bVal = next.brand !== undefined ? next.brand : brandId;
    const sVal = next.stock !== undefined ? next.stock : onlyAvailable;
    const sortVal = next.sort !== undefined ? next.sort : sort;

    if (qVal.trim()) params.set("q", qVal.trim());
    if (bVal) params.set("brand", bVal);
    if (sVal) params.set("stock", "1");
    if (sortVal && sortVal !== "codigo") params.set("sort", sortVal);

    const qs = params.toString();
    return qs ? `/categoria/${slug}?${qs}` : `/categoria/${slug}`;
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
    router.push(buildUrl({ q }));
  }

  const hasFilters = Boolean(search || brandId || onlyAvailable || (sort && sort !== "codigo"));

  return (
    <div className="mb-10 bg-white border border-stone-200/70 rounded-2xl p-3.5 shadow-xs flex flex-wrap items-center gap-3">
      <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          name="q"
          defaultValue={search}
          placeholder="Buscar por nombre o nota olfativa..."
          className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-none focus:border-gold"
        />
      </form>

      {brands.length > 0 && (
        <select
          value={brandId}
          onChange={(e) => router.push(buildUrl({ brand: e.target.value }))}
          className="px-3 py-2 text-xs border border-stone-200 rounded-xl bg-white text-stone-700 focus:outline-none focus:border-gold"
        >
          <option value="">Todas las marcas</option>
          {brands.map((b) => (
            <option key={b.id} value={String(b.id)}>
              {b.name}
            </option>
          ))}
        </select>
      )}

      <select
        value={sort || "codigo"}
        onChange={(e) => router.push(buildUrl({ sort: e.target.value }))}
        className="px-3 py-2 text-xs border border-stone-200 rounded-xl bg-white text-stone-700 focus:outline-none focus:border-gold"
      >
        <option value="codigo">Orden: Destacado</option>
        <option value="name">Nombre (A-Z)</option>
        <option value="price_asc">Menor precio</option>
        <option value="price_desc">Mayor precio</option>
      </select>

      <label className="inline-flex items-center gap-2 text-xs text-stone-700 px-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={onlyAvailable}
          onChange={(e) => router.push(buildUrl({ stock: e.target.checked }))}
          className="accent-stone-900 rounded"
        />
        Solo disponibles
      </label>

      {hasFilters && (
        <button
          type="button"
          onClick={() => router.push(`/categoria/${slug}`)}
          className="text-xs text-gold hover:underline font-medium ml-auto"
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
