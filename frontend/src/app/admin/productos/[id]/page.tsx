import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatCurrency, isSCCode } from "@/lib/utils";
import { UpdateProductForm } from "@/components/admin/forms/product-update-form";
import { AddVariantForm } from "@/components/admin/forms/add-variant-form";
import { ProductImageUpload } from "@/components/admin/product-image-upload";
import { updateProductCodigo } from "@/server/actions/products";
import { assignNextMDNCode } from "@/server/actions/variants";
import Link from "next/link";

async function handleUpdateProductCodigo(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const codigo = String(formData.get("codigo") ?? "");
  if (id && codigo) await updateProductCodigo(id, codigo);
}

async function handleAssignMDN(formData: FormData) {
  "use server";
  const variantId = Number(formData.get("variantId"));
  if (variantId) await assignNextMDNCode(variantId);
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: {
      category: true,
      brand: true,
      variants: {
        include: {
          presentation: true,
          costs: { orderBy: { effectiveDate: "desc" }, take: 1 },
          globalInventory: true,
        },
        orderBy: { codigo: "asc" },
      },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product) notFound();

  const [categories, brands, presentations] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.presentation.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/admin/productos" className="text-xs text-muted-foreground hover:text-foreground">
          Productos
        </Link>
        <span className="text-muted-foreground text-xs">/</span>
        <h1 className="text-base font-bold truncate">{product.name}</h1>
        <span className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {product.codigo}
          </span>
          {isSCCode(product.codigo) && (
            <span className="text-[9px] font-medium text-yellow-700 bg-yellow-100 px-1 py-0.5 rounded">SC</span>
          )}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div className="xl:col-span-2 space-y-4">
          <UpdateProductForm
            productId={product.id}
              product={{
                name: product.name,
                categoryId: product.categoryId,
                brandId: product.brandId,
                description: product.description,
                olfactoryNotes: product.olfactoryNotes,
                notes: product.notes,
              isSupply: product.isSupply,
              isFullBottle: product.isFullBottle,
              showInCatalog: product.showInCatalog,
            }}
            categories={categories}
            brands={brands}
          />

          <div className="bg-card border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b flex items-center justify-between">
              <h2 className="font-semibold text-sm">Variantes ({product.variants.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium">Código</th>
                    <th className="text-left px-3 py-2 font-medium">Presentación</th>
                    <th className="text-right px-3 py-2 font-medium">Costo</th>
                    <th className="text-right px-3 py-2 font-medium">Precio</th>
                    <th className="text-right px-3 py-2 font-medium">Stock</th>
                    <th className="text-center px-3 py-2 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {product.variants.map((variant) => {
                    const cost = variant.costs[0];
                    return (
                      <tr key={variant.id} className="hover:bg-muted/20">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono">{variant.codigo}</span>
                            {isSCCode(variant.codigo) ? (
                              <>
                                <span className="text-[9px] font-medium text-yellow-700 bg-yellow-100 px-1 py-0.5 rounded">SC</span>
                                <form action={handleAssignMDN} className="inline-flex">
                                  <input type="hidden" name="variantId" value={variant.id} />
                                  <button type="submit" className="text-[9px] text-primary hover:underline whitespace-nowrap">
                                    Oficializar
                                  </button>
                                </form>
                              </>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-3 py-2">{variant.presentation.name}</td>
                        <td className="px-3 py-2 text-right">
                          {cost ? formatCurrency(Number(cost.unitCost) + Number(cost.suppliesCost) + Number(cost.shippingCost)) : "-"}
                        </td>
                        <td className="px-3 py-2 text-right font-medium">
                          {cost ? formatCurrency(Number(cost.finalPrice)) : "-"}
                        </td>
                        <td className="px-3 py-2 text-right">{variant.globalInventory?.quantity ?? 0}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${variant.active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                            {variant.active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 space-y-4">
          <AddVariantForm
            productId={product.id}
            presentations={presentations.map((p) => ({
              id: p.id,
              name: p.name,
              quantity: p.quantity,
            }))}
          />
          <ProductImageUpload
            productId={product.id}
            images={product.images.map((img) => ({
              id: img.id,
              url: img.url,
              altText: img.altText,
              isPrimary: img.isPrimary,
              sortOrder: img.sortOrder,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
