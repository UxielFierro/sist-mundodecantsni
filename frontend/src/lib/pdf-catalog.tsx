import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const colors = {
  noir: "#0c0a09",
  charcoal: "#1c1917",
  gold: "#c9a23b",
  goldDark: "#8c6a16",
  goldBg: "#faf5e6",
  goldBorder: "#e8d7a8",
  ivory: "#faf8f4",
  white: "#ffffff",
  muted: "#78716c",
  stoneLight: "#a8a29e",
  border: "#e7e2d8",
};

const styles = StyleSheet.create({
  // ==================== COVER PAGE ====================
  coverPage: {
    backgroundColor: colors.noir,
    padding: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  coverOuterFrame: {
    flex: 1,
    width: "100%",
    borderWidth: 1.5,
    borderColor: colors.gold,
    padding: 6,
  },
  coverInnerFrame: {
    flex: 1,
    width: "100%",
    borderWidth: 0.6,
    borderColor: "rgba(201, 162, 59, 0.45)",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 46,
    paddingHorizontal: 38,
  },
  coverTopLabel: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: colors.gold,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  coverCenter: {
    alignItems: "center",
    width: "100%",
  },
  coverLogo: {
    width: 135,
    height: 135,
    objectFit: "contain",
    borderRadius: 68,
    marginBottom: 24,
  },
  coverTitle: {
    fontFamily: "Times-Bold",
    fontSize: 40,
    color: colors.white,
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 4,
  },
  coverTitleSub: {
    fontFamily: "Times-Italic",
    fontSize: 22,
    color: colors.gold,
    textAlign: "center",
    marginBottom: 22,
  },
  coverDivider: {
    width: 72,
    height: 1.5,
    backgroundColor: colors.gold,
    marginBottom: 22,
  },
  coverSubtitle: {
    fontFamily: "Helvetica",
    fontSize: 12,
    color: "#d6d3d1",
    textAlign: "center",
    lineHeight: 1.6,
    marginBottom: 20,
    maxWidth: 360,
  },
  coverCategoriesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
    marginBottom: 16,
  },
  coverCategoryPill: {
    fontFamily: "Helvetica",
    fontSize: 8.5,
    color: colors.gold,
    borderWidth: 0.7,
    borderColor: "rgba(201, 162, 59, 0.55)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  coverBottom: {
    alignItems: "center",
    width: "100%",
    borderTopWidth: 0.6,
    borderTopColor: "rgba(201, 162, 59, 0.3)",
    paddingTop: 18,
  },
  coverEdition: {
    fontFamily: "Times-Italic",
    fontSize: 10,
    color: colors.stoneLight,
    marginBottom: 6,
  },
  coverContact: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: colors.gold,
    letterSpacing: 0.8,
  },

  // ==================== CONTENT PAGES ====================
  contentPage: {
    paddingTop: 22,
    paddingBottom: 34,
    paddingHorizontal: 28,
    backgroundColor: colors.white,
  },
  header: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorder,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerLogo: {
    width: 24,
    height: 24,
    objectFit: "contain",
    borderRadius: 12,
  },
  headerTitle: {
    fontFamily: "Times-Bold",
    fontSize: 13,
    color: colors.charcoal,
  },
  headerSubtitle: {
    fontFamily: "Helvetica",
    fontSize: 6.5,
    color: colors.goldDark,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  headerRight: {
    fontFamily: "Helvetica",
    fontSize: 7,
    color: colors.muted,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.charcoal,
  },
  categoryLabel: {
    fontFamily: "Times-Bold",
    fontSize: 13,
    color: colors.charcoal,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  categoryCount: {
    fontFamily: "Helvetica",
    fontSize: 7.5,
    color: colors.goldDark,
  },
  productRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  productCard: {
    width: "31.5%",
    height: 162,
    marginRight: "2.75%",
    padding: 7,
    borderWidth: 0.8,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: colors.white,
    position: "relative",
    justifyContent: "space-between",
  },
  productCardLast: {
    width: "31.5%",
    height: 162,
    marginRight: 0,
    padding: 7,
    borderWidth: 0.8,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: colors.white,
    position: "relative",
    justifyContent: "space-between",
  },
  imageBox: {
    width: "100%",
    height: 68,
    backgroundColor: colors.ivory,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    marginBottom: 4,
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  productNoImageText: {
    fontFamily: "Times-Roman",
    fontSize: 22,
    color: "#d6d3d1",
  },
  productBrand: {
    fontFamily: "Helvetica-Bold",
    fontSize: 5.8,
    color: colors.goldDark,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 1,
  },
  productName: {
    fontFamily: "Times-Bold",
    fontSize: 8.2,
    color: colors.charcoal,
    lineHeight: 1.2,
    marginBottom: 2,
  },
  productNotes: {
    fontFamily: "Times-Italic",
    fontSize: 6.2,
    color: colors.muted,
    lineHeight: 1.2,
    marginBottom: 3,
  },
  productPrices: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    marginTop: 2,
  },
  priceTag: {
    fontFamily: "Helvetica-Bold",
    fontSize: 6.5,
    color: colors.goldDark,
    backgroundColor: colors.goldBg,
    borderWidth: 0.5,
    borderColor: colors.goldBorder,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 3,
  },
  codesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    marginTop: 2,
  },
  variantCode: {
    fontFamily: "Helvetica",
    fontSize: 5,
    color: colors.stoneLight,
  },
  soldOutOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(12, 10, 9, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  soldOutBadge: {
    backgroundColor: colors.noir,
    borderWidth: 1,
    borderColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
  },
  soldOutText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: colors.gold,
    letterSpacing: 2,
  },
  footer: {
    position: "absolute",
    bottom: 14,
    left: 28,
    right: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.8,
    borderTopColor: colors.goldBorder,
    paddingTop: 6,
  },
  footerText: {
    fontFamily: "Helvetica",
    fontSize: 6.5,
    color: colors.muted,
  },
  pageNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 6.5,
    color: colors.goldDark,
  },

  // ==================== BACK COVER PAGE ====================
  backPage: {
    backgroundColor: colors.noir,
    padding: 26,
  },
  backInner: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(201, 162, 59, 0.65)",
    paddingVertical: 40,
    paddingHorizontal: 38,
    justifyContent: "space-between",
  },
  backSection: {
    marginBottom: 18,
  },
  backKicker: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: colors.gold,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  backTitle: {
    fontFamily: "Times-Bold",
    fontSize: 22,
    color: colors.white,
    marginBottom: 8,
  },
  backText: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#d6d3d1",
    lineHeight: 1.6,
  },
  sprayGrid: {
    flexDirection: "row",
    gap: 14,
    marginTop: 12,
  },
  sprayCard: {
    flex: 1,
    borderWidth: 0.8,
    borderColor: "rgba(201, 162, 59, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  spraySize: {
    fontFamily: "Times-Bold",
    fontSize: 15,
    color: colors.gold,
    marginBottom: 4,
  },
  sprayCount: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: colors.white,
    marginBottom: 2,
  },
  sprayDuration: {
    fontFamily: "Helvetica",
    fontSize: 8.5,
    color: colors.stoneLight,
  },
  stepsBox: {
    borderTopWidth: 0.6,
    borderTopColor: "rgba(201, 162, 59, 0.35)",
    paddingTop: 16,
    marginBottom: 14,
  },
  stepLine: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#e7e5e4",
    marginBottom: 6,
    lineHeight: 1.5,
  },
  stepNum: {
    fontFamily: "Times-Bold",
    color: colors.gold,
  },
  contactBox: {
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: "rgba(201, 162, 59, 0.08)",
    borderRadius: 8,
    padding: 18,
    alignItems: "center",
  },
  contactTitle: {
    fontFamily: "Times-Bold",
    fontSize: 15,
    color: colors.white,
    marginBottom: 8,
  },
  contactHighlight: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: colors.gold,
    marginBottom: 6,
  },
  contactDetails: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#d6d3d1",
    textAlign: "center",
    lineHeight: 1.6,
  },
});

