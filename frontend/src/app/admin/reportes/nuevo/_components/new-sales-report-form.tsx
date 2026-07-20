"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { formatCurrency } from "@/lib/utils";
import { createSalesReport } from "@/server/actions/sales-reports";

interface VariantData {
  id: number;
  codigo: string;
  product: { name: string };
  presentation: { name: string };
  costs: { finalPrice: number }[];
}

interface LocationData {
  id: number;
  name: string;
}

export function NewSalesReportForm({
  locations,
  variants,
}: {
  locations: LocationData[];
  variants: VariantData[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const defaultPeriod = `Mes de ${new Date().toLocaleString("es", { month: "long" })} ${new Date().getFullYear()}`;

  async function handleSubmit(formData: FormData) {
    await createSalesReport(formData);
    router.push("/admin/reportes");
    router.refresh();
  }

  function handleQtyChange(variantId: number, unitPrice: number) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const qty = parseInt(e.target.value) || 0;
      const hidden = formRef.current?.querySelector(`[data-variant-id="${variantId}"]`) as HTMLInputElement;
      if (hidden) {
        hidden.value = JSON.stringify({ variantId, quantitySold: qty, unitPrice });
      }
    };
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nuevo Reporte de Ventas</h1>
        <p className="text-muted-foreground mt-1">Registra las ventas reportadas por un espacio</p>
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
          <label className="block text-sm font-medium mb-2">Productos vendidos</label>
          <div className="max-h-96 overflow-y-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2.5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Código</th>
                  <th className="text-left px-3 py-2.5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Producto</th>
                  <th className="text-left px-3 py-2.5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Pres.</th>
                  <th className="text-right px-3 py-2.5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Precio</th>
                  <th className="text-center px-3 py-2.5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Vend.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {variants.map((v) => {
                  const cost = v.costs[0];
                  const price = cost ? Number(cost.finalPrice) : 0;
                  return (
                    <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{v.codigo}</td>
                      <td className="px-3 py-2 font-medium">{v.product.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{v.presentation.name}</td>
                      <td className="px-3 py-2 text-right font-mono text-xs">{cost ? formatCurrency(price) : "-"}</td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="number"
                          min="0"
                          defaultValue="0"
                          className="w-14 text-center border rounded px-1 py-1 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                          onChange={handleQtyChange(v.id, price)}
                        />
                        <input type="hidden" name="items" data-variant-id={v.id} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90">
            Registrar Reporte
          </button>
          <a href="/admin/reportes" className="border border-input px-6 py-2 rounded-lg text-sm font-medium hover:bg-accent">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
