import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageCircle,
  CheckCircle2,
  Pencil,
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

function ProductDetailModal({
  product,
  onClose,
  mode = "public",
  showPrecio = false,
  onSelect,
  onEdit,
}) {
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

  const handleEdit = () => {
    onEdit?.(product)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25 }}
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-slate-900/95 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado con contraste */}
        <div className="relative shrink-0 px-6 pb-4 pt-5 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4 pr-10">
            <div>
              {cat && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/25 px-3 py-1 text-xs font-bold text-indigo-300 ring-1 ring-indigo-400/40">
                  {CatIcon ? <CatIcon className="h-3.5 w-3.5" /> : cat.emoji}
                  {cat.nombre}
                </span>
              )}
              <h3 className="mt-2.5 text-2xl font-bold text-white">{product.nombre}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cuerpo con tarjetas enmarcadas */}
        <div className="overflow-y-auto bg-slate-50/80">
          <div className="grid grid-cols-1 gap-6 p-6 sm:p-8 md:grid-cols-2">
            {/* Columna izquierda: visual */}
            <div className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
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
                      className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow ring-1 ring-slate-200 transition hover:bg-slate-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={next}
                      aria-label="Imagen siguiente"
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow ring-1 ring-slate-200 transition hover:bg-slate-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <span className="absolute bottom-3 right-3 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-bold text-white">
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
                          ? "ring-indigo-500"
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
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Descripción
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {product.descripcion}
                </p>
              </div>

              {product.especificaciones?.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Especificaciones Técnicas
                  </h4>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {product.especificaciones.map((spec) => (
                      <li
                        key={spec}
                        className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {showPrecio && (
                <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500 p-5 text-white shadow-lg shadow-indigo-500/25">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                      Precio Referencial Interno
                    </p>
                    <span className="rounded-full bg-emerald-400/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200 ring-1 ring-emerald-300/40">
                      Interno
                    </span>
                  </div>
                  <p className="mt-1.5 text-2xl font-extrabold text-white">
                    {formatPrecio(product.precio_referencial)} Bs
                  </p>
                </div>
              )}

              <div className="mt-auto">
                {onSelect ? (
                  <button
                    onClick={handleSelect}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    Seleccionar para Cotización
                  </button>
                ) : mode === "admin" ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleEdit}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
                    >
                      <Pencil className="h-5 w-5" />
                      Editar Producto
                    </button>
                    <button
                      onClick={onClose}
                      className="cursor-pointer rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      Cerrar
                    </button>
                  </div>
                ) : (
                  <a
                    href={buildWhatsAppUrl(product)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Cotizar por WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProductDetailModal