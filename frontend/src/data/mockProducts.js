export const CATEGORIES = [
  {
    id: 1,
    nombre: "Equipamiento Médico",
    descripcion: "Equipos de diagnóstico y atención para clínicas y hospitales",
    emoji: "🏥",
    colorBorde: "border-pulse",
    colorFondo: "bg-pulse/10",
    colorTexto: "text-pulse",
    imagen:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    nombre: "Mobiliario de Laboratorio y Clínica",
    descripcion: "Camillas, vitrinas, sillas ergonómicas y mobiliario sanitario",
    emoji: "🧪",
    colorBorde: "border-navy-soft",
    colorFondo: "bg-navy-soft/10",
    colorTexto: "text-navy",
    imagen:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    nombre: "Insumos Médicos",
    descripcion: "Descartables, kits de esterilización y bioseguridad",
    emoji: "💉",
    colorBorde: "border-brand-green",
    colorFondo: "bg-brand-green/10",
    colorTexto: "text-brand-green-dark",
    imagen:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    nombre: "Material Corporativo y Limpieza",
    descripcion: "Papelería, escritorio y productos de higiene para empresas",
    emoji: "🧼",
    colorBorde: "border-brand-green",
    colorFondo: "bg-brand-green/10",
    colorTexto: "text-brand-green-dark",
    imagen:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
  },
]

export const WHATSAPP_NUMBER = "59171814954"
export const EMAIL_CONTACT = "info@estab.com.bo"
export const ADDRESS_FULL = "Ciudad Satélite C. Fernando Caballero # 1158, El Alto, Bolivia"

export const buildWhatsAppUrl = (producto) => {
  const mensaje = `Hola, deseo consultar por el producto: ${producto.nombre}`
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
      const cat = CATEGORIES.find((c) => String(c.id) === String(p.categoria_id))
      return `${i + 1}. ${p.nombre} (${cat?.nombre || "Sin categoría"})`
    })
    .join("\n")
  const mensaje = `Hola Estab Group S.R.L., quisiera solicitar una cotización para los siguientes productos seleccionados de su catálogo web:\n${lineas}\nPor favor, quedo atento a su propuesta y disponibilidad.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
}
