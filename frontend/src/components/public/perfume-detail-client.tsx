"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageCircle, Camera, Droplets, Check, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { useCart, WHATSAPP_NUMBER } from "./cart-context";

interface ImageItem {
  id: number;
  url: string;
  altText: string | null;
}

interface VariantItem {
  id: number;
  codigo: string;
  presentationName: string;
  presentationSlug: string;
  price: number | null;
  stock: number;
}

export function PerfumeDetailClient({
  product,
}: {
  product: {
    slug: string;
    name: string;
    brandName: string | null;
    categoryName: string | null;
    description: string | null;
    olfactoryNotes: string | null;
    isSupply: boolean;
    isFullBottle: boolean;
    hasStock: boolean;
    images: ImageItem[];
    variants: VariantItem[];
  };
}) {
  const { addItem, openCart } = useCart();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const firstAvailable =
    product.variants.find((v) => v.stock > 0 && v.price !== null) ?? product.variants[0] ?? null;
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    firstAvailable?.id ?? null
  );

  const activeImage = product.images[selectedImageIdx] ?? product.images[0] ?? null;
  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? firstAvailable;

  const whatsappMessage = selectedVariant
    ? `Hola, me interesa ${product.name} (${selectedVariant.presentationName}) [${selectedVariant.codigo}]${
        selectedVariant.price ? ` — ${formatCurrency(selectedVariant.price)}` : ""
      } que vi en su catálogo. ¿Tienen disponibilidad?`
    : `Hola, me interesa ${product.name} que vi en su catálogo. ¿Tienen disponibilidad?`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const canAddSelected = Boolean(selectedVariant && selectedVariant.stock > 0);

  function handleAddToCart() {
    if (!selectedVariant) return;
    if (selectedVariant.stock <= 0) {
      toast.error("Esta presentación está agotada por el momento");
      return;
    }
    addItem({
      variantId: selectedVariant.id,
      codigo: selectedVariant.codigo,
      productName: product.name,
      brandName: product.brandName,
      presentationName: selectedVariant.presentationName,
      price: selectedVariant.price ?? 0,
      imageUrl: product.images[0]?.url ?? null,
      slug: product.slug,
    });
    toast.success(`Agregado: ${product.name} (${selectedVariant.presentationName})`, {
      action: {
        label: "Ver pedido",
        onClick: () => openCart(),
      },
    });
  }

  const showSprayGuide = !product.isSupply && !product.isFullBottle;

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-6 md:gap-12 lg:gap-20">
        {/* Left: Images Gallery */}
        <div className="w-full space-y-3">
          <div className="h-72 sm:h-96 md:h-auto md:aspect-[4/5] bg-gradient-to-b from-stone-50 to-stone-100 rounded-2xl relative flex items-center justify-center p-4 lg:p-14 overflow-hidden border border-border/50">
            {activeImage ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={activeImage.url}
                  alt={activeImage.altText || product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain drop-shadow-xl md:drop-shadow-2xl transition-all duration-300"
                  style={{ maxHeight: "92%" }}
                  priority
                />
              </div>
            ) : (
              <div className="text-7xl md:text-9xl text-stone-200 font-serif font-light select-none">
                {product.name.charAt(0)}
              </div>
            )}
            {!product.hasStock && (
              <div className="absolute inset-0 bg-white/25 backdrop-blur-sm flex items-center justify-center">
                <span className="text-foreground border border-foreground px-4 py-2 md:px-6 md:py-3 text-[10px] md:text-xs uppercase tracking-[0.25em] font-medium bg-white/85">
                  Agotado
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 bg-stone-50 transition-all ${
                    idx === selectedImageIdx
                      ? "border-gold shadow-sm"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || `${product.name} ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-contain p-1.5"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col md:pt-4 lg:pt-8">
          <div className="mb-4">
            {product.categoryName && (
              <div className="mb-2.5">
                <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 shadow-sm">
                  {product.categoryName}
                </span>
              </div>
            )}
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-medium tracking-tight text-foreground leading-[1.1]">
              {product.brandName && (
                <span className="block text-[10px] md:text-sm uppercase tracking-[0.2em] text-muted-foreground font-sans mb-1 md:mb-2">
                  {product.brandName}
                </span>
              )}
              {product.name}
            </h1>
          </div>

          {/* Description */}
          {product.description && (
            <div className="border border-border/60 rounded-xl p-3 md:p-4 mb-4 bg-white shadow-sm">
              <p className="text-sm text-foreground/80 leading-relaxed font-light whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          {/* Olfactory Notes */}
          {!product.isSupply && product.olfactoryNotes && (
            <div className="mb-5">
              <h3 className="text-[10px] md:text-xs uppercase tracking-[0.15em] font-semibold text-muted-foreground/60 mb-2.5 flex items-center gap-1.5">
                <Droplets className="h-3 w-3 text-gold" /> Notas Olfativas
              </h3>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {product.olfactoryNotes.split(",").map((note) => {
                  const trimmed = note.trim();
                  if (!trimmed) return null;
                  return (
                    <span
                      key={trimmed}
                      className="px-2.5 py-1.5 md:px-4 md:py-2 border border-border/60 rounded-full text-[11px] md:text-xs text-foreground/80 font-light bg-stone-50 shadow-sm"
                    >
                      {trimmed}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Variants / Sizes */}
          {product.variants.length > 0 && (
            <div className="mb-6 md:mb-8">
              <h3 className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-foreground mb-3">
                Seleccioná tu tamaño
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const inStock = v.stock > 0;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`relative border rounded-xl p-3 md:p-4 text-center transition-all ${
                        isSelected
                          ? "border-gold bg-amber-50/40 ring-1 ring-gold/40 shadow-sm"
                          : inStock
                          ? "border-border bg-white shadow-xs hover:border-gold/60"
                          : "border-border/50 bg-stone-50 opacity-55"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-gold text-stone-950 flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                      )}
                      <p className="text-sm md:text-base font-serif mb-0.5 text-stone-900">
                        {v.presentationName}
                      </p>
                      {v.price !== null ? (
                        <p className="text-[13px] md:text-sm font-semibold text-gold">
                          {formatCurrency(v.price)}
                        </p>
                      ) : (
                        <p className="text-[11px] text-muted-foreground italic">Consultar</p>
                      )}
                      <p
                        onClick={(e) => e.stopPropagation()}
                        className="text-[9px] text-stone-300 hover:text-stone-500 font-mono mt-1 select-all transition-colors cursor-text"
                      >
                        {v.codigo}
                      </p>
                    </button>
                  );
                })}
              </div>

              {showSprayGuide && (
                <div className="mt-5 pt-5 border-t border-border/40 grid grid-cols-2 gap-3">
                  <div className="text-center bg-stone-50/80 rounded-lg p-3 shadow-xs border border-border/30">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/80 mb-1 font-medium">
                      Decant 5 ml
                    </p>
                    <p className="text-sm font-semibold text-foreground/90">~75 sprays</p>
                    <p className="text-[9px] text-muted-foreground mt-1">Aprox. 1 mes de uso</p>
                  </div>
                  <div className="text-center bg-stone-50/80 rounded-lg p-3 shadow-xs border border-border/30">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/80 mb-1 font-medium">
                      Decant 10 ml
                    </p>
                    <p className="text-sm font-semibold text-foreground/90">~150 sprays</p>
                    <p className="text-[9px] text-muted-foreground mt-1">Aprox. 2 meses de uso</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Desktop Action Buttons */}
          <div className="hidden md:block mt-auto space-y-2.5 pt-8 border-t border-border/60">
            {selectedVariant && (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canAddSelected}
                className="flex items-center justify-center gap-2 bg-stone-950 text-white px-6 py-4 text-sm font-medium hover:bg-stone-800 disabled:opacity-45 disabled:cursor-not-allowed transition-all duration-300 w-full tracking-wide rounded-xl shadow-sm"
              >
                <ShoppingBag className="h-5 w-5 text-gold" />
                {canAddSelected
                  ? `Agregar ${selectedVariant.presentationName} a mi pedido`
                  : "Presentación agotada"}
              </button>
            )}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 text-sm font-medium hover:bg-[#20bd5a] transition-all duration-300 w-full tracking-wide rounded-xl shadow-sm hover:shadow-md"
            >
              <MessageCircle className="h-5 w-5" />
              {selectedVariant
                ? `Pedir solo este (${selectedVariant.presentationName}) por WhatsApp`
                : "Consultar disponibilidad por WhatsApp"}
            </a>
            <a
              href="https://www.instagram.com/mundodecants_nicaragua"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-stone-100 text-stone-800 border border-border px-6 py-3 text-xs font-medium hover:bg-stone-200 transition-all duration-300 w-full tracking-wide rounded-xl"
            >
              <Camera className="h-4 w-4" />
              Ver en Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Buy Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3.5 bg-white/95 backdrop-blur-md border-t border-border/50 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] pb-6">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAddSelected}
            className="flex items-center justify-center gap-1.5 bg-stone-950 text-white px-4 py-3.5 text-xs font-semibold uppercase tracking-wide hover:bg-stone-800 disabled:opacity-45 transition-colors rounded-xl shadow-md"
          >
            <ShoppingBag className="h-4 w-4 text-gold" />
            {canAddSelected ? "Agregar" : "Agotado"}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 bg-[#25D366] text-white px-4 py-3.5 text-xs font-semibold uppercase tracking-wide hover:bg-[#20bd5a] transition-colors rounded-xl shadow-md"
          >
            <MessageCircle className="h-4 w-4" />
            Pedir ya
          </a>
        </div>
      </div>
    </>
  );
}
