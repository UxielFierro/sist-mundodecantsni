"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./cart-context";

export function CartButton() {
  const { totalItems, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="Abrir mi pedido"
      className="relative p-2 rounded-full text-foreground/75 hover:text-gold hover:bg-stone-100/70 transition-colors"
    >
      <ShoppingBag className="h-5 w-5 stroke-[1.75]" />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-stone-950 text-[10px] font-bold flex items-center justify-center shadow-xs">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
