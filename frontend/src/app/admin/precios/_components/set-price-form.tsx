"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { setPrice } from "@/server/actions/prices";

export function SetPriceForm({
  variantId,
  defaultSuppliesCost,
  defaultShippingCost,
}: {
  variantId: number;
  defaultSuppliesCost: number;
  defaultShippingCost: number;
}) {
  const [open, setOpen] = useState(false);
  const [unitCost, setUnitCost] = useState("");
  const [suppliesCost, setSuppliesCost] = useState(String(defaultSuppliesCost));
  const [shippingCost, setShippingCost] = useState(String(defaultShippingCost));
  const [finalPrice, setFinalPrice] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!unitCost || !finalPrice) {
      toast.error("Costo unitario y precio final son requeridos");
      return;
    }
    setIsPending(true);
    try {
      const formData = new FormData();
      formData.append("variantId", String(variantId));
      formData.append("unitCost", unitCost);
      formData.append("suppliesCost", suppliesCost);
      formData.append("shippingCost", shippingCost);
      formData.append("finalPrice", finalPrice);
      await setPrice(formData);
      toast.success("Precio guardado correctamente");
      router.refresh();
      setOpen(false);
    } catch {
      toast.error("Error al guardar el precio");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:opacity-90"
      >
        Fijar Precio
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setOpen(false)}>
          <div className="bg-card border rounded-xl p-5 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-sm mb-4">Fijar Precio</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-0.5">Costo Unitario *</label>
                <input type="number" step="0.01" value={unitCost} onChange={(e) => setUnitCost(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-background" placeholder="0.00" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-0.5">Insumos</label>
                  <input type="number" step="0.01" value={suppliesCost} onChange={(e) => setSuppliesCost(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg bg-background" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-0.5">Envío</label>
                  <input type="number" step="0.01" value={shippingCost} onChange={(e) => setShippingCost(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg bg-background" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-0.5">Precio Final *</label>
                <input type="number" step="0.01" value={finalPrice} onChange={(e) => setFinalPrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-background" placeholder="0.00" required />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={isPending}
                  className="flex-1 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {isPending ? "Guardando..." : "Guardar"}
                </button>
                <button type="button" onClick={() => setOpen(false)}
                  className="px-3 py-2 border rounded-lg text-sm font-medium hover:bg-accent">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
