"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createGiftConversion } from "@/server/actions/gift-conversion";

interface ProductItem {
  id: number;
  name: string;
  codigo: string;
  brand: { name: string } | null;
  variants: {
    id: number;
    presentation: { id: number; name: string; quantity: number | null; unitType: string | null };
    globalInventory: { quantity: number } | null;
  }[];
}

export function NewGiftConversionForm({
  products,
  presentations,
}: {
  products: ProductItem[];
  presentations: { id: number; name: string; quantity: number | null }[];
}) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantityMl, setQuantityMl] = useState("");
  const [giftPresentationId, setGiftPresentationId] = useState("");
  const [reason, setReason] = useState("");
  const [isPending, setIsPending] = useState(false);

  const selectedProduct = products.find((p) => p.id === parseInt(selectedProductId));
  const selectedVariant = selectedProduct?.variants.find((v) => v.id === parseInt(selectedVariantId));

  const availableMl = selectedVariant
    ? (selectedVariant.globalInventory?.quantity ?? 0) * (selectedVariant.presentation.quantity ?? 0)
    : 0;

  const maxUnits = selectedVariant ? (selectedVariant.globalInventory?.quantity ?? 0) : 0;
  const maxMl = selectedVariant ? maxUnits * (selectedVariant.presentation.quantity ?? 0) : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProductId || !selectedVariantId || !quantityMl || !giftPresentationId) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }

    setIsPending(true);
    try {
      const formData = new FormData();
      formData.append("productId", selectedProductId);
      formData.append("variantId", selectedVariantId);
      formData.append("quantityMl", quantityMl);
      formData.append("giftPresentationId", giftPresentationId);
      if (reason) formData.append("reason", reason);

      await createGiftConversion(formData);
      toast.success("Regalías generadas correctamente");
      setSelectedProductId("");
      setSelectedVariantId("");
      setQuantityMl("");
      setGiftPresentationId("");
      setReason("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al generar regalías");
    } finally {
      setIsPending(false);
    }
  }

  const giftPres = presentations.find((p) => p.id === parseInt(giftPresentationId));
  const estimatedUnits = giftPres?.quantity && quantityMl
    ? Math.floor(parseInt(quantityMl) / giftPres.quantity)
    : 0;

  return (
    <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 space-y-4">
      <h2 className="font-semibold">Nueva Conversión</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Producto</label>
        <select
          value={selectedProductId}
          onChange={(e) => {
            setSelectedProductId(e.target.value);
            setSelectedVariantId("");
            setQuantityMl("");
          }}
          className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
        >
          <option value="">Seleccionar producto...</option>
          {products
            .filter((p) => p.variants.length > 0)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.codigo} - {p.name} {p.brand ? `(${p.brand.name})` : ""}
              </option>
            ))}
        </select>
      </div>

      {selectedProduct && (
        <div>
          <label className="block text-sm font-medium mb-1">Variante (presentación)</label>
          <select
            value={selectedVariantId}
            onChange={(e) => {
              setSelectedVariantId(e.target.value);
              setQuantityMl("");
            }}
            className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
          >
            <option value="">Seleccionar variante...</option>
            {selectedProduct.variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.presentation.name} — Stock: {v.globalInventory?.quantity ?? 0} uds
                {v.presentation.quantity ? ` (${(v.globalInventory?.quantity ?? 0) * v.presentation.quantity}ml)` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedVariant && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">
              Cantidad a convertir (ml)
            </label>
            <input
              type="number"
              value={quantityMl}
              onChange={(e) => setQuantityMl(e.target.value)}
              min={selectedVariant.presentation.quantity ?? 1}
              max={maxMl}
              className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Disponible: {maxMl}ml ({maxUnits} uds de {selectedVariant.presentation.name})
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Presentación de regalo</label>
            <select
              value={giftPresentationId}
              onChange={(e) => setGiftPresentationId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
            >
              <option value="">Seleccionar...</option>
              {presentations.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.quantity}ml)
                </option>
              ))}
            </select>
          </div>

          {estimatedUnits > 0 && (
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
              <p>
                <span className="font-medium">~{estimatedUnits}</span> unidades estimadas de{" "}
                {giftPres?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Se descontarán{" "}
                {Math.ceil(parseInt(quantityMl || "0") / (selectedVariant.presentation.quantity ?? 1))}{" "}
                unidades de inventario
              </p>
            </div>
          )}
        </>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Motivo (opcional)</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
          placeholder="Ej: Promoción de lanzamiento, cortesía cliente..."
        />
      </div>

      <button
        type="submit"
        disabled={isPending || !selectedProductId || !selectedVariantId || !quantityMl || !giftPresentationId}
        className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Convirtiendo..." : "Generar Regalías"}
      </button>
    </form>
  );
}
