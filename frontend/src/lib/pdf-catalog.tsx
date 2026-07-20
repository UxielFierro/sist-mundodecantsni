import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4TYFqL_KWxQ.ttf", fontWeight: "normal" },
    { src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4TYFv0L_KWxQ.ttf", fontWeight: "bold" },
  ],
});

const colors = {
  primary: "#1a1a2e",
  accent: "#2563eb",
  muted: "#6b7280",
  border: "#e5e7eb",
  lightBg: "#f9fafb",
  soldOut: "#dc2626",
};

const styles = StyleSheet.create({
  coverPage: {
    padding: 0,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  coverContent: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  coverLogo: {
    width: 180,
    height: 180,
    objectFit: "contain",
    marginBottom: 20,
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
  },
  coverSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 1.6,
  },
  coverDivider: {
    width: 60,
    height: 2,
    backgroundColor: colors.accent,
    marginBottom: 30,
  },
  coverInfo: {
    fontSize: 10,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 1.8,
  },
  coverDate: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 40,
  },
  contentPage: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 30,
  },
  header: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerLogo: {
    width: 28,
    height: 28,
    objectFit: "contain",
    borderRadius: 4,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
  },
  headerSubtitle: {
    fontSize: 7,
    color: colors.muted,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  categoryCount: {
    fontSize: 8,
    color: colors.muted,
    marginLeft: 6,
  },
  productRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  productCard: {
    width: "31%",
    height: 155,
    marginRight: "3.5%",
    padding: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    position: "relative",
  },
  productCardLast: {
    width: "31%",
    height: 155,
    marginRight: 0,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: 70,
    marginBottom: 3,
    objectFit: "contain",
  },
  productNoImage: {
    width: "100%",
    height: 70,
    marginBottom: 3,
    backgroundColor: colors.lightBg,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
  },
  productNoImageText: {
    fontSize: 18,
    color: colors.border,
    fontWeight: "bold",
  },
  productCode: {
    fontSize: 6,
    color: colors.muted,
    marginBottom: 1,
  },
  productName: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 1,
    lineHeight: 1.3,
  },
  productBrand: {
    fontSize: 6.5,
    color: colors.muted,
    marginBottom: 2,
  },
  productPrices: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    marginTop: 2,
  },
  priceTag: {
    fontSize: 7,
    fontWeight: "bold",
    color: colors.accent,
    backgroundColor: "#eff6ff",
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 2,
  },
  variantCode: {
    fontSize: 5,
    color: colors.muted,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 2,
    paddingVertical: 1,
    borderRadius: 1,
  },
  soldOutOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(220, 38, 38, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  soldOutText: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.soldOut,
    letterSpacing: 2,
  },
  footer: {
    position: "absolute",
    bottom: 15,
    left: 35,
    right: 35,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6,
  },
  footerText: {
    fontSize: 6.5,
    color: colors.muted,
  },
  pageNumber: {
    fontSize: 6.5,
    color: colors.muted,
  },
});

interface VariantData {
  presentation: string;
  finalPrice: number;
  stock: number;
  codigo: string;
}

interface ProductData {
  codigo: string;
  name: string;
  category: string;
  brand: string;
  imageUrl?: string;
  variants: VariantData[];
}

function ProductCard({ product, isLast }: { product: ProductData; isLast: boolean }) {
  const soldOut = product.variants.every((v) => v.stock === 0);
  return (
    <View style={isLast ? styles.productCardLast : styles.productCard} wrap={false}>
      {product.imageUrl ? (
        <Image style={styles.productImage} src={product.imageUrl} />
      ) : (
        <View style={styles.productNoImage}>
          <Text style={styles.productNoImageText}>
            {product.name.charAt(0)}
          </Text>
        </View>
      )}
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productBrand}>{product.brand}</Text>
      <View style={styles.productPrices}>
        {product.variants.map((v) => (
          <Text key={v.presentation} style={styles.priceTag}>
            {v.presentation}: C${v.finalPrice.toFixed(0)}
          </Text>
        ))}
      </View>
      <View style={styles.productPrices}>
        {product.variants.map((v) => (
          <Text key={v.codigo} style={styles.variantCode}>
            {v.codigo}
          </Text>
        ))}
      </View>
      {soldOut && (
        <View style={styles.soldOutOverlay}>
          <Text style={styles.soldOutText}>SOLD OUT</Text>
        </View>
      )}
    </View>
  );
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function ContentPage({
  category,
  products,
  pageNumber,
  totalPages,
  logoUrl,
}: {
  category: string;
  products: ProductData[];
  pageNumber: number;
  totalPages: number;
  logoUrl?: string;
}) {
  const rows = chunkArray(products, 3);

  return (
    <Page size="A4" style={styles.contentPage}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {logoUrl && <Image style={styles.headerLogo} src={logoUrl} />}
          <View>
            <Text style={styles.headerTitle}>Catálogo de Fragancias</Text>
            <Text style={styles.headerSubtitle}>
              {totalPages} página{totalPages !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.categoryHeader}>
        <Text style={styles.categoryLabel}>{category}</Text>
      </View>

      {rows.map((row, i) => (
        <View key={i} style={styles.productRow}>
          {row.map((p, j) => (
            <ProductCard key={p.codigo} product={p} isLast={j === row.length - 1} />
          ))}
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Mundo Decants Nicaragua — Contáctanos para pedidos
        </Text>
        <Text style={styles.pageNumber}>
          Página {pageNumber} de {totalPages}
        </Text>
      </View>
    </Page>
  );
}

export function CatalogPDF({ products, logoUrl }: { products: ProductData[]; logoUrl?: string }) {
  const categories = [...new Set(products.map((p) => p.category))].filter((c) => c !== "-");

  // Build pages: each category on separate page(s), 9 products max per page
  const contentPages: { category: string; products: ProductData[] }[] = [];
  categories.forEach((category) => {
    const catProducts = products.filter((p) => p.category === category);
    const chunks = chunkArray(catProducts, 12);
    chunks.forEach((chunk) => {
      contentPages.push({ category, products: chunk });
    });
  });

  const totalPages = 1 + contentPages.length; // cover + content

  return (
    <Document>
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverContent}>
          {logoUrl && <Image style={styles.coverLogo} src={logoUrl} />}
          <Text style={styles.coverTitle}>Mundo Decants{'\n'}Nicaragua</Text>
          <View style={styles.coverDivider} />
          <Text style={styles.coverSubtitle}>
            Catálogo de Fragancias{'\n'}Descubre nuestra colección exclusiva de decants
          </Text>
          <Text style={styles.coverInfo}>
            Presentaciones disponibles: 5ml y 10ml{'\n'}
            Perfumes Nicho • Diseñador • Árabes
          </Text>
        </View>
      </Page>

      {contentPages.map((cp, i) => (
        <ContentPage
          key={`${cp.category}-${i}`}
          category={cp.category}
          products={cp.products}
          pageNumber={i + 2}
          totalPages={totalPages}
          logoUrl={logoUrl}
        />
      ))}
    </Document>
  );
}
