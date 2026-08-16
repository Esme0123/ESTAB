import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, ChevronLeft, ChevronRight, ImageOff } from "lucide-react"
import { CATEGORIES, buildWhatsAppUrl } from "../data/mockProducts"

function ProductDetailModal({ product, onClose }) {
  const images = product.imagenes?.length ? product.imagenes : [null]
  const [index, setIndex] = useState(0)
  const cat = CATEGORIES.find((c) => c.id === product.categoria_id)

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setIndex((i) => (i + 1) % images.length)

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
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 text-navy shadow transition hover:bg-white"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative h-64 sm:h-80">
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={images[index]}
              alt={product.nombre}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Imagen anterior"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow transition hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                aria-label="Imagen siguiente"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow transition hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="absolute bottom-3 right-3 rounded-full bg-navy/70 px-3 py-1 text-xs font-bold text-white">
                {index + 1} / {images.length}
              </span>
            </>
          )}

          {cat && (
            <span
              className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-bold ${cat.colorFondo} ${cat.colorTexto}`}
            >
              {cat.emoji} {cat.nombre}
            </span>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex justify-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                onClick={() => setIndex(i)}
                aria-label={`Ver imagen ${i + 1}`}
                className={`h-14 w-16 overflow-hidden rounded-lg ring-2 transition ${
                  i === index
                    ? "ring-brand-green"
                    : "ring-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {src ? (
                  <img src={src} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400">
                    <ImageOff className="h-4 w-4" />
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="max-h-[45vh] overflow-y-auto p-6 sm:p-8">
          <h3 className="text-2xl font-extrabold text-navy">{product.nombre}</h3>
          <p className="mt-3 text-slate-600">{product.descripcion}</p>

          {product.especificaciones?.length > 0 && (
            <>
              <h4 className="mt-6 text-sm font-bold uppercase tracking-wider text-navy">
                Especificaciones Técnicas
              </h4>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {product.especificaciones.map((spec) => (
                  <li
                    key={spec}
                    className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-brand-green" />
                    {spec}
                  </li>
                ))}
              </ul>
            </>
          )}

          <a
            href={buildWhatsAppUrl(product)}
            target="_blank"
            rel="noreferrer"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-3 font-semibold text-white shadow-lg shadow-brand-green/30 transition hover:bg-brand-green-dark"
          >
            <MessageCircle className="h-5 w-5" />
            Cotizar por WhatsApp
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default ProductDetailModal