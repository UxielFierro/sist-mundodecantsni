"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function ProductFilters({
  search,
  categoryFilter,
  categories,
}: {
  search: string;
  categoryFilter: string;
  categories: { id: number; name: string }[];
}) {
  const router = useRouter();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem("q") as HTMLInputElement).value;
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categoryFilter) params.set("cat", categoryFilter);
    router.push(`/admin/productos?${params.toString()}`);
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (e.target.value) params.set("cat", e.target.value);
    router.push(`/admin/productos?${params.toString()}`);
  }

  function handleClear() {
    router.push("/admin/productos");
  }

  return (
    <div className="p-4 border-b flex items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <form onSubmit={handleSearch}>
          <input
            name="q"
            defaultValue={search}
            placeholder="Buscar por nombre o código..."
            className="w-full pl-9 pr-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </form>
      </div>
      <div>
        <select
          name="cat"
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="px-3 py-2 border rounded-lg bg-background text-sm"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      {(search || categoryFilter) && (
        <button
          onClick={handleClear}
          className="text-xs text-primary hover:underline shrink-0"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
