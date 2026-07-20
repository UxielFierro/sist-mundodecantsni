"use client";

import { GiftConversionList } from "@/server/actions/gift-conversion";
import { Gift, FlaskConical } from "lucide-react";

export function GiftConversionsList({
  conversions,
}: {
  conversions: GiftConversionList;
}) {
  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Historial de Conversiones</h2>
        <span className="text-xs text-muted-foreground">{conversions.length} registros</span>
      </div>
      {conversions.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground text-sm">
          <Gift className="h-8 w-8 mx-auto mb-2 opacity-30" />
          No hay conversiones aún
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Fecha</th>
                <th className="text-left px-4 py-3 font-medium">Producto</th>
                <th className="text-left px-4 py-3 font-medium">De</th>
                <th className="text-right px-4 py-3 font-medium">ml</th>
                <th className="text-left px-4 py-3 font-medium">Regalo</th>
                <th className="text-right px-4 py-3 font-medium">Uds. Estimadas</th>
                <th className="text-left px-4 py-3 font-medium">Motivo</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {conversions.map((c) => (
                <tr key={c.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(c.convertedAt).toLocaleDateString("es-NI", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{c.product.name}</p>
                    <p className="text-xs text-muted-foreground">{c.product.codigo}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">{c.variant?.presentation.name ?? "-"}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">
                    {c.quantityMl ? `${Number(c.quantityMl)}ml` : "-"}
                  </td>
                  <td className="px-4 py-3 text-xs">{c.giftPresentation?.name ?? "-"}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">
                    {c.estimatedUnits ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                    {c.reason ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
