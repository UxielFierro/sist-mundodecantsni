import ExcelJS from "exceljs";

export async function createCatalogExcel(
  data: {
    codigo: string;
    name: string;
    category: string;
    brand: string;
    presentation: string;
    unitCost: number;
    finalPrice: number;
    stock: number;
  }[]
) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Catálogo MDN");

  sheet.columns = [
    { header: "Código", key: "codigo", width: 14 },
    { header: "Producto", key: "name", width: 40 },
    { header: "Categoría", key: "category", width: 14 },
    { header: "Marca", key: "brand", width: 20 },
    { header: "Presentación", key: "presentation", width: 14 },
    { header: "Costo Unit.", key: "unitCost", width: 12 },
    { header: "Precio Final", key: "finalPrice", width: 14 },
    { header: "Stock", key: "stock", width: 8 },
  ];

  sheet.getRow(1).font = { bold: true };
  data.forEach((row) => sheet.addRow(row));

  // Second sheet: contact info
  const infoSheet = workbook.addWorksheet("Contacto");
  infoSheet.getColumn(1).width = 20;
  infoSheet.getColumn(2).width = 50;

  const infoData: [string, string][] = [
    ["Mundo Decants Nicaragua", ""],
    ["", ""],
    ["Redes Sociales", ""],
    ["WhatsApp", "https://wa.me/message/7ZODFUDVVJZSH1"],
    ["Instagram", "https://www.instagram.com/mundodecants_nicaragua"],
    ["TikTok", "https://www.tiktok.com/@mundodecants_nicaragua"],
    ["Facebook", "https://www.facebook.com/share/1HoTQ938Nn"],
    ["", ""],
    ["Ubicación", ""],
    ["Dirección", "Colonia Centroamerica, De los Semáforos de Lozelsa 20varas abajo en edificio KTM"],
    ["Google Maps", "https://maps.app.goo.gl/ChcfVXpJgUnzkcwc9"],
  ];

  infoData.forEach(([label, value], i) => {
    const row = infoSheet.addRow([label, value]);
    if (label && !value) {
      row.font = { bold: true, size: 13 };
    }
  });

  return workbook;
}

export async function createInventoryExcel(
  data: {
    codigo: string;
    product: string;
    presentation: string;
    stock: number;
    minStock: number;
    finalPrice: number;
    status: string;
  }[]
) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Inventario MDN");

  sheet.columns = [
    { header: "Código", key: "codigo", width: 14 },
    { header: "Producto", key: "product", width: 40 },
    { header: "Presentación", key: "presentation", width: 14 },
    { header: "Stock", key: "stock", width: 8 },
    { header: "Stock Mínimo", key: "minStock", width: 12 },
    { header: "Precio", key: "finalPrice", width: 12 },
    { header: "Estado", key: "status", width: 14 },
  ];

  sheet.getRow(1).font = { bold: true };
  data.forEach((row) => {
    const r = sheet.addRow(row);
    if (row.status === "Sin stock") r.eachCell((c) => { c.font = { color: { argb: "FFFF0000" } }; });
    if (row.status === "Stock bajo") r.eachCell((c) => { c.font = { color: { argb: "FFCC8800" } }; });
  });

  return workbook;
}

export async function createSalesReportExcel(
  data: {
    location: string;
    period: string;
    product: string;
    presentation: string;
    quantitySold: number;
    unitPrice: number;
    total: number;
  }[]
) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Reporte Ventas");

  sheet.columns = [
    { header: "Espacio", key: "location", width: 20 },
    { header: "Período", key: "period", width: 20 },
    { header: "Producto", key: "product", width: 40 },
    { header: "Presentación", key: "presentation", width: 14 },
    { header: "Vendidos", key: "quantitySold", width: 10 },
    { header: "Precio Unit.", key: "unitPrice", width: 14 },
    { header: "Total", key: "total", width: 14 },
  ];

  sheet.getRow(1).font = { bold: true };
  data.forEach((row) => sheet.addRow(row));

  return workbook;
}
