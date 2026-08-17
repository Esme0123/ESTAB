import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageCircle,
  Check,
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

const CATEGORY_BADGES = {
  1: "bg-amber-400 text-slate-900",
  2: "bg-cyan-400 text-slate-900",
  3: "bg-emerald-400 text-slate-900",
  4: "bg-indigo-400 text-white",
}

const findCat = (id) => CATEGORIES.find((c) => String(c.id) === String(id))

const formatPrecio = (value) =>
  Number(value || 0).toLocaleString("es-BO", { minimumFractionDigits: 2 })

const WHATSAPP_GRADIENT =
  "flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#3BB54A] to-[#10B981] px-6 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:from-[#2e943c] hover:to-[#059669] hover:scale-[1.02] hover:shadow-emerald-500/50"

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0D1F]/75 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25 }}
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#111325]/95 text-white shadow-[0_0_50px_rgba(34,197,94,0.15)] backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="shrink-0 bg-[#1A1C38]">
          <div className="relative px-6 pb-5 pt-5 sm:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4 pr-10">
              <div>
                {cat && (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-md ${
                      CATEGORY_BADGES[cat.id] || CATEGORY_BADGES[3]
                    }`}
                  >
                    {CatIcon ? <CatIcon className="h-3.5 w-3.5" /> : cat.emoji}
                    {cat.nombre}
                  </span>
                )}
                <h3 className="mt-2.5 text-2xl font-bold tracking-wide text-white">
                  {product.nombre}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-all duration-200 hover:bg-red-500/80"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-[#3BB54A] via-[#EAB308] to-[#06B6D4]" />
        </div>

        {/* Cuerpo */}
        <div className="overflow-y-auto">
          <div className="grid grid-cols-1 gap-6 p-6 sm:p-8 md:grid-cols-2">
            {/* Columna izquierda: galería */}
            <div className="relative h-fit rounded-2xl border border-emerald-500/40 bg-white p-4 shadow-inner">
              <div className="relative h-72 w-full overflow-hidden rounded-xl bg-slate-100 md:h-80">
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
                      className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/60 text-white shadow ring-1 ring-white/20 transition hover:bg-slate-900/80"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={next}
                      aria-label="Imagen siguiente"
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/60 text-white shadow ring-1 ring-white/20 transition hover:bg-slate-900/80"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <span className="absolute bottom-3 right-3 rounded-full bg-[#1A1C38]/80 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/20">
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
                      className={`h-14 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-slate-100 transition-all duration-200 ${
                        i === index
                          ? "scale-105 border-[#3BB54A] shadow-[0_0_10px_rgba(59,181,74,0.5)]"
                          : "border-transparent opacity-60 hover:opacity-100"
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
              <div className="rounded-2xl border border-slate-700/60 bg-[#1A1C38]/80 p-4 shadow-md">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#EAB308]">
                  Descripción
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {product.descripcion}
                </p>
              </div>

              {product.especificaciones?.length > 0 && (
                <div className="rounded-2xl border border-slate-700/60 bg-[#1A1C38]/80 p-4 shadow-md">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#EAB308]">
                    Especificaciones Técnicas
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {product.especificaciones.map((spec) => (
                      <li key={spec} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#3BB54A]/20 text-[#3BB54A]">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {showPrecio && (
                <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#1A1C38] to-[#111325] p-5 text-white shadow-lg shadow-black/30">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#EAB308]">
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
                  <button onClick={handleSelect} className={`cursor-pointer ${WHATSAPP_GRADIENT}`}>
                    <CheckCircle2 className="h-5 w-5" />
                    Seleccionar para Cotización
                  </button>
                ) : mode === "admin" ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleEdit}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#3BB54A] px-6 py-3 font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-[#2e943c]"
                    >
                      <Pencil className="h-5 w-5" />
                      Editar Producto
                    </button>
                    <button
                      onClick={onClose}
                      className="cursor-pointer rounded-2xl border border-slate-600 bg-white/5 px-6 py-3 font-semibold text-slate-200 transition hover:bg-white/10"
                    >
                      Cerrar
                    </button>
                  </div>
                ) : (
                  <a href={buildWhatsAppUrl(product)} target="_blank" rel="noreferrer" className={WHATSAPP_GRADIENT}>
                    <MessageCircle className="h-6 w-6" />
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