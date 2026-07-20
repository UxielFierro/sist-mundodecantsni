"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function DeliveryFilters({ search, locationId: currentLocationId, locations }: { search: string; locationId: string; locations: { id: number; name: string }[] }) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem("q") as HTMLInputElement).value;
    const locId = (form.elements.namedItem("locationId") as HTMLSelectElement).value;
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (locId) params.set("locationId", locId);
    router.push(`/admin/entregas?${params.toString()}`);
  }

  function handleClear() {
    router.push("/admin/entregas");
  }

  const hasFilters = search || currentLocationId;

  return (
    <div className="p-4 border-b flex items-center gap-3">
      <form onSubmit={handleSubmit} className="flex items-center gap-3 flex-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            name="q"
            defaultValue={search}
            placeholder="Buscar por período..."
            className="w-full pl-9 pr-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          name="locationId"
          defaultValue={currentLocationId}
          className="px-3 py-2 border rounded-lg bg-background text-sm"
        >
          <option value="">Todos los espacios</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
        <button type="submit" className="px-3 py-2 border rounded-lg text-sm hover:bg-accent">
          Filtrar
        </button>
      </form>
      {hasFilters && (
        <button onClick={handleClear} className="text-xs text-primary hover:underline shrink-0">
          Limpiar
        </button>
      )}
    </div>
  );
}
