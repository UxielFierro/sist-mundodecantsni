import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileDown } from "lucide-react";
import { RevertDeliveryButton } from "./revert-button";

export default async function DeliveryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const delivery = await prisma.locationDelivery.findUnique({
    where: { id: parseInt(id) },
    include: {
      location: true,
      items: {
        include: {
          variant: { include: { product: true, presentation: true } },
        },
      },
    },
  });

  if (!delivery) notFound();

  const total = delivery.items.reduce((s, i) => s + Number(i.unitCost) * i.quantity, 0);
  const totalUnits = delivery.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/entregas"
            className="p-2 border rounded-lg hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{delivery.location.name}</h1>
            <p className="text-sm text-muted-foreground">{delivery.period}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/api/export/entrega/${delivery.id}`}
            className="inline-flex items-center gap-1.5 border border-input px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-accent"
          >
            <FileDown className="h-3.5 w-3.5" />
            Excel
          </a>
          <RevertDeliveryButton deliveryId={delivery.id} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Total</p>
          <p className="text-xl font-bold">{formatCurrency(total)}</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Productos</p>
          <p className="text-xl font-bold">{delivery.items.length}</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Unidades</p>
          <p className="text-xl font-bold">{totalUnits}</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Código</th>
              <th className="text-left px-4 py-3 font-medium">Producto</th>
              <th className="text-left px-4 py-3 font-medium">Presentación</th>
              <th className="text-right px-4 py-3 font-medium">Costo Unit.</th>
              <th className="text-center px-4 py-3 font-medium">Cantidad</th>
              <th className="text-right px-4 py-3 font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {delivery.items.map((item) => (
              <tr key={item.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-mono text-xs">{item.variant.codigo}</td>
                <td className="px-4 py-3 font-medium">{item.variant.product.name}</td>
                <td className="px-4 py-3">{item.variant.presentation.name}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(Number(item.unitCost))}</td>
                <td className="px-4 py-3 text-center font-semibold">{item.quantity}</td>
                <td className="px-4 py-3 text-right font-semibold">
                  {formatCurrency(Number(item.unitCost) * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted/30 font-medium">
            <tr>
              <td colSpan={4} className="px-4 py-3" />
              <td className="px-4 py-3 text-center">{totalUnits}</td>
              <td className="px-4 py-3 text-right">{formatCurrency(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {delivery.notes && (
        <div className="mt-4 bg-card border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Notas</p>
          <p className="text-sm">{delivery.notes}</p>
        </div>
      )}

      <div className="mt-4 text-xs text-muted-foreground">
        Creado por {delivery.createdBy ?? "admin"} · {new Date(delivery.createdAt).toLocaleString("es")}
      </div>
    </div>
  );
}
