import { prisma } from "@/lib/db";
import { formatCurrency, isSCCode } from "@/lib/utils";
import { Download } from "lucide-react";
import { adjustInventory } from "@/server/actions/inventory";
import { InventoryFilters } from "./_components/inventory-filters";

const ITEMS_PER_PAGE = 25;

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1"));
  const search = q?.trim() || "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.variant = {
      OR: [
        { codigo: { contains: search, mode: "insensitive" } },
        { product: { name: { contains: search, mode: "insensitive" } } },
      ],
    };
  }

  const [total, inventory] = await Promise.all([
    prisma.globalInventory.count({ where: where as any }),
    prisma.globalInventory.findMany({
      where: where as any,
      include: {
        variant: {
          include: {
            product: true,
            presentation: true,
            costs: { take: 1, orderBy: { effectiveDate: "desc" } },
          },
        },
      },
      orderBy: { variant: { codigo: "asc" } },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.systemConfig.findFirst(),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Only fetch uninitialized variants when not searching (or on page 1)
  const variants = !search && currentPage === 1
    ? await prisma.productVariant.findMany({
        where: { active: true, globalInventory: null },
        include: { product: true, presentation: true },
        orderBy: { codigo: "asc" },
        take: 20,
      })
    : [];

  async function handleAdjust(formData: FormData) {
    "use server";
    await adjustInventory(formData);
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Inventario Global</h1>
          <a
            href="/api/export/inventario"
            className="inline-flex items-center gap-1.5 border border-input px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-accent"
          >
            <Download className="h-3.5 w-3.5" />
            Excel
          </a>
        </div>
        <p className="text-muted-foreground mt-1">
          Stock general de bodega central — {total} productos con inventario
        </p>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <InventoryFilters search={search} />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Código</th>
                <th className="text-left px-4 py-3 font-medium">Producto</th>
                <th className="text-left px-4 py-3 font-medium">Presentación</th>
                <th className="text-right px-4 py-3 font-medium">Stock</th>
                <th className="text-right px-4 py-3 font-medium">Min.</th>
                <th className="text-right px-4 py-3 font-medium">Costo</th>
                <th className="text-center px-4 py-3 font-medium">Estado</th>
                <th className="text-center px-4 py-3 font-medium">Ajustar</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inventory.map((item) => {
                const cost = item.variant.costs[0];
                const isLow = item.quantity <= item.minStock;
                return (
                  <tr key={item.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1">
                        <span className="font-mono text-xs">{item.variant.codigo}</span>
                        {isSCCode(item.variant.codigo) && (
                          <span className="text-[9px] font-medium text-yellow-700 bg-yellow-100 px-1 py-0.5 rounded">SC</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{item.variant.product.name}</td>
                    <td className="px-4 py-3">{item.variant.presentation.name}</td>
                    <td className="px-4 py-3 text-right font-semibold">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{item.minStock}</td>
                    <td className="px-4 py-3 text-right">
                      {cost ? formatCurrency(Number(cost.finalPrice)) : "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isLow && item.quantity > 0 ? (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          Bajo
                        </span>
                      ) : item.quantity === 0 ? (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          Sin stock
                        </span>
                      ) : (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Disponible
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <form action={handleAdjust}>
                        <input type="hidden" name="variantId" value={item.variant.id} />
                        <input
                          type="number"
                          name="quantity"
                          defaultValue={item.quantity}
                          className="w-16 text-center border rounded px-1 py-0.5 text-xs"
                        />
                        <input type="hidden" name="minStock" value={item.minStock} />
                        <button
                          type="submit"
                          className="text-xs text-primary hover:underline ml-2"
                        >
                          OK
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
              {inventory.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    No se encontraron productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t text-sm">
            <p className="text-muted-foreground">
              Página {currentPage} de {totalPages} ({total} productos)
            </p>
            <div className="flex items-center gap-2">
              {currentPage > 1 && (
                <a
                  href={`/admin/inventario?${new URLSearchParams({ ...(search && { q: search }), page: String(currentPage - 1) }).toString()}`}
                  className="px-3 py-1.5 border rounded-lg hover:bg-accent"
                >
                  Anterior
                </a>
              )}
              {currentPage < totalPages && (
                <a
                  href={`/admin/inventario?${new URLSearchParams({ ...(search && { q: search }), page: String(currentPage + 1) }).toString()}`}
                  className="px-3 py-1.5 border rounded-lg hover:bg-accent"
                >
                  Siguiente
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {variants.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold mb-3">Variantes sin inventario ({variants.length})</h2>
          <div className="bg-card border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Código</th>
                  <th className="text-left px-4 py-3 font-medium">Producto</th>
                  <th className="text-left px-4 py-3 font-medium">Presentación</th>
                  <th className="text-center px-4 py-3 font-medium">Inicializar</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {variants.map((v) => (
                  <tr key={v.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1">
                        <span className="font-mono text-xs">{v.codigo}</span>
                        {isSCCode(v.codigo) && (
                          <span className="text-[9px] font-medium text-yellow-700 bg-yellow-100 px-1 py-0.5 rounded">SC</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">{v.product.name}</td>
                    <td className="px-4 py-3">{v.presentation.name}</td>
                    <td className="px-4 py-3 text-center">
                      <form action={handleAdjust}>
                        <input type="hidden" name="variantId" value={v.id} />
                        <input
                          type="number"
                          name="quantity"
                          defaultValue={0}
                          className="w-16 text-center border rounded px-1 py-0.5 text-xs"
                        />
                        <input type="hidden" name="minStock" value="0" />
                        <button type="submit" className="text-xs text-primary hover:underline ml-2">
                          OK
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
