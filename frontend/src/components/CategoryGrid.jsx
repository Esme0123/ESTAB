import { ArrowRight } from "lucide-react"
import { CATEGORIES } from "../data/mockProducts"

function CategoryGrid({ activeCategory, onSelectCategory }) {
  return (
    <section id="categorias" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">
          Nuestras Áreas de Especialización
        </h2>
        <p className="mt-3 text-slate-500">
          Cuatro líneas de negocio para clínicas, laboratorios y empresas.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const activo = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(activo ? null : cat.id)}
              className={`group relative flex flex-col rounded-2xl border-2 bg-white p-6 text-left shadow-card transition hover:-translate-y-1 hover:shadow-xl ${cat.colorBorde} ${
                activo ? "ring-4 ring-brand-green/30" : ""
              }`}
            >
              <span
                className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${cat.colorFondo}`}
              >
                {cat.emoji}
              </span>
              <h3 className={`text-lg font-bold ${cat.colorTexto}`}>{cat.nombre}</h3>
              <p className="mt-2 flex-1 text-sm text-slate-500">{cat.descripcion}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy group-hover:text-brand-green-dark">
                {activo ? "Filtrando..." : "Ver productos"}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default CategoryGrid