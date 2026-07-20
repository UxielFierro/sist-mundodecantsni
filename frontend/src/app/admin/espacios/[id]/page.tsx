import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const location = await prisma.location.findUnique({
    where: { id: parseInt(id) },
    include: {
      locationInventory: {
        include: {
          variant: {
            include: { product: true, presentation: true, costs: { take: 1, orderBy: { effectiveDate: "desc" } } },
          },
        },
        orderBy: { variant: { codigo: "asc" } },
      },
      deliveries: {
        include: { items: { include: { variant: { include: { product: true, presentation: true } } } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      salesReports: {
        include: { items: { include: { variant: { include: { product: true, presentation: true } } } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!location) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/espacios" className="text-sm text-muted-foreground hover:text-foreground">
          Espacios
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-2xl font-bold">{location.name}</h1>
        <span className="text-xs capitalize bg-muted px-2 py-0.5 rounded">{location.type}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Inventario en {location.name}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Producto</th>
                  <th className="pb-2 font-medium">Presentación</th>
                  <th className="pb-2 text-right font-medium">Stock</th>
                  <th className="pb-2 text-right font-medium">Precio</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {location.locationInventory.map((inv) => (
                  <tr key={inv.id}>
                    <td className="py-2">{inv.variant.product.name}</td>
                    <td className="py-2">{inv.variant.presentation.name}</td>
                    <td className="py-2 text-right">{inv.quantity}</td>
                    <td className="py-2 text-right">
                      {inv.variant.costs[0]
                        ? formatCurrency(Number(inv.variant.costs[0].finalPrice))
                        : "-"}
                    </td>
                  </tr>
                ))}
                {location.locationInventory.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                      Sin inventario registrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6">
            <h2 className="font-semibold mb-3">Últimas Entregas</h2>
            {location.deliveries.map((d) => (
              <div key={d.id} className="text-sm py-2 border-b last:border-0">
                <div className="font-medium">{d.period}</div>
                <div className="text-muted-foreground text-xs">
                  {d.items.length} productos — {new Date(d.createdAt).toLocaleDateString("es")}
                </div>
              </div>
            ))}
            {location.deliveries.length === 0 && (
              <div className="text-sm text-muted-foreground">Sin entregas registradas</div>
            )}
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h2 className="font-semibold mb-3">Últimos Reportes</h2>
            {location.salesReports.map((r) => (
              <div key={r.id} className="text-sm py-2 border-b last:border-0">
                <div className="font-medium">{r.period}</div>
                <div className="text-muted-foreground text-xs">
                  {r.items.length} productos — Estado: {r.status}
                </div>
              </div>
            ))}
            {location.salesReports.length === 0 && (
              <div className="text-sm text-muted-foreground">Sin reportes registrados</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
