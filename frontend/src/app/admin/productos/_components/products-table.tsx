"use client";

import { formatCurrency, isSCCode } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Package, ToggleLeft, ToggleRight, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleProductActive, toggleShowInCatalog } from "@/server/actions/products";

interface ProductRow {
  id: number;
  codigo: string;
  name: string;
  active: boolean;
  showInCatalog: boolean;
  category: { name: string } | null;
  brand: { name: string } | null;
  variants: {
    presentation: { slug: string };
    costs: { finalPrice: unknown }[];
  }[];
  images: { url: string }[];
}

export function ProductsTable({ products }: { products: ProductRow[] }) {
  const router = useRouter();

  async function handleToggle(id: number, active: boolean) {
    try {
      await toggleProductActive(id, active);
      toast.success(active ? "Producto activado" : "Producto desactivado");
      router.refresh();
    } catch {
      toast.error("Error al cambiar estado");
    }
  }

  async function handleCatalogToggle(id: number, show: boolean) {
    try {
      await toggleShowInCatalog(id, show);
      toast.success(show ? "Visible en catálogo" : "Oculto del catálogo");
      router.refresh();
    } catch {
      toast.error("Error al cambiar visibilidad");
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Código</th>
            <th className="text-left px-4 py-3 font-medium">Producto</th>
            <th className="text-left px-4 py-3 font-medium">Categoría</th>
            <th className="text-left px-4 py-3 font-medium">Marca</th>
            <th className="text-left px-4 py-3 font-medium">Variantes</th>
            <th className="text-right px-4 py-3 font-medium">Precio 5ml</th>
            <th className="text-right px-4 py-3 font-medium">Precio 10ml</th>
            <th className="text-center px-4 py-3 font-medium">Activo</th>
            <th className="text-center px-4 py-3 font-medium">Catálogo</th>
            <th className="text-center px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((product) => {
            const v5 = product.variants.find(
              (v) => v.presentation.slug === "5ml" && v.costs[0]
            );
            const v10 = product.variants.find(
              (v) => v.presentation.slug === "10ml" && v.costs[0]
            );
            return (
              <tr key={product.id} className="hover:bg-muted/20">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1">
                    <span className="font-mono text-xs">{product.codigo}</span>
                    {isSCCode(product.codigo) && (
                      <span className="text-[9px] font-medium text-yellow-700 bg-yellow-100 px-1 py-0.5 rounded">SC</span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/productos/${product.id}`}
                    className="flex items-center gap-2 font-medium hover:text-primary"
                  >
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0].url}
                        alt=""
                        width={32}
                        height={32}
                        className="rounded object-contain bg-muted/20"
                      />
                    )}
                    <span>{product.name}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.category?.name ?? "-"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.brand?.name ?? "-"}
                </td>
                <td className="px-4 py-3">{product.variants.length}</td>
                <td className="px-4 py-3 text-right font-medium">
                  {v5 ? formatCurrency(Number(v5.costs[0].finalPrice)) : "-"}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {v10 ? formatCurrency(Number(v10.costs[0].finalPrice)) : "-"}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggle(product.id, !product.active)}
                    className="inline-flex"
                    title={product.active ? "Desactivar" : "Activar"}
                  >
                    {product.active ? (
                      <ToggleRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleCatalogToggle(product.id, !product.showInCatalog)}
                    className="inline-flex"
                    title={product.showInCatalog ? "Ocultar del catálogo" : "Mostrar en catálogo"}
                  >
                    {product.showInCatalog ? (
                      <Eye className="h-5 w-5 text-blue-600" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <Link
                    href={`/admin/productos/${product.id}`}
                    className="text-xs text-primary hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            );
          })}
          {products.length === 0 && (
            <tr>
              <td colSpan={10} className="px-4 py-12 text-center text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No hay productos que coincidan
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
