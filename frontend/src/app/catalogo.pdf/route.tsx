import { prisma } from "@/lib/db";
import { CatalogPDF } from "@/lib/pdf-catalog";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const onlyAvailable = url.searchParams.get("disponibles") === "1";

  const products = await prisma.product.findMany({
    where: {
      active: true,
      showInCatalog: true,
      isGift: false,
      ...(onlyAvailable
        ? {
            variants: {
              some: {
                active: true,
                globalInventory: { quantity: { gt: 0 } },
              },
            },
          }
        : {}),
    },
    include: {
      category: true,
      brand: true,
      images: { take: 1, orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
      variants: {
        where: { active: true },
        orderBy: { presentation: { sortOrder: "asc" } },
        include: {
          presentation: true,
          globalInventory: true,
          costs: { take: 1, orderBy: { effectiveDate: "desc" } },
        },
      },
    },
    orderBy: [{ category: { name: "asc" } }, { codigo: "asc" }],
  });

  const data = products
    .filter((p) => p.variants.length > 0)
    .map((p) => ({
      codigo: p.codigo,
      name: p.name,
      category: p.category?.name ?? "General",
      brand: p.brand?.name ?? "-",
      olfactoryNotes: p.olfactoryNotes,
      imageUrl: p.images[0]?.url
        ? p.images[0].url.startsWith("http")
          ? p.images[0].url
          : `${origin}${p.images[0].url}`
        : undefined,
      variants: p.variants.map((v) => ({
        presentation: v.presentation.name,
        finalPrice: v.costs[0] ? Number(v.costs[0].finalPrice) : 0,
        stock: v.globalInventory?.quantity ?? 0,
        codigo: v.codigo,
      })),
    }));

  const logoUrl = `${origin}/images/logo-icon.png`;
  const now = new Date();
  const monthName = now.toLocaleString("es-NI", { month: "long" });
  const editionLabel = `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} ${now.getFullYear()}`;

  const pdfBuffer = await renderToBuffer(
    <CatalogPDF products={data} logoUrl={logoUrl} editionLabel={editionLabel} />
  );
  const uint8 = new Uint8Array(pdfBuffer);

  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="catalogo-mundodecants.pdf"`,
    },
  });
}
