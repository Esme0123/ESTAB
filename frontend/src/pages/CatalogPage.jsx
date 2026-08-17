import { useEffect, useMemo, useState } from "react"
import { useSearchParams, useOutletContext } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Eye, PackageSearch, Search, ImageOff } from "lucide-react"
import { CATEGORIES, buildWhatsAppUrl } from "../data/mockProducts"
import ProductDetailModal from "../components/ProductDetailModal"

function CatalogPage() {
  const { products } = useOutletContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [selected, setSelected] = useState(null)

  const urlCategory = searchParams.get("categoria") || null
  const [activeCategory, setActiveCategory] = useState(urlCategory)

  useEffect(() => {
    setActiveCategory(urlCategory)
  }, [urlCategory])

  const handleCategory = (id) => {
    setActiveCategory(id)
    if (id) {
      setSearchParams({ categoria: id })
    } else {
      setSearchParams({})
    }
  }

  const findCat = (id) => CATEGORIES.find((c) => String(c.id) === String(id))

  const catName = activeCategory ? findCat(activeCategory)?.nombre : null

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (p.estado === "inactivo") return false
      const matchesCategory =
        !activeCategory || String(p.categoria_id) === String(activeCategory)
      const q = searchTerm.toLowerCase().trim()
      const cat = findCat(p.categoria_id)
      const matchesSearch =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        (cat && cat.nombre.toLowerCase().includes(q))
      return matchesCategory && matchesSearch
    })
  }, [products, activeCategory, searchTerm])

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold text-navy sm:text-4xl">
          Catálogo de Productos
        </h1>
        <p className="mt-2 text-slate-500">
          {catName
            ? `Mostrando productos de: ${catName}`
            : "Toda la gama de productos del rubro médico y laboratorio."}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="relative mb-6"
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o categoría..."
          className="w-full rounded-full border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-navy shadow-card outline-none transition placeholder:text-slate-400 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
        />
      </motion.div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => handleCategory(null)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            !activeCategory
              ? "bg-navy text-white shadow-lg shadow-navy/20"
              : "bg-white text-navy ring-1 ring-navy/10 hover:bg-navy/5"
          }`}
        >
          Todos
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategory(String(cat.id))}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeCategory === String(cat.id)
                ? "bg-navy text-white shadow-lg shadow-navy/20"
                : "bg-white text-navy ring-1 ring-navy/10 hover:bg-navy/5"
            }`}
          >
            {cat.emoji} {cat.nombre}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center rounded-3xl bg-white py-16 text-center shadow-card"
        >
          <PackageSearch className="mb-4 h-14 w-14 text-slate-300" />
          <p className="text-lg font-bold text-navy">No se encontraron productos</p>
          <p className="text-sm text-slate-500">
            Intenta con otro término de búsqueda o categoría.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => {
              const cat = findCat(product.categoria_id)
              const firstImage = product.imagenes?.[0]
              return (
                <motion.article
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={product.nombre}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-slate-300">
                        <ImageOff className="h-10 w-10" />
                      </span>
                    )}
                    <span
                      className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold ${cat?.colorFondo} ${cat?.colorTexto}`}
                    >
                      {cat?.nombre}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold text-navy">{product.nombre}</h3>
                    <p className="mt-2 flex-1 text-sm text-slate-500 line-clamp-2">
                      {product.descripcion}
                    </p>

                    <div className="mt-4 space-y-2">
                      <a
                        href={buildWhatsAppUrl(product)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-green px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-green/20 transition hover:bg-brand-green-dark"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Cotizar por WhatsApp
                      </a>
                      <button
                        onClick={() => setSelected(product)}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-navy/15 px-4 py-2.5 text-sm font-semibold text-navy transition hover:border-navy hover:bg-navy/5"
                      >
                        <Eye className="h-4 w-4" />
                        Ver detalle
                      </button>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {selected && <ProductDetailModal product={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}

export default CatalogPage