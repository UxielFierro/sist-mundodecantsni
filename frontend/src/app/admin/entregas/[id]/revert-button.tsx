"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { revertDelivery } from "@/server/actions/deliveries";

export function RevertDeliveryButton({ deliveryId }: { deliveryId: number }) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    if (!confirm("¿Estás seguro? Se revertirá el inventario y se eliminará la entrega.")) return;
    await revertDelivery(formData);
    router.push("/admin/entregas");
    router.refresh();
  }

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="deliveryId" value={deliveryId} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Revertir Entrega
      </button>
    </form>
  );
}
