import { useEffect, useRef, useState } from "react"
import { Check, Loader2, Pencil, TriangleAlert } from "lucide-react"

/**
 * Editor de precio en línea para el listado de administración.
 * - Muestra la cifra actual (o "Sin precio" en alerta si es 0/nulo).
 * - Al hacer clic se convierte en un campo numérico editable.
 * - Al presionar Enter o perder el foco (onBlur) dispara la actualización.
 * - Muestra un indicador verde breve "Precio actualizado".
 */
function PriceEditor({ product, onSave }) {
  const initial = Number(product.precio_referencial || 0)
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initial ? String(initial) : "")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    setValue(initial ? String(initial) : "")
  }, [initial])

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  const cancel = () => {
    setValue(initial ? String(initial) : "")
    setEditing(false)
  }

  const commit = async () => {
    if (!editing) return
    setEditing(false)

    const numeric = Number(value)
    if (value.trim() === "" || Number.isNaN(numeric) || numeric < 0) {
      cancel()
      return
    }
    if (numeric === initial) return

    setSaving(true)
    try {
      await onSave(product, numeric)
      setSaved(true)
      setTimeout(() => setSaved(false), 2200)
    } catch {
      setValue(initial ? String(initial) : "")
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      commit()
    }
    if (e.key === "Escape") {
      e.preventDefault()
      cancel()
    }
  }

  const sinPrecio = !initial

  if (saved) {
    return (
      <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-600 ring-1 ring-emerald-200">
        <Check className="h-4 w-4" />
        Precio actualizado
      </span>
    )
  }

  if (saving) {
    return (
      <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-400 ring-1 ring-slate-200">
        <Loader2 className="h-4 w-4 animate-spin" />
        Guardando...
      </span>
    )
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1.5 rounded-lg border-2 border-brand-green bg-white px-2 py-1.5">
        <span className="text-xs font-bold text-slate-400">Bs.</span>
        <input
          ref={inputRef}
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          placeholder="0.00"
          className="w-full min-w-0 bg-transparent text-sm font-bold text-navy outline-none"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      title="Clic para editar el precio"
      className={`group/price flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left transition ring-1 ${
        sinPrecio
          ? "bg-amber-50 text-amber-600 ring-amber-200 hover:bg-amber-100"
          : "bg-slate-50 text-navy ring-slate-200 hover:bg-white hover:ring-brand-green/50"
      }`}
    >
      <span className="flex items-center gap-1.5 text-sm font-bold">
        {sinPrecio ? (
          <>
            <TriangleAlert className="h-4 w-4" />
            Sin precio
          </>
        ) : (
          <>Bs. {initial.toFixed(2)}</>
        )}
      </span>
      <Pencil className="h-3.5 w-3.5 text-slate-400 transition group-hover/price:text-brand-green" />
    </button>
  )
}

export default PriceEditor
