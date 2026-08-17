import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, X, Upload, Loader2, Check, ImageOff, Pencil } from "lucide-react"
import { CATEGORIES } from "../data/mockProducts"
import { api } from "../services/api"

const EMPTY_FORM = {
  id: null,
  nombre: "",
  descripcion: "",
  precio_referencial: "",
  categoria_id: CATEGORIES[0].id,
  imagenes: [],
  especificaciones: [],
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-navy outline-none transition focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20"

function ProductFormModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(() =>
    initial
      ? {
          id: initial.id,
          nombre: initial.nombre,
          descripcion: initial.descripcion,
          precio_referencial: String(initial.precio_referencial ?? ""),
          categoria_id: initial.categoria_id,
          imagenes: [...(initial.imagenes || [])],
          especificaciones: [...(initial.especificaciones || [])],
        }
      : EMPTY_FORM
  )
  const [newSpec, setNewSpec] = useState("")
  const [newImageUrl, setNewImageUrl] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

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
      setError(err.message || "Error al subir la imagen.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.descripcion.trim()) {
      setError("Nombre y descripción son obligatorios.")
      return
    }
    setSaving(true)
    setError("")
    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio_referencial: Number(form.precio_referencial) || 0,
        categoria_id: Number(form.categoria_id),
        imagenes: form.imagenes.filter(Boolean),
        especificaciones: form.especificaciones.filter(Boolean),
      }
      await onSave(payload)
      onClose()
    } catch (err) {
      setError(err.message || "Error al guardar el producto.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25 }}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-navy">
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
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-navy"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6">
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
                {cat.emoji} {cat.nombre}
              </option>
            ))}
          </select>

          <label className="mb-1 mt-4 block text-sm font-semibold text-navy">Descripción</label>
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
                className="shrink-0 cursor-pointer rounded-lg bg-navy px-4 text-sm font-semibold text-white transition hover:bg-navy-soft"
              >
                Agregar
              </button>
            </div>

            <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 px-4 py-2.5 text-sm font-semibold text-navy transition hover:border-brand-green hover:text-brand-green-dark">
              <Upload className="h-4 w-4" />
              {uploading ? "Subiendo..." : "Subir imagen desde tu equipo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>

            {form.imagenes.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {form.imagenes.map((url, i) => (
                  <div key={`${url}-${i}`} className="group relative overflow-hidden rounded-lg">
                    {url ? (
                      <img
                        src={url}
                        alt={`Imagen ${i + 1}`}
                        className="h-16 w-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    ) : (
                      <span className="flex h-16 w-full items-center justify-center bg-slate-100 text-slate-300">
                        <ImageOff className="h-5 w-5" />
                      </span>
                    )}
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
                className="shrink-0 cursor-pointer rounded-lg bg-brand-green px-4 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
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

          {error && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-lg bg-pulse/10 px-4 py-2 text-sm font-semibold text-pulse"
            >
              {error}
            </motion.p>
          )}

          <div className="mt-6 flex gap-3">
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={saving || uploading}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-green px-4 py-2.5 font-semibold text-white shadow-md shadow-brand-green/20 transition hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : form.id ? (
                <Check className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {saving ? "Guardando..." : form.id ? "Guardar cambios" : "Añadir producto"}
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="cursor-pointer rounded-full border border-slate-200 px-4 py-2.5 font-semibold text-slate-500 transition hover:border-slate-400"
            >
              Cancelar
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default ProductFormModal