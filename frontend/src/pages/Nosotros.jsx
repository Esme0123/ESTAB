import { Target, Eye, Lightbulb, Cpu, ShieldCheck, Award } from "lucide-react"
import { motion } from "framer-motion"

const MISION =
  "Proveer soluciones integrales en equipamiento médico, insumos de laboratorio y mobiliario especializado con los más altos estándares de calidad y tecnología en Bolivia."

const VISION =
  "Ser el aliado estratégico líder a nivel nacional en el suministro de tecnología médica y equipamiento corporativo, garantizando innovación y respaldo continuo."

const VALORES = [
  {
    icon: Lightbulb,
    titulo: "Innovación",
    descripcion:
      "Buscamos constantemente nuevas soluciones y productos que mejoren la atención en salud.",
  },
  {
    icon: Cpu,
    titulo: "Tecnología",
    descripcion:
      "Equipamiento moderno y de vanguardia para clínicas, laboratorios y empresas.",
  },
  {
    icon: ShieldCheck,
    titulo: "Confianza",
    descripcion:
      "Relaciones transparentes y respaldo continuo después de cada entrega.",
  },
  {
    icon: Award,
    titulo: "Calidad",
    descripcion:
      "Estándares exigentes en cada producto y en cada servicio que ofrecemos.",
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
}

function Nosotros() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy py-20 text-white">
        <motion.img
          src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1600&q=70"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-indigo-950/80" />
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-green blur-3xl" />
          <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-pulse blur-3xl" />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <motion.span
            variants={item}
            className="inline-block rounded-full border border-brand-green/40 bg-brand-green/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-green"
          >
            Nosotros
          </motion.span>
          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl"
          >
            Estab Group S.R.L.{" "}
            <span className="bg-gradient-to-r from-brand-green to-pulse bg-clip-text text-transparent">
              Innovación y Confianza
            </span>
          </motion.h1>
          <motion.p variants={item} className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
            Somos una empresa boliviana dedicada al suministro de equipamiento
            médico, insumos de laboratorio y mobiliario especializado para el
            sector salud y empresarial.
          </motion.p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            whileHover={{ y: -6 }}
            className="rounded-3xl border-t-4 border-brand-green bg-white p-8 shadow-card ring-1 ring-navy/5"
          >
            <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green-dark">
              <Target className="h-7 w-7" />
            </span>
            <h2 className="text-2xl font-extrabold text-navy">Misión</h2>
            <p className="mt-4 leading-relaxed text-slate-600">{MISION}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.12 }}
            whileHover={{ y: -6 }}
            className="rounded-3xl border-t-4 border-pulse bg-white p-8 shadow-card ring-1 ring-navy/5"
          >
            <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-pulse/10 text-pulse">
              <Eye className="h-7 w-7" />
            </span>
            <h2 className="text-2xl font-extrabold text-navy">Visión</h2>
            <p className="mt-4 leading-relaxed text-slate-600">{VISION}</p>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">
              Valores Corporativos
            </h2>
            <p className="mt-3 text-slate-500">
              Los principios que guían cada una de nuestras entregas.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {VALORES.map(({ icon: Icon, titulo, descripcion }) => (
              <motion.div
                key={titulo}
                variants={item}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group rounded-3xl bg-white p-7 text-center shadow-card ring-1 ring-navy/5"
              >
                <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-white transition group-hover:bg-brand-green">
                  <Icon className="h-8 w-8" />
                </span>
                <h3 className="text-lg font-bold text-navy">{titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{descripcion}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Nosotros