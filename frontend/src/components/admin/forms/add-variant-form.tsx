"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createVariant } from "@/server/actions/variants";

export function AddVariantForm({
  productId,
  presentations,
}: {
  productId: number;
  presentations: { id: number; name: string; quantity: number }[];
}) {
  const router = useRouter();

  async function handleAdd(_prev: unknown, formData: FormData) {
    try {
      await createVariant(formData);
      toast.success("Variante agregada correctamente");
      router.refresh();
      return { success: true };
    } catch (e) {
      toast.error("Error al agregar la variante");
      return { success: false, error: String(e) };
    }
  }

  const [state, formAction, isPending] = useActionState(handleAdd, null);

  return (
    <form action={formAction} className="bg-card border rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm">Nueva Variante</h2>
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Agregando..." : "Agregar"}
        </button>
      </div>

      <input type="hidden" name="productId" value={productId} />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="presentationId" className="block text-xs font-medium mb-0.5">Presentación</label>
          <select id="presentationId" name="presentationId" required
            className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-background">
            <option value="">Seleccionar...</option>
            {presentations.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}{p.quantity > 1 ? ` (${p.quantity} uds)` : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sku" className="block text-xs font-medium mb-0.5">SKU</label>
          <input id="sku" name="sku"
            className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-background"
            placeholder="Opcional" />
        </div>
      </div>
      <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <input type="checkbox" name="sinCodigo" value="true" />
        Sin código (generar SC-XXXX)
      </label>
    </form>
  );
}
