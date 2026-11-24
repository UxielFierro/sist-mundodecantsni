"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateSalesReportStatus } from "@/server/actions/sales-reports";

export function ReportStatusSelect({
  reportId,
  currentStatus,
}: {
  reportId: number;
  currentStatus: "pending" | "confirmed" | "reconciled";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as "pending" | "confirmed" | "reconciled";
    startTransition(async () => {
      try {
        await updateSalesReportStatus(reportId, next);
        toast.success("Estado del reporte actualizado");
        router.refresh();
      } catch {
        toast.error("No se pudo actualizar el estado");
      }
    });
  }

  const colorClass =
    currentStatus === "confirmed"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : currentStatus === "reconciled"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${colorClass}`}
    >
      <option value="pending">Pendiente</option>
      <option value="confirmed">Confirmado</option>
      <option value="reconciled">Conciliado</option>
    </select>
  );
}
