import { prisma } from "@/lib/db";
import { deepSerialize } from "@/lib/utils";
import { GiftConversionsList } from "./_components/gift-conversions-list";
import { NewGiftConversionForm } from "./_components/new-gift-conversion-form";
import { Gift } from "lucide-react";

export default async function RegaliasPage() {
  const [rawConversions, rawProducts, rawPresentations] = await Promise.all([
    prisma.giftConversion.findMany({
      orderBy: { convertedAt: "desc" },
      include: {
        product: {
          select: { id: true, name: true, codigo: true, brand: { select: { name: true } } },
        },
        variant: { include: { presentation: true } },
        giftPresentation: { select: { id: true, name: true, quantity: true } },
      },
    }),
    prisma.product.findMany({
      where: { active: true, isSupply: false },
      include: {
        brand: true,
        variants: {
          where: { active: true, globalInventory: { quantity: { gt: 0 } } },
          include: {
            presentation: true,
            globalInventory: true,
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.presentation.findMany({
      where: { unitType: "ml", quantity: { lte: 5 } },
      orderBy: { quantity: "asc" },
    }),
  ]);

  const conversions = deepSerialize(rawConversions) as any;
  const products = deepSerialize(rawProducts) as any;
  const presentations = deepSerialize(rawPresentations) as any;

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <Gift className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Conversión a Regalías</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <NewGiftConversionForm products={products} presentations={presentations} />
        <div className="bg-card border rounded-xl p-6">
          <h2 className="font-semibold mb-2">¿Qué son las Regalías?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Convierte perfume de inventario existente en muestras o regalías (ej. 2ml) para
            promociones, cortesías o ventas. El sistema descuenta automáticamente el stock
            original y registra las unidades estimadas generadas.
          </p>
        </div>
      </div>

      <GiftConversionsList conversions={conversions} />
    </div>
  );
}
