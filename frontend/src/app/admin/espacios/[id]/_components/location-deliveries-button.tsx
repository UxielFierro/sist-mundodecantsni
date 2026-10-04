"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PackageOpen } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Delivery = {
  id: number;
  period: string | null;
  createdAt: Date;
  items: {
    id: number;
    quantity: number;
    unitCost: number | string | unknown;
    variant: {
      codigo: string;
      product: { name: string };
      presentation: { name: string };
    };
  }[];
};

export function LocationDeliveriesButton({ deliveries }: { deliveries: Delivery[] }) {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PackageOpen className="mr-2 h-4 w-4" />
          Ver Lista de Entregas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Historial de Entregas</DialogTitle>
        </DialogHeader>

        {!selectedDelivery ? (
          <div className="overflow-y-auto pr-2 space-y-2 mt-4">
            {deliveries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Sin entregas registradas</p>
            ) : (
              deliveries.map((d) => (
                <div
                  key={d.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between"
                  onClick={() => setSelectedDelivery(d)}
                >
                  <div>
                    <h3 className="font-medium">{d.period || `Entrega #${d.id}`}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(d.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold">{d.items.length} productos</span>
                    <p className="text-xs text-muted-foreground">Clic para ver detalles</p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col mt-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedDelivery.period || `Entrega #${selectedDelivery.id}`}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedDelivery.createdAt).toLocaleDateString("es-ES")}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDelivery(null)}>
                &larr; Volver
              </Button>
            </div>
            
            <div className="overflow-y-auto border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Cód.</th>
                    <th className="px-3 py-2 font-medium">Producto</th>
                    <th className="px-3 py-2 text-center font-medium">Cant.</th>
                    <th className="px-3 py-2 text-right font-medium">Costo U.</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedDelivery.items.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/10">
                      <td className="px-3 py-1.5 font-mono text-xs">{item.variant.codigo}</td>
                      <td className="px-3 py-1.5 font-medium">
                        {item.variant.product.name}
                        <span className="block text-xs text-muted-foreground font-normal">{item.variant.presentation.name}</span>
                      </td>
                      <td className="px-3 py-1.5 text-center font-semibold">{item.quantity}</td>
                      <td className="px-3 py-1.5 text-right font-mono text-xs">
                        {formatCurrency(Number(item.unitCost))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
