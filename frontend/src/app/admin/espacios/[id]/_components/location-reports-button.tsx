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
import { ClipboardList } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Report = {
  id: number;
  period: string | null;
  status: string;
  createdAt: Date;
  items: {
    id: number;
    quantitySold: number;
    unitPrice: number | string | unknown;
    variant: {
      codigo: string;
      product: { name: string };
      presentation: { name: string };
    };
  }[];
};

export function LocationReportsButton({ reports }: { reports: Report[] }) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ClipboardList className="mr-2 h-4 w-4" />
          Ver Lista de Reportes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Historial de Reportes de Ventas</DialogTitle>
        </DialogHeader>

        {!selectedReport ? (
          <div className="overflow-y-auto pr-2 space-y-2 mt-4">
            {reports.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Sin reportes registrados</p>
            ) : (
              reports.map((r) => (
                <div
                  key={r.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between"
                  onClick={() => setSelectedReport(r)}
                >
                  <div>
                    <h3 className="font-medium">{r.period || `Reporte #${r.id}`}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold">{r.items.length} productos</span>
                    <p className="text-xs capitalize text-muted-foreground">Estado: {r.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col mt-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedReport.period || `Reporte #${selectedReport.id}`}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedReport.createdAt).toLocaleDateString("es-ES")} - Estado: {selectedReport.status}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedReport(null)}>
                &larr; Volver
              </Button>
            </div>
            
            <div className="overflow-y-auto border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Cód.</th>
                    <th className="px-3 py-2 font-medium">Producto</th>
                    <th className="px-3 py-2 text-center font-medium">Cant. Vendida</th>
                    <th className="px-3 py-2 text-right font-medium">Precio U.</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedReport.items.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/10">
                      <td className="px-3 py-1.5 font-mono text-xs">{item.variant.codigo}</td>
                      <td className="px-3 py-1.5 font-medium">
                        {item.variant.product.name}
                        <span className="block text-xs text-muted-foreground font-normal">{item.variant.presentation.name}</span>
                      </td>
                      <td className="px-3 py-1.5 text-center font-semibold text-red-600">-{item.quantitySold}</td>
                      <td className="px-3 py-1.5 text-right font-mono text-xs">
                        {formatCurrency(Number(item.unitPrice))}
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
