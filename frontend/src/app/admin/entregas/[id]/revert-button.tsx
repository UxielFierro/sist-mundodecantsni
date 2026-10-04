"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { revertDelivery } from "@/server/actions/deliveries";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

export function RevertDeliveryButton({ deliveryId }: { deliveryId: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("deliveryId", deliveryId.toString());
      await revertDelivery(formData);
      router.push("/admin/entregas");
      router.refresh();
      toast.success("Entrega revertida correctamente");
    } catch (e) {
      toast.error("Ocurrió un error al revertir la entrega");
      console.error(e);
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Revertir Entrega
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Revertir Entrega"
        description="¿Estás seguro? Se revertirá el inventario y se eliminará la entrega. Esta acción no se puede deshacer."
        confirmText="Revertir"
        loading={loading}
        onConfirm={handleConfirm}
      />
    </>
  );
}
