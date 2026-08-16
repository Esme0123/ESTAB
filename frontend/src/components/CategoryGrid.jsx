import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { CATEGORIES } from "../data/mockProducts"

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

function CategoryGrid() {
  return (
    <section id="categorias" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">
          Nuestras Áreas de Especialización
        </h2>
        <p className="mt-3 text-slate-500">
          Cuatro líneas de negocio para clínicas, laboratorios y empresas.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {CATEGORIES.map((cat) => (
          <motion.div key={cat.id} variants={item}>
            <Link
              to={`/catalogo?categoria=${cat.id}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-navy/5 transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={cat.imagen}
                  alt={cat.nombre}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                <span
                  className={`absolute left-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl text-2xl backdrop-blur-sm ${cat.colorFondo}`}
                >
                  {cat.emoji}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className={`text-lg font-bold ${cat.colorTexto}`}>{cat.nombre}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-500">{cat.descripcion}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy transition group-hover:gap-2 group-hover:text-brand-green-dark">
                  Ver productos
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default CategoryGrid