import { useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  Power,
  Inbox,
  Upload,
  Loader2,
  X,
  LayoutGrid,
  FileText,
} from "lucide-react"
import { motion } from "framer-motion"
import { CATEGORIES } from "../data/mockProducts"
import { api } from "../services/api"
import CotizadorInterno from "./CotizadorInterno"

const EMPTY_FORM = {
  id: null,
  nombre: "",
  descripcion: "",
  precio_referencial: "",
  categoria_id: CATEGORIES[0].id,
  imagenes: [],
  especificaciones: [],
}

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
  const [form, setForm] = useState(EMPTY_FORM)
  const [newSpec, setNewSpec] = useState("")
  const [newImageUrl, setNewImageUrl] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState("")

  const flash = (msg) => {
    setNotice(msg)
    setTimeout(() => setNotice(""), 4000)
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setNewSpec("")
    setNewImageUrl("")
  }

  const startEdit = (p) => {
    setForm({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio_referencial: String(p.precio_referencial ?? ""),
      categoria_id: p.categoria_id,
      imagenes: [...(p.imagenes || [])],
      especificaciones: [...(p.especificaciones || [])],
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const addSpec = () => {
    const value = newSpec.trim()
    if (!value) return
    setForm((f) => ({ ...f, especificaciones: [...f.especificaciones, value] }))
    setNewSpec("")
  }

  const removeSpec = (i) =>
    setForm((f) => ({
      ...f,
      especificaciones: f.especificaciones.filter((_, idx) => idx !== i),
    }))

  const addImageUrl = () => {
    const value = newImageUrl.trim()
    if (!value) return
    setForm((f) => ({ ...f, imagenes: [...f.imagenes, value] }))
    setNewImageUrl("")
  }

  const removeImage = (i) =>
    setForm((f) => ({
      ...f,
      imagenes: f.imagenes.filter((_, idx) => idx !== i),
    }))

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const data = await api.uploadImage(file)
      setForm((f) => ({ ...f, imagenes: [...f.imagenes, data.url] }))
    } catch (err) {
      flash(err.message || "Error al subir la imagen.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.descripcion.trim()) {
      flash("Nombre y descripción son obligatorios.")
      return
    }

    setSaving(true)
    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio_referencial: Number(form.precio_referencial) || 0,
        categoria_id: Number(form.categoria_id),
        imagenes: form.imagenes.filter(Boolean),
        especificaciones: form.especificaciones.filter(Boolean),
      }

      if (form.id) {
        const updated = await api.updateProducto(form.id, payload)
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        )
        flash("Producto actualizado correctamente.")
      } else {
        const created = await api.createProducto(payload)
        setProducts((prev) => [created, ...prev])
        flash("Producto creado correctamente.")
      }
      resetForm()
    } catch (err) {
      flash(err.message || "Error al guardar el producto.")
    } finally {
      setSaving(false)
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
    } catch (err) {
      flash(err.message || "Error al cambiar el estado.")
    }
  }

  const remove = async (p) => {
    if (!window.confirm(`¿Eliminar el producto "${p.nombre}"?`)) return
    try {
      await api.deleteProducto(p.id)
      setProducts((prev) => prev.filter((item) => item.id !== p.id))
      if (form.id === p.id) resetForm()
      flash("Producto eliminado.")
    } catch (err) {
      flash(err.message || "Error al eliminar el producto.")
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-navy outline-none transition focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20"

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
      <form onSubmit={handleSubmit} className="h-fit rounded-2xl bg-white p-6 shadow-card">
        <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-navy">
          {form.id ? (
            <>
              <Pencil className="h-5 w-5 text-brand-green" /> Editar producto
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 text-brand-green" /> Añadir producto
            </>
          )}
        </h3>

        <label className="mb-1 block text-sm font-semibold text-navy">Nombre</label>
        <input
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          placeholder="Ej: Camilla de examen"
          className={inputClass}
        />

        <label className="mb-1 mt-4 block text-sm font-semibold text-navy">Categoría</label>
        <select
          value={form.categoria_id}
          onChange={(e) => setForm({ ...form, categoria_id: Number(e.target.value) })}
          className={inputClass}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <label className="mb-1 mt-4 block text-sm font-semibold text-navy">
          Descripción
        </label>
        <textarea
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          rows="3"
          placeholder="Ej: Camilla de exploración con colchoneta acolchada."
          className={inputClass}
        />

        <label className="mb-1 mt-4 block text-sm font-semibold text-navy">
          Precio Referencial Interno (Bs)
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={form.precio_referencial}
          onChange={(e) => setForm({ ...form, precio_referencial: e.target.value })}
          placeholder="0.00"
          className={inputClass}
        />

        <div className="mt-5">
          <label className="mb-1 block text-sm font-semibold text-navy">
            Imágenes del producto
          </label>

          <div className="flex gap-2">
            <input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://... (URL de imagen)"
              className={inputClass}
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="shrink-0 rounded-lg bg-navy px-4 text-sm font-semibold text-white transition hover:bg-navy-soft"
            >
              Agregar
            </button>
          </div>

          <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 px-4 py-2.5 text-sm font-semibold text-navy transition hover:border-brand-green hover:text-brand-green-dark">
            <Upload className="h-4 w-4" />
            {uploading ? "Subiendo..." : "Subir imagen desde tu equipo"}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>

          {form.imagenes.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {form.imagenes.map((url, i) => (
                <div key={`${url}-${i}`} className="group relative overflow-hidden rounded-lg">
                  <img
                    src={url}
                    alt={`Imagen ${i + 1}`}
                    className="h-16 w-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label="Quitar imagen"
                    className="absolute right-1 top-1 rounded-full bg-navy/80 p-1 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5">
          <label className="mb-1 block text-sm font-semibold text-navy">
            Especificaciones Técnicas
          </label>
          <div className="flex gap-2">
            <input
              value={newSpec}
              onChange={(e) => setNewSpec(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpec())}
              placeholder="Ej: Estructura de acero cromado"
              className={inputClass}
            />
            <button
              type="button"
              onClick={addSpec}
              className="shrink-0 rounded-lg bg-brand-green px-4 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
            >
              + Agregar
            </button>
          </div>

          {form.especificaciones.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.especificaciones.map((spec, i) => (
                <span
                  key={`${spec}-${i}`}
                  className="flex items-center gap-1.5 rounded-full bg-brand-green/10 px-3 py-1.5 text-xs font-semibold text-brand-green-dark"
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    aria-label="Quitar especificación"
                    className="text-brand-green-dark/60 transition hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {notice && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg bg-pulse/10 px-4 py-2 text-sm font-semibold text-pulse"
          >
            {notice}
          </motion.p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-green px-4 py-2.5 font-semibold text-white shadow-md shadow-brand-green/20 transition hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : form.id ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {saving ? "Guardando..." : form.id ? "Guardar cambios" : "Añadir producto"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-slate-200 px-4 py-2.5 font-semibold text-slate-500 transition hover:border-slate-400"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        {products.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Inbox className="mb-4 h-12 w-12 text-slate-300" />
            <p className="font-bold text-navy">No hay productos</p>
            <p className="text-sm text-slate-500">Agrega tu primer producto.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="px-5 py-3 font-semibold">Producto</th>
                  <th className="px-5 py-3 font-semibold">Categoría</th>
                  <th className="px-5 py-3 font-semibold">Precio (Bs)</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const inactivo = p.estado === "inactivo"
                  return (
                    <tr key={p.id} className={`transition ${inactivo ? "opacity-50" : "hover:bg-slate-50"}`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imagenes?.[0]}
                            alt={p.nombre}
                            className="h-10 w-10 rounded-lg object-cover"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                          <div>
                            <p className={`font-semibold text-navy ${inactivo ? "line-through" : ""}`}>
                              {p.nombre}
                            </p>
                            <p className="max-w-[240px] truncate text-xs text-slate-400">
                              {p.descripcion}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {CATEGORIES.find((c) => c.id === p.categoria_id)?.nombre}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-bold text-brand-green-dark">
                        {Number(p.precio_referencial || 0).toLocaleString("es-BO", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                            inactivo
                              ? "bg-slate-100 text-slate-500"
                              : "bg-brand-green/10 text-brand-green-dark"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${inactivo ? "bg-slate-400" : "bg-brand-green"}`} />
                          {inactivo ? "Inactivo" : "Activo"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => toggleEstado(p)}
                            title="Cambiar estado"
                            className={`rounded-lg p-2 transition ${
                              inactivo
                                ? "bg-brand-green/10 text-brand-green-dark hover:bg-brand-green/20"
                                : "bg-slate-100 text-pulse hover:bg-pulse/10"
                            }`}
                          >
                            <Power className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => startEdit(p)}
                            className="rounded-lg bg-navy/5 p-2 text-navy transition hover:bg-navy/10"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => remove(p)}
                            className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
    </div>
  )
}

export default AdminPanel