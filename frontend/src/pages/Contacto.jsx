import { useState } from "react"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Send, MessageCircle, User, AtSign, Smartphone } from "lucide-react"

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER

const INFO_CARDS = [
  {
    icon: Phone,
    titulo: "Teléfono / WhatsApp",
    valor: "+591 71814954",
    detalle: "Atención de lunes a viernes, 8:00 a 18:00",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
  {
    icon: Mail,
    titulo: "Correo electrónico",
    valor: "estabgroup@gmail.com",
    detalle: "Respondemos en un plazo máximo de 24 horas",
    href: "mailto:estabgroup@gmail.com",
  },
  {
    icon: MapPin,
    titulo: "Dirección",
    valor: "Ciudad Satélite C. Fernando Caballero # 1158",
    detalle: "El Alto, Bolivia",
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      "Ciudad Satélite C. Fernando Caballero 1158, El Alto, Bolivia"
    )}`,
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
}

function Contacto() {
  const [form, setForm] = useState({ nombre: "", correo: "", telefono: "", mensaje: "" })
  const [enviado, setEnviado] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const texto = `Hola, soy ${form.nombre}.\nCorreo: ${form.correo}\nTeléfono: ${form.telefono}\n\nMensaje: ${form.mensaje}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`, "_blank")
    setEnviado(true)
    setTimeout(() => setEnviado(false), 6000)
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20"

  return (
    <>
      <section className="relative overflow-hidden bg-navy py-20 text-white">
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
            Contáctenos
          </motion.span>
          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl"
          >
            Hablemos sobre tu proyecto
          </motion.h1>
          <motion.p variants={item} className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
            Cuéntanos qué necesitas y un asesor de Estab Group te contactará a la
            brevedad con la mejor solución.
          </motion.p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-navy/5 sm:p-8"
          >
            <motion.h2 variants={item} className="text-2xl font-extrabold text-navy">
              Formulario de consulta
            </motion.h2>
            <motion.p variants={item} className="mt-1 text-sm text-slate-500">
              Completa tus datos y presiona enviar para continuar por WhatsApp.
            </motion.p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
              <motion.div variants={item}>
                <label className="mb-1.5 block text-sm font-semibold text-navy">Nombre</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre completo"
                    className={inputClass}
                  />
                </div>
              </motion.div>

              <motion.div variants={item}>
                <label className="mb-1.5 block text-sm font-semibold text-navy">Correo</label>
                <div className="relative">
                  <AtSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    name="correo"
                    type="email"
                    value={form.correo}
                    onChange={handleChange}
                    required
                    placeholder="tucorreo@empresa.com"
                    className={inputClass}
                  />
                </div>
              </motion.div>

              <motion.div variants={item}>
                <label className="mb-1.5 block text-sm font-semibold text-navy">Teléfono</label>
                <div className="relative">
                  <Smartphone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    name="telefono"
                    type="tel"
                    value={form.telefono}
                    onChange={handleChange}
                    required
                    placeholder="+591 7XXXXXXX"
                    className={inputClass}
                  />
                </div>
              </motion.div>

              <motion.div variants={item}>
                <label className="mb-1.5 block text-sm font-semibold text-navy">Mensaje</label>
                <div className="relative">
                  <textarea
                    name="mensaje"
                    rows="4"
                    value={form.mensaje}
                    onChange={handleChange}
                    required
                    placeholder="Describe tu requerimiento: equipos, cantidades, plazos..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </motion.div>

              <motion.div variants={item}>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-3.5 font-bold text-white shadow-lg shadow-brand-green/30 transition hover:bg-brand-green-dark"
                >
                  <Send className="h-5 w-5" />
                  Enviar consulta por WhatsApp
                </button>

                {enviado && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand-green/10 px-4 py-3 text-sm font-semibold text-brand-green-dark"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Abriendo WhatsApp con tu consulta...
                  </motion.p>
                )}
              </motion.div>
            </form>
          </motion.div>

          <div className="grid content-start gap-5">
            {INFO_CARDS.map(({ icon: Icon, titulo, valor, detalle, href }, i) => (
              <motion.a
                key={titulo}
                href={href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ x: 6 }}
                className="flex items-start gap-4 rounded-3xl bg-white p-6 shadow-card ring-1 ring-navy/5"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-brand-green">
                  <Icon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    {titulo}
                  </span>
                  <span className="mt-1 block font-bold text-navy">{valor}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{detalle}</span>
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Contacto