import { formatCurrency, isSCCode } from "@/lib/utils";
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
      className="group bg-card border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all block"
    >
      <div className="aspect-square bg-gradient-to-br from-primary/[0.03] to-primary/[0.06] flex items-center justify-center p-4 relative overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 200px"
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-4xl text-muted-foreground/20 font-bold select-none">
            {product.name.charAt(0)}
          </div>
        )}
        {!hasStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
            <span className="text-white font-bold text-xs tracking-widest bg-red-600/90 px-3 py-1.5 rounded-md shadow-lg">
              SOLD OUT
            </span>
          </div>
        )}
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-[10px] text-muted-foreground font-mono tracking-wider">
          {product.codigo}
          {isSCCode(product.codigo) && <span className="ml-1 text-[8px] font-medium text-yellow-700 bg-yellow-100 px-1 py-0.5 rounded">SC</span>}
        </p>
        <h3 className="font-semibold text-xs leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {product.brand && (
          <p className="text-[10px] text-muted-foreground/70">{product.brand.name}</p>
        )}
        {product.olfactoryNotes && (
          <p className="text-[9px] text-muted-foreground/40 italic leading-tight line-clamp-1">
            {product.olfactoryNotes}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 pt-0.5">
          {v5?.costs[0] && (
            <span className="text-[11px] font-semibold text-primary">
              5ml: {formatCurrency(Number(v5.costs[0].finalPrice))}
            </span>
          )}
          {v10?.costs[0] && (
            <span className="text-[11px] font-semibold text-primary">
              10ml: {formatCurrency(Number(v10.costs[0].finalPrice))}
            </span>
          )}
          {otherPriced.slice(0, 3).map((v) => (
            <span key={v.id} className="text-[11px] font-semibold text-primary">
              {v.presentation.name}: {formatCurrency(Number(v.costs[0].finalPrice))}
            </span>
          ))}
          {pricedVariants.length === 0 && (
            <span className="text-[10px] text-muted-foreground">Consultar precio</span>
          )}
        </div>
      </div>
    </Link>
  );
}
