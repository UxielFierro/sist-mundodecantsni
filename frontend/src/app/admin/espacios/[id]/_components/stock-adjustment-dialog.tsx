"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adjustLocationStock } from "@/server/actions/locations";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StockAdjustmentDialogProps {
  locationId: number;
  variantId: number;
  productName: string;
  presentationName: string;
  currentQuantity: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StockAdjustmentDialog({
  locationId,
  variantId,
  productName,
  presentationName,
  currentQuantity,
  open,
  onOpenChange,
}: StockAdjustmentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [newQuantity, setNewQuantity] = useState(currentQuantity.toString());
  const [reason, setReason] = useState("");

  const handleAdjust = async () => {
    const qty = parseInt(newQuantity);
    if (isNaN(qty) || qty < 0) {
      toast.error("Cantidad inválida");
      return;
    }

    if (!reason.trim()) {
      toast.error("Debe especificar una razón para el ajuste");
      return;
    }

    if (qty === currentQuantity) {
      onOpenChange(false);
      return;
    }

    setLoading(true);
    try {
      await adjustLocationStock(locationId, variantId, qty, reason);
      toast.success("Stock ajustado correctamente");
      onOpenChange(false);
      setReason("");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al ajustar el stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajustar Stock</DialogTitle>
          <DialogDescription>
            {productName} - {presentationName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Stock Actual</Label>
            <div className="text-lg font-semibold">{currentQuantity}</div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newQuantity">Nuevo Stock</Label>
            <Input
              id="newQuantity"
              type="number"
              min="0"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo del Ajuste</Label>
            <Input
              id="reason"
              placeholder="Ej: Corrección de inventario, pérdida, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleAdjust} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Guardar Ajuste"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
