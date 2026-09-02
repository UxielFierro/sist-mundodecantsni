import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ProductCardData {
  slug: string;
  name: string;
  codigo: string;
  olfactoryNotes: string | null;
  brand: { name: string } | null;
  images: { url: string }[];
  variants: {
    id: number;
    presentation: { slug: string; name: string };
    costs: { finalPrice: unknown }[];
    globalInventory: { quantity: number } | null;
  }[];
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const pricedVariants = product.variants.filter((v) => v.costs[0]);
  const v5 = pricedVariants.find((v) => v.presentation.slug === "5ml");
  const v10 = pricedVariants.find((v) => v.presentation.slug === "10ml");
  const otherPriced = pricedVariants.filter(
    (v) => v.presentation.slug !== "5ml" && v.presentation.slug !== "10ml"
  );
  const hasStock = product.variants.some((v) => (v.globalInventory?.quantity ?? 0) > 0);

  return (
    <Link
      href={`/perfume/${product.slug}`}
      className="group block"
    >
      <div className="aspect-[4/5] bg-gradient-to-b from-stone-50 to-stone-100/80 rounded-xl overflow-hidden relative mb-3">
        {product.images[0] ? (
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 250px"
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-5xl text-stone-200 font-serif font-light select-none">
              {product.name.charAt(0)}
            </span>
          </div>
        )}
        {!hasStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-white text-[10px] tracking-[0.25em] font-light border border-white/40 px-4 py-2 uppercase">
              Agotado
            </span>
          </div>
        )}
      </div>
      <div className="space-y-1 px-0.5">
        {product.brand && (
          <p className="text-[10px] text-muted-foreground/70 uppercase tracking-[0.15em]">
            {product.brand.name}
          </p>
        )}
        <h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-gold transition-colors duration-300">
          {product.name}
        </h3>
        {product.olfactoryNotes && (
          <p className="text-[10px] text-muted-foreground/50 italic leading-tight line-clamp-1">
            {product.olfactoryNotes}
          </p>
        )}
        <div className="flex items-center gap-2 pt-0.5">
          {v5?.costs[0] && (
            <span className="text-xs font-medium text-gold">
              5ml {formatCurrency(Number(v5.costs[0].finalPrice))}
            </span>
          )}
          {v5?.costs[0] && v10?.costs[0] && (
            <span className="text-stone-300 text-xs">·</span>
          )}
          {v10?.costs[0] && (
            <span className="text-xs font-medium text-gold">
              10ml {formatCurrency(Number(v10.costs[0].finalPrice))}
            </span>
          )}
          {otherPriced.slice(0, 2).map((v) => (
            <span key={v.id} className="text-xs font-medium text-gold">
              {v.presentation.name} {formatCurrency(Number(v.costs[0].finalPrice))}
            </span>
          ))}
          {pricedVariants.length === 0 && (
            <span className="text-[10px] text-muted-foreground/60 italic">Consultar precio</span>
          )}
        </div>
      </div>
    </Link>
  );
}
