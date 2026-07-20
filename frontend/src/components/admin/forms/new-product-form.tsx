"use client";

import { useActionState, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct } from "@/server/actions/products";
import { slugify } from "@/lib/utils";
import { ImagePlus } from "lucide-react";

export function NewProductForm({
  categories,
  brands,
}: {
  categories: { id: number; name: string }[];
  brands: { id: number; name: string }[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [productId, setProductId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleCreate(_prev: unknown, formData: FormData) {
    try {
      const product = await createProduct(formData);
      toast.success("Producto creado correctamente");
      setProductId(product.id);
      return { success: true, productId: product.id };
    } catch (e) {
      toast.error("Error al crear el producto");
      return { success: false, error: String(e) };
    }
  }

  const [state, formAction, isPending] = useActionState(handleCreate, null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !productId) return;

    setUploading(true);
    const form = new FormData();
    form.append("productId", String(productId));
    form.append("image", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (res.ok) {
        toast.success("Imagen subida correctamente");
        router.refresh();
      } else {
        toast.error("Error al subir la imagen");
      }
    } catch {
      toast.error("Error al subir la imagen");
    }
    setUploading(false);
  }

  if (state?.success && productId) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="bg-card border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-4">
            Producto creado correctamente. Ahora puedes subir imágenes.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-muted-foreground/30 hover:border-primary/50 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ImagePlus className="h-4 w-4" />
              {uploading ? "Subiendo..." : "Subir imagen"}
            </button>
            <a
              href={`/admin/productos/${productId}`}
              className="text-sm text-primary hover:underline"
            >
              Ir a editar producto &rarr;
            </a>
          </div>
        </div>

        <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>
    );
  }

  return (
    <form action={formAction} className="bg-card border rounded-xl p-5 space-y-3">
      <h2 className="font-semibold">Información del Producto</h2>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre *</label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Ej: Xerjoff Naxos 1861"
          />
          {name && (
            <p className="text-[10px] text-muted-foreground mt-0.5">{slugify(name)}</p>
          )}
        </div>
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium mb-1">Categoría</label>
          <select id="categoryId" name="categoryId" className="w-full px-3 py-2 text-sm border rounded-lg bg-background">
            <option value="">Sin categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="brandId" className="block text-sm font-medium mb-1">Marca</label>
          <select id="brandId" name="brandId" className="w-full px-3 py-2 text-sm border rounded-lg bg-background">
            <option value="">Sin marca</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="olfactoryNotes" className="block text-sm font-medium mb-1 text-muted-foreground">
          Notas Olfativas
        </label>
        <textarea
          id="olfactoryNotes"
          name="olfactoryNotes"
          rows={2}
          className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          placeholder="Ej: Limón, Bergamota, Lavanda, Jazmín, Vainilla, Ámbar..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1 text-muted-foreground">Descripción / Reseña</label>
          <textarea id="description" name="description" rows={2}
            className="w-full px-3 py-2 text-sm border rounded-lg bg-background resize-none"
            placeholder="Breve reseña del perfume..." />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1 text-muted-foreground">Notas internas</label>
          <textarea id="notes" name="notes" rows={2}
            className="w-full px-3 py-2 text-sm border rounded-lg bg-background resize-none"
            placeholder="Solo visible en admin" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" name="isSupply" value="true" />
          Insumo
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" name="isFullBottle" value="true" />
          Full
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" name="showInCatalog" value="true" defaultChecked />
          Catálogo
        </label>
        <label className="flex items-center gap-1.5 text-sm ml-auto">
          <input type="checkbox" name="sinCodigo" value="true" />
          <span className="text-muted-foreground">Sin código MDN</span>
        </label>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Creando..." : "Crear Producto"}
        </button>
        <a
          href="/admin/productos"
          className="border border-input px-6 py-2 rounded-lg text-sm font-medium hover:bg-accent"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