export interface VariantData {
  presentation: string;
  finalPrice: number;
  stock: number;
  codigo: string;
}

export interface ProductData {
  codigo: string;
  name: string;
  category: string;
  brand: string;
  olfactoryNotes?: string | null;
  imageUrl?: string;
  variants: VariantData[];
}

function truncateText(text: string, maxLen: number): string {
  const clean = text.trim();
  if (clean.length <= maxLen) return clean;
  return `${clean.slice(0, maxLen - 1).trim()}…`;
}

function ProductCard({ product, isLast }: { product: ProductData; isLast: boolean }) {
  const soldOut = product.variants.every((v) => v.stock === 0);
  const pricedVariants = product.variants.filter((v) => v.finalPrice > 0);

  return (
    <View style={isLast ? styles.productCardLast : styles.productCard} wrap={false}>
      <View>
        <View style={styles.imageBox}>
          {product.imageUrl ? (
            <Image style={styles.productImage} src={product.imageUrl} />
          ) : (
            <Text style={styles.productNoImageText}>{product.name.charAt(0).toUpperCase()}</Text>
          )}
        </View>
        {product.brand && product.brand !== "-" && (
          <Text style={styles.productBrand}>{truncateText(product.brand, 26)}</Text>
        )}
        <Text style={styles.productName}>{truncateText(product.name, 38)}</Text>
        {product.olfactoryNotes && (
          <Text style={styles.productNotes}>{truncateText(product.olfactoryNotes, 48)}</Text>
        )}
      </View>

      <View>
        <View style={styles.productPrices}>
          {pricedVariants.slice(0, 3).map((v) => (
            <Text key={v.codigo} style={styles.priceTag}>
              {v.presentation} · C${v.finalPrice.toFixed(0)}
            </Text>
          ))}
        </View>
        <View style={styles.codesRow}>
          {product.variants.slice(0, 3).map((v) => (
            <Text key={`code-${v.codigo}`} style={styles.variantCode}>
              {v.codigo}
            </Text>
          ))}
        </View>
      </View>

      {soldOut && (
        <View style={styles.soldOutOverlay}>
          <View style={styles.soldOutBadge}>
            <Text style={styles.soldOutText}>AGOTADO</Text>
          </View>
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
  totalInCategory,
  products,
  pageNumber,
  totalPages,
  logoUrl,
}: {
  category: string;
  totalInCategory: number;
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
            <Text style={styles.headerTitle}>Mundo Decants Nicaragua</Text>
            <Text style={styles.headerSubtitle}>Catálogo Oficial de Fragancias</Text>
          </View>
        </View>
        <Text style={styles.headerRight}>WhatsApp +505 7789-2532</Text>
      </View>

      <View style={styles.categoryHeader}>
        <Text style={styles.categoryLabel}>{category}</Text>
        <Text style={styles.categoryCount}>
          {totalInCategory} {totalInCategory === 1 ? "fragancia" : "fragancias"}
        </Text>
      </View>

      {rows.map((row, i) => (
        <View key={i} style={styles.productRow}>
          {row.map((p, j) => (
            <ProductCard key={p.codigo} product={p} isLast={j === 2 || j === row.length - 1} />
          ))}
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          @mundodecants_nicaragua · Envíos a toda Nicaragua · 100% Originales
        </Text>
        <Text style={styles.pageNumber}>
          Página {pageNumber} de {totalPages}
        </Text>
      </View>
    </Page>
  );
}

export function CatalogPDF({
  products,
  logoUrl,
  editionLabel,
}: {
  products: ProductData[];
  logoUrl?: string;
  editionLabel?: string;
}) {
  const categories = [...new Set(products.map((p) => p.category))].filter((c) => c !== "-");

  const contentPages: {
    category: string;
    totalInCategory: number;
    products: ProductData[];
  }[] = [];

  categories.forEach((category) => {
    const catProducts = products.filter((p) => p.category === category);
    const chunks = chunkArray(catProducts, 12);
    chunks.forEach((chunk) => {
      contentPages.push({
        category,
        totalInCategory: catProducts.length,
        products: chunk,
      });
    });
  });

  // Cover + Content pages + Back cover
  const totalPages = 2 + contentPages.length;

  return (
    <Document
      title="Catálogo Mundo Decants Nicaragua"
      author="Mundo Decants Nicaragua"
      subject="Catálogo oficial de perfumes y decants originales"
    >
      {/* PORTADA */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverOuterFrame}>
          <View style={styles.coverInnerFrame}>
            <Text style={styles.coverTopLabel}>Alta Perfumería · 100% Auténtica</Text>

            <View style={styles.coverCenter}>
              {logoUrl && <Image style={styles.coverLogo} src={logoUrl} />}
              <Text style={styles.coverTitle}>Mundo Decants</Text>
              <Text style={styles.coverTitleSub}>Nicaragua</Text>
              <View style={styles.coverDivider} />
              <Text style={styles.coverSubtitle}>
                Catálogo Oficial de Fragancias{"\n"}
                Descubre aromas exclusivos en presentaciones de decant con envío a todo el país.
              </Text>

              {categories.length > 0 && (
                <View style={styles.coverCategoriesWrap}>
                  {categories.slice(0, 6).map((cat) => (
                    <Text key={cat} style={styles.coverCategoryPill}>
                      {cat}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.coverBottom}>
              {editionLabel && <Text style={styles.coverEdition}>Edición {editionLabel}</Text>}
              <Text style={styles.coverContact}>
                WhatsApp +505 7789-2532 · @mundodecants_nicaragua
              </Text>
            </View>
          </View>
        </View>
      </Page>

      {/* PÁGINAS DE CONTENIDO */}
      {contentPages.map((cp, i) => (
        <ContentPage
          key={`${cp.category}-${i}`}
          category={cp.category}
          totalInCategory={cp.totalInCategory}
          products={cp.products}
          pageNumber={i + 2}
          totalPages={totalPages}
          logoUrl={logoUrl}
        />
      ))}

      {/* CONTRAPORTADA */}
      <Page size="A4" style={styles.backPage}>
        <View style={styles.backInner}>
          <View>
            <View style={styles.backSection}>
              <Text style={styles.backKicker}>Experiencia Mundo Decants</Text>
              <Text style={styles.backTitle}>¿Qué es un Decant?</Text>
              <Text style={styles.backText}>
                Un decant es una porción cuidadosamente extraída de un perfume 100% original hacia
                un atomizador de viaje de 5 ml o 10 ml. Te permite probar fragancias nicho, de
                diseñador y árabes de alta gama antes de invertir en la botella completa, o llevar
                tu aroma favorito siempre contigo.
              </Text>
            </View>

            <View style={styles.backSection}>
              <Text style={styles.backKicker}>Guía de Rendimiento</Text>
              <View style={styles.sprayGrid}>
                <View style={styles.sprayCard}>
                  <Text style={styles.spraySize}>Decant 5 ml</Text>
                  <Text style={styles.sprayCount}>~75 sprays</Text>
                  <Text style={styles.sprayDuration}>Aprox. 1 mes de uso</Text>
                </View>
                <View style={styles.sprayCard}>
                  <Text style={styles.spraySize}>Decant 10 ml</Text>
                  <Text style={styles.sprayCount}>~150 sprays</Text>
                  <Text style={styles.sprayDuration}>Aprox. 2 meses de uso</Text>
                </View>
              </View>
            </View>

            <View style={styles.stepsBox}>
              <Text style={styles.backKicker}>¿Cómo hacer tu pedido?</Text>
              <Text style={styles.stepLine}>
                <Text style={styles.stepNum}>01. </Text>Elegí tus fragancias favoritas y anotá el
                tamaño o código (ej. MDN0012).
              </Text>
              <Text style={styles.stepLine}>
                <Text style={styles.stepNum}>02. </Text>Escribinos por WhatsApp o armá tu pedido
                directamente en nuestra web.
              </Text>
              <Text style={styles.stepLine}>
                <Text style={styles.stepNum}>03. </Text>Coordinamos entrega en Managua, retiro en
                colectivo o envío a todo Nicaragua.
              </Text>
            </View>
          </View>

          <View style={styles.contactBox}>
            <Text style={styles.contactTitle}>Haz tu pedido hoy</Text>
            <Text style={styles.contactHighlight}>WhatsApp: +505 7789-2532</Text>
            <Text style={styles.contactDetails}>
              Instagram & TikTok: @mundodecants_nicaragua{"\n"}
              Colonia Centroamérica, de los Semáforos de Lozelsa 20 varas abajo, edificio KTM —
              Managua, Nicaragua
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
