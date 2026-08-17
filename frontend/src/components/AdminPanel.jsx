import { useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Power,
  Inbox,
  LayoutGrid,
  FileText,
  Search,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { CATEGORIES } from "../data/mockProducts"
import { api } from "../services/api"
import CotizadorInterno from "./CotizadorInterno"
import SuccessModal from "./SuccessModal"
import ProductDetailModal from "./ProductDetailModal"
import ProductFormModal from "./ProductFormModal"

function AdminPanel({ products, setProducts, user }) {
  const isAdmin = user?.rol === "Admin"
  const [tab, setTab] = useState("catalogo")

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-navy">Cotizador Interno</h2>
            <p className="mt-1 text-slate-500">
              Genera cotizaciones por WhatsApp con el precio referencial interno.
            </p>
          </div>
          <span className="rounded-full bg-brand-green/10 px-4 py-1.5 text-sm font-bold text-brand-green-dark">
            {products.length} productos en catálogo
          </span>
        </div>
        <CotizadorInterno products={products} />
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-navy">Panel de Administración</h2>
          <p className="mt-1 text-slate-500">
            Gestión de catálogo y cotizaciones en tiempo real con el backend.
          </p>
        </div>
        <span className="rounded-full bg-pulse/10 px-4 py-1.5 text-sm font-bold text-pulse">
          {products.length} productos en catálogo
        </span>
      </div>

      <div className="mb-6 flex gap-2 rounded-full bg-slate-100 p-1.5 sm:w-fit">
        <button
          onClick={() => setTab("catalogo")}
          className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
            tab === "catalogo"
              ? "bg-navy text-white shadow"
              : "text-navy hover:bg-white"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          Gestión de Catálogo
        </button>
        <button
          onClick={() => setTab("cotizador")}
          className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
            tab === "cotizador"
              ? "bg-navy text-white shadow"
              : "text-navy hover:bg-white"
          }`}
        >
          <FileText className="h-4 w-4" />
          Cotizador Interno
        </button>
      </div>

      {tab === "cotizador" ? (
        <CotizadorInterno products={products} />
      ) : (
        <ProductManager products={products} setProducts={setProducts} />
      )}
    </section>
  )
}

function ProductManager({ products, setProducts }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCat, setFilterCat] = useState("all")
  const [successMsg, setSuccessMsg] = useState("")
  const [notice, setNotice] = useState("")
  const [preview, setPreview] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const showError = (msg) => {
    setNotice(msg)
    setTimeout(() => setNotice(""), 5000)
  }

  const filteredProducts = products.filter((p) => {
    if (filterCat !== "all" && String(p.categoria_id) !== String(filterCat)) return false
    const q = searchTerm.trim().toLowerCase()
    if (q && !p.nombre.toLowerCase().includes(q)) return false
    return true
  })

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setPreview(null)
    setFormOpen(true)
  }

  const handleSave = async (payload) => {
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
      if (editing?.id === p.id) setFormOpen(false)
      setSuccessMsg("El producto se eliminó correctamente.")
    } catch (err) {
      showError(err.message || "Error al eliminar el producto.")
    }
  }

  return (
    <div>
      {notice && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-lg bg-pulse/10 px-4 py-2 text-sm font-semibold text-pulse"
        >
          {notice}
        </motion.p>
      )}

      {/* Toolbar de la tabla */}
      <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-navy/5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar producto por nombre..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-navy outline-none transition focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20"
          aria-label="Filtrar por categoría"
        >
          <option value="all">Todas las categorías</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.emoji} {cat.nombre}
            </option>
          ))}
        </select>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-green/25 transition hover:bg-brand-green-dark"
        >
          <Plus className="h-4 w-4" />
          Añadir Nuevo Producto
        </motion.button>
      </div>

      {/* Tabla al 100% del ancho */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h4 className="text-sm font-bold text-navy">Listado de productos</h4>
            <p className="text-xs text-slate-400">
              {filteredProducts.length} de {products.length} productos
            </p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Inbox className="mb-4 h-12 w-12 text-slate-300" />
            <p className="font-bold text-navy">No hay productos</p>
            <p className="text-sm text-slate-500">
              {filterCat === "all" && !searchTerm
                ? "Agrega tu primer producto."
                : "No hay resultados para los filtros aplicados."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="px-5 py-3 font-semibold">Imagen</th>
                  <th className="px-5 py-3 font-semibold">Producto</th>
                  <th className="px-5 py-3 font-semibold">Categoría</th>
                  <th className="px-5 py-3 font-semibold">Precio Referencial (Bs)</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const inactivo = p.estado === "inactivo"
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setPreview(p)}
                      className={`cursor-pointer transition-colors ${inactivo ? "opacity-50" : "hover:bg-slate-50"}`}
                      title="Ver ficha técnica"
                    >
                      <td className="px-5 py-3">
                        <span className="block h-11 w-11 overflow-hidden rounded-lg bg-slate-100">
                          {p.imagenes?.[0] ? (
                            <img
                              src={p.imagenes[0]}
                              alt={p.nombre}
                              className="h-full w-full object-cover"
                              onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-xs text-slate-300">
                              —
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className={`font-semibold text-navy ${inactivo ? "line-through" : ""}`}>
                              {p.nombre}
                            </p>
                            <p className="max-w-[220px] truncate text-xs text-slate-400">
                              {p.descripcion}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {CATEGORIES.find((c) => String(c.id) === String(p.categoria_id))?.nombre}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-bold text-brand-green-dark">
                        {Number(p.precio_referencial || 0).toLocaleString("es-BO", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-5 py-3">
                        <motion.span
                          key={p.estado}
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                            inactivo
                              ? "bg-slate-100 text-slate-500"
                              : "bg-brand-green/10 text-brand-green-dark"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${inactivo ? "bg-slate-400" : "bg-brand-green"}`} />
                          {inactivo ? "Inactivo" : "Activo"}
                        </motion.span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleEstado(p)
                            }}
                            title="Cambiar estado"
                            className={`cursor-pointer rounded-lg p-2 transition ${
                              inactivo
                                ? "bg-brand-green/10 text-brand-green-dark hover:bg-brand-green/20"
                                : "bg-slate-100 text-pulse hover:bg-pulse/10"
                            }`}
                          >
                            <Power className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              openEdit(p)
                            }}
                            className="cursor-pointer rounded-lg bg-navy/5 p-2 text-navy transition hover:bg-navy/10"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              remove(p)
                            }}
                            className="cursor-pointer rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SuccessModal
        open={!!successMsg}
        message={successMsg}
        onClose={() => setSuccessMsg("")}
      />

      <AnimatePresence>
        {preview && (
          <ProductDetailModal
            product={preview}
            onClose={() => setPreview(null)}
            mode="admin"
            showPrecio
            onEdit={openEdit}
          />
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
    </div>
  )
}

export default AdminPanel