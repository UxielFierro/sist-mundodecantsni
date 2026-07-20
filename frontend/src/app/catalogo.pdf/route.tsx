import { prisma } from "@/lib/db";
import { CatalogPDF } from "@/lib/pdf-catalog";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;

  const products = await prisma.product.findMany({
    where: { active: true, showInCatalog: true },
    include: {
      category: true,
      brand: true,
      images: { take: 1, orderBy: { sortOrder: "asc" } },
      variants: {
        where: { active: true },
        include: {
          presentation: true,
          globalInventory: true,
          costs: { take: 1, orderBy: { effectiveDate: "desc" } },
        },
      },
    },
    orderBy: [{ categoryId: "asc" }, { codigo: "asc" }],
  });

  const data = products
    .filter((p) => p.variants.length > 0)
    .map((p) => ({
      codigo: p.codigo,
      name: p.name,
      category: p.category?.name ?? "General",
      brand: p.brand?.name ?? "-",
      imageUrl: p.images[0]?.url ? `${origin}${p.images[0].url}` : undefined,
      variants: p.variants.map((v) => ({
        presentation: v.presentation.name,
        finalPrice: v.costs[0] ? Number(v.costs[0].finalPrice) : 0,
        stock: v.globalInventory?.quantity ?? 0,
        codigo: v.codigo,
      })),
    }));

  const logoUrl = `${origin}/images/logo.jpeg`;

  const pdfBuffer = await renderToBuffer(<CatalogPDF products={data} logoUrl={logoUrl} />);
  const uint8 = new Uint8Array(pdfBuffer);

  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="catalogo-mundodecants.pdf"`,
    },
  });
}
