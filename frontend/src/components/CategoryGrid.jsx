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
    <section
      id="categorias"
      className="bg-gradient-to-b from-slate-50 to-white py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <span className="inline-block rounded-full border border-brand-green/20 bg-brand-green/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-green">
            Líneas de negocio
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-navy sm:text-4xl">
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
            <motion.div key={cat.id} variants={item} whileHover={{ y: -8 }}>
              <div className="group relative overflow-hidden rounded-2xl p-[2px]">
                <div className="absolute inset-0 rounded-2xl running-gradient-border opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <Link
                  to={`/catalogo?categoria=${cat.id}`}
                  className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-[#13152B] shadow-xl shadow-navy/20 transition-shadow duration-300 hover:shadow-2xl hover:shadow-[#13152B]/40"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={cat.imagen}
                      alt={cat.nombre}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13152B] via-navy/10 to-transparent" />
                    <span
                      className={`absolute left-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl text-2xl ring-1 ring-white/20 backdrop-blur-md ${cat.colorFondo}`}
                    >
                      {cat.emoji}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-bold text-white">{cat.nombre}</h3>
                    <p className="mt-2 flex-1 text-sm text-slate-300/80">{cat.descripcion}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#22C55E] transition group-hover:gap-2 group-hover:text-emerald-300">
                      Ver productos
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default CategoryGrid