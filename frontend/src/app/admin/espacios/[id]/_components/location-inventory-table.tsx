"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PenLine } from "lucide-react";
import { StockAdjustmentDialog } from "./stock-adjustment-dialog";

type InventoryItem = {
  id: number;
  quantity: number;
  variant: {
    id: number;
    product: { name: string };
    presentation: { name: string };
    costs: { finalPrice: number | string | unknown }[];
  };
};

interface LocationInventoryTableProps {
  locationId: number;
  inventory: InventoryItem[];
}

export function LocationInventoryTable({ locationId, inventory }: LocationInventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const filteredInventory = inventory.filter((inv) =>
    inv.variant.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por producto..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="pb-2 font-medium">Producto</th>
              <th className="pb-2 font-medium">Presentación</th>
              <th className="pb-2 text-right font-medium">Stock</th>
              <th className="pb-2 text-right font-medium">Precio</th>
              <th className="pb-2 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredInventory.map((inv) => (
              <tr key={inv.id} className="group">
                <td className="py-2">{inv.variant.product.name}</td>
                <td className="py-2">{inv.variant.presentation.name}</td>
                <td className="py-2 text-right font-medium">{inv.quantity}</td>
                <td className="py-2 text-right">
                  {inv.variant.costs[0]
                    ? formatCurrency(Number(inv.variant.costs[0].finalPrice))
                    : "-"}
                </td>
                <td className="py-2 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setEditingItem(inv)}
                  >
                    <PenLine className="h-4 w-4 mr-2" />
                    Ajustar
                  </Button>
                </td>
              </tr>
            ))}
            {filteredInventory.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingItem && (
        <StockAdjustmentDialog
          locationId={locationId}
          variantId={editingItem.variant.id}
          productName={editingItem.variant.product.name}
          presentationName={editingItem.variant.presentation.name}
          currentQuantity={editingItem.quantity}
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
        />
      )}
    </div>
  );
}
