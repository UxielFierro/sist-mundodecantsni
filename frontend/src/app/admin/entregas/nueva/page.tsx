import { prisma } from "@/lib/db";
import { deepSerialize } from "@/lib/utils";
import { NewDeliveryForm } from "./_components/new-delivery-form";

export default async function NewDeliveryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; locationId?: string }>;
}) {
  const { q, locationId } = await searchParams;
  const search = q?.trim() || "";
  const defaultLocationId = locationId ? parseInt(locationId) : undefined;

  const variantWhere: Record<string, unknown> = {
    active: true,
    globalInventory: { quantity: { gt: 0 } },
  };

  if (search) {
    variantWhere.OR = [
      { codigo: { contains: search, mode: "insensitive" } },
      { product: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [locations, rawVariants] = await Promise.all([
    prisma.location.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.productVariant.findMany({
      where: variantWhere as any,
      include: {
        product: { select: { name: true } },
        presentation: { select: { name: true } },
        globalInventory: { select: { quantity: true } },
        costs: { take: 1, orderBy: { effectiveDate: "desc" }, select: { finalPrice: true } },
      },
      orderBy: { codigo: "asc" },
    }),
  ]);

  const variants = deepSerialize(rawVariants) as any;

  return <NewDeliveryForm locations={locations} variants={variants} search={search} defaultLocationId={defaultLocationId} />;
}
