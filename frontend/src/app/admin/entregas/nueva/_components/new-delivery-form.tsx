"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import { createDelivery } from "@/server/actions/deliveries";
import { Search, Plus, Trash2, ShoppingCart } from "lucide-react";

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

interface SelectedItem {
  variantId: number;
  codigo: string;
  productName: string;
  presentationName: string;
  quantity: number;
  unitCost: number;
  maxStock: number;
}

export function NewDeliveryForm({
  locations,
  variants,
  search: initialSearch = "",
  defaultLocationId,
}: {
  locations: LocationData[];
  variants: VariantData[];
  search?: string;
  defaultLocationId?: number;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [selected, setSelected] = useState<SelectedItem[]>([]);

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

  const totalUnits = selected.reduce((s, i) => s + i.quantity, 0);
  const totalCost = selected.reduce((s, i) => s + i.quantity * i.unitCost, 0);

  const defaultPeriod = `Mes de ${new Date().toLocaleString("es", { month: "long" })} ${new Date().getFullYear()}`;

  async function handleSubmit(formData: FormData) {
    await createDelivery(formData);
    router.push("/admin/entregas");
    router.refresh();
  }

  function handleAdd(v: VariantData) {
    const stock = v.globalInventory?.quantity ?? 0;
    const input = document.getElementById(`qty-${v.id}`) as HTMLInputElement | null;
    const qty = Math.max(0, Math.min(parseInt(input?.value ?? "0") || 0, stock));
    if (qty <= 0) return;
    const cost = v.costs[0];
    const unitCost = cost ? Number(cost.finalPrice) : 0;
    setSelected((prev) => {
      const existing = prev.find((i) => i.variantId === v.id);
      if (existing) {
        return prev.map((i) =>
          i.variantId === v.id
            ? { ...i, quantity: Math.min(i.quantity + qty, stock) }
            : i
        );
      }
      return [
        ...prev,
        {
          variantId: v.id,
          codigo: v.codigo,
          productName: v.product.name,
          presentationName: v.presentation.name,
          quantity: qty,
          unitCost,
          maxStock: stock,
        },
      ];
    });
    if (input) input.value = "0";
  }

  function handleSelectedQtyChange(variantId: number, qty: number) {
    setSelected((prev) =>
      prev.map((i) =>
        i.variantId === variantId
          ? { ...i, quantity: Math.max(0, Math.min(qty, i.maxStock)) }
          : i
      )
    );
  }

  function handleRemove(variantId: number) {
    setSelected((prev) => prev.filter((i) => i.variantId !== variantId));
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nueva Entrega</h1>
        <p className="text-muted-foreground mt-1">Registra los productos que llevas a un espacio</p>
      </div>

      <form action={handleSubmit} className="bg-card border rounded-xl p-6 space-y-4">
        {selected.map((i) => (
          <input
            key={i.variantId}
            type="hidden"
            name="items"
            value={JSON.stringify({ variantId: i.variantId, quantity: i.quantity, unitCost: i.unitCost })}
            readOnly
          />
        ))}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="locationId" className="block text-sm font-medium mb-1">Espacio *</label>
            <select id="locationId" name="locationId" required defaultValue={defaultLocationId || ""} className="w-full px-3 py-2 border rounded-lg bg-background">
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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium mb-2">
              Selecciona productos en stock
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
                    <th className="text-center px-3 py-2.5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Cant.</th>
                    <th className="text-center px-3 py-2.5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredVariants.map((v) => {
                    const stock = v.globalInventory?.quantity ?? 0;
                    const alreadyAdded = selected.find((i) => i.variantId === v.id);
                    return (
                      <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{v.codigo}</td>
                        <td className="px-3 py-2 font-medium">{v.product.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{v.presentation.name}</td>
                        <td className="px-3 py-2 text-right font-mono text-xs">{stock}</td>
                        <td className="px-3 py-2 text-center">
                          <input
                            id={`qty-${v.id}`}
                            type="number"
                            min="0"
                            max={stock}
                            defaultValue="0"
                            className="w-14 text-center border rounded px-1 py-1 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleAdd(v)}
                            disabled={stock === 0 || !!alreadyAdded}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            {alreadyAdded ? "Agregado" : "Agregar"}
                          </button>
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

          <div className="lg:col-span-2">
            <div className="bg-muted/30 border rounded-xl p-4 lg:sticky lg:top-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Lo que llevas
                </h2>
                <span className="text-xs text-muted-foreground">{totalUnits} unidades</span>
              </div>

              {selected.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  Agrega productos desde la tabla para armar tu entrega
                </p>
              ) : (
                <ul className="space-y-3">
                  {selected.map((item) => (
                    <li key={item.variantId} className="border rounded-lg p-3 bg-card">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.codigo} · {item.presentationName}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.variantId)}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                          aria-label="Quitar producto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2 gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max={item.maxStock}
                            value={item.quantity}
                            onChange={(e) => handleSelectedQtyChange(item.variantId, parseInt(e.target.value) || 0)}
                            className="w-16 text-center border rounded px-1 py-1 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <span className="text-xs text-muted-foreground">máx {item.maxStock}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{formatCurrency(item.unitCost)} c/u</p>
                          <p className="text-sm font-semibold">{formatCurrency(item.unitCost * item.quantity)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 pt-3 border-t flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-bold text-lg">{formatCurrency(totalCost)}</span>
              </div>
            </div>
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