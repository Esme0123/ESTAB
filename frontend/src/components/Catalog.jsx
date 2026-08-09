import { useState } from "react"
import { MessageCircle, Eye, X, PackageSearch } from "lucide-react"
import { CATEGORIES, buildWhatsAppUrl } from "../data/mockProducts"

function ProductModal({ product, onClose }) {
  if (!product) return null
  const cat = CATEGORIES.find((c) => c.id === product.categoria)

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-navy shadow transition hover:bg-white"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative h-60 sm:h-72">
          <img
            src={product.imagen_url}
            alt={product.nombre}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
          <span
            className={`absolute bottom-4 left-4 rounded-full px-3 py-1 text-xs font-bold ${cat?.colorFondo} ${cat?.colorTexto}`}
          >
            {cat?.emoji} {cat?.nombre}
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <h3 className="text-2xl font-extrabold text-navy">{product.nombre}</h3>
          <p className="mt-3 text-slate-600">{product.descripcion}</p>

          <h4 className="mt-6 text-sm font-bold uppercase tracking-wider text-navy">
            Especificaciones
          </h4>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {product.especificaciones.map((spec) => (
              <li
                key={spec}
                className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600"
              >
                <span className="h-2 w-2 rounded-full bg-brand-green" />
                {spec}
              </li>
            ))}
          </ul>

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
      </div>
    </div>
  )
}

function Catalog({ products, searchTerm, activeCategory, onSelectCategory }) {
  const [selected, setSelected] = useState(null)

  const catName = activeCategory
    ? CATEGORIES.find((c) => c.id === activeCategory)?.nombre
    : null

  const filtered = products.filter((p) => {
    const matchesCategory = !activeCategory || p.categoria === activeCategory
    const q = searchTerm.toLowerCase()
    const matchesSearch =
      !q ||
      p.nombre.toLowerCase().includes(q) ||
      p.descripcion.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  return (
    <section id="catalogo" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">
            Catálogo de Productos
          </h2>
<p className="mt-2 text-slate-500">
            {catName
              ? `Mostrando productos de: ${catName}`
              : "Toda la gama de productos y servicios."}
          </p>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            !activeCategory
              ? "bg-navy text-white"
              : "bg-white text-navy hover:bg-navy/10"
          }`}
        >
          Todos
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeCategory === cat.id
                ? "bg-navy text-white"
                : "bg-white text-navy hover:bg-navy/10"
            }`}
          >
            {cat.emoji} {cat.nombre}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl bg-white py-16 text-center shadow-card">
          <PackageSearch className="mb-4 h-14 w-14 text-slate-300" />
          <p className="text-lg font-bold text-navy">No se encontraron productos</p>
          <p className="text-sm text-slate-500">
            Intenta con otro término de búsqueda o categoría.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => {
            const cat = CATEGORIES.find((c) => c.id === product.categoria)
            return (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={product.imagen_url}
                    alt={product.nombre}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
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
              </article>
            )
          })}
        </div>
      )}

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  )
}

export default Catalog