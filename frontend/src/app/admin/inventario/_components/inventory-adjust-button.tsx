"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { adjustInventory } from "@/server/actions/inventory";

export function InventoryAdjustButton({
  variantId,
  productName,
  presentationName,
  currentQty,
  minStock,
}: {
  variantId: number;
  productName: string;
  presentationName: string;
  currentQty: number;
  minStock: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"set" | "add">("add");
  const [qty, setQty] = useState<string>(mode === "add" ? "1" : String(currentQty));
  const [minVal, setMinVal] = useState<string>(String(minStock));
  const [movementType, setMovementType] = useState<"purchase" | "adjustment" | "return">("purchase");
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  function openModal() {
    setMode("add");
    setQty("1");
    setMinVal(String(minStock));
    setMovementType("purchase");
    setNotes("");
    setOpen(true);
  }

  function handleModeChange(nextMode: "set" | "add") {
    setMode(nextMode);
    if (nextMode === "add") {
      setQty("1");
      setMovementType("purchase");
    } else {
      setQty(String(currentQty));
      setMovementType("adjustment");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("variantId", String(variantId));
        fd.append("quantity", qty);
        fd.append("minStock", minVal);
        fd.append("mode", mode);
        fd.append("movementType", movementType);
        if (notes.trim()) fd.append("notes", notes.trim());

        await adjustInventory(fd);
        toast.success("Inventario actualizado");
        setOpen(false);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al ajustar inventario");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:border-stone-900 hover:text-stone-900 text-xs font-medium text-stone-700 transition-colors"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Ajustar
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-left">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div>
                <h3 className="font-semibold text-stone-900 text-sm">{productName}</h3>
                <p className="text-xs text-muted-foreground">
                  {presentationName} · Stock actual: <strong>{currentQty}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-900 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleModeChange("add")}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    mode === "add" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600"
                  }`}
                >
                  + Ingreso / Compra
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange("set")}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    mode === "set" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600"
                  }`}
                >
                  = Fijar Stock Exacto
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {mode === "add" ? "Unidades a sumar" : "Nuevo stock total"}
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                  {mode === "add" && (
                    <p className="text-[11px] text-emerald-700 mt-1">
                      Quedará en: <strong>{currentQty + (parseInt(qty, 10) || 0)}</strong> u.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Stock Mínimo (alerta)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={minVal}
                    onChange={(e) => setMinVal(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Tipo de movimiento
                </label>
                <select
                  value={movementType}
                  onChange={(e) =>
                    setMovementType(e.target.value as "purchase" | "adjustment" | "return")
                  }
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                >
                  <option value="purchase">Compra / Reabastecimiento</option>
                  <option value="adjustment">Ajuste de conteo físico</option>
                  <option value="return">Devolución</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nota / Motivo (opcional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Factura proveedor, conteo semanal..."
                  className="w-full px-3 py-2 text-sm border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-xs font-medium border rounded-lg hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 disabled:opacity-50"
                >
                  {isPending ? "Guardando..." : "Guardar Movimiento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
