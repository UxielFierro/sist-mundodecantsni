"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PenLine, ChevronLeft, ChevronRight } from "lucide-react";
import { StockAdjustmentDialog } from "./stock-adjustment-dialog";
import { cn } from "@/lib/utils";

type InventoryItem = {
  id: number;
  quantity: number;
  variant: {
    id: number;
    codigo: string;
    product: { name: string };
    presentation: { name: string };
    costs: { finalPrice: number | string | unknown }[];
  };
};

interface LocationInventoryTableProps {
  locationId: number;
  inventory: InventoryItem[];
}

const ITEMS_PER_PAGE = 10;

export function LocationInventoryTable({ locationId, inventory }: LocationInventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const filteredInventory = inventory.filter((inv) => {
    const term = searchTerm.toLowerCase();
    return (
      inv.variant.product.name.toLowerCase().includes(term) ||
      inv.variant.presentation.name.toLowerCase().includes(term) ||
      inv.variant.codigo.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE) || 1;
  const currentItems = filteredInventory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por código, producto o presentación..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto border rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-muted-foreground">
              <th className="px-3 py-2 font-medium">Código</th>
              <th className="px-3 py-2 font-medium">Producto</th>
              <th className="px-3 py-2 font-medium">Presentación</th>
              <th className="px-3 py-2 text-right font-medium">Stock</th>
              <th className="px-3 py-2 text-right font-medium">Precio</th>
              <th className="px-3 py-2 text-center font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentItems.map((inv) => {
              const qty = inv.quantity;
              const stockColor = qty <= 0 ? "text-red-600 font-bold" : qty <= 2 ? "text-yellow-600 font-semibold" : "text-foreground";
              
              return (
                <tr key={inv.id} className="group hover:bg-muted/20">
                  <td className="px-3 py-1.5 font-mono text-xs text-muted-foreground">{inv.variant.codigo}</td>
                  <td className="px-3 py-1.5 font-medium">{inv.variant.product.name}</td>
                  <td className="px-3 py-1.5 text-muted-foreground">{inv.variant.presentation.name}</td>
                  <td className={cn("px-3 py-1.5 text-right", stockColor)}>{qty}</td>
                  <td className="px-3 py-1.5 text-right font-mono text-xs">
                    {inv.variant.costs[0] ? formatCurrency(Number(inv.variant.costs[0].finalPrice)) : "-"}
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setEditingItem(inv)}
                    >
                      <PenLine className="h-3.5 w-3.5 mr-1.5" />
                      Ajustar
                    </Button>
                  </td>
                </tr>
              );
            })}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-muted-foreground">
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Mostrando {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredInventory.length)} a {Math.min(currentPage * ITEMS_PER_PAGE, filteredInventory.length)} de {filteredInventory.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

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
