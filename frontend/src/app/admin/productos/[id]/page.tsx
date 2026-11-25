import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatCurrency, isSCCode } from "@/lib/utils";
import { UpdateProductForm } from "@/components/admin/forms/product-update-form";
import { AddVariantForm } from "@/components/admin/forms/add-variant-form";
import { ProductImageUpload } from "@/components/admin/product-image-upload";
import { SocialCardGenerator } from "@/components/admin/social-card-generator";
import { BottlePricingCalculator } from "@/components/admin/bottle-pricing-calculator";
import { SetPriceForm } from "@/app/admin/precios/_components/set-price-form";
import { PriceHistoryButton } from "@/app/admin/precios/_components/price-history-button";
import { assignNextMDNCode } from "@/server/actions/variants";
import Link from "next/link";

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
    where: { id: parseInt(id, 10) },
    include: {
      category: true,
      brand: true,
      variants: {
        include: {
          presentation: true,
          costs: { orderBy: { effectiveDate: "desc" }, take: 1 },
          globalInventory: true,
        },
        orderBy: { presentation: { sortOrder: "asc" } },
      },
      images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
    },
  });

  if (!product) notFound();

  const [categories, brands, presentations, config] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.presentation.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.systemConfig.findFirst(),
  ]);

  const defaultSupplies = Number(config?.standardSuppliesCost ?? 733);
  const defaultShipping = Number(config?.standardShippingCost ?? 185);
  const posFeePercentage = Number(config?.posFeePercentage ?? 7);

  return (
    <div className="max-w-6xl">
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
            <span className="text-[9px] font-medium text-yellow-700 bg-yellow-100 px-1 py-0.5 rounded">
              SC
            </span>
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
            <div className="px-4 py-3 border-b flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold text-sm">Variantes ({product.variants.length})</h2>
              {product.variants.length > 0 && (
                <BottlePricingCalculator
                  products={[
                    {
                      id: product.id,
                      name: product.name,
                      codigo: product.codigo,
                      variants: product.variants
                        .filter((v) => v.active)
                        .map((v) => ({
                          id: v.id,
                          codigo: v.codigo,
                          presentationName: v.presentation.name,
                          unitType: v.presentation.unitType,
                          unitValue: Number(v.presentation.unitValue ?? v.presentation.quantity ?? 1),
                          currentPrice: v.costs[0] ? Number(v.costs[0].finalPrice) : null,
                        })),
                    },
                  ]}
                  fixedProductId={product.id}
                  defaultSuppliesCost={defaultSupplies}
                  defaultShippingCost={defaultShipping}
                  posFeePercentage={posFeePercentage}
                  buttonLabel="Calcular desde Frasco"
                  compact
                />
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium">Código</th>
                    <th className="text-left px-3 py-2 font-medium">Presentación</th>
                    <th className="text-right px-3 py-2 font-medium">Neto</th>
                    <th className="text-right px-3 py-2 font-medium">Precio</th>
                    <th className="text-right px-3 py-2 font-medium">Stock</th>
                    <th className="text-center px-3 py-2 font-medium">Estado</th>
                    <th className="text-center px-3 py-2 font-medium">Precio</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {product.variants.map((variant) => {
                    const cost = variant.costs[0];
                    const netCost = cost ? Number(cost.netCost ?? 0) : null;
                    const finalPrice = cost ? Number(cost.finalPrice) : null;
                    return (
                      <tr key={variant.id} className="hover:bg-muted/20">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono">{variant.codigo}</span>
                            {isSCCode(variant.codigo) ? (
                              <>
                                <span className="text-[9px] font-medium text-yellow-700 bg-yellow-100 px-1 py-0.5 rounded">
                                  SC
                                </span>
                                <form action={handleAssignMDN} className="inline-flex">
                                  <input type="hidden" name="variantId" value={variant.id} />
                                  <button
                                    type="submit"
                                    className="text-[9px] text-primary hover:underline whitespace-nowrap"
                                  >
                                    Oficializar
                                  </button>
                                </form>
                              </>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-3 py-2 font-medium">{variant.presentation.name}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">
                          {netCost !== null ? formatCurrency(netCost) : "-"}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold">
                          {finalPrice !== null ? formatCurrency(finalPrice) : "-"}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {variant.globalInventory?.quantity ?? 0}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              variant.active
                                ? "bg-green-100 text-green-700"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {variant.active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-center gap-1">
                            <SetPriceForm
                              variantId={variant.id}
                              productName={product.name}
                              presentationName={variant.presentation.name}
                              presentationMl={Number(
                                variant.presentation.unitValue ?? variant.presentation.quantity ?? 1
                              )}
                              unitType={variant.presentation.unitType}
                              defaultSuppliesCost={defaultSupplies}
                              defaultShippingCost={defaultShipping}
                              posFeePercentage={posFeePercentage}
                              currentUnitCost={cost ? Number(cost.unitCost) : null}
                              currentFinalPrice={finalPrice}
                              compact
                            />
                            <PriceHistoryButton
                              variantId={variant.id}
                              productName={product.name}
                              presentationName={variant.presentation.name}
                            />
                          </div>
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
          <SocialCardGenerator
            product={{
              name: product.name,
              slug: product.slug,
              brandName: product.brand?.name ?? null,
              categoryName: product.category?.name ?? null,
              olfactoryNotes: product.olfactoryNotes,
              description: product.description,
              imageUrl: product.images[0]?.url ?? null,
              variants: product.variants
                .filter((v) => v.active && v.costs[0])
                .map((v) => ({
                  name: v.presentation.name,
                  price: Number(v.costs[0].finalPrice),
                  inStock: (v.globalInventory?.quantity ?? 0) > 0,
                })),
            }}
          />
        </div>
      </div>
    </div>
  );
}
