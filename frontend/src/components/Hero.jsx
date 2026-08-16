import { MessageCircle, ChevronRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const WA_URL = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola, deseo más información sobre sus soluciones."
)}`

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-green blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-pulse blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 lg:flex-row lg:text-left">
        <motion.div
          className="flex-1"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-brand-green/40 bg-brand-green/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-green"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Equipamiento médico e insumos
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
          >
            Equipamiento para tu{" "}
            <span className="bg-gradient-to-r from-brand-green to-pulse bg-clip-text text-transparent">
              Clínica o Laboratorio
            </span>
          </motion.h1>

          <motion.p variants={item} className="mx-auto mt-5 max-w-2xl text-lg text-white/70 lg:mx-0">
            En Estab Group S.R.L. proveemos equipamiento médico, mobiliario de
            laboratorio y clínica, insumos médicos y material corporativo y de
            limpieza. Innovación, Tecnología y Confianza en cada entrega.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <button
              onClick={() =>
                document
                  .getElementById("categorias")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 font-semibold text-white shadow-lg shadow-brand-green/30 transition hover:bg-brand-green-dark"
            >
              Ver nuestro catálogo
              <ChevronRight className="h-5 w-5" />
            </button>
            <a
              href={WA_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-pulse hover:bg-pulse/10"
            >
              <MessageCircle className="h-5 w-5 text-brand-green" />
              Contacto directo
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/60"
          >
            {["🇧🇴 La Paz - Bolivia", "✅ Proveedor certificado", "📦 Entregas en todo el país"].map(
              (tag) => (
                <span key={tag} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
                  {tag}
                </span>
              )
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="relative hidden flex-1 lg:block"
        >
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=60"
              alt="Equipo trabajando con Estab Group"
              className="h-full w-full rounded-3xl object-cover shadow-2xl"
              loading="lazy"
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 text-navy shadow-xl"
            >
              <p className="text-2xl font-extrabold text-brand-green-dark">+500</p>
              <p className="text-xs font-medium text-slate-600">Empresas atendidas</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="relative flex items-center justify-center gap-2 border-t border-white/10 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
        Innovación <span className="text-brand-green">·</span> Tecnología{" "}
        <span className="text-pulse">·</span> Confianza
      </div>
    </section>
  )
}

export default Hero