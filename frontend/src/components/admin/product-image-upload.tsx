"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { ImagePlus, Star, Trash2 } from "lucide-react";

interface ImageData {
  id: number;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export function ProductImageUpload({
  productId,
  images,
}: {
  productId: number;
  images: ImageData[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

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

  async function handleSetPrimary(imageId: number) {
    const form = new FormData();
    form.append("imageId", String(imageId));
    form.append("productId", String(productId));

    try {
      const res = await fetch("/api/upload/primary", { method: "POST", body: form });
      if (res.ok) {
        toast.success("Imagen principal actualizada");
        router.refresh();
      }
    } catch {
      toast.error("Error al actualizar");
    }
  }

  async function handleDelete(imageId: number) {
    if (!confirm("¿Eliminar esta imagen?")) return;

    try {
      const res = await fetch("/api/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId, productId }),
      });
      if (res.ok) {
        toast.success("Imagen eliminada");
        router.refresh();
      } else {
        toast.error("Error al eliminar la imagen");
      }
    } catch {
      toast.error("Error al eliminar la imagen");
    }
  }

  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="bg-card border rounded-xl p-5">
      <h2 className="font-semibold mb-4">Imágenes</h2>

      <div className="grid grid-cols-2 gap-3">
        {sorted.map((img) => (
          <div
            key={img.id}
            className={`relative aspect-square rounded-lg border-2 overflow-hidden ${
              img.isPrimary ? "border-primary" : "border-border"
            }`}
          >
            <Image src={img.url} alt={img.altText ?? ""} fill className="object-contain bg-muted/20" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
              {!img.isPrimary && (
                <button onClick={() => handleSetPrimary(img.id)} className="p-1.5 bg-white rounded-full text-yellow-600 hover:bg-yellow-50" title="Principal">
                  <Star className="h-3.5 w-3.5" />
                </button>
              )}
              <button onClick={() => handleDelete(img.id)} className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50" title="Eliminar">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            {img.isPrimary && (
              <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
                Principal
              </div>
            )}
          </div>
        ))}

        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
        >
          <ImagePlus className="h-6 w-6" />
          <span className="text-[10px] font-medium">{uploading ? "Subiendo..." : "Agregar"}</span>
        </button>
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />

      {images.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">Sin imágenes</p>
      )}
    </div>
  );
}
