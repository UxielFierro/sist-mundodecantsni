import { prisma } from "@/lib/db";

export async function getDashboardData() {
  const [
    totalProducts,
    totalVariants,
    totalLocations,
    totalSalesReports,
    inventory,
    recentMovements,
    categoryDistribution,
    topSelling,
  ] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.productVariant.count({ where: { active: true } }),
    prisma.location.count({ where: { active: true } }),
    prisma.salesReport.count(),
    prisma.globalInventory.findMany({
      include: { variant: { include: { product: true, presentation: true } } },
      orderBy: { quantity: "asc" },
    }),
    prisma.inventoryMovement.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { variant: { include: { product: true } }, location: true },
    }),
    prisma.product.groupBy({
      by: ["categoryId"],
      _count: { id: true },
      where: { active: true },
    }),
    prisma.saleReportItem.groupBy({
      by: ["variantId"],
      _sum: { quantitySold: true },
      orderBy: { _sum: { quantitySold: "desc" } },
      take: 5,
    }),
  ]);

  const categoriesMap = await prisma.category.findMany();
  const categoryChart = [];
  for (const c of categoryDistribution) {
    const cat = categoriesMap.find((x) => x.id === c.categoryId);
    categoryChart.push({
      name: cat?.name ?? "Sin categoría",
      value: c._count.id,
    });
  }

  const lowStock = inventory.filter((i) => i.quantity <= i.minStock);
  const outOfStock = inventory.filter((i) => i.quantity === 0);

  const variantIds = topSelling.map((t) => t.variantId);
  const topVariantMap = new Map(
    (await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true, presentation: true },
    })).map((v) => [v.id, v])
  );
  const topVariants = topSelling.map((t) => {
    const v = topVariantMap.get(t.variantId);
    return { name: `${v?.product.name ?? "N/A"} (${v?.presentation.name ?? ""})`, sold: t._sum.quantitySold ?? 0 };
  });

  const recentSales = await prisma.salesReport.findMany({
    orderBy: { reportDate: "desc" },
    take: 6,
    include: {
      location: true,
      items: { include: { variant: { include: { product: true, presentation: true } } } },
    },
  });

  return {
    totals: {
      products: totalProducts,
      variants: totalVariants,
      locations: totalLocations,
      salesReports: totalSalesReports,
      inventoryItems: inventory.length,
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
      totalStock: inventory.reduce((s, i) => s + i.quantity, 0),
    },
    categoryChart,
    topSelling: topVariants,
    recentMovements: recentMovements.slice(0, 10),
    recentSales,
    inventory,
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
