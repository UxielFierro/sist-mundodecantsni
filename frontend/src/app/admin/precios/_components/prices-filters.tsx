"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function PricesFilters({ search }: { search: string }) {
  const router = useRouter();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    router.push(`/admin/precios?${params.toString()}`);
  }

  return (
    <div className="p-4 border-b flex items-center gap-3">
      <div className="relative flex-1 max-w-sm">
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
      {search && (
        <button onClick={() => router.push("/admin/precios")} className="text-xs text-primary hover:underline shrink-0">
          Limpiar
        </button>
      )}
    </div>
  );
}
