import { prisma } from "@/lib/db";
import { deepSerialize } from "@/lib/utils";
import { NewSalesReportForm } from "./_components/new-sales-report-form";

export default async function NewSalesReportPage() {
  const [locations, rawVariants] = await Promise.all([
    prisma.location.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.productVariant.findMany({
      where: { active: true },
      include: {
        product: { select: { name: true } },
        presentation: { select: { name: true } },
        costs: { take: 1, orderBy: { effectiveDate: "desc" }, select: { finalPrice: true } },
      },
      orderBy: { codigo: "asc" },
    }),
  ]);

  const variants = deepSerialize(rawVariants) as any;

  return <NewSalesReportForm locations={locations} variants={variants} />;
}
