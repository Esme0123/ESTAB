export const CATEGORIES = [
  {
    id: "material-escritura",
    nombre: "Material de Escritorio y Limpieza",
    descripcion: "Papelería, insumnos de oficina y artes de higiene",
    emoji: "📦",
    colorBorde: "border-brand-green",
    colorFondo: "bg-brand-green/10",
    colorTexto: "text-brand-green-dark",
  },
  {
    id: "equipamiento-medico",
    nombre: "Equipamiento Médico",
    descripcion: "Equipos e instrumentos para clínicas y laboratorios",
    emoji: "🏥",
    colorBorde: "border-pulse",
    colorFondo: "bg-pulse/10",
    colorTexto: "text-pulse",
  },
  {
    id: "mobiliario-tecnologia",
    nombre: "Mobiliario y Tecnología",
    descripcion: "Escritorios, sillas ergonómicas y equipos de cómputo",
    emoji: "💻",
    colorBorde: "border-navy-soft",
    colorFondo: "bg-navy-soft/10",
    colorTexto: "text-navy",
  },
  {
    id: "importacion",
    nombre: "Importación y Comercialización",
    descripcion: "Importación, asesoría y comercialización industrial",
    emoji: "🚢",
    colorBorde: "border-brand-green",
    colorFondo: "bg-brand-green/10",
    colorTexto: "text-brand-green-dark",
  },
]

export const PRODUCTS = [
  {
    id: 1,
    nombre: "Papelería y Suministros de Oficina",
    categoria: "material-escritura",
    descripcion: "Kit completo de papelería y utiles para equipos de trabajo.",
    imagen_url:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=60",
    especificaciones: [
      "Resmas A4 - 1000 hojas",
      "Archivadores colgantes",
      "Bolígrafos surtidos",
      "Kit notas adhesivas",
    ],
  },
  {
    id: 2,
    nombre: "Kit de Limpieza Profesional",
    categoria: "material-escritura",
    descripcion:
      "Desinfectantes, trapeadores y productos de higiene para oficinas e industria.",
    imagen_url:
      "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=60",
    especificaciones: [
      "Desinfectante galón 5L",
      "Limpador multiusos",
      "Trapeador profesional",
      "Guantes de limpieza",
    ],
  },
  {
    id: 3,
    nombre: "Estetoscopio Profesional",
    categoria: "equipamiento-medico",
    descripcion: "Estetoscopio de alta precisión para profesionales de la salud.",
    imagen_url:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=800&q=60",
    especificaciones: [
      "Tubo de PVC premium",
      "Campana dual 52/35 mm",
      "Olivas suaves",
      "Estuche rígido de regalo",
    ],
  },
  {
    id: 4,
    nombre: "Kit Básico Hospitalario",
    categoria: "equipamiento-medico",
    descripcion: "Set de insumos básicos para clínicas y consultorios médicos.",
    imagen_url:
      "https://picsum.photos/seed/estab-medico/800/600",
    especificaciones: [
      "Termómetro digital",
      "Baumanómetro aneroide",
      "Tijeras quirúrgicas",
      "Guantes y mascarillas",
    ],
  },
  {
    id: 5,
    nombre: "Silla Ergonómica Ejecutiva",
    categoria: "mobiliario-tecnologia",
    descripcion:
      "Silla de escritorio ergonómica con soporte lumbar y respaldo de malla.",
    imagen_url:
      "https://picsum.photos/seed/estab-silla/800/600",
    especificaciones: [
      "Respaldo de malla transpirable",
      "Soporte lumbar ajustable",
      "Apoyabrazos 3D",
      "Capacidad 150 kg",
    ],
  },
  {
    id: 6,
    nombre: "Notebook Corporativa",
    categoria: "mobiliario-tecnologia",
    descripcion: "Laptop Core i5 con SSD para la gestión empresarial diaria.",
    imagen_url:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60",
    especificaciones: [
      "Intel Core i5 12va gen",
      "SSD 512 GB",
      "RAM 16 GB",
      "Pantalla Full HD 15.6\"",
    ],
  },
  {
    id: 7,
    nombre: "Mueble Modular de Oficina",
    categoria: "mobiliario-tecnologia",
    descripcion:
      "Escritorio modular con cajoneras y canaleta para el cableado.",
    imagen_url:
      "https://picsum.photos/seed/estab-mueble/800/600",
    especificaciones: [
      "Melamina 18 mm",
      "Cantos de PVC",
      "Sistema de cableado",
      "Medidas 160 x 70 x 75 cm",
    ],
  },
  {
    id: 8,
    nombre: "Importación de Contenedores",
    categoria: "importacion",
    descripcion:
      "Gestión integral de importación FCL/LCL con trámites aduaneros incluidos.",
    imagen_url:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&q=60",
    especificaciones: [
      "Contenedores 20' y 40'",
      "Despacho aduanero",
      "Almacenaje y logística",
      "Asesoría legal completa",
    ],
  },
  {
    id: 9,
    nombre: "Asesoría en Comercialización",
    categoria: "importacion",
    descripcion:
      "Consultoría para posicionar productos importados en el mercado local.",
    imagen_url:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=60",
    especificaciones: [
      "Estudio de mercado",
      "Proveedores internacionales",
      "Estrategia de precios",
      "Branding y distribución",
    ],
  },
  {
    id: 10,
    nombre: "Impresora Multifunción",
    categoria: "material-escritura",
    descripcion: "Impresora láser multifunción con red Wi-Fi para oficina.",
    imagen_url:
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=60",
    especificaciones: [
      "Velocidad 38 ppm",
      "Dúplex automático",
      "Escáner y fax integrados",
      "Red Wi-Fi y Ethernet",
    ],
  },
]

export const buildWhatsAppUrl = (producto) => {
  const numero = import.meta.env.VITE_WHATSAPP_NUMBER
  const mensaje = `Hola, deseo consultar por el producto: ${producto.nombre}`
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`
}