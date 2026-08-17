import { ShieldCheck, Truck, Headset, MessageCircle, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import Hero from "../components/Hero"
import CategoryGrid from "../components/CategoryGrid"
import { buildGeneralWhatsAppUrl } from "../data/mockProducts"

const WHY_ITEMS = [
  {
    icon: ShieldCheck,
    titulo: "Garantía de calidad",
    descripcion:
      "Productos certificados y verificación de cada entrega para asegurar la mejor inversión.",
  },
  {
    icon: Truck,
    titulo: "Envíos a nivel nacional",
    descripcion:
      "Llegamos a todo Bolivia con logística segura y tiempos de entrega coordinados contigo.",
  },
  {
    icon: Headset,
    titulo: "Atención personalizada",
    descripcion:
      "Asesoría directa por WhatsApp y por teléfono para elegir el equipamiento ideal.",
  },
]

const CTA_WA_URL = buildGeneralWhatsAppUrl()

const DOT_PATTERN = {
  backgroundImage:
    "radial-gradient(circle at 1px 1px, rgb(30 27 75 / 0.06) 1px, transparent 0)",
  backgroundSize: "28px 28px",
}

function WhyChooseUs() {
  return (
    <section
      className="bg-gradient-to-b from-slate-50 to-slate-100 py-16"
      style={DOT_PATTERN}
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
            Nuestro valor
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-navy sm:text-4xl">¿Por qué elegirnos?</h2>
          <p className="mt-3 text-slate-500">
            La confianza de más de 500 empresas respalda nuestro servicio.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {WHY_ITEMS.map(({ icon: Icon, titulo, descripcion }, i) => (
            <motion.div
              key={titulo}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -8 }}
              className="group rounded-3xl border border-slate-200/80 bg-white/70 p-8 text-center shadow-xl shadow-navy/5 backdrop-blur-md transition-shadow hover:border-brand-green/25 hover:shadow-2xl hover:shadow-brand-green/10"
            >
              <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green ring-1 ring-brand-green/20 transition duration-300 group-hover:bg-brand-green group-hover:text-white">
                <Icon className="h-8 w-8" />
              </span>
              <h3 className="text-xl font-bold text-navy">{titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{descripcion}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#1A1C38] via-[#20234A] to-[#2A2E66] px-6 py-14 text-center text-white shadow-2xl shadow-[#1A1C38]/20 ring-1 ring-white/10 sm:px-12"
      >
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#3BB54A] blur-3xl" />
          <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-[#2E315C] blur-3xl" />
          <div className="absolute left-1/3 top-1/2 h-56 w-56 rounded-full bg-[#3BB54A]/40 blur-3xl" />
        </div>

        <div className="relative">
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
            ¿Necesitas una cotización rápida?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Envíanos tu requerimiento por WhatsApp y un asesor te responderá a la
            brevedad con las mejores opciones para tu clínica, laboratorio o empresa.
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            href={CTA_WA_URL}
            target="_blank"
            rel="noreferrer"
            className="group relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#3BB54A] px-7 py-3.5 font-bold text-white shadow-xl shadow-[#3BB54A]/40 transition hover:bg-[#2E9E3C] hover:shadow-[#3BB54A]/60"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="pointer-events-none absolute -inset-1 rounded-full bg-[#3BB54A]/40 opacity-0 blur-md transition group-hover:animate-pulse group-hover:opacity-100" />
            <MessageCircle className="h-5 w-5" />
            Cotizar por WhatsApp
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </motion.a>
        </div>
      </motion.div>
    </section>
  )
}

function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <WhyChooseUs />
      <CtaBanner />
    </>
  )
}

export default Home