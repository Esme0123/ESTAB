import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageCircle,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Stethoscope,
  FlaskConical,
  Syringe,
  SprayCan,
} from "lucide-react"
import { CATEGORIES, buildWhatsAppUrl } from "../data/mockProducts"

const CATEGORY_ICONS = {
  1: Stethoscope,
  2: FlaskConical,
  3: Syringe,
  4: SprayCan,
}

const findCat = (id) => CATEGORIES.find((c) => String(c.id) === String(id))

const formatPrecio = (value) =>
  Number(value || 0).toLocaleString("es-BO", { minimumFractionDigits: 2 })

function ProductDetailModal({ product, onClose, showPrecio = false, onSelect }) {
  const images = product.imagenes?.length ? product.imagenes : [null]
  const [index, setIndex] = useState(0)
  const cat = findCat(product.categoria_id)
  const CatIcon = cat ? CATEGORY_ICONS[cat.id] : null

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length])

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setIndex((i) => (i + 1) % images.length)

  const handleSelect = () => {
    onSelect?.(product)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25 }}
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 text-navy shadow transition hover:bg-white"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          {/* Columna izquierda: visual */}
          <div>
            <div className="relative h-72 w-full overflow-hidden rounded-xl bg-slate-50 md:h-80">
              {images[index] ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={index}
                    src={images[index]}
                    alt={product.nombre}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="h-full w-full object-contain p-2"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </AnimatePresence>
              ) : (
                <span className="flex h-full w-full items-center justify-center text-slate-300">
                  <ImageOff className="h-12 w-12" />
                </span>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Imagen anterior"
                    className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow transition hover:bg-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Imagen siguiente"
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow transition hover:bg-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <span className="absolute bottom-3 right-3 rounded-full bg-navy/70 px-3 py-1 text-xs font-bold text-white">
                    {index + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex justify-center gap-2 overflow-x-auto">
                {images.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    onClick={() => setIndex(i)}
                    aria-label={`Ver imagen ${i + 1}`}
                    className={`h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-50 ring-2 transition ${
                      i === index
                        ? "ring-brand-green"
                        : "ring-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    {src ? (
                      <img src={src} alt="" className="h-full w-full object-contain p-1" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400">
                        <ImageOff className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columna derecha: información */}
          <div className="flex flex-col">
            {cat && (
              <span
                className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${cat.colorFondo} ${cat.colorTexto}`}
              >
                {CatIcon ? <CatIcon className="h-3.5 w-3.5" /> : cat.emoji}
                {cat.nombre}
              </span>
            )}

            <h3 className="mt-3 text-2xl font-bold text-slate-800">{product.nombre}</h3>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">{product.descripcion}</p>

            {product.especificaciones?.length > 0 && (
              <>
                <h4 className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Especificaciones Técnicas
                </h4>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {product.especificaciones.map((spec) => (
                    <li
                      key={spec}
                      className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {showPrecio && (
              <div className="mt-6 rounded-xl bg-brand-green/10 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-green-dark">
                  Precio Referencial Interno
                </p>
                <p className="mt-1 text-2xl font-extrabold text-navy">
                  {formatPrecio(product.precio_referencial)} Bs
                </p>
              </div>
            )}

            <div className="mt-auto pt-6">
              {onSelect ? (
                <button
                  onClick={handleSelect}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-navy px-6 py-3 font-bold text-white shadow-lg shadow-navy/20 transition hover:bg-navy-soft"
                >
                  <CheckCircle2 className="h-5 w-5 text-brand-green" />
                  Seleccionar para Cotización
                </button>
              ) : (
                <a
                  href={buildWhatsAppUrl(product)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-3 font-bold text-white shadow-lg shadow-brand-green/30 transition hover:bg-brand-green-dark"
                >
                  <MessageCircle className="h-5 w-5" />
                  Cotizar por WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProductDetailModal