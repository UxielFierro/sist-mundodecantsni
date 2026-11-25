"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Calculator, X, Check, Search } from "lucide-react";
import { toast } from "sonner";
import { applyBottlePricing } from "@/server/actions/prices";
import { formatCurrency } from "@/lib/utils";

export interface CalculatorVariant {
  id: number;
  codigo: string;
  presentationName: string;
  unitType: string | null;
  unitValue: number;
  currentPrice: number | null;
}

export interface CalculatorProduct {
  id: number;
  name: string;
  codigo: string;
  variants: CalculatorVariant[];
}

function roundToStep(value: number, step: number): number {
  if (step <= 0) return Math.round(value * 100) / 100;
  return Math.ceil(value / step) * step;
}

export function BottlePricingCalculator({
  products,
  fixedProductId,
  defaultSuppliesCost,
  defaultShippingCost,
  posFeePercentage,
  buttonLabel = "Calculadora Frasco → Decants",
  compact = false,
}: {
  products: CalculatorProduct[];
  fixedProductId?: number;
  defaultSuppliesCost: number;
  defaultShippingCost: number;
  posFeePercentage: number;
  buttonLabel?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number>(
    fixedProductId ?? products[0]?.id ?? 0
  );

  const [bottleCost, setBottleCost] = useState<string>("");
  const [bottleMl, setBottleMl] = useState<string>("100");
  const [suppliesCost, setSuppliesCost] = useState<string>(String(defaultSuppliesCost));
  const [shippingCost, setShippingCost] = useState<string>(String(defaultShippingCost));
  const [markupPct, setMarkupPct] = useState<string>("60");
  const [roundStep, setRoundStep] = useState<number>(10);
  const [reason, setReason] = useState<string>("");

  // Per-variant manual overrides and inclusion checkboxes
  const [manualPrices, setManualPrices] = useState<Record<number, string>>({});
  const [excludedIds, setExcludedIds] = useState<Record<number, boolean>>({});
  const [isPending, startTransition] = useTransition();

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products.slice(0, 40);
    return products
      .filter(
        (p) => p.name.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q)
      )
      .slice(0, 40);
  }, [products, search]);

  const activeProduct = useMemo(() => {
    if (fixedProductId) {
      return products.find((p) => p.id === fixedProductId) ?? null;
    }
    const foundInFiltered = filteredProducts.find((p) => p.id === selectedProductId);
    return foundInFiltered ?? filteredProducts[0] ?? null;
  }, [products, filteredProducts, fixedProductId, selectedProductId]);

  const bCost = parseFloat(bottleCost) || 0;
  const bMl = Math.max(1, parseFloat(bottleMl) || 100);
  const sCost = parseFloat(suppliesCost) || 0;
  const shCost = parseFloat(shippingCost) || 0;
  const mPct = parseFloat(markupPct) || 0;

  const bottleTotal = bCost + sCost + shCost;
  const bottleNet = bottleTotal * (1 + posFeePercentage / 100);
  const costPerMl = bottleNet / bMl;

  const calculatedRows = useMemo(() => {
    if (!activeProduct) return [];
    return activeProduct.variants.map((v) => {
      const ml = v.unitType === "ml" ? Math.max(1, v.unitValue) : bMl;
      const factor = ml / bMl;
      const propUnit = Math.round(bCost * factor * 100) / 100;
      const propSupplies = Math.round(sCost * factor * 100) / 100;
      const propShipping = Math.round(shCost * factor * 100) / 100;
      const propNet = costPerMl * ml;

      const suggestedRaw = propNet * (1 + mPct / 100);
      const suggested = bCost > 0 ? roundToStep(suggestedRaw, roundStep) : v.currentPrice ?? 0;

      const manualVal = manualPrices[v.id];
      const finalPrice =
        manualVal !== undefined && manualVal !== "" ? parseFloat(manualVal) || 0 : suggested;
      const profit = finalPrice - propNet;
      const marginPct = finalPrice > 0 ? (profit / finalPrice) * 100 : 0;

      return {
        variant: v,
        ml,
        propUnit,
        propSupplies,
        propShipping,
        propNet,
        suggested,
        finalPrice,
        profit,
        marginPct,
        included: !excludedIds[v.id],
      };
    });
  }, [activeProduct, bCost, bMl, sCost, shCost, costPerMl, mPct, roundStep, manualPrices, excludedIds]);

  function handleOpen() {
    setSuppliesCost(String(defaultSuppliesCost));
    setShippingCost(String(defaultShippingCost));
    setManualPrices({});
    setExcludedIds({});
    setReason("");
    setOpen(true);
  }

  function handleApply() {
    if (!activeProduct) return;
    if (bCost <= 0) {
      toast.error("Ingresá el costo del frasco completo");
      return;
    }

    const items = calculatedRows
      .filter((r) => r.included && r.finalPrice > 0)
      .map((r) => ({
        variantId: r.variant.id,
        unitCost: r.propUnit,
        suppliesCost: r.propSupplies,
        shippingCost: r.propShipping,
        finalPrice: r.finalPrice,
      }));

    if (items.length === 0) {
      toast.error("Seleccioná al menos una variante con precio mayor a 0");
      return;
    }

    startTransition(async () => {
      try {
        await applyBottlePricing({
          productId: activeProduct.id,
          bottleMl: bMl,
          bottleCost: bCost,
          suppliesCost: sCost,
          shippingCost: shCost,
          reason: reason.trim() || undefined,
          items,
        });
        toast.success(
          `Precios actualizados para ${items.length} variante${items.length !== 1 ? "s" : ""}`
        );
        setOpen(false);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al aplicar los precios");
      }
    });
  }

  const selectedCount = calculatedRows.filter((r) => r.included && r.finalPrice > 0).length;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={
          compact
            ? "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 text-white text-[11px] font-medium hover:bg-stone-800 transition-colors"
            : "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 shadow-xs transition-colors"
        }
      >
        <Calculator className={compact ? "h-3.5 w-3.5 text-gold" : "h-4 w-4 text-gold"} />
        {buttonLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white border border-stone-200 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0 bg-stone-50/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-stone-900 text-gold">
                  <Calculator className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-base">
                    Calculadora Frasco → Decants
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Calculá el costo por ml (incluyendo insumos, envío y +{posFeePercentage}% POS) y
                    aplicá precios redondeados en 1 clic
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Product selector (only when not fixed) */}
              {!fixedProductId && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSearch(val);
                        const q = val.trim().toLowerCase();
                        const firstMatch = q
                          ? products.find(
                              (p) =>
                                p.name.toLowerCase().includes(q) ||
                                p.codigo.toLowerCase().includes(q)
                            )
                          : products[0];
                        if (firstMatch) {
                          setSelectedProductId(firstMatch.id);
                          setManualPrices({});
                          setExcludedIds({});
                        }
                      }}
                      placeholder="Filtrar perfume por nombre o código..."
                      className="w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-stone-50 focus:bg-white"
                    />
                  </div>
                  <select
                    value={activeProduct?.id ?? ""}
                    onChange={(e) => {
                      setSelectedProductId(Number(e.target.value));
                      setManualPrices({});
                      setExcludedIds({});
                    }}
                    className="w-full px-3 py-2 text-xs border rounded-lg bg-white font-medium"
                  >
                    {filteredProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.codigo} — {p.name} ({p.variants.length} var.)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Bottle inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">
                    Costo del Frasco (C$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={bottleCost}
                    onChange={(e) => {
                      setBottleCost(e.target.value);
                      setManualPrices({});
                    }}
                    placeholder="Ej: 3500"
                    className="w-full px-3 py-2 text-sm font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/40"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">
                    Volumen Frasco (ml)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={bottleMl}
                    onChange={(e) => {
                      setBottleMl(e.target.value);
                      setManualPrices({});
                    }}
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                  <div className="flex gap-1 mt-1">
                    {[50, 100, 125, 200].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setBottleMl(String(preset));
                          setManualPrices({});
                        }}
                        className={`text-[10px] px-1.5 py-0.5 rounded border ${
                          bottleMl === String(preset)
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-stone-50 text-stone-600 border-stone-200"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">
                    Insumos Frasco (C$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={suppliesCost}
                    onChange={(e) => {
                      setSuppliesCost(e.target.value);
                      setManualPrices({});
                    }}
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">
                    Envío Frasco (C$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={shippingCost}
                    onChange={(e) => {
                      setShippingCost(e.target.value);
                      setManualPrices({});
                    }}
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                </div>
              </div>

              {/* Margin + Rounding bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-50 border border-stone-200/80 rounded-xl p-3.5">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Costo Neto Frasco: </span>
                    <strong className="text-stone-900">{formatCurrency(bottleNet)}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Costo por ml: </span>
                    <strong className="text-gold">{formatCurrency(costPerMl)}/ml</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <label className="text-[11px] font-medium text-stone-700">Ganancia %:</label>
                    <input
                      type="number"
                      min={0}
                      max={500}
                      value={markupPct}
                      onChange={(e) => {
                        setMarkupPct(e.target.value);
                        setManualPrices({});
                      }}
                      className="w-16 px-2 py-1 text-xs font-semibold text-center border rounded-md bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-muted-foreground">Redondeo:</span>
                    {[
                      { v: 10, l: "C$10" },
                      { v: 50, l: "C$50" },
                      { v: 0, l: "Exacto" },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => {
                          setRoundStep(opt.v);
                          setManualPrices({});
                        }}
                        className={`px-2 py-1 rounded-md border font-medium ${
                          roundStep === opt.v
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-white text-stone-600 border-stone-200"
                        }`}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Variants breakdown table */}
              {activeProduct && activeProduct.variants.length > 0 ? (
                <div className="border rounded-xl overflow-hidden">
                  <div className="px-3 py-2 bg-stone-100/70 border-b flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-800">
                      Perfume seleccionado: <strong>{activeProduct.name}</strong>
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {activeProduct.codigo}
                    </span>
                  </div>
                  <table className="w-full text-xs">
                    <thead className="bg-stone-50 border-b">
                      <tr>
                        <th className="w-8 px-3 py-2.5 text-center">✓</th>
                        <th className="text-left px-3 py-2.5 font-medium text-stone-600">
                          Presentación
                        </th>
                        <th className="text-right px-3 py-2.5 font-medium text-stone-600">
                          Costo Prop. Neto
                        </th>
                        <th className="text-right px-3 py-2.5 font-medium text-stone-600">
                          Actual
                        </th>
                        <th className="text-right px-3 py-2.5 font-medium text-stone-600">
                          Nuevo Precio (editable)
                        </th>
                        <th className="text-right px-3 py-2.5 font-medium text-stone-600">
                          Ganancia / Margen
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {calculatedRows.map((row) => (
                        <tr
                          key={row.variant.id}
                          className={row.included ? "bg-white" : "bg-stone-50/70 opacity-50"}
                        >
                          <td className="px-3 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={row.included}
                              onChange={(e) =>
                                setExcludedIds((prev) => ({
                                  ...prev,
                                  [row.variant.id]: !e.target.checked,
                                }))
                              }
                              className="accent-stone-900"
                            />
                          </td>
                          <td className="px-3 py-2.5 font-medium text-stone-900">
                            {row.variant.presentationName}
                            <span className="block text-[10px] font-mono text-muted-foreground">
                              {row.variant.codigo}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-right text-stone-600">
                            {formatCurrency(row.propNet)}
                          </td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">
                            {row.variant.currentPrice !== null
                              ? formatCurrency(row.variant.currentPrice)
                              : "—"}
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <input
                              type="number"
                              step="0.01"
                              min={0}
                              disabled={!row.included}
                              value={
                                manualPrices[row.variant.id] !== undefined
                                  ? manualPrices[row.variant.id]
                                  : row.suggested
                                  ? String(row.suggested)
                                  : ""
                              }
                              onChange={(e) =>
                                setManualPrices((prev) => ({
                                  ...prev,
                                  [row.variant.id]: e.target.value,
                                }))
                              }
                              className="w-24 text-right font-semibold px-2 py-1 border rounded-md bg-white focus:outline-none focus:border-gold"
                            />
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            {row.finalPrice > 0 ? (
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  row.profit < 0
                                    ? "bg-red-100 text-red-700"
                                    : row.marginPct < 20
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {row.profit >= 0 ? "+" : ""}
                                {formatCurrency(row.profit)} ({row.marginPct.toFixed(0)}%)
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-muted-foreground border rounded-xl">
                  Este producto todavía no tiene variantes activas. Agregá presentaciones primero.
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">
                  Motivo / Nota para el historial (opcional)
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ej: Nuevo lote abril, ajuste por demanda, promoción..."
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-stone-50/70 flex items-center justify-between gap-3 shrink-0">
              <p className="text-[11px] text-muted-foreground">
                Podés editar cualquier precio individualmente (por demanda o promoción) antes de
                guardar.
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-medium bg-white hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isPending || selectedCount === 0 || bCost <= 0}
                  onClick={handleApply}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 disabled:opacity-50"
                >
                  <Check className="h-3.5 w-3.5 text-gold" />
                  {isPending
                    ? "Aplicando..."
                    : `Aplicar a ${selectedCount} variante${selectedCount !== 1 ? "s" : ""}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
