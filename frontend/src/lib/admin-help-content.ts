export interface HelpFaq {
  question: string;
  answer: string;
}

export interface ModuleHelpGuide {
  id: string;
  matchPrefix: string;
  title: string;
  shortTitle: string;
  summary: string;
  steps: { title: string; detail: string }[];
  tips: string[];
  faqs: HelpFaq[];
}

export const ADMIN_HELP_GUIDES: ModuleHelpGuide[] = [
  {
    id: "dashboard",
    matchPrefix: "/admin",
    title: "Dashboard General",
    shortTitle: "Dashboard",
    summary:
      "Vista ejecutiva del estado de Mundo Decants Nicaragua: productos activos, alertas de stock, más vendidos y movimientos recientes.",
    steps: [
      {
        title: "Revisá tus alertas de stock al iniciar el día",
        detail:
          "Hacé clic en las tarjetas de Stock Bajo o Sin Stock para saltar directamente al inventario filtrado y ver qué reabastecer.",
      },
      {
        title: "Analizá los perfumes más vendidos",
        detail:
          "El gráfico de Más Vendidos se alimenta automáticamente de tus Reportes de Ventas registrados en los distintos espacios.",
      },
      {
        title: "Controlá los movimientos recientes",
        detail:
          "Cada ingreso, ajuste, entrega a espacio, venta o regalía queda registrado con fecha y usuario responsable.",
      },
    ],
    tips: [
      "Todas las tarjetas superiores son botones interactivos que te llevan al módulo correspondiente.",
      "Usá los accesos rápidos superiores (+ Nuevo Producto y Categorías y Marcas) para cargar perfumes en segundos.",
    ],
    faqs: [
      {
        question: "¿Por qué un producto aparece en 'Stock Bajo'?",
        answer:
          "Aparece en Stock Bajo cuando su cantidad en Bodega Central es mayor a 0 pero menor o igual al Stock Mínimo que configuraste en /admin/inventario.",
      },
      {
        question: "¿Qué diferencia hay entre Stock Bajo y Sin Stock?",
        answer:
          "Sin Stock significa 0 unidades disponibles (se muestra como Agotado en la tienda). Stock Bajo significa que aún hay unidades pero ya llegó al límite de alerta.",
      },
    ],
  },
  {
    id: "productos",
    matchPrefix: "/admin/productos",
    title: "Productos, Variantes y Tarjetas para Redes",
    shortTitle: "Productos",
    summary:
      "Creá y editá tus perfumes, asigná categorías y marcas, cargá fotos, administrá presentaciones (5ml, 10ml, etc.) y descargá tarjetas listas para redes sociales.",
    steps: [
      {
        title: "Creá el producto base",
        detail:
          "Ingresá nombre, notas olfativas (separadas por coma) y reseña. Si falta una categoría o marca, usá el botón '+ Nueva' sin salir del formulario.",
      },
      {
        title: "Agregá sus presentaciones (variantes)",
        detail:
          "Dentro del detalle del producto, sumá tamaños como 2ml, 5ml, 10ml o 25ml. Al crear cada variante, el sistema inicializa automáticamente su inventario en 0.",
      },
      {
        title: "Subí fotos y elegí la principal",
        detail:
          "Podés subir varias fotos. La que marques como Principal será la portada en la tienda pública, el catálogo PDF y las tarjetas de redes.",
      },
      {
        title: "Generá tu tarjeta para Instagram / WhatsApp",
        detail:
          "En el panel derecho del producto elegí Story 9:16 o Post 4:5 (Noir Dorado o Editorial), descargá el PNG en HD y copiá el texto listo con 1 clic.",
      },
    ],
    tips: [
      "Las tarjetas para redes se descargan directo en tu dispositivo y NO ocupan espacio en Supabase Storage.",
      "Desde la tabla de variantes del producto podés usar 'Calcular desde Frasco' o editar precios sin cambiar de pantalla.",
      "Si desactivás 'Catálogo', el perfume sigue existiendo en tu inventario interno pero no se muestra a clientes.",
    ],
    faqs: [
      {
        question: "¿Qué significan los códigos MDN y SC?",
        answer:
          "MDN (ej. MDN0042) es el código oficial correlativo del sistema. SC ('Sin Código') se usa para productos temporales; cuando quieras puedes convertir una variante SC en código oficial con el botón 'Oficializar'.",
      },
      {
        question: "¿Cómo pongo un perfume para que no salga la guía de sprays?",
        answer:
          "Marcá la casilla 'Insumo' o 'Full' (botella completa) en el producto y la tienda ocultará automáticamente la guía de sprays de 5ml/10ml.",
      },
    ],
  },
  {
    id: "catalogos",
    matchPrefix: "/admin/catalogos",
    title: "Catálogos y Configuración Global",
    shortTitle: "Catálogos",
    summary:
      "Autogestioná tus Categorías, Marcas, Presentaciones y los parámetros estándar de costos (insumos, envío y % POS) sin tocar código.",
    steps: [
      {
        title: "Categorías",
        detail:
          "Agregá o editá colecciones (Nicho, Diseñador, Árabe, Damas, etc.). La descripción que escribás aquí aparece automáticamente en la portada y páginas de colección.",
      },
      {
        title: "Marcas",
        detail:
          "Mantené tu listado de casas perfumeras ordenado y buscable. Cada marca muestra cuántos productos tiene asociados.",
      },
      {
        title: "Presentaciones",
        detail:
          "Creá nuevos tamaños (ej. 3 ml, 15 ml, 30 ml) indicando unidad ('ml' o 'unidad'), valor numérico y orden de visualización.",
      },
      {
        title: "Configuración de Costos",
        detail:
          "Definí tus valores globales de insumos por frasco, envío por frasco y % de comisión POS. Estos valores precargan automáticamente los cálculos en Precios.",
      },
    ],
    tips: [
      "Por seguridad, el sistema no permite borrar una categoría, marca o presentación que todavía tenga productos asignados.",
      "Si tenés más de 4 categorías activas, el menú superior de la tienda agrupa las adicionales automáticamente bajo 'Más' para mantener el diseño limpio.",
    ],
    faqs: [
      {
        question: "¿Si cambio el % POS o insumos en Configuración, cambian los precios ya guardados?",
        answer:
          "No, tus precios históricos y vigentes no se alteran solos. Los nuevos valores se aplican automáticamente a partir de los próximos precios que calcules o actualices.",
      },
    ],
  },
  {
    id: "precios",
    matchPrefix: "/admin/precios",
    title: "Precios y Rentabilidad",
    shortTitle: "Precios",
    summary:
      "Calculá costos reales por mililitro a partir del frasco completo, aplicá precios redondeados a todas las presentaciones y auditá cada cambio en el historial.",
    steps: [
      {
        title: "Usá la Calculadora Frasco → Decants",
        detail:
          "Elegí un perfume, ingresá el costo del frasco completo y su volumen (ej. 100 ml). El sistema suma insumos + envío + % POS, saca el costo por ml y sugiere precios redondeados (C$10 o C$50) para todas sus variantes.",
      },
      {
        title: "Ajustá precios puntuales con Editar / Fijar Precio",
        detail:
          "En cualquier fila podés calcular 'Desde Frasco' o cambiar a la pestaña 'Precio Fijo Directo' para insumos, promociones o perfumes de alta demanda.",
      },
      {
        title: "Revisá márgenes y sin precio",
        detail:
          "Usá las píldoras 'Sin precio' y 'Margen bajo (<25%)' para detectar rápidamente variantes que necesitan ajuste.",
      },
      {
        title: "Consultá el Historial de Precios",
        detail:
          "Tocá el ícono de reloj en cualquier variante para ver cuándo cambió de precio, cuánto subió/bajó, el motivo y quién lo modificó.",
      },
    ],
    tips: [
      "En la calculadora podés sobreescribir manualmente el precio de cualquier tamaño antes de dar clic en 'Aplicar'.",
      "Al guardar un precio, podés escribir un motivo opcional (ej. 'Nuevo lote' o 'Promo') para recordar luego por qué cambió.",
    ],
    faqs: [
      {
        question: "¿Por qué algunos registros dicen 'Precio fijo' en la columna Ganancia?",
        answer:
          "Son variantes que se guardaron sin costo base de frasco (o en modo Precio Fijo Directo). Cuando les asignes el costo del frasco, verás su costo/ml y ganancia exacta.",
      },
    ],
  },
  {
    id: "inventario",
    matchPrefix: "/admin/inventario",
    title: "Inventario Global y Kardex",
    shortTitle: "Inventario",
    summary:
      "Controlá las existencias de tu Bodega Central, configurá alertas de stock mínimo, registrá compras/ajustes con motivo y revisá el historial de movimientos.",
    steps: [
      {
        title: "Filtrá por estado o categoría",
        detail:
          "Alterná entre Todos, Disponible, Stock Bajo y Sin Stock, o buscá directamente por código MDN o nombre del perfume.",
      },
      {
        title: "Registrá ingresos o ajustes físicos",
        detail:
          "Hacé clic en 'Ajustar' para elegir entre '+ Ingreso / Compra' (suma unidades al stock actual) o '= Fijar Stock Exacto' (reemplaza el total tras conteo físico).",
      },
      {
        title: "Configurá el Stock Mínimo",
        detail:
          "Dentro del mismo modal 'Ajustar' podés definir cuántas unidades mínimas querés mantener para recibir alertas en el Dashboard.",
      },
      {
        title: "Auditá el Historial (Kardex)",
        detail:
          "Bajá a la tabla de movimientos recientes (o usá el botón 'Historial (Kardex)') para ver entradas, salidas, entregas y ventas.",
      },
    ],
    tips: [
      "Podés descargar el inventario completo en Excel con el botón 'Exportar Excel' (protegido solo para usuarios con sesión).",
      "Si una variante tiene stock 0 en todas sus presentaciones, la tienda pública la marca automáticamente como Agotado.",
    ],
    faqs: [
      {
        question: "¿El inventario global incluye lo que ya envié a colectivos/espacios?",
        answer:
          "No. Inventario Global es tu Bodega Central. Cuando hacés una Entrega a un espacio, esas unidades se descuentan de Bodega Central y se suman al inventario propio de ese espacio.",
      },
    ],
  },
  {
    id: "espacios",
    matchPrefix: "/admin/espacios",
    title: "Espacios y Colectivos",
    shortTitle: "Espacios",
    summary:
      "Administrá las tiendas, colectivos y bodegas donde distribuís mercadería en consignación o venta, con control de stock independiente por lugar.",
    steps: [
      {
        title: "Creá tus puntos de venta",
        detail:
          "Registrá cada colectivo, tienda o bodega con su tipo y persona de contacto.",
      },
      {
        title: "Inspeccioná el stock asignado",
        detail:
          "Al entrar a un espacio ves exactamente qué perfumes y cuántas unidades tiene actualmente, además de sus entregas y reportes históricos.",
      },
      {
        title: "Realizá ajustes de conteo en el espacio",
        detail:
          "Si hacés auditoría física en un colectivo y hay diferencias, ajustá el stock directamente dentro del espacio dejando un motivo registrado.",
      },
    ],
    tips: [
      "El stock de un espacio sube cuando registrás una Entrega hacia él y baja automáticamente cuando cargás un Reporte de Ventas de ese espacio.",
    ],
    faqs: [
      {
        question: "¿Un ajuste dentro de un espacio afecta la Bodega Central?",
        answer:
          "No, el ajuste en un espacio solo corrige el conteo de ese lugar y deja constancia en el historial de movimientos.",
      },
    ],
  },
  {
    id: "entregas",
    matchPrefix: "/admin/entregas",
    title: "Entregas a Espacios",
    shortTitle: "Entregas",
    summary:
      "Transferí productos desde tu Bodega Central hacia un espacio o colectivo, generando respaldo en Excel y trazabilidad completa.",
    steps: [
      {
        title: "Seleccioná el espacio destino y período",
        detail:
          "Elegí hacia qué colectivo o tienda va el envío y colocá el período (ej. 'Mes de Noviembre 2026').",
      },
      {
        title: "Agregá los productos y cantidades",
        detail:
          "Buscá por código o nombre, indicá cuántas unidades enviás (no permite enviar más de lo disponible en bodega) y confirmá.",
      },
      {
        title: "Exportá la hoja de entrega en Excel",
        detail:
          "Desde el detalle de la entrega podés descargar un Excel formateado con códigos, cantidades y subtotales para firmar o compartir con el espacio.",
      },
    ],
    tips: [
      "Si cometiste un error al registrar una entrega, podés entrar a su detalle y usar 'Revertir entrega': el stock regresa automáticamente a Bodega Central y se descuenta del espacio.",
    ],
    faqs: [
      {
        question: "¿Qué pasa si intento entregar un producto sin stock en bodega?",
        answer:
          "El sistema bloquea la operación y te avisa exactamente cuánto stock disponible hay para evitar inventarios negativos.",
      },
    ],
  },
  {
    id: "reportes",
    matchPrefix: "/admin/reportes",
    title: "Reportes de Ventas",
    shortTitle: "Reportes",
    summary:
      "Registrá las ventas reportadas por cada espacio o colectivo, descontando su inventario automáticamente y llevando control de conciliación.",
    steps: [
      {
        title: "Cargá un nuevo reporte",
        detail:
          "Seleccioná el espacio, el período y colocá las unidades vendidas de cada variante. Al guardar, se descuenta automáticamente del stock de ese espacio.",
      },
      {
        title: "Actualizá el estado de conciliación",
        detail:
          "En la lista de reportes podés cambiar cada reporte entre Pendiente → Confirmado → Conciliado conforme verificás pagos y liquidaciones.",
      },
      {
        title: "Revisá el detalle o exportá a Excel",
        detail:
          "Hacé clic en 'Ver detalle de productos' en cualquier tarjeta para inspeccionar el desglose vendido, o exportá todos los reportes a Excel.",
      },
    ],
    tips: [
      "Los reportes de ventas alimentan el gráfico de 'Más Vendidos' en tu Dashboard principal.",
    ],
    faqs: [
      {
        question: "¿Para qué sirven los estados Pendiente, Confirmado y Conciliado?",
        answer:
          "Te ayudan a llevar orden financiero: Pendiente cuando recién recibís el listado, Confirmado cuando validás las cantidades vendidas y Conciliado cuando ya recibiste el pago del espacio.",
      },
    ],
  },
  {
    id: "regalias",
    matchPrefix: "/admin/regalias",
    title: "Conversión a Regalías",
    shortTitle: "Regalías",
    summary:
      "Convertí mililitros de tu inventario existente en muestras o regalías (ej. 2 ml) descontando el stock original de forma trazable.",
    steps: [
      {
        title: "Elegí el producto y variante origen",
        detail:
          "Seleccioná el perfume y la presentación desde la cual vas a extraer el líquido (el sistema te muestra los ml totales disponibles).",
      },
      {
        title: "Indicá los ml a convertir y presentación destino",
        detail:
          "Escribí cuántos mililitros vas a usar y el tamaño de la regalía (ej. 2 ml). El sistema calcula cuántas muestras estimadas salen.",
      },
      {
        title: "Confirmá la conversión",
        detail:
          "Se descuenta automáticamente el stock origen en Bodega Central y queda el registro en el historial de regalías y en el Kardex.",
      },
    ],
    tips: [
      "Anotá el motivo (ej. 'Cortesía clientes VIP' o 'Evento') para llevar control de cuánto invertís en muestras promocionales.",
    ],
    faqs: [
      {
        question: "¿Cómo calcula cuántas unidades descontar del stock origen?",
        answer:
          "Divide los ml a convertir entre los ml de la presentación origen (redondeando hacia arriba) para asegurar que el inventario refleje las unidades consumidas.",
      },
    ],
  },
];

export function getGuideForPathname(pathname: string): ModuleHelpGuide {
  // Match longest prefix first (so /admin/productos matches before /admin)
  const sorted = [...ADMIN_HELP_GUIDES].sort(
    (a, b) => b.matchPrefix.length - a.matchPrefix.length
  );
  return (
    sorted.find((g) =>
      g.matchPrefix === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(g.matchPrefix)
    ) ?? ADMIN_HELP_GUIDES[0]
  );
}
