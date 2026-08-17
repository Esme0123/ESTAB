import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, FileText, PackageSearch, ImageOff } from "lucide-react"
import { CATEGORIES, buildQuoteWhatsAppUrl } from "../data/mockProducts"
import ProductSearch from "./ProductSearch"
import ProductDetailModal from "./ProductDetailModal"

function CotizadorInterno({ products }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCat, setFilterCat] = useState("all")
  const [selectedId, setSelectedId] = useState(null)
  const [preview, setPreview] = useState(null)

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim()
    return products.filter((p) => {
      if (p.estado === "inactivo") return false
      if (filterCat !== "all" && String(p.categoria_id) !== String(filterCat)) return false
      const cat = CATEGORIES.find((c) => String(c.id) === String(p.categoria_id))
      return (
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        (cat && cat.nombre.toLowerCase().includes(q))
      )
    })
  }, [products, searchTerm, filterCat])

  const selected = products.find((p) => p.id === selectedId) || null

  const formatPrecio = (value) =>
    Number(value || 0).toLocaleString("es-BO", { minimumFractionDigits: 2 })

  const handleTypeaheadSelect = (product) => {
    setSelectedId(product.id)
    setPreview(null)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      <div>
        <ProductSearch
          products={products}
          value={searchTerm}
          onChange={setSearchTerm}
          onSelectProduct={handleTypeaheadSelect}
          placeholder="Buscar producto por nombre o categoría..."
          showFilter
          filterValue={filterCat}
          onFilterChange={setFilterCat}
          className="mb-5"
        />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center rounded-3xl bg-white py-16 text-center shadow-card">
            <PackageSearch className="mb-4 h-12 w-12 text-slate-300" />
            <p className="font-bold text-navy">Sin resultados</p>
            <p className="text-sm text-slate-500">Prueba con otro término o categoría.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => {
                const cat = CATEGORIES.find((c) => String(c.id) === String(p.categoria_id))
                const isSelected = selectedId === p.id
                return (
                  <motion.button
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPreview(p)}
                    className={`flex w-full cursor-pointer items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-card ring-1 transition-colors hover:bg-slate-50 hover:shadow-xl ${
                      isSelected ? "ring-2 ring-brand-green" : "ring-navy/5"
                    }`}
                  >
                    <span className="h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {p.imagenes?.[0] ? (
                        <img
                          src={p.imagenes[0]}
                          alt={p.nombre}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-slate-300">
                          <ImageOff className="h-5 w-5" />
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-navy">{p.nombre}</span>
                      <span className="block text-xs text-slate-500">
                        {cat?.emoji} {cat?.nombre}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full bg-brand-green/10 px-3 py-1 text-sm font-extrabold text-brand-green-dark">
                      {formatPrecio(p.precio_referencial)} Bs
                    </span>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="h-fit rounded-3xl bg-white p-6 shadow-card ring-1 ring-navy/5 lg:sticky lg:top-24">
        <h3 className="flex items-center gap-2 text-lg font-bold text-navy">
          <FileText className="h-5 w-5 text-brand-green" />
          Ficha Técnica Rápida
        </h3>

        {selected ? (
          <div>
            <div className="mt-4 flex items-start gap-4">
              <span className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {selected.imagenes?.[0] ? (
                  <img
                    src={selected.imagenes[0]}
                    alt={selected.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-slate-300">
                    <ImageOff className="h-6 w-6" />
                  </span>
                )}
              </span>
              <div>
                <p className="font-bold leading-snug text-navy">{selected.nombre}</p>
                <p className="mt-1 text-sm font-extrabold text-brand-green-dark">
                  {formatPrecio(selected.precio_referencial)} Bs
                </p>
              </div>
            </div>

            {selected.especificaciones?.length > 0 && (
              <ul className="mt-4 space-y-1.5">
                {selected.especificaciones.map((spec) => (
                  <li key={spec} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                    {spec}
                  </li>
                ))}
              </ul>
            )}

            <a
              href={buildQuoteWhatsAppUrl(selected)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-green px-5 py-3 font-bold text-white shadow-lg shadow-brand-green/30 transition hover:bg-brand-green-dark"
            >
              <MessageCircle className="h-5 w-5" />
              Generar Cotización WhatsApp
            </a>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            Selecciona un producto de la lista para ver su ficha técnica y generar una
            cotización por WhatsApp con el precio referencial interno.
          </p>
        )}
      </div>

      <AnimatePresence>
        {preview && (
          <ProductDetailModal
            product={preview}
            onClose={() => setPreview(null)}
            showPrecio
            onSelect={(p) => setSelectedId(p.id)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default CotizadorInterno