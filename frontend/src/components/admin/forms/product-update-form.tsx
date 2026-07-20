"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProduct } from "@/server/actions/products";

export function UpdateProductForm({
  productId,
  product,
  categories,
  brands,
}: {
  productId: number;
  product: {
    name: string;
    categoryId: number | null;
    brandId: number | null;
    description: string | null;
    olfactoryNotes: string | null;
    notes: string | null;
    isSupply: boolean;
    isFullBottle: boolean;
    showInCatalog: boolean;
  };
  categories: { id: number; name: string }[];
  brands: { id: number; name: string }[];
}) {
  const router = useRouter();

  async function handleUpdate(_prev: unknown, formData: FormData) {
    try {
      await updateProduct(productId, formData);
      toast.success("Producto actualizado correctamente");
      router.refresh();
      return { success: true };
    } catch (e) {
      toast.error("Error al actualizar el producto");
      return { success: false, error: String(e) };
    }
  }

  const [state, formAction, isPending] = useActionState(handleUpdate, null);

  return (
    <form action={formAction} className="bg-card border rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Información del Producto</h2>
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Guardando..." : "Guardar"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre</label>
          <input id="name" name="name" defaultValue={product.name} required
            className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium mb-1">Categoría</label>
          <select id="categoryId" name="categoryId" defaultValue={product.categoryId ?? ""}
            className="w-full px-3 py-2 text-sm border rounded-lg bg-background">
            <option value="">Sin categoría</option>
            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
          </select>
        </div>
        <div>
          <label htmlFor="brandId" className="block text-sm font-medium mb-1">Marca</label>
          <select id="brandId" name="brandId" defaultValue={product.brandId ?? ""}
            className="w-full px-3 py-2 text-sm border rounded-lg bg-background">
            <option value="">Sin marca</option>
            {brands.map((brand) => (<option key={brand.id} value={brand.id}>{brand.name}</option>))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="olfactoryNotes" className="block text-sm font-medium mb-1 text-muted-foreground">Notas Olfativas</label>
        <textarea id="olfactoryNotes" name="olfactoryNotes" rows={2} defaultValue={product.olfactoryNotes ?? ""}
          className="w-full px-3 py-2 text-sm border rounded-lg bg-background resize-none" placeholder="Limón, Bergamota, Lavanda, Jazmín, Vainilla, Ámbar..." />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1 text-muted-foreground">Descripción / Reseña</label>
          <textarea id="description" name="description" rows={2} defaultValue={product.description ?? ""}
            className="w-full px-3 py-2 text-sm border rounded-lg bg-background resize-none" placeholder="Breve reseña del perfume..." />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1 text-muted-foreground">Notas internas</label>
          <textarea id="notes" name="notes" rows={2} defaultValue={product.notes ?? ""}
            className="w-full px-3 py-2 text-sm border rounded-lg bg-background resize-none" placeholder="Solo visible en admin" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" name="isSupply" value="true" defaultChecked={product.isSupply} />
          Insumo
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" name="isFullBottle" value="true" defaultChecked={product.isFullBottle} />
          Full
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" name="showInCatalog" value="true" defaultChecked={product.showInCatalog} />
          Catálogo
        </label>
      </div>
    </form>
  );
}
