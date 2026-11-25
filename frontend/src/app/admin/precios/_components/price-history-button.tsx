"use client";

import { useState, useTransition } from "react";
import { History, X, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { getVariantPriceHistory } from "@/server/actions/prices";
import { formatCurrency } from "@/lib/utils";

interface HistoryRow {
  id: number;
  oldPrice: number | null;
  newPrice: number | null;
  reason: string | null;
  changedBy: string | null;
  createdAt: string;
}

export function PriceHistoryButton({
  variantId,
  productName,
  presentationName,
}: {
  variantId: number;
  productName: string;
  presentationName: string;
}) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleOpen() {
    setOpen(true);
    startTransition(async () => {
      try {
        const data = await getVariantPriceHistory(variantId);
        setRows(data);
      } catch {
        toast.error("No se pudo cargar el historial");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        title="Ver historial de precios"
        className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
      >
        <History className="h-4 w-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white border border-stone-200 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
              <div>
                <h3 className="font-semibold text-sm text-stone-900">Historial de Precios</h3>
                <p className="text-xs text-muted-foreground">
                  {productName} · {presentationName}
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

            <div className="p-5 overflow-y-auto flex-1">
              {isPending ? (
                <p className="text-center text-xs text-muted-foreground py-8">Cargando historial...</p>
              ) : rows.length === 0 ? (
                <p className="text-center text-xs text-muted-foreground py-8">
                  Todavía no hay cambios de precio registrados para esta variante.
                </p>
              ) : (
                <div className="space-y-3">
                  {rows.map((row) => {
                    const diff =
                      row.oldPrice !== null && row.newPrice !== null
                        ? row.newPrice - row.oldPrice
                        : null;
                    const diffPct =
                      diff !== null && row.oldPrice && row.oldPrice > 0
                        ? (diff / row.oldPrice) * 100
                        : null;
                    return (
                      <div
                        key={row.id}
                        className="p-3 rounded-xl border border-stone-200/80 bg-stone-50/50 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs font-medium">
                            <span className="text-stone-500">
                              {row.oldPrice !== null ? formatCurrency(row.oldPrice) : "Sin precio"}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 text-stone-400" />
                            <span className="text-stone-900 font-semibold">
                              {row.newPrice !== null ? formatCurrency(row.newPrice) : "-"}
                            </span>
                            {diff !== null && diff !== 0 && (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                                  diff > 0
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {diff > 0 ? "+" : ""}
                                {diffPct !== null ? `${diffPct.toFixed(1)}%` : formatCurrency(diff)}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {new Date(row.createdAt).toLocaleDateString("es-NI")}
                          </span>
                        </div>
                        {(row.reason || row.changedBy) && (
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>{row.reason || "Sin motivo especificado"}</span>
                            {row.changedBy && <span className="opacity-70">{row.changedBy}</span>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
