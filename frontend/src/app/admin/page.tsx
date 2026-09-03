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
    { title: "Productos", value: data.totals.products, icon: Package, sub: `${data.totals.variants} variantes`, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Espacios", value: data.totals.locations, icon: Store, sub: "activos", color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Stock Bajo", value: data.totals.lowStock, icon: AlertTriangle, sub: "por reabastecer", warn: data.totals.lowStock > 0, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Sin Stock", value: data.totals.outOfStock, icon: Boxes, sub: "agotados", danger: data.totals.outOfStock > 0, color: "text-red-600", bg: "bg-red-50" },
    { title: "Unidades Totales", value: data.totals.totalStock, icon: TrendingUp, sub: "en inventario", color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Reportes", value: data.totals.salesReports, icon: BarChart3, sub: "de ventas cargados", color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-4xl font-serif font-medium tracking-tight text-stone-900">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-2 font-light">
          Resumen general del sistema Mundo Decants Nicaragua
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 mb-10">
        {cards.map((card) => (
          <div key={card.title} className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${card.danger ? "bg-red-50 text-red-600" : card.warn ? "bg-amber-50 text-amber-600" : "bg-stone-50 text-stone-700"}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-serif mb-1 text-stone-900">{card.value}</div>
            <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">{card.title}</div>
            <div className="text-[11px] text-muted-foreground">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
        {data.categoryChart.length > 0 && (
          <div className="bg-white border border-stone-200/60 rounded-2xl p-6 shadow-sm">
            <h2 className="font-serif text-lg text-stone-800 mb-4">Productos por Categoría</h2>
            <div className="h-[300px]">
              <CategoryChart data={data.categoryChart} />
            </div>
          </div>
        )}

        {data.topSelling.length > 0 && (
          <div className="bg-white border border-stone-200/60 rounded-2xl p-6 shadow-sm lg:col-span-2">
            <h2 className="font-serif text-lg text-stone-800 mb-4">Más Vendidos</h2>
            <div className="h-[300px]">
              <TopSellingChart data={data.topSelling} />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
        {inventoryStatus.length > 0 && (
          <div className="bg-white border border-stone-200/60 rounded-2xl p-6 shadow-sm">
            <h2 className="font-serif text-lg text-stone-800 mb-4">Estado del Inventario</h2>
            <div className="h-[300px]">
              <InventoryStatusChart data={inventoryStatus} />
            </div>
          </div>
        )}

        <div className="lg:col-span-2 bg-white border border-stone-200/60 rounded-2xl p-6 shadow-sm flex flex-col">
          <h2 className="font-serif text-lg text-stone-800 mb-4">Movimientos Recientes</h2>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: "300px" }}>
            <div className="space-y-3">
              {data.recentMovements.map((m) => (
                <div key={m.id} className="flex items-center justify-between text-sm py-3 border-b border-stone-100 last:border-0 hover:bg-stone-50/50 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full shadow-sm ${m.movementType === "purchase" ? "bg-emerald-500" : m.movementType === "sale" ? "bg-blue-500" : m.movementType === "delivery_to_location" ? "bg-amber-500" : "bg-stone-400"}`} />
                    <span className="font-medium text-stone-700 capitalize text-xs bg-white border border-stone-200 px-2 py-1 rounded-md shadow-sm">
                      {m.movementType.replace(/_/g, " ")}
                    </span>
                    <span className="text-muted-foreground font-light">{m.variant.product.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-semibold ${m.quantity > 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                    </span>
                    <span className="text-xs text-muted-foreground/60 font-mono">
                      {new Date(m.createdAt).toLocaleDateString("es")}
                    </span>
                  </div>
                </div>
              ))}
              {data.recentMovements.length === 0 && (
                <div className="text-center py-10 text-muted-foreground font-light">Sin movimientos recientes</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200/60 rounded-2xl p-6 shadow-sm">
        <h2 className="font-serif text-lg text-stone-800 mb-6">Últimos Reportes de Ventas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50/80 border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-stone-600 rounded-tl-lg">Espacio</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-600">Período</th>
                <th className="text-center px-4 py-3 font-semibold text-stone-600">Productos</th>
                <th className="text-center px-4 py-3 font-semibold text-stone-600">Unidades</th>
                <th className="text-right px-4 py-3 font-semibold text-stone-600">Total</th>
                <th className="text-center px-4 py-3 font-semibold text-stone-600 rounded-tr-lg">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data.recentSales.map((r) => {
                const total = r.items.reduce((s, i) => s + Number(i.unitPrice) * i.quantitySold, 0);
                const units = r.items.reduce((s, i) => s + i.quantitySold, 0);
                return (
                  <tr key={r.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-stone-800">{r.location.name}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{r.period}</td>
                    <td className="px-4 py-3.5 text-center text-muted-foreground">{r.items.length}</td>
                    <td className="px-4 py-3.5 text-center text-muted-foreground">{units}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-stone-800">{formatCurrency(total)}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                        r.status === "confirmed" ? "bg-emerald-100/50 text-emerald-700 border border-emerald-200" :
                        r.status === "reconciled" ? "bg-blue-100/50 text-blue-700 border border-blue-200" :
                        "bg-amber-100/50 text-amber-700 border border-amber-200"
                      }`}>
                        {r.status === "pending" ? "Pendiente" :
                         r.status === "confirmed" ? "Confirmado" : "Conciliado"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {data.recentSales.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-muted-foreground font-light">Sin reportes registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
