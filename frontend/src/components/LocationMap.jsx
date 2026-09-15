import { motion } from "framer-motion"
import { MapPin, Phone, Mail } from "lucide-react"
import { WHATSAPP_NUMBER, EMAIL_CONTACT } from "../data/mockProducts"

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.291768482618!2d-68.1512249!3d-16.5232924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915edf3286c39959%3A0x39cefd442670a1b0!2sESTAB!5e0!3m2!1ses!2sbo!4v1700000000000"

const INFO_CARDS = [
  {
    icon: MapPin,
    titulo: "Dirección",
    valor: "Ciudad Satélite C. Fernando Caballero #1158",
    detalle: "El Alto, La Paz · Bolivia",
    href: "https://maps.google.com/?q=C.+Fernando+Caballero+1158,+Ciudad+Satelite,+El+Alto,+Bolivia",
  },
  {
    icon: Phone,
    titulo: "Teléfono / WhatsApp",
    valor: "+591 71814954",
    detalle: "Atención de lunes a viernes, 8:00 a 18:00",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
  {
    icon: Mail,
    titulo: "Correo Oficial",
    valor: EMAIL_CONTACT,
    detalle: "Respondemos en un plazo máximo de 24 horas",
    href: `mailto:${EMAIL_CONTACT}`,
  },
]

function LocationMap() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">
          Nuestra Ubicación
        </h2>
        <p className="mt-3 text-slate-500">
          Visítanos en Ciudad Satélite y conoce nuestro catálogo completo en
          persona o solicita atención a domicilio.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="h-[400px] w-full overflow-hidden rounded-3xl border-2 border-emerald-500/20 shadow-xl"
        >
          <iframe
            src={MAP_EMBED_URL}
            title="Ubicación de Estab Group S.R.L."
            className="h-full w-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
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
  )
}

export default LocationMap