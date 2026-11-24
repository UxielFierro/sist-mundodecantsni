import { prisma } from "@/lib/db";
import { formatCurrency, isSCCode } from "@/lib/utils";
import { MOVEMENT_TYPE_LABELS } from "@/lib/auth-guard";
import { Download, History } from "lucide-react";
import { adjustInventory } from "@/server/actions/inventory";
import { InventoryFilters } from "./_components/inventory-filters";
import { InventoryAdjustButton } from "./_components/inventory-adjust-button";

const ITEMS_PER_PAGE = 25;

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; cat?: string; page?: string }>;
}) {
  const { q, status = "all", cat = "", page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const search = q?.trim() || "";
  const categoryIdNum = cat ? parseInt(cat, 10) : null;

  const variantFilter: Record<string, unknown> = {};
  if (search) {
    variantFilter.OR = [
      { codigo: { contains: search, mode: "insensitive" } },
      { product: { name: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (categoryIdNum && Number.isFinite(categoryIdNum)) {
    variantFilter.product = { ...(variantFilter.product as object), categoryId: categoryIdNum };
  }

  const baseWhere: Record<string, unknown> =
    Object.keys(variantFilter).length > 0 ? { variant: variantFilter } : {};

  if (status === "out") {
    baseWhere.quantity = 0;
  } else if (status === "available" || status === "low") {
    baseWhere.quantity = { gt: 0 };
  }

  const [allMatching, categories, recentMovements] = await Promise.all([
    prisma.globalInventory.findMany({
      where: baseWhere as any,
      include: {
        variant: {
          include: {
            product: { include: { category: true } },
            presentation: true,
            costs: { take: 1, orderBy: { effectiveDate: "desc" } },
          },
        },
      },
      orderBy: { variant: { codigo: "asc" } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.inventoryMovement.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        variant: { include: { product: true, presentation: true } },
        location: true,
      },
    }),
  ]);

  // Apply minStock comparison in memory for low/available status
  const filteredInventory = allMatching.filter((item) => {
    if (status === "low") return item.quantity > 0 && item.quantity <= item.minStock;
    if (status === "available") return item.quantity > item.minStock;
    return true;
  });

  const total = filteredInventory.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const inventory = filteredInventory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Uninitialized variants
  const fetchUninitialized = (!search && currentPage === 1 && status === "all") || Boolean(search);
  const variants = fetchUninitialized
    ? await prisma.productVariant.findMany({
        where: {
          active: true,
          globalInventory: null,
          ...(search
            ? {
                OR: [
                  { codigo: { contains: search, mode: "insensitive" } },
                  { product: { name: { contains: search, mode: "insensitive" } } },
                ],
              }
            : {}),
        },
        include: { product: true, presentation: true },
        orderBy: { codigo: "asc" },
        take: search ? 50 : 20,
      })
    : [];

  async function handleInit(formData: FormData) {
    "use server";
    await adjustInventory(formData);
  }

  const pageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (status && status !== "all") params.set("status", status);
    if (cat) params.set("cat", cat);
    params.set("page", String(targetPage));
    return `/admin/inventario?${params.toString()}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-stone-900">Inventario Global</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stock general de bodega central — {total} variante{total !== 1 ? "s" : ""} encontradas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#movimientos"
            className="inline-flex items-center gap-1.5 border border-input bg-white px-3.5 py-2 rounded-xl text-xs font-medium hover:bg-accent"
          >
            <History className="h-3.5 w-3.5" />
            Historial (Kardex)
          </a>
          <a
            href="/api/export/inventario"
            className="inline-flex items-center gap-1.5 border border-input bg-white px-3.5 py-2 rounded-xl text-xs font-medium hover:bg-accent"
          >
            <Download className="h-3.5 w-3.5" />
            Exportar Excel
          </a>
        </div>
      </div>

      <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm">
        <InventoryFilters
          search={search}
          status={status}
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
                <th className="text-right px-4 py-3 font-medium text-stone-600">Stock</th>
                <th className="text-right px-4 py-3 font-medium text-stone-600">Mín.</th>
                <th className="text-right px-4 py-3 font-medium text-stone-600">Precio Venta</th>
                <th className="text-center px-4 py-3 font-medium text-stone-600">Estado</th>
                <th className="text-center px-4 py-3 font-medium text-stone-600">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inventory.map((item) => {
                const cost = item.variant.costs[0];
                const isLow = item.quantity > 0 && item.quantity <= item.minStock;
                return (
                  <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1">
                        <span className="font-mono text-xs">{item.variant.codigo}</span>
                        {isSCCode(item.variant.codigo) && (
                          <span className="text-[9px] font-medium text-yellow-700 bg-yellow-100 px-1 py-0.5 rounded">
                            SC
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-900">{item.variant.product.name}</div>
                      {item.variant.product.category && (
                        <div className="text-[11px] text-muted-foreground">
                          {item.variant.product.category.name}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{item.variant.presentation.name}</td>
                    <td className="px-4 py-3 text-right font-semibold">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{item.minStock}</td>
                    <td className="px-4 py-3 text-right font-medium text-stone-700">
                      {cost ? formatCurrency(Number(cost.finalPrice)) : "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isLow ? (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">
                          Stock bajo
                        </span>
                      ) : item.quantity === 0 ? (
                        <span className="text-xs bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full font-medium">
                          Sin stock
                        </span>
                      ) : (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium">
                          Disponible
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <InventoryAdjustButton
                        variantId={item.variant.id}
                        productName={item.variant.product.name}
                        presentationName={item.variant.presentation.name}
                        currentQty={item.quantity}
                        minStock={item.minStock}
                      />
                    </td>
                  </tr>
                );
              })}
              {inventory.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    No se encontraron productos con estos filtros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t text-sm">
            <p className="text-muted-foreground">
              Página {currentPage} de {totalPages} ({total} registros)
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

      {variants.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3 text-stone-800">
            Variantes sin inventario inicializado ({variants.length})
          </h2>
          <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Código</th>
                  <th className="text-left px-4 py-3 font-medium">Producto</th>
                  <th className="text-left px-4 py-3 font-medium">Presentación</th>
                  <th className="text-center px-4 py-3 font-medium">Inicializar</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {variants.map((v) => (
                  <tr key={v.id} className="hover:bg-stone-50/50">
                    <td className="px-4 py-3 font-mono text-xs">{v.codigo}</td>
                    <td className="px-4 py-3">{v.product.name}</td>
                    <td className="px-4 py-3">{v.presentation.name}</td>
                    <td className="px-4 py-3 text-center">
                      <form action={handleInit} className="inline-flex items-center gap-2">
                        <input type="hidden" name="variantId" value={v.id} />
                        <input
                          type="number"
                          min={0}
                          name="quantity"
                          defaultValue={0}
                          className="w-16 text-center border rounded px-1.5 py-1 text-xs"
                        />
                        <input type="hidden" name="minStock" value="0" />
                        <button
                          type="submit"
                          className="text-xs bg-stone-900 text-white px-2.5 py-1 rounded-md hover:bg-stone-800"
                        >
                          Inicializar
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

      {/* Recent movements / Kardex */}
      <div
        id="movimientos"
        className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg text-stone-900">Historial Reciente de Movimientos</h2>
            <p className="text-xs text-muted-foreground">Últimos 20 movimientos registrados</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-stone-50 border-b">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-stone-600">Fecha</th>
                <th className="text-left px-4 py-2.5 font-medium text-stone-600">Tipo</th>
                <th className="text-left px-4 py-2.5 font-medium text-stone-600">Producto</th>
                <th className="text-right px-4 py-2.5 font-medium text-stone-600">Cantidad</th>
                <th className="text-left px-4 py-2.5 font-medium text-stone-600">Espacio / Nota</th>
                <th className="text-left px-4 py-2.5 font-medium text-stone-600">Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentMovements.map((m) => (
                <tr key={m.id} className="hover:bg-stone-50/50">
                  <td className="px-4 py-2.5 font-mono text-muted-foreground whitespace-nowrap">
                    {new Date(m.createdAt).toLocaleDateString("es-NI")}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 rounded-md border bg-stone-50 text-stone-700 font-medium">
                      {MOVEMENT_TYPE_LABELS[m.movementType] ?? m.movementType}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-medium text-stone-800">
                    {m.variant.product.name}{" "}
                    <span className="text-muted-foreground font-normal">
                      ({m.variant.presentation.name})
                    </span>
                  </td>
                  <td
                    className={`px-4 py-2.5 text-right font-semibold ${
                      m.quantity > 0 ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {m.location ? `${m.location.name} · ` : ""}
                    {m.notes || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{m.createdBy || "—"}</td>
                </tr>
              ))}
              {recentMovements.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Sin movimientos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
