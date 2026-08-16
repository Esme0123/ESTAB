import { ShieldCheck, Truck, Headset, MessageCircle, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import Hero from "../components/Hero"
import CategoryGrid from "../components/CategoryGrid"

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

const CTA_WA_URL = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola, deseo una cotización rápida de equipamiento médico e insumos."
)}`

function WhyChooseUs() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">¿Por qué elegirnos?</h2>
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
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-white p-8 text-center shadow-card ring-1 ring-navy/5"
            >
              <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green-dark">
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
        className="relative overflow-hidden rounded-[2.5rem] bg-navy px-6 py-14 text-center text-white sm:px-12"
      >
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-brand-green blur-3xl" />
          <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-pulse blur-3xl" />
        </div>

        <div className="relative">
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
            ¿Necesitas una cotización rápida?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Envíanos tu requerimiento por WhatsApp y un asesor te responderá a la
            brevedad con las mejores opciones para tu clínica, laboratorio o empresa.
          </p>
          <a
            href={CTA_WA_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3.5 font-bold text-white shadow-xl shadow-brand-green/30 transition hover:bg-brand-green-dark hover:shadow-brand-green/40"
          >
            <MessageCircle className="h-5 w-5" />
            Cotizar por WhatsApp
            <ChevronRight className="h-5 w-5" />
          </a>
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