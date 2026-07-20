import { formatCurrency } from "@/lib/utils";
import { getDashboardData } from "@/server/services/dashboard";
import dynamic from "next/dynamic";
import {
  Package,
  Store,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Boxes,
} from "lucide-react";

const CategoryChart = dynamic(() =>
  import("@/components/admin/dashboard/charts-client").then((m) => m.CategoryChart)
);
const TopSellingChart = dynamic(() =>
  import("@/components/admin/dashboard/charts-client").then((m) => m.TopSellingChart)
);
const InventoryStatusChart = dynamic(() =>
  import("@/components/admin/dashboard/charts-client").then((m) => m.InventoryStatusChart)
);

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const inventoryStatus = [
    { name: "Disponible", value: data.totals.inventoryItems - data.totals.lowStock - data.totals.outOfStock },
    { name: "Stock Bajo", value: data.totals.lowStock },
    { name: "Sin Stock", value: data.totals.outOfStock },
  ].filter((d) => d.value > 0);

  const cards = [
    { title: "Productos", value: data.totals.products, icon: Package, sub: `${data.totals.variants} variantes` },
    { title: "Espacios", value: data.totals.locations, icon: Store, sub: "activos" },
    { title: "Stock Bajo", value: data.totals.lowStock, icon: AlertTriangle, sub: "por reabastecer", warn: data.totals.lowStock > 0 },
    { title: "Sin Stock", value: data.totals.outOfStock, icon: Boxes, sub: "agotados", danger: data.totals.outOfStock > 0 },
    { title: "Unidades Totales", value: data.totals.totalStock, icon: TrendingUp, sub: "en inventario" },
    { title: "Reportes", value: data.totals.salesReports, icon: BarChart3, sub: "de ventas cargados" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Resumen del sistema Mundo Decants Nicaragua
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.title} className="bg-card border rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.danger ? "bg-red-100" : card.warn ? "bg-yellow-100" : "bg-primary/10"}`}>
                <card.icon className={`h-4 w-4 ${card.danger ? "text-red-600" : card.warn ? "text-yellow-600" : "text-primary"}`} />
              </div>
            </div>
            <div className="text-2xl font-bold mb-0.5">{card.value}</div>
            <div className="text-xs font-medium">{card.title}</div>
            <div className="text-[10px] text-muted-foreground">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {data.categoryChart.length > 0 && (
          <div className="bg-card border rounded-xl p-5">
            <h2 className="font-semibold mb-2 text-sm">Productos por Categoría</h2>
            <CategoryChart data={data.categoryChart} />
          </div>
        )}

        {data.topSelling.length > 0 && (
          <div className="bg-card border rounded-xl p-5 lg:col-span-2">
            <h2 className="font-semibold mb-2 text-sm">Más Vendidos</h2>
            <TopSellingChart data={data.topSelling} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {inventoryStatus.length > 0 && (
          <div className="bg-card border rounded-xl p-5">
            <h2 className="font-semibold mb-2 text-sm">Estado del Inventario</h2>
            <InventoryStatusChart data={inventoryStatus} />
          </div>
        )}

        <div className="lg:col-span-2 bg-card border rounded-xl p-5">
          <h2 className="font-semibold mb-3 text-sm">Movimientos Recientes</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {data.recentMovements.map((m) => (
              <div key={m.id} className="flex items-center justify-between text-xs py-1.5 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${m.movementType === "purchase" ? "bg-green-500" : m.movementType === "sale" ? "bg-blue-500" : m.movementType === "delivery_to_location" ? "bg-yellow-500" : "bg-gray-500"}`} />
                  <span className="font-medium capitalize">{m.movementType.replace(/_/g, " ")}</span>
                  <span className="text-muted-foreground">{m.variant.product.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={m.quantity > 0 ? "text-green-600" : "text-red-600"}>
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(m.createdAt).toLocaleDateString("es")}
                  </span>
                </div>
              </div>
            ))}
            {data.recentMovements.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">Sin movimientos recientes</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-5">
        <h2 className="font-semibold mb-3 text-sm">Últimos Reportes de Ventas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Espacio</th>
                <th className="text-left px-3 py-2 font-medium">Período</th>
                <th className="text-right px-3 py-2 font-medium">Productos</th>
                <th className="text-right px-3 py-2 font-medium">Unidades</th>
                <th className="text-right px-3 py-2 font-medium">Total</th>
                <th className="text-center px-3 py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.recentSales.map((r) => {
                const total = r.items.reduce((s, i) => s + Number(i.unitPrice) * i.quantitySold, 0);
                const units = r.items.reduce((s, i) => s + i.quantitySold, 0);
                return (
                  <tr key={r.id} className="hover:bg-muted/20">
                    <td className="px-3 py-2">{r.location.name}</td>
                    <td className="px-3 py-2">{r.period}</td>
                    <td className="px-3 py-2 text-right">{r.items.length}</td>
                    <td className="px-3 py-2 text-right">{units}</td>
                    <td className="px-3 py-2 text-right font-medium">{formatCurrency(total)}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                        r.status === "confirmed" ? "bg-green-100 text-green-700" :
                        r.status === "reconciled" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {r.status === "pending" ? "Pendiente" :
                         r.status === "confirmed" ? "Confirmado" : "Conciliado"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {data.recentSales.length === 0 && (
                <tr><td colSpan={6} className="text-center py-6 text-muted-foreground">Sin reportes</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
