"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import { createDelivery } from "@/server/actions/deliveries";
import { Search } from "lucide-react";

interface VariantData {
  id: number;
  codigo: string;
  product: { name: string };
  presentation: { name: string };
  globalInventory: { quantity: number } | null;
  costs: { finalPrice: number }[];
}

interface LocationData {
  id: number;
  name: string;
}

export function NewDeliveryForm({
  locations,
  variants,
  search: initialSearch = "",
}: {
  locations: LocationData[];
  variants: VariantData[];
  search?: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [search, setSearch] = useState(initialSearch);

  const filteredVariants = useMemo(() => {
    if (!search.trim()) return variants;
    const q = search.toLowerCase();
    return variants.filter(
      (v) =>
        v.codigo.toLowerCase().includes(q) ||
        v.product.name.toLowerCase().includes(q) ||
        v.presentation.name.toLowerCase().includes(q)
    );
  }, [variants, search]);

  const defaultPeriod = `Mes de ${new Date().toLocaleString("es", { month: "long" })} ${new Date().getFullYear()}`;

  async function handleSubmit(formData: FormData) {
    await createDelivery(formData);
    router.push("/admin/entregas");
    router.refresh();
  }

  function handleQuantityChange(variantId: number, unitCost: number) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const qty = parseInt(e.target.value) || 0;
      const hidden = formRef.current?.querySelector(`[data-variant-id="${variantId}"]`) as HTMLInputElement;
      if (hidden) {
        hidden.value = JSON.stringify({ variantId, quantity: qty, unitCost });
      }
    };
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nueva Entrega</h1>
        <p className="text-muted-foreground mt-1">Registra los productos que llevas a un espacio</p>
      </div>

      <form ref={formRef} action={handleSubmit} className="bg-card border rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="locationId" className="block text-sm font-medium mb-1">Espacio *</label>
            <select id="locationId" name="locationId" required className="w-full px-3 py-2 border rounded-lg bg-background">
              <option value="">Seleccionar...</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="period" className="block text-sm font-medium mb-1">Período *</label>
            <input id="period" name="period" required defaultValue={defaultPeriod} className="w-full px-3 py-2 border rounded-lg bg-background" />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1">Notas</label>
          <input id="notes" name="notes" className="w-full px-3 py-2 border rounded-lg bg-background" placeholder="Notas opcionales" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Productos a entregar
            {search && (
              <span className="text-muted-foreground font-normal ml-2">
                ({filteredVariants.length} de {variants.length})
              </span>
            )}
          </label>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por código, producto o presentación..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="max-h-96 overflow-y-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2.5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Código</th>
                  <th className="text-left px-3 py-2.5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Producto</th>
                  <th className="text-left px-3 py-2.5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Pres.</th>
                  <th className="text-right px-3 py-2.5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Stock</th>
                  <th className="text-right px-3 py-2.5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Costo</th>
                  <th className="text-center px-3 py-2.5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Cant.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredVariants.map((v) => {
                  const stock = v.globalInventory?.quantity ?? 0;
                  const cost = v.costs[0];
                  const unitCost = cost ? Number(cost.finalPrice) : 0;
                  return (
                    <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{v.codigo}</td>
                      <td className="px-3 py-2 font-medium">{v.product.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{v.presentation.name}</td>
                      <td className="px-3 py-2 text-right font-mono text-xs">{stock}</td>
                      <td className="px-3 py-2 text-right font-mono text-xs">{cost ? formatCurrency(unitCost) : "-"}</td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max={stock}
                          defaultValue="0"
                          className="w-14 text-center border rounded px-1 py-1 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                          onChange={handleQuantityChange(v.id, unitCost)}
                        />
                        <input type="hidden" name="items" data-variant-id={v.id} />
                      </td>
                    </tr>
                  );
                })}
                {filteredVariants.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground text-sm">
                      {search ? "No se encontraron productos con ese criterio" : "No hay productos con stock disponible"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90">
            Registrar Entrega
          </button>
          <a href="/admin/entregas" className="border border-input px-6 py-2 rounded-lg text-sm font-medium hover:bg-accent">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
