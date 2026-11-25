import { prisma } from "@/lib/db";
import { formatCurrency, isSCCode } from "@/lib/utils";
import { SetPriceForm } from "./_components/set-price-form";
import { PricesFilters } from "./_components/prices-filters";
import { PriceHistoryButton } from "./_components/price-history-button";
import { BottlePricingCalculator } from "@/components/admin/bottle-pricing-calculator";

const ITEMS_PER_PAGE = 25;

function hasReliableCost(
  cost: { unitCost: unknown; netCost: unknown; finalPrice: unknown } | undefined
): boolean {
  if (!cost) return false;
  const u = Number(cost.unitCost);
  const net = Number(cost.netCost ?? 0);
  // Legacy rows saved unitCost = 0 with full-bottle supplies (733+185) on a decant
  if (u <= 0) return false;
  if (net <= 0) return false;
  return true;
}

export default async function PricesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string; cat?: string; page?: string }>;
}) {
  const { q, filter = "all", cat = "", page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const search = q?.trim() || "";
  const categoryIdNum = cat ? parseInt(cat, 10) : null;

  const where: Record<string, unknown> = { active: true };
  if (search) {
    where.OR = [
      { codigo: { contains: search, mode: "insensitive" } },
      { product: { name: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (categoryIdNum && Number.isFinite(categoryIdNum)) {
    where.product = { categoryId: categoryIdNum };
  }

  const [allVariants, categories, config, productsForCalc] = await Promise.all([
    prisma.productVariant.findMany({
      where: where as any,
      include: {
        product: { include: { category: true } },
        presentation: true,
        costs: { orderBy: { effectiveDate: "desc" }, take: 1 },
      },
      orderBy: { codigo: "asc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.systemConfig.findFirst(),
    prisma.product.findMany({
      where: { active: true, variants: { some: { active: true } } },
      orderBy: { name: "asc" },
      include: {
        variants: {
          where: { active: true },
          orderBy: { presentation: { sortOrder: "asc" } },
          include: {
            presentation: true,
            costs: { orderBy: { effectiveDate: "desc" }, take: 1 },
          },
        },
      },
    }),
  ]);

  const defaultSupplies = Number(config?.standardSuppliesCost ?? 733);
  const defaultShipping = Number(config?.standardShippingCost ?? 185);
  const posFeePercentage = Number(config?.posFeePercentage ?? 7);

  const filteredVariants = allVariants.filter((v) => {
    const cost = v.costs[0];
    if (filter === "no_price") return !cost;
    if (filter === "low_margin") {
      if (!hasReliableCost(cost)) return false;
      const finalPrice = Number(cost.finalPrice);
      const netCost = Number(cost.netCost ?? 0);
      if (finalPrice <= 0) return true;
      const markupPct = ((finalPrice - netCost) / netCost) * 100;
      return markupPct < 25;
    }
    return true;
  });

  const total = filteredVariants.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const variants = filteredVariants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const pageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (filter && filter !== "all") params.set("filter", filter);
    if (cat) params.set("cat", cat);
    params.set("page", String(targetPage));
    return `/admin/precios?${params.toString()}`;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium text-stone-900">Precios y Rentabilidad</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total} variantes · Insumos frasco: {formatCurrency(defaultSupplies)} · Envío frasco:{" "}
            {formatCurrency(defaultShipping)} · POS: {posFeePercentage}%
          </p>
        </div>

        <BottlePricingCalculator
          products={productsForCalc.map((p) => ({
            id: p.id,
            name: p.name,
            codigo: p.codigo,
            variants: p.variants.map((v) => ({
              id: v.id,
              codigo: v.codigo,
              presentationName: v.presentation.name,
              unitType: v.presentation.unitType,
              unitValue: Number(v.presentation.unitValue ?? v.presentation.quantity ?? 1),
              currentPrice: v.costs[0] ? Number(v.costs[0].finalPrice) : null,
            })),
          }))}
          defaultSuppliesCost={defaultSupplies}
          defaultShippingCost={defaultShipping}
          posFeePercentage={posFeePercentage}
        />
      </div>

      <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm">
        <PricesFilters
          search={search}
          filter={filter}
          categoryId={cat}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Código</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Producto</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Presentación</th>
                <th className="text-right px-4 py-3 font-medium text-stone-600">Costo / ml</th>
                <th className="text-right px-4 py-3 font-medium text-stone-600">
                  Costo Presentación
                </th>
                <th className="text-right px-4 py-3 font-medium text-stone-600">Precio Final</th>
                <th className="text-right px-4 py-3 font-medium text-stone-600">Ganancia</th>
                <th className="text-center px-4 py-3 font-medium text-stone-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {variants.map((variant) => {
                const cost = variant.costs[0];
                const reliable = hasReliableCost(cost);
                const netCost = cost ? Number(cost.netCost ?? 0) : 0;
                const pricePerMl = cost?.pricePerMl ? Number(cost.pricePerMl) : null;
                const finalPrice = cost ? Number(cost.finalPrice) : 0;
                const profit = reliable ? finalPrice - netCost : 0;
                const markupPct = reliable && netCost > 0 ? (profit / netCost) * 100 : 0;
                const presMl = Number(
                  variant.presentation.unitValue ?? variant.presentation.quantity ?? 1
                );

                return (
                  <tr key={variant.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1">
                        <span className="font-mono text-xs">{variant.codigo}</span>
                        {isSCCode(variant.codigo) && (
                          <span className="text-[9px] font-medium text-yellow-700 bg-yellow-100 px-1 py-0.5 rounded">
                            SC
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-900">{variant.product.name}</div>
                      {variant.product.category && (
                        <div className="text-[11px] text-muted-foreground">
                          {variant.product.category.name}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{variant.presentation.name}</td>
                    <td className="px-4 py-3 text-right text-stone-600">
                      {reliable && pricePerMl ? `${formatCurrency(pricePerMl)}/ml` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-stone-600">
                      {reliable ? formatCurrency(netCost) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-stone-900">
                      {cost ? (
                        formatCurrency(finalPrice)
                      ) : (
                        <span className="text-muted-foreground text-xs font-normal">Sin precio</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {cost && reliable ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            profit < 0
                              ? "bg-red-100 text-red-700"
                              : markupPct < 25
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {profit >= 0 ? "+" : ""}
                          {formatCurrency(profit)} ({markupPct >= 0 ? "+" : ""}
                          {markupPct.toFixed(0)}%)
                        </span>
                      ) : cost ? (
                        <span className="text-[11px] text-muted-foreground italic">Precio fijo</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <SetPriceForm
                          variantId={variant.id}
                          productName={variant.product.name}
                          presentationName={variant.presentation.name}
                          presentationMl={presMl}
                          unitType={variant.presentation.unitType}
                          defaultSuppliesCost={defaultSupplies}
                          defaultShippingCost={defaultShipping}
                          posFeePercentage={posFeePercentage}
                          currentUnitCost={cost ? Number(cost.unitCost) : null}
                          currentFinalPrice={cost ? finalPrice : null}
                        />
                        <PriceHistoryButton
                          variantId={variant.id}
                          productName={variant.product.name}
                          presentationName={variant.presentation.name}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {variants.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    No se encontraron variantes con estos filtros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t text-sm">
            <p className="text-muted-foreground">
              Página {currentPage} de {totalPages} ({total} variantes)
            </p>
            <div className="flex items-center gap-2">
              {currentPage > 1 && (
                <a
                  href={pageUrl(currentPage - 1)}
                  className="px-3 py-1.5 border rounded-lg hover:bg-accent"
                >
                  Anterior
                </a>
              )}
              {currentPage < totalPages && (
                <a
                  href={pageUrl(currentPage + 1)}
                  className="px-3 py-1.5 border rounded-lg hover:bg-accent"
                >
                  Siguiente
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
