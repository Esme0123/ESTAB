import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageCircle,
  Eye,
  PackageSearch,
  ImageOff,
  Check,
  Plus,
  Trash2,
  Calculator,
  Pencil,
  Power,
} from "lucide-react"
import { CATEGORIES, buildWhatsAppUrl, buildMultiQuoteWhatsAppUrl } from "../data/mockProducts"
import ProductDetailModal from "../components/ProductDetailModal"
import ProductSearch from "../components/ProductSearch"
import CotizadorPanel from "../components/CotizadorPanel"
import ProductFormModal from "../components/ProductFormModal"
import SuccessModal from "../components/SuccessModal"
import { isAuthenticated, getStoredUser, isAdminRole } from "../lib/auth"
import { api } from "../services/api"

const CATEGORY_STYLES = {
  1: {
    card: "border-amber-400/70 hover:border-amber-500 hover:shadow-amber-500/10",
    badge: "bg-amber-400 text-slate-900",
  },
  2: {
    card: "border-cyan-400/70 hover:border-cyan-500 hover:shadow-cyan-500/10",
    badge: "bg-cyan-400 text-slate-900",
  },
  3: {
    card: "border-emerald-400/70 hover:border-emerald-500 hover:shadow-emerald-500/10",
    badge: "bg-emerald-400 text-slate-900",
  },
  4: {
    card: "border-indigo-400/70 hover:border-indigo-500 hover:shadow-indigo-500/10",
    badge: "bg-indigo-400 text-white",
  },
}

const FILTER_STYLES = {
  all: "border-[#EAB308] bg-[#1A1C38] text-white shadow-lg shadow-[#EAB308]/25",
  1: "border-amber-300 bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/40",
  2: "border-cyan-300 bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/40",
  3: "border-emerald-300 bg-emerald-400 text-slate-900 shadow-lg shadow-emerald-400/40",
  4: "border-indigo-300 bg-indigo-400 text-white shadow-lg shadow-indigo-400/40",
}

