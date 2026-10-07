export const CATEGORIES = [
  {
    id: 1,
    nombre: "Equipamiento y Prendas Médicas",
    descripcion: "Equipamiento médico, insumos, prendas y ropa hospitalaria",
    emoji: "🩺",
    icono: "Stethoscope",
    colorBorde: "border-pulse",
    colorFondo: "bg-pulse/10",
    colorTexto: "text-pulse",
    gradiente: "from-amber-500 to-orange-700",
    imagen:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    nombre: "Mobiliario de Oficina y Clínica",
    descripcion: "Mobiliario ergonómico de oficina, clínico y de laboratorio",
    emoji: "🪑",
    icono: "Building2",
    colorBorde: "border-navy-soft",
    colorFondo: "bg-navy-soft/10",
    colorTexto: "text-navy",
    gradiente: "from-cyan-500 to-sky-800",
    imagen:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    nombre: "Equipos de Computación y Audiovisual",
    descripcion: "Computadoras, laptops, material educativo y equipos audiovisuales",
    emoji: "💻",
    icono: "Laptop",
    colorBorde: "border-brand-green",
    colorFondo: "bg-brand-green/10",
    colorTexto: "text-brand-green-dark",
    gradiente: "from-emerald-500 to-teal-800",
    imagen:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    nombre: "Material de Escritorio y Papelería",
    descripcion: "Material de escritorio, suministros de oficina y papelería general",
    emoji: "📄",
    icono: "FileText",
    colorBorde: "border-brand-green",
    colorFondo: "bg-brand-green/10",
    colorTexto: "text-brand-green-dark",
    gradiente: "from-indigo-500 to-violet-800",
    imagen:
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    nombre: "Material de Limpieza y Corporativo",
    descripcion: "Insumos de higiene, desinfectantes y productos corporativos",
    emoji: "✨",
    icono: "Sparkles",
    colorBorde: "border-brand-green",
    colorFondo: "bg-brand-green/10",
    colorTexto: "text-brand-green-dark",
    gradiente: "from-sky-500 to-cyan-800",
    imagen:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    nombre: "Maquinaria Industrial y Ferretería",
    descripcion: "Maquinaria pesada, industrial y herramientas de ferretería",
    emoji: "🔧",
    icono: "Wrench",
    colorBorde: "border-pulse",
    colorFondo: "bg-pulse/10",
    colorTexto: "text-pulse",
    gradiente: "from-rose-500 to-red-800",
    imagen:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    nombre: "Electrodomésticos y Material Eléctrico",
    descripcion: "Línea blanca, electrodomésticos e instalaciones eléctricas",
    emoji: "⚡",
    icono: "Zap",
    colorBorde: "border-pulse",
    colorFondo: "bg-pulse/10",
    colorTexto: "text-pulse",
    gradiente: "from-orange-500 to-amber-700",
    imagen:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    nombre: "Confección y Textiles en General",
    descripcion: "Confección de textiles, uniformes y ropa en general",
    emoji: "✂️",
    icono: "Scissors",
    colorBorde: "border-navy-soft",
    colorFondo: "bg-navy-soft/10",
    colorTexto: "text-navy",
    gradiente: "from-violet-500 to-fuchsia-800",
    imagen:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80",
  },
]

export const UNIDADES = ["UNIDAD", "PAQUETE", "FRASCO", "CAJA"]

export const PROCEDENCIAS_SUGERIDAS = [
  "NACIONAL",
  "PERÚ",
  "BRASIL",
  "IMPORTADO",
  "CHINA",
  "ESTADOS UNIDOS",
]

export const WHATSAPP_NUMBER = "59171814954"
export const EMAIL_CONTACT = "info@estab.com.bo"
export const ADDRESS_FULL = "Ciudad Satélite C. Fernando Caballero # 1158, El Alto, Bolivia"

export const findCategoria = (id, nombre) =>
  CATEGORIES.find((c) => String(c.id) === String(id)) ||
  (nombre ? CATEGORIES.find((c) => c.nombre === nombre) : undefined)

export const buildWhatsAppUrl = (producto) => {
  const extras = [
    producto.marca ? `Marca: ${producto.marca}` : "",
    producto.procedencia ? `Procedencia: ${producto.procedencia}` : "",
  ]
    .filter(Boolean)
    .join(" · ")
  const mensaje = `Hola, deseo consultar por el producto: ${producto.nombre}${
    extras ? ` (${extras})` : ""
  }`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
}

export const buildGeneralWhatsAppUrl = () => {
  const mensaje =
    "Hola, deseo más información sobre sus productos y servicios de equipamiento médico e insumos."
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
}

export const buildQuoteWhatsAppUrl = (producto) => {
  const mensaje = `Cotización Estab Group: ${producto.nombre} - Precio estimado: ${producto.precio_referencial} Bs. ¿Desea coordinar la entrega?`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
}

export const buildMultiQuoteWhatsAppUrl = (productos) => {
  const lineas = productos
    .map((p, i) => {
      const cat = findCategoria(p.categoria_id, p.categoria_nombre)
      const extras = [p.marca ? `marca ${p.marca}` : "", p.procedencia ? `proc. ${p.procedencia}` : ""]
        .filter(Boolean)
        .join(" · ")
      return `${i + 1}. ${p.nombre} (${cat?.nombre || "Sin categoría"}${
        extras ? ` · ${extras}` : ""
      })`
    })
    .join("\n")
  const mensaje = `Hola Estab Group S.R.L., quisiera solicitar una cotización para los siguientes productos seleccionados de su catálogo web:\n${lineas}\nPor favor, quedo atento a su propuesta y disponibilidad.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
}
