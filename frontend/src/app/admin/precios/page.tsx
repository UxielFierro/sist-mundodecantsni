import { prisma } from "@/lib/db";
import { formatCurrency, isSCCode } from "@/lib/utils";
import { SetPriceForm } from "./_components/set-price-form";
import { PricesFilters } from "./_components/prices-filters";

const ITEMS_PER_PAGE = 25;

export default async function PricesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1"));
  const search = q?.trim() || "";

  const where: Record<string, unknown> = { active: true };
  if (search) {
    where.OR = [
      { codigo: { contains: search, mode: "insensitive" } },
      { product: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [total, variants, config] = await Promise.all([
    prisma.productVariant.count({ where: where as any }),
    prisma.productVariant.findMany({
      where: where as any,
      include: {
        product: true,
        presentation: true,
        costs: { orderBy: { effectiveDate: "desc" }, take: 1 },
      },
      orderBy: { codigo: "asc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.systemConfig.findFirst(),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const defaultSupplies = Number(config?.standardSuppliesCost ?? 733);
  const defaultShipping = Number(config?.standardShippingCost ?? 185);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Precios</h1>
          <p className="text-muted-foreground mt-1">
            {total} variantes · Insumos: {formatCurrency(defaultSupplies)} · Envío: {formatCurrency(defaultShipping)}
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <PricesFilters search={search} />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Código</th>
                <th className="text-left px-4 py-3 font-medium">Producto</th>
                <th className="text-left px-4 py-3 font-medium">Presentación</th>
                <th className="text-right px-4 py-3 font-medium">Costo Unit.</th>
                <th className="text-right px-4 py-3 font-medium">Insumos</th>
                <th className="text-right px-4 py-3 font-medium">Envío</th>
                <th className="text-right px-4 py-3 font-medium">Neto (+7%)</th>
                <th className="text-right px-4 py-3 font-medium">Precio Final</th>
                <th className="text-center px-4 py-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {variants.map((variant) => {
                const cost = variant.costs[0];
                const sCost = cost ? Number(cost.suppliesCost) : defaultSupplies;
                const shCost = cost ? Number(cost.shippingCost) : defaultShipping;
                return (
                  <tr key={variant.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1">
                        <span className="font-mono text-xs">{variant.codigo}</span>
                        {isSCCode(variant.codigo) && (
                          <span className="text-[9px] font-medium text-yellow-700 bg-yellow-100 px-1 py-0.5 rounded">SC</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{variant.product.name}</td>
                    <td className="px-4 py-3">{variant.presentation.name}</td>
                    <td className="px-4 py-3 text-right">
                      {cost ? formatCurrency(Number(cost.unitCost)) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">{formatCurrency(sCost)}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(shCost)}</td>
                    <td className="px-4 py-3 text-right">
                      {cost ? formatCurrency(Number(cost.netCost)) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {cost ? formatCurrency(Number(cost.finalPrice)) : (
                        <span className="text-muted-foreground text-xs">Sin precio</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <SetPriceForm variantId={variant.id} defaultSuppliesCost={sCost} defaultShippingCost={shCost} />
                    </td>
                  </tr>
                );
              })}
              {variants.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                    No se encontraron variantes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t text-sm">
            <p className="text-muted-foreground">Página {currentPage} de {totalPages} ({total} variantes)</p>
            <div className="flex items-center gap-2">
              {currentPage > 1 && (
                <a
                  href={`/admin/precios?${new URLSearchParams({ ...(search && { q: search }), page: String(currentPage - 1) }).toString()}`}
                  className="px-3 py-1.5 border rounded-lg hover:bg-accent"
                >
                  Anterior
                </a>
              )}
              {currentPage < totalPages && (
                <a
                  href={`/admin/precios?${new URLSearchParams({ ...(search && { q: search }), page: String(currentPage + 1) }).toString()}`}
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
