export const CATEGORIES = [
  {
    id: "equipamiento-medico",
    nombre: "Equipamiento Médico",
    descripcion: "Equipos de diagnóstico y atención para clínicas y hospitales",
    emoji: "🏥",
    colorBorde: "border-pulse",
    colorFondo: "bg-pulse/10",
    colorTexto: "text-pulse",
    imagen:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "mobiliario-laboratorio",
    nombre: "Mobiliario de Laboratorio y Clínica",
    descripcion: "Camillas, vitrinas, sillas ergonómicas y mobiliario sanitario",
    emoji: "🧪",
    colorBorde: "border-navy-soft",
    colorFondo: "bg-navy-soft/10",
    colorTexto: "text-navy",
    imagen:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "insumos-medicos",
    nombre: "Insumos Médicos",
    descripcion: "Descartables, kits de esterilización y bioseguridad",
    emoji: "💉",
    colorBorde: "border-brand-green",
    colorFondo: "bg-brand-green/10",
    colorTexto: "text-brand-green-dark",
    imagen:
      "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "material-corporativo",
    nombre: "Material Corporativo y Limpieza",
    descripcion: "Papelería, escritorio y productos de higiene para empresas",
    emoji: "🧼",
    colorBorde: "border-brand-green",
    colorFondo: "bg-brand-green/10",
    colorTexto: "text-brand-green-dark",
    imagen:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=60",
  },
]

export const PRODUCTS = [
  {
    id: 1,
    nombre: "Camilla de Examen Médico",
    categoria: "mobiliario-laboratorio",
    descripcion:
      "Camilla de exploración con colchoneta acolchada para consultorios y centros de salud.",
    imagen_url: "https://picsum.photos/seed/estab-camilla/800/600",
    especificaciones: [
      "Colchoneta acolchada lavable",
      "Estructura de acero cromado",
      "Respaldo reclinable",
      "Ruedas con freno de seguridad",
    ],
  },
  {
    id: 2,
    nombre: "Mesa de Exploración Ginecológica",
    categoria: "mobiliario-laboratorio",
    descripcion:
      "Mesa de exploración con respaldos regulables para consulta ginecológica.",
    imagen_url: "https://picsum.photos/seed/estab-mesa/800/600",
    especificaciones: [
      "Respaldo y pierneras regulables",
      "Tapizado en polipiel lavable",
      "Altura ajustable",
      "Estribos desmontables",
    ],
  },
  {
    id: 3,
    nombre: "Vitrina de Laboratorio",
    categoria: "mobiliario-laboratorio",
    descripcion:
      "Vitrina metálica con puertas de vidrio para almacenar reactivos e insumos.",
    imagen_url: "https://picsum.photos/seed/estab-vitrina/800/600",
    especificaciones: [
      "Puertas corredizas de vidrio",
      "Bandejas de acero inoxidable",
      "Cierre con llave",
      "Medidas 100 x 45 x 180 cm",
    ],
  },
  {
    id: 4,
    nombre: "Silla Ergonómica Médica",
    categoria: "mobiliario-laboratorio",
    descripcion:
      "Silla de trabajo ergonómica con soporte lumbar para personal de salud.",
    imagen_url: "https://picsum.photos/seed/estab-silla/800/600",
    especificaciones: [
      "Respaldo de malla transpirable",
      "Soporte lumbar ajustable",
      "Apoyabrazos 3D",
      "Ruedas de alto tránsito",
    ],
  },
  {
    id: 5,
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
    id: 6,
    nombre: "Baumanómetro Aneroide",
    categoria: "equipamiento-medico",
    descripcion:
      "Tensiómetro aneroide con estuche para control de presión arterial.",
    imagen_url: "https://picsum.photos/seed/estab-baumanometro/800/600",
    especificaciones: [
      "Manómetro calibrado",
      "Brazalete adulto universal",
      "Fonendoscopio incluido",
      "Válvula de desinflado fino",
    ],
  },
  {
    id: 7,
    nombre: "Termómetro Digital Infrarrojo",
    categoria: "equipamiento-medico",
    descripcion:
      "Termómetro de frente sin contacto para toma de temperatura por infrarrojo.",
    imagen_url: "https://picsum.photos/seed/estab-termometro/800/600",
    especificaciones: [
      "Lectura en 1 segundo",
      "Modo frente y objeto",
      "Alarma de fiebre",
      "Pantalla LCD retroiluminada",
    ],
  },
  {
    id: 8,
    nombre: "Lámpara de Examen",
    categoria: "equipamiento-medico",
    descripcion:
      "Lámpara de exploración con cabezal regulable para consultorios y clínicas.",
    imagen_url: "https://picsum.photos/seed/estab-lampara/800/600",
    especificaciones: [
      "Base con ruedas",
      "Brazo articulado",
      "Foco LED frío",
      "Intensidad regulable",
    ],
  },
  {
    id: 9,
    nombre: "Kit de Esterilización",
    categoria: "insumos-medicos",
    descripcion:
      "Set completo para esterilización y desinfección de instrumental médico.",
    imagen_url: "https://picsum.photos/seed/estab-esterilizacion/800/600",
    especificaciones: [
      "Desinfectante de alto nivel",
      "Contenedor hermético",
      "Guantes de nitrilo",
      "Tiras indicadoras de esterilización",
    ],
  },
  {
    id: 10,
    nombre: "Guantes y Mascarillas Descartables",
    categoria: "insumos-medicos",
    descripcion:
      "Kit de bioseguridad con guantes de nitrilo y mascarillas desechables.",
    imagen_url: "https://picsum.photos/seed/estab-bioseguridad/800/600",
    especificaciones: [
      "Guantes de nitrilo (100 u)",
      "Mascarillas quirúrgicas (50 u)",
      "Delantales desechables (10 u)",
      "Gorros descartables (10 u)",
    ],
  },
  {
    id: 11,
    nombre: "Kit de Material de Escritorio",
    categoria: "material-corporativo",
    descripcion:
      "Kit completo de papelería y útiles para equipos de oficina.",
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
    id: 12,
    nombre: "Kit de Limpieza y Bioseguridad",
    categoria: "material-corporativo",
    descripcion:
      "Desinfectantes y productos de higiene para oficinas, clínicas e industria.",
    imagen_url:
      "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=60",
    especificaciones: [
      "Desinfectante galón 5L",
      "Alcohol al 70%",
      "Limpador multiusos",
      "Toallas desechables",
    ],
  },
]

export const WHATSAPP_NUMBER = "59171814954"
export const EMAIL_CONTACT = "estabgroup@gmail.com"
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