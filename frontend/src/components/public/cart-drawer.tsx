"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { useCart, WHATSAPP_NUMBER } from "./cart-context";
import { formatCurrency } from "@/lib/utils";

type DeliveryMode = "Envío a domicilio" | "Retiro en tienda" | "Colectivo";

export function CartDrawer() {
  const pathname = usePathname();
  const {
    items,
    isOpen,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
    closeCart,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("Envío a domicilio");
  const [copied, setCopied] = useState(false);

  // Never render public cart UI or duplicate Toaster inside /admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  function buildWhatsAppText(): string {
    const lines = [
      "Hola Mundo Decants Nicaragua! ✨ Quisiera confirmar disponibilidad de mi pedido:",
      "",
      ...items.map((item, idx) => {
        const subtotal = item.price * item.quantity;
        const pricePart = item.price > 0 ? ` — ${formatCurrency(subtotal)}` : "";
        return `${idx + 1}. ${item.brandName ? `${item.brandName} — ` : ""}${item.productName} (${item.presentationName}) [${item.codigo}] x${item.quantity}${pricePart}`;
      }),
      "",
      ...(totalPrice > 0 ? [`💰 Total estimado: ${formatCurrency(totalPrice)}`] : []),
      `📦 Modalidad: ${deliveryMode}`,
      ...(customerName.trim() ? [`👤 Nombre: ${customerName.trim()}`] : []),
    ];
    return lines.join("\n");
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildWhatsAppText()
  )}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildWhatsAppText());
      setCopied(true);
      toast.success("Resumen del pedido copiado");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar el resumen");
    }
  }

  return (
    <>
      <Toaster richColors position="bottom-center" />

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={closeCart}
          />

          {/* Slide-over panel */}
          <aside className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-950 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-gold" />
                <div>
                  <h2 className="font-serif text-base tracking-wide">Mi Pedido</h2>
                  <p className="text-[11px] text-stone-400">
                    {totalItems === 0
                      ? "Tu selección está vacía"
                      : `${totalItems} ${totalItems === 1 ? "producto" : "productos"} seleccionados`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Cerrar pedido"
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                    <ShoppingBag className="h-7 w-7 text-stone-400 stroke-[1.5]" />
                  </div>
                  <p className="font-serif text-lg text-stone-800 mb-1">
                    Aún no agregás fragancias
                  </p>
                  <p className="text-xs max-w-[240px] leading-relaxed mb-6">
                    Explorá el catálogo, elegí tus decants favoritos y envianos tu pedido completo
                    por WhatsApp en un solo mensaje.
                  </p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="px-5 py-2.5 bg-stone-900 text-white text-xs uppercase tracking-widest rounded-lg hover:bg-stone-800 transition-colors"
                  >
                    Explorar catálogo
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.variantId}
                        className="flex gap-3 p-3 rounded-xl border border-stone-200/80 bg-stone-50/50"
                      >
                        <Link
                          href={`/perfume/${item.slug}`}
                          onClick={closeCart}
                          className="relative w-16 h-20 rounded-lg bg-white border border-stone-200/60 shrink-0 overflow-hidden flex items-center justify-center"
                        >
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.productName}
                              fill
                              sizes="64px"
                              className="object-contain p-1.5"
                            />
                          ) : (
                            <span className="font-serif text-2xl text-stone-300">
                              {item.productName.charAt(0)}
                            </span>
                          )}
                        </Link>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              {item.brandName && (
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">
                                  {item.brandName}
                                </p>
                              )}
                              <Link
                                href={`/perfume/${item.slug}`}
                                onClick={closeCart}
                                className="font-medium text-sm text-stone-900 hover:text-gold transition-colors line-clamp-1"
                              >
                                {item.productName}
                              </Link>
                              <p className="text-[11px] text-muted-foreground">
                                {item.presentationName}{" "}
                                <span className="font-mono text-[10px] text-stone-400">
                                  · {item.codigo}
                                </span>
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.variantId)}
                              aria-label="Eliminar producto"
                              className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="inline-flex items-center border border-stone-200 rounded-lg bg-white">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                className="p-1.5 text-stone-600 hover:text-stone-900"
                                aria-label="Disminuir cantidad"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-2.5 text-xs font-semibold text-stone-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                className="p-1.5 text-stone-600 hover:text-stone-900"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <span className="text-sm font-semibold text-gold">
                              {item.price > 0
                                ? formatCurrency(item.price * item.quantity)
                                : "Consultar"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick delivery & name options */}
                  <div className="pt-3 border-t border-stone-200/80 space-y-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1.5">
                        Modalidad de entrega
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(
                          ["Envío a domicilio", "Retiro en tienda", "Colectivo"] as DeliveryMode[]
                        ).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setDeliveryMode(opt)}
                            className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-colors ${
                              deliveryMode === opt
                                ? "bg-stone-900 text-white border-stone-900"
                                : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                            }`}
                          >
                            {opt === "Envío a domicilio"
                              ? "Envío"
                              : opt === "Retiro en tienda"
                              ? "Tienda"
                              : "Colectivo"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Tu nombre (opcional)
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ej: María López"
                        className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-stone-200 bg-stone-50/80 space-y-3 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                    Total estimado
                  </span>
                  <span className="text-xl font-serif font-semibold text-stone-900">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 px-5 rounded-xl text-sm font-semibold hover:bg-[#20bd5a] transition-colors w-full shadow-md"
                >
                  <MessageCircle className="h-5 w-5" />
                  Enviar pedido por WhatsApp
                </a>

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium py-1"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copiado" : "Copiar resumen"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      toast.info("Pedido vaciado");
                    }}
                    className="text-xs text-muted-foreground hover:text-red-600 transition-colors py-1"
                  >
                    Vaciar lista
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
