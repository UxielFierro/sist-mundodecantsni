import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Plus, ShoppingCart } from "lucide-react";
import { DeliveryFilters } from "./_components/delivery-filters";

const ITEMS_PER_PAGE = 12;

export default async function DeliveriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; locationId?: string; page?: string }>;
}) {
  const { q, locationId, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1"));
  const search = q?.trim() || "";
  const locId = locationId?.trim() || "";

  const where: Record<string, unknown> = {};
  if (locId) where.locationId = parseInt(locId);
  if (search) where.period = { contains: search, mode: "insensitive" };

  const [total, deliveries, locations] = await Promise.all([
    prisma.locationDelivery.count({ where: where as any }),
    prisma.locationDelivery.findMany({
      where: where as any,
      orderBy: { createdAt: "desc" },
      include: {
        location: true,
        items: {
          include: {
            variant: { include: { product: true, presentation: true } },
          },
        },
      },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.location.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  function buildUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    if (search && !("q" in overrides)) params.set("q", search);
    if (locId && !("locationId" in overrides)) params.set("locationId", locId);
    Object.entries(overrides).forEach(([k, v]) => { if (v) params.set(k, v); });
    return `/admin/entregas?${params.toString()}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Entregas a Espacios</h1>
          <p className="text-muted-foreground mt-1">
            {total} entrega{total !== 1 ? "s" : ""} registrada{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/entregas/nueva"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nueva Entrega
        </Link>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <DeliveryFilters search={search} locationId={locId} locations={locations.map((l) => ({ id: l.id, name: l.name }))} />

        <div className="p-4">
          {deliveries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
              No hay entregas registradas
            </div>
          ) : (
            <div className="space-y-3">
              {deliveries.map((delivery) => {
                const total = delivery.items.reduce((s, i) => s + Number(i.unitCost) * i.quantity, 0);
                return (
                  <Link
                    key={delivery.id}
                    href={`/admin/entregas/${delivery.id}`}
                    className="block bg-card border rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{delivery.location.name}</h3>
                        <p className="text-sm text-muted-foreground">{delivery.period}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(total)}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(delivery.createdAt).toLocaleDateString("es")}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {delivery.items.length} productos · {delivery.items.reduce((s, i) => s + i.quantity, 0)} unidades
                    </div>
                    {delivery.notes && (
                      <div className="text-xs text-muted-foreground mt-1 italic">{delivery.notes}</div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t text-sm">
            <p className="text-muted-foreground">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              {currentPage > 1 && (
                <a href={buildUrl({ page: String(currentPage - 1) })} className="px-3 py-1.5 border rounded-lg hover:bg-accent">
                  Anterior
                </a>
              )}
              {currentPage < totalPages && (
                <a href={buildUrl({ page: String(currentPage + 1) })} className="px-3 py-1.5 border rounded-lg hover:bg-accent">
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
