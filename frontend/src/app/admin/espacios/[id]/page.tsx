import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";
import { LocationInventoryTable } from "./_components/location-inventory-table";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/espacios" className="text-sm text-muted-foreground hover:text-foreground">
            Espacios
          </Link>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-2xl font-bold">{location.name}</h1>
          <span className="text-xs capitalize bg-muted px-2 py-0.5 rounded">{location.type}</span>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/admin/entregas/nueva?locationId=${location.id}`}>
            <Button size="sm" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Entrega
            </Button>
          </Link>
          <Link href={`/admin/reportes/nuevo?locationId=${location.id}`}>
            <Button size="sm" variant="default">
              <FileText className="mr-2 h-4 w-4" />
              Nuevo Reporte
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Inventario en {location.name}</h2>
          <LocationInventoryTable 
            locationId={location.id} 
            inventory={location.locationInventory} 
          />
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6">
            <h2 className="font-semibold mb-3">Últimas Entregas</h2>
            {location.deliveries.map((d) => (
              <div key={d.id} className="text-sm py-2 border-b last:border-0">
                <div className="font-medium">{d.period || `Entrega #${d.id}`}</div>
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
                <div className="font-medium">{r.period || `Reporte #${r.id}`}</div>
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
