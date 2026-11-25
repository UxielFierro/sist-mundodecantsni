"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { X, TrendingUp, AlertTriangle, FlaskConical, Tag } from "lucide-react";
import { setPrice } from "@/server/actions/prices";
import { formatCurrency } from "@/lib/utils";

function roundToStep(value: number, step: number): number {
  if (step <= 0) return Math.round(value * 100) / 100;
  return Math.ceil(value / step) * step;
}

export function SetPriceForm({
  variantId,
  productName,
  presentationName,
  presentationMl = 10,
  unitType = "ml",
  defaultSuppliesCost,
  defaultShippingCost,
  posFeePercentage = 7,
  currentUnitCost,
  currentFinalPrice,
  compact = false,
}: {
  variantId: number;
  productName?: string;
  presentationName?: string;
  presentationMl?: number;
  unitType?: string | null;
  defaultSuppliesCost: number;
  defaultShippingCost: number;
  posFeePercentage?: number;
  currentUnitCost?: number | null;
  currentFinalPrice?: number | null;
  compact?: boolean;
}) {
  const isMlVariant = unitType === "ml";
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"bottle" | "direct">(isMlVariant ? "bottle" : "direct");

  // Bottle mode state
  const [bottleCost, setBottleCost] = useState("");
  const [bottleMl, setBottleMl] = useState("100");
  const [suppliesCost, setSuppliesCost] = useState(String(defaultSuppliesCost));
  const [shippingCost, setShippingCost] = useState(String(defaultShippingCost));

  // Direct mode state
  const [directCost, setDirectCost] = useState("");

  // Shared state
  const [finalPrice, setFinalPrice] = useState(
    currentFinalPrice !== null && currentFinalPrice !== undefined ? String(currentFinalPrice) : ""
  );
  const [reason, setReason] = useState("");
  const [roundStep, setRoundStep] = useState<number>(10);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  function openModal() {
    setMode(isMlVariant ? "bottle" : "direct");
    // Estimate bottle cost if we have proportional unitCost from a 100ml bottle
    if (isMlVariant && currentUnitCost && currentUnitCost > 0 && presentationMl > 0) {
      const estimatedBottle =
        presentationMl < 50 && currentUnitCost < 1200
          ? Math.round((currentUnitCost / presentationMl) * 100)
          : currentUnitCost;
      setBottleCost(String(estimatedBottle));
    } else {
      setBottleCost("");
    }
    setBottleMl("100");
    setSuppliesCost(String(defaultSuppliesCost));
    setShippingCost(String(defaultShippingCost));
    setDirectCost(
      !isMlVariant && currentUnitCost && currentUnitCost > 0 ? String(currentUnitCost) : ""
    );
    setFinalPrice(
      currentFinalPrice !== null && currentFinalPrice !== undefined ? String(currentFinalPrice) : ""
    );
    setReason("");
    setOpen(true);
  }

  const posMultiplier = 1 + posFeePercentage / 100;
  const bCost = parseFloat(bottleCost) || 0;
  const bMl = Math.max(1, parseFloat(bottleMl) || 100);
  const sNum = parseFloat(suppliesCost) || 0;
  const shNum = parseFloat(shippingCost) || 0;
  const dCost = parseFloat(directCost) || 0;
  const fNum = parseFloat(finalPrice) || 0;

  // Bottle math
  const bottleTotal = bCost + sNum + shNum;
  const bottleNet = bottleTotal * posMultiplier;
  const costPerMl = bMl > 0 ? bottleNet / bMl : 0;
  const variantRealCost =
    mode === "bottle" && isMlVariant
      ? costPerMl * Math.max(1, presentationMl)
      : dCost * posMultiplier;

  const cost5ml = costPerMl * 5;
  const cost10ml = costPerMl * 10;

  const hasCostBasis = mode === "bottle" ? bCost > 0 : dCost > 0;
  const profit = fNum - variantRealCost;
  const markupOverCostPct = variantRealCost > 0 ? (profit / variantRealCost) * 100 : 0;

  function applySuggestedMarkup(markupPct: number) {
    if (!hasCostBasis || variantRealCost <= 0) {
      toast.error(
        mode === "bottle"
          ? "Ingresá primero el costo del frasco completo"
          : "Ingresá primero el costo directo"
      );
      return;
    }
    const raw = variantRealCost * (1 + markupPct / 100);
    setFinalPrice(String(roundToStep(raw, roundStep)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (finalPrice === "") {
      toast.error("El precio final es requerido");
      return;
    }
    if (mode === "bottle" && isMlVariant && bottleCost === "") {
      toast.error("Ingresá el costo del frasco completo o cambiá a Precio Fijo Directo");
      return;
    }
    setIsPending(true);
    try {
      const formData = new FormData();
      formData.append("variantId", String(variantId));
      formData.append("mode", mode);
      formData.append("finalPrice", finalPrice);
      if (mode === "bottle" && isMlVariant) {
        formData.append("bottleCost", bottleCost || "0");
        formData.append("bottleMl", bottleMl || "100");
        formData.append("suppliesCost", suppliesCost || "0");
        formData.append("shippingCost", shippingCost || "0");
      } else {
        formData.append("unitCost", directCost || "0");
      }
      if (reason.trim()) formData.append("reason", reason.trim());

      await setPrice(formData);
      toast.success("Precio guardado correctamente");
      router.refresh();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar el precio");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={
          compact
            ? "text-[11px] font-medium text-stone-700 border border-stone-200 bg-white hover:border-stone-900 px-2 py-1 rounded-md transition-colors"
            : "text-xs bg-stone-900 text-white px-2.5 py-1.5 rounded-lg hover:bg-stone-800 font-medium transition-colors"
        }
      >
        {currentFinalPrice ? "Editar" : "Fijar Precio"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white border border-stone-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div>
                <h3 className="font-semibold text-sm text-stone-900">
                  {productName || "Fijar Precio"}
                </h3>
                {presentationName && (
                  <p className="text-xs text-muted-foreground">Presentación: {presentationName}</p>
                )}
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
              {/* Mode selector */}
              {isMlVariant && (
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMode("bottle")}
                    className={`inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      mode === "bottle" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600"
                    }`}
                  >
                    <FlaskConical className="h-3.5 w-3.5 text-gold" />
                    Desde Frasco
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("direct")}
                    className={`inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      mode === "direct" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600"
                    }`}
                  >
                    <Tag className="h-3.5 w-3.5" />
                    Precio Fijo Directo
                  </button>
                </div>
              )}

              {mode === "bottle" && isMlVariant ? (
                <>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        Costo Frasco Completo (C$) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        value={bottleCost}
                        onChange={(e) => setBottleCost(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-semibold border rounded-lg bg-background"
                        placeholder="Ej: 2460"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        Tamaño Frasco (ml)
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={bottleMl}
                        onChange={(e) => setBottleMl(e.target.value)}
                        className="w-full px-3 py-2 text-sm border rounded-lg bg-background"
                      />
                      <div className="flex gap-1 mt-1">
                        {[50, 100, 125, 200].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setBottleMl(String(preset))}
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
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        Insumos Frasco (C$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        value={suppliesCost}
                        onChange={(e) => setSuppliesCost(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-background"
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
                        onChange={(e) => setShippingCost(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-background"
                      />
                    </div>
                  </div>

                  {/* Live Bottle Breakdown */}
                  <div className="rounded-xl bg-stone-50 border border-stone-200/80 p-3.5 space-y-1.5 text-xs">
                    <div className="flex justify-between text-stone-600">
                      <span>Frasco Neto (+{posFeePercentage}% POS):</span>
                      <span className="font-medium text-stone-900">{formatCurrency(bottleNet)}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Costo por ml:</span>
                      <span className="font-semibold text-gold">{formatCurrency(costPerMl)}/ml</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-muted-foreground pt-1 border-t border-stone-200/60">
                      <span>Ref. 5 ml: {formatCurrency(cost5ml)}</span>
                      <span>Ref. 10 ml: {formatCurrency(cost10ml)}</span>
                    </div>
                    <div className="flex justify-between text-stone-800 font-medium pt-1 border-t border-stone-200/60">
                      <span>Costo de {presentationName || `${presentationMl}ml`}:</span>
                      <span className="font-semibold">{formatCurrency(variantRealCost)}</span>
                    </div>
                    {fNum > 0 && hasCostBasis && (
                      <div className="flex items-center justify-between pt-1.5 border-t border-stone-200/70">
                        <span className="flex items-center gap-1 text-stone-600">
                          {profit < 0 ? (
                            <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                          ) : (
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                          )}
                          Ganancia neta:
                        </span>
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                            profit < 0
                              ? "bg-red-100 text-red-700"
                              : markupOverCostPct < 25
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {profit >= 0 ? "+" : ""}
                          {formatCurrency(profit)} ({markupOverCostPct >= 0 ? "+" : ""}
                          {markupOverCostPct.toFixed(0)}%)
                        </span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Costo directo de esta unidad (opcional, C$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={directCost}
                      onChange={(e) => setDirectCost(e.target.value)}
                      placeholder="Dejá vacío si es solo precio fijo"
                      className="w-full px-3 py-2 text-sm border rounded-lg bg-background"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Ideal para insumos, promociones o perfumes con precio fijo por demanda.
                    </p>
                  </div>
                  {dCost > 0 && fNum > 0 && (
                    <div className="rounded-xl bg-stone-50 border border-stone-200/80 p-3 flex items-center justify-between text-xs">
                      <span className="text-stone-600">
                        Ganancia (neto {formatCurrency(variantRealCost)}):
                      </span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                          profit < 0
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {profit >= 0 ? "+" : ""}
                        {formatCurrency(profit)} ({markupOverCostPct.toFixed(0)}%)
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Quick markup + rounding */}
              {hasCostBasis && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">Sumar % sobre costo:</span>
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="text-muted-foreground">Redondear:</span>
                      {[
                        { v: 10, l: "C$10" },
                        { v: 50, l: "C$50" },
                        { v: 0, l: "Exacto" },
                      ].map((opt) => (
                        <button
                          key={opt.v}
                          type="button"
                          onClick={() => setRoundStep(opt.v)}
                          className={`px-1.5 py-0.5 rounded border ${
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
                  <div className="grid grid-cols-4 gap-1.5">
                    {[30, 50, 80, 100].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => applySuggestedMarkup(pct)}
                        className="py-1 text-xs font-medium border border-stone-200 rounded-lg bg-white hover:border-gold hover:text-gold transition-colors"
                      >
                        +{pct}%
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Precio Final de Venta (C$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                  className="w-full px-3 py-2 text-base font-semibold border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-gold/40"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Motivo del cambio (opcional)
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ej: Nuevo lote, promoción, ajuste por demanda..."
                  className="w-full px-3 py-2 text-xs border rounded-lg bg-background"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-medium hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-stone-900 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-stone-800 disabled:opacity-50"
                >
                  {isPending ? "Guardando..." : "Guardar Precio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
