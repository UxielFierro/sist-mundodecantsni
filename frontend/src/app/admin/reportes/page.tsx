import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Plus, BarChart3, Download } from "lucide-react";

const ITEMS_PER_PAGE = 12;

export default async function SalesReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1"));

  const [total, reports] = await Promise.all([
    prisma.salesReport.count(),
    prisma.salesReport.findMany({
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: {
        location: true,
        items: {
          include: {
            variant: { include: { product: true, presentation: true } },
          },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Reportes de Ventas</h1>
          <p className="text-muted-foreground mt-1">
            Ventas reportadas por cada espacio
          </p>
        </div>
        <Link
          href="/admin/reportes/nuevo"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nuevo Reporte
        </Link>
        <a
          href="/api/export/reportes"
          className="inline-flex items-center gap-2 border border-input px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent"
        >
          <Download className="h-4 w-4" />
          Exportar Excel
        </a>
      </div>

      <div className="space-y-4">
        {reports.map((report) => {
          const total = report.items.reduce((s, i) => s + Number(i.unitPrice) * i.quantitySold, 0);
          const totalUnits = report.items.reduce((s, i) => s + i.quantitySold, 0);
          return (
            <div key={report.id} className="bg-card border rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{report.location.name}</h3>
                  <p className="text-sm text-muted-foreground">{report.period}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      report.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : report.status === "reconciled"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {report.status === "pending"
                      ? "Pendiente"
                      : report.status === "confirmed"
                        ? "Confirmado"
                        : "Conciliado"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">Productos</div>
                  <div className="font-medium">{report.items.length}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Unidades</div>
                  <div className="font-medium">{totalUnits}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Total</div>
                  <div className="font-medium">{formatCurrency(total)}</div>
                </div>
              </div>
            </div>
          );
        })}
        {reports.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No hay reportes de ventas registrados
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 text-sm">
            <p className="text-muted-foreground">
              Página {currentPage} de {totalPages} ({total} reportes)
            </p>
            <div className="flex items-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={{ pathname: "/admin/reportes", query: { page: String(currentPage - 1) } }}
                  className="px-3 py-1.5 border rounded-lg hover:bg-accent"
                >
                  Anterior
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={{ pathname: "/admin/reportes", query: { page: String(currentPage + 1) } }}
                  className="px-3 py-1.5 border rounded-lg hover:bg-accent"
                >
                  Siguiente
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
