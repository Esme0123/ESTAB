import { useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  Power,
  Inbox,
} from "lucide-react"
import { CATEGORIES } from "../data/mockProducts"

const EMPTY_FORM = {
  nombre: "",
  categoria: CATEGORIES[0].id,
  descripcion: "",
  imagen_url: "",
}

function AdminPanel({ products, setProducts }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [previewOk, setPreview] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.descripcion.trim()) return

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...form } : p))
      )
    } else {
      const nuevo = {
        id: Date.now(),
        ...form,
        especificaciones: ["Disponible para cotización", "Precio a consultar"],
      }
      setProducts((prev) => [nuevo, ...prev])
    }
    setForm(EMPTY_FORM)
    setEditingId(null)
    setPreview(null)
  }

  const startEdit = (p) => {
    setEditingId(p.id)
    setForm({
      nombre: p.nombre,
      categoria: p.categoria,
      descripcion: p.descripcion,
      imagen_url: p.imagen_url,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleEstado = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, estado: p.estado === "activo" ? "inactivo" : "activo" } : p
      )
    )
  }

  const remove = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-navy outline-none transition focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20"

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-navy">Panel de Administración</h2>
          <p className="mt-1 text-slate-500">
            Gestión simulada: los cambios se mantienen en memoria durante la sesión.
          </p>
        </div>
        <span className="rounded-full bg-pulse/10 px-4 py-1.5 text-sm font-bold text-pulse">
          {products.length} productos en catálogo
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
        <form
          onSubmit={handleSubmit}
          className="h-fit rounded-2xl bg-white p-6 shadow-card"
        >
          <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-navy">
            {editingId ? (
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
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
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
            URL de imagen
          </label>
          <input
            value={form.imagen_url}
            onChange={(e) => {
              setForm({ ...form, imagen_url: e.target.value })
              setPreview(e.target.value)
            }}
            placeholder="https://..."
            className={inputClass}
          />
          {previewOk && (
            <img
              src={previewOk}
              alt="Preview"
              onError={(e) => (e.currentTarget.style.display = "none")}
              onLoad={(e) => (e.currentTarget.style.display = "block")}
              className="mt-3 hidden h-24 w-full rounded-lg object-cover"
            />
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-green px-4 py-2.5 font-semibold text-white shadow-md shadow-brand-green/20 transition hover:bg-brand-green-dark"
            >
              {editingId ? (
                <>
                  <Check className="h-4 w-4" /> Guardar cambios
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Añadir producto
                </>
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setForm(EMPTY_FORM)
                  setPreview(null)
                }}
                className="rounded-full border border-slate-200 px-4 py-2.5 font-semibold text-slate-500 transition hover:border-slate-400"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="overflow-hidden rounded-2xl bg-white shadow-card">
          {products.filter((p) => !p.estado || p.estado === "activo").length === 0 &&
          products.length === 0 ? (
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
                              src={p.imagen_url}
                              alt={p.nombre}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className={`font-semibold text-navy ${inactivo ? "line-through" : ""}`}>
                                {p.nombre}
                              </p>
                              <p className="text-xs text-slate-400">{p.descripcion}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            {CATEGORIES.find((c) => c.id === p.categoria)?.nombre}
                          </span>
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
                              onClick={() => toggleEstado(p.id)}
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
                              onClick={() => remove(p.id)}
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
    </section>
  )
}

export default AdminPanel