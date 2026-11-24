import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Plus, BarChart3, Download } from "lucide-react";
import { ReportStatusSelect } from "./_components/report-status-select";

const ITEMS_PER_PAGE = 12;

export default async function SalesReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium text-stone-900">Reportes de Ventas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ventas reportadas por cada espacio ({total} reportes)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/export/reportes"
            className="inline-flex items-center gap-2 border border-input bg-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-accent"
          >
            <Download className="h-4 w-4" />
            Exportar Excel
          </a>
          <Link
            href="/admin/reportes/nuevo"
            className="inline-flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-stone-800"
          >
            <Plus className="h-4 w-4" />
            Nuevo Reporte
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {reports.map((report) => {
          const totalAmount = report.items.reduce(
            (s, i) => s + Number(i.unitPrice) * i.quantitySold,
            0
          );
          const totalUnits = report.items.reduce((s, i) => s + i.quantitySold, 0);
          return (
            <div
              key={report.id}
              className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-semibold text-stone-900">{report.location.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {report.period} · {new Date(report.reportDate).toLocaleDateString("es-NI")}
                    {report.notes ? ` · ${report.notes}` : ""}
                  </p>
                </div>
                <ReportStatusSelect reportId={report.id} currentStatus={report.status} />
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm pb-3 border-b border-stone-100">
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
                  <div className="font-semibold text-stone-900">{formatCurrency(totalAmount)}</div>
                </div>
              </div>

              {report.items.length > 0 && (
                <details className="mt-3 group">
                  <summary className="text-xs text-gold font-medium cursor-pointer hover:underline select-none">
                    Ver detalle de {report.items.length} producto{report.items.length !== 1 ? "s" : ""}
                  </summary>
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="text-muted-foreground border-b">
                        <tr>
                          <th className="text-left py-1.5 font-medium">Producto</th>
                          <th className="text-left py-1.5 font-medium">Presentación</th>
                          <th className="text-right py-1.5 font-medium">Cant.</th>
                          <th className="text-right py-1.5 font-medium">Precio</th>
                          <th className="text-right py-1.5 font-medium">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {report.items.map((item) => (
                          <tr key={item.id}>
                            <td className="py-1.5 font-medium text-stone-800">
                              {item.variant.product.name}
                            </td>
                            <td className="py-1.5 text-muted-foreground">
                              {item.variant.presentation.name}
                            </td>
                            <td className="py-1.5 text-right">{item.quantitySold}</td>
                            <td className="py-1.5 text-right">
                              {formatCurrency(Number(item.unitPrice))}
                            </td>
                            <td className="py-1.5 text-right font-medium">
                              {formatCurrency(Number(item.unitPrice) * item.quantitySold)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              )}
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
