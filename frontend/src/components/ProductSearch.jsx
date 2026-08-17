import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Search, X, PackageSearch, ImageOff } from "lucide-react"
import { CATEGORIES } from "../data/mockProducts"

const findCat = (id) => CATEGORIES.find((c) => String(c.id) === String(id))

function ProductSearch({
  products,
  value,
  onChange,
  onSelectProduct,
  placeholder = "Buscar por nombre o categoría...",
  showFilter = false,
  filterValue = "all",
  onFilterChange,
  className = "",
}) {
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)

  useEffect(() => {
    const onClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase()
    if (!q) return []
    return products
      .filter((p) => {
        if (p.estado === "inactivo") return false
        const cat = findCat(p.categoria_id)
        return (
          p.nombre.toLowerCase().includes(q) ||
          p.descripcion.toLowerCase().includes(q) ||
          (cat && cat.nombre.toLowerCase().includes(q))
        )
      })
      .slice(0, 6)
  }, [products, value])

  const handleSelect = (product) => {
    onSelectProduct(product)
    onChange("")
    setOpen(false)
  }

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#3BB54A] drop-shadow-[0_0_6px_rgba(59,181,74,0.5)]" />
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value)
              setOpen(true)
            }}
            onFocus={() => value.trim() && setOpen(true)}
            placeholder={placeholder}
            className="w-full rounded-2xl border-2 border-emerald-500/30 bg-white/90 py-3.5 pl-12 pr-11 text-sm text-navy shadow-lg backdrop-blur-md outline-none transition placeholder:text-slate-400 focus:border-[#3BB54A] focus:ring-2 focus:ring-[#3BB54A]/20"
          />
          {value && (
            <button
              onClick={() => onChange("")}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-navy"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {showFilter && (
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-navy shadow-card outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
            aria-label="Filtrar por categoría"
          >
            <option value="all">Todas las categorías</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.nombre}
              </option>
            ))}
          </select>
        )}
      </div>

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-navy/10"
          >
            {suggestions.map((p) => {
              const cat = findCat(p.categoria_id)
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-slate-50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                    {p.imagenes?.[0] ? (
                      <img src={p.imagenes[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <ImageOff className="h-4 w-4 text-slate-300" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-navy">
                      {p.nombre}
                    </span>
                    <span className="block truncate text-xs text-slate-400">
                      {cat ? `${cat.emoji} ${cat.nombre}` : "Categoría"}
                    </span>
                  </span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {open && value.trim() && suggestions.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-slate-400 shadow-2xl ring-1 ring-navy/10">
          <PackageSearch className="h-4 w-4" />
          Sin resultados para “{value.trim()}”
        </div>
      )}
    </div>
  )
}

export default ProductSearch