function CatalogPage({ products: allProducts, setProducts }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [selected, setSelected] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [cotizadorOpen, setCotizadorOpen] = useState(false)
  const autenticado = isAuthenticated()
  const user = getStoredUser()
  const esAdmin = isAdminRole(user)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [successMsg, setSuccessMsg] = useState("")
  const [notice, setNotice] = useState("")

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
    return allProducts.filter((p) => {
      if (p.estado === "inactivo" && !esAdmin) return false
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
  }, [allProducts, activeCategory, searchTerm, esAdmin])

  const toggleSelect = (product) => {
    setSelectedProducts((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    )
  }

  const clearSelection = () => setSelectedProducts([])

  const showError = (msg) => {
    setNotice(msg)
    setTimeout(() => setNotice(""), 5000)
  }

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setSelected(null)
    setFormOpen(true)
  }

  const handleSave = async (payload) => {
    try {
      if (editing?.id) {
        const updated = await api.updateProducto(editing.id, payload)
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        )
        setSuccessMsg("El producto se actualizó correctamente.")
      } else {
        const created = await api.createProducto(payload)
        setProducts((prev) => [created, ...prev])
        setSuccessMsg("El producto se creó correctamente.")
      }
    } catch (err) {
      showError(err.message || "Error al guardar el producto.")
    }
  }

  const toggleEstado = async (p) => {
    const nuevoEstado = p.estado === "activo" ? "inactivo" : "activo"
    try {
      const updated = await api.updateProducto(p.id, {
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio_referencial: p.precio_referencial,
        categoria_id: p.categoria_id,
        estado: nuevoEstado,
        imagenes: p.imagenes,
        especificaciones: p.especificaciones,
      })
      setProducts((prev) =>
        prev.map((item) => (item.id === p.id ? updated : item))
      )
      setSuccessMsg(
        nuevoEstado === "activo"
          ? "El producto se activó correctamente."
          : "El producto se desactivó correctamente."
      )
    } catch (err) {
      showError(err.message || "Error al cambiar el estado.")
    }
  }

  const remove = async (p) => {
    if (!window.confirm(`¿Eliminar el producto "${p.nombre}"?`)) return
    try {
      await api.deleteProducto(p.id)
      setProducts((prev) => prev.filter((item) => item.id !== p.id))
      setSuccessMsg("El producto se eliminó correctamente.")
    } catch (err) {
      showError(err.message || "Error al eliminar el producto.")
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#1A1C38]/5 via-slate-100 to-emerald-50/20">
      {/* Hero / Cabecera */}
      <div className="relative overflow-hidden bg-[#1A1C38]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#3BB54A]/30 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[#EAB308]/25 blur-3xl" />
          <div className="absolute left-1/3 -top-10 h-56 w-56 rounded-full bg-[#06B6D4]/20 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-7xl px-4 pb-24 pt-12 text-center sm:px-6"
        >
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
            Catálogo de{" "}
            <span className="bg-gradient-to-r from-[#3BB54A] via-emerald-400 to-[#EAB308] bg-clip-text text-transparent">
              Equipamiento e Insumos
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            {catName
              ? `Mostrando productos de: ${catName}`
              : "Toda la gama de productos del rubro médico y laboratorio."}
          </p>
        </motion.div>
      </div>

      {/* Buscador y filtros */}
      <div className="relative mx-auto max-w-7xl px-4 pb-32 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="relative z-10 -mt-8 mb-6"
        >
          <ProductSearch
            products={allProducts}
            value={searchTerm}
            onChange={setSearchTerm}
            onSelectProduct={setSelected}
            placeholder="Buscar por nombre o categoría..."
          />
        </motion.div>

        {notice && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg bg-pulse/10 px-4 py-2 text-sm font-semibold text-pulse"
          >
            {notice}
          </motion.p>
        )}

        <div className="mb-8 flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleCategory(null)}
            className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
              !activeCategory
                ? FILTER_STYLES.all
                : "border-transparent bg-white/80 text-navy ring-1 ring-navy/10 hover:bg-white"
            }`}
          >
            Todos
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategory(String(cat.id))}
              className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
                activeCategory === String(cat.id)
                  ? FILTER_STYLES[cat.id] || FILTER_STYLES[3]
                  : "border-transparent bg-white/80 text-navy ring-1 ring-navy/10 hover:bg-white"
              }`}
            >
              {cat.emoji} {cat.nombre}
            </button>
          ))}

          {esAdmin && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={openCreate}
              className="ml-auto flex cursor-pointer items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-green/25 transition hover:bg-brand-green-dark"
            >
              <Plus className="h-4 w-4" />
              Añadir Producto
            </motion.button>
          )}
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
                const catStyle = CATEGORY_STYLES[product.categoria_id] || CATEGORY_STYLES[3]
                const firstImage = product.imagenes?.[0]
                const isSelected = selectedProducts.some((p) => p.id === product.id)
                const inactivo = product.estado === "inactivo"
                return (
                  <motion.article
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                    className={`group flex flex-col overflow-hidden rounded-2xl border-2 bg-white/95 backdrop-blur-sm shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${catStyle.card} ${
                      inactivo ? "opacity-60" : ""
                    }`}
                  >
                    <button
                      onClick={() => setSelected(product)}
                      className="relative block h-44 w-full cursor-pointer overflow-hidden bg-slate-100 text-left"
                      aria-label={`Ver detalle de ${product.nombre}`}
                    >
                      {firstImage ? (
                        <img
                          src={firstImage}
                          alt={product.nombre}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-slate-300">
                          <ImageOff className="h-10 w-10" />
                        </span>
                      )}
                      <span
                        className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold shadow-md ${catStyle.badge}`}
                      >
                        {cat?.nombre}
                      </span>
                      {inactivo && (
                        <span className="absolute right-3 top-3 rounded-full bg-slate-800 px-3 py-1 text-[11px] font-bold text-white shadow-md">
                          Inactivo
                        </span>
                      )}
                    </button>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base font-bold text-navy">{product.nombre}</h3>
                      <p className="mt-2 flex-1 text-sm text-slate-500 line-clamp-2">
                        {product.descripcion}
                      </p>

                      <div className="mt-4 space-y-2">
                        <motion.a
                          href={buildWhatsAppUrl(product)}
                          target="_blank"
                          rel="noreferrer"
                          whileTap={{ scale: 0.97 }}
                          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-green px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-green/20 transition hover:bg-brand-green-dark"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Cotizar por WhatsApp
                        </motion.a>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleSelect(product)}
                          className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                              : "border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="h-4 w-4" />
                              Seleccionado
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4" />
                              Seleccionar para cotizar
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelected(product)}
                          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-navy/15 px-4 py-2.5 text-sm font-semibold text-navy transition hover:border-navy hover:bg-navy/5"
                        >
                          <Eye className="h-4 w-4" />
                          Ver detalle
                        </motion.button>
                      </div>

                      {esAdmin && (
                        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openEdit(product)}
                            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-navy/5 px-2 py-2 text-xs font-bold text-navy transition hover:bg-navy/10"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Editar
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleEstado(product)}
                            className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-bold transition ${
                              inactivo
                                ? "bg-brand-green/10 text-brand-green-dark hover:bg-brand-green/20"
                                : "bg-slate-100 text-pulse hover:bg-pulse/10"
                            }`}
                          >
                            <Power className="h-3.5 w-3.5" />
                            {inactivo ? "Activar" : "Desactivar"}
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => remove(product)}
                            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-red-50 px-2 py-2 text-xs font-bold text-red-500 transition hover:bg-red-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.article>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <ProductDetailModal
            product={selected}
            onClose={() => setSelected(null)}
            mode={esAdmin ? "admin" : "public"}
            showPrecio={esAdmin}
            onEdit={esAdmin ? openEdit : undefined}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cotizadorOpen && autenticado && (
          <CotizadorPanel
            items={selectedProducts}
            onClose={() => setCotizadorOpen(false)}
            modo="interno"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 48 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4"
          >
            <div className="animate-bounce-short flex flex-wrap items-center justify-center gap-3 rounded-full border border-emerald-500/40 bg-[#1A1C38] px-5 py-3 text-white shadow-2xl sm:gap-4 sm:px-6 sm:py-3.5">
              <span className="text-sm font-semibold">
                🛒 {selectedProducts.length}{" "}
                {selectedProducts.length === 1 ? "producto" : "productos"} listos para cotizar
              </span>
              <button
                onClick={clearSelection}
                className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-white/50 hover:text-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Vaciar
              </button>
              {autenticado && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCotizadorOpen(true)}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-[#EAB308]/60 bg-[#1A1C38]/90 px-4 py-2 text-sm font-bold text-[#EAB308] shadow-lg shadow-black/20 transition hover:border-[#EAB308] hover:bg-[#1A1C38]"
                >
                  <Calculator className="h-4 w-4" />
                  Modo Cotizador
                </motion.button>
              )}
              <a
                href={buildMultiQuoteWhatsAppUrl(selectedProducts)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full bg-[#22C55E] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-500"
              >
                <MessageCircle className="h-4 w-4" />
                Cotizar Lista por WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {formOpen && (
          <ProductFormModal
            initial={editing}
            onClose={() => setFormOpen(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      <SuccessModal
        open={!!successMsg}
        message={successMsg}
        onClose={() => setSuccessMsg("")}
      />
    </section>
  )
}

export default CatalogPage