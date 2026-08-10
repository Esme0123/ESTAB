import { Phone, Mail, MapPin, MessageCircle, Lock } from "lucide-react"
import { Link } from "react-router-dom"
import { CATEGORIES } from "../data/mockProducts"

const WHATSAPP_URL = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`

const SOCIAL = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  },
]

function Footer({ onSelectCategory }) {
  const handleLine = (id) => {
    onSelectCategory(id)
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <img
            src="/logo_nombre_2.jpeg"
            alt="Logo Estab Group S.R.L."
            className="h-16 w-auto rounded-xl"
          />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
            Proveemos equipamiento médico, mobiliario de laboratorio y clínica,
            insumos médicos y material corporativo y de limpieza para clínicas,
            hospitales y empresas en Bolivia.
          </p>
          <div className="mt-5 flex gap-3">
            {SOCIAL.map(({ name, href, path }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={name}
                title={name}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-brand-green hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d={path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="md:justify-self-center">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">
            Contacto
          </h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
              <div>
                <p className="font-semibold">+591 71814954</p>
                <p className="text-xs text-white/50">Teléfono / WhatsApp</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
              <div>
                <p className="font-semibold">estabgroup@gmail.com</p>
                <p className="text-xs text-white/50">Correo electrónico</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
              <div>
                <p className="font-semibold">
                  Ciudad Satélite C. Fernando Caballero # 1158
                </p>
                <p className="text-xs text-white/50">El Alto, Bolivia</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="md:justify-self-end">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">
            Líneas de negocio
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => handleLine(cat.id)}
                  className="rounded-lg px-1 py-0.5 text-left transition hover:text-brand-green"
                >
                  {cat.emoji} {cat.nombre}
                </button>
              </li>
            ))}
          </ul>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex w-fit items-center justify-center gap-2 rounded-full bg-brand-green px-5 py-2.5 font-semibold text-white shadow-lg shadow-brand-green/25 transition hover:bg-brand-green-dark"
          >
            <MessageCircle className="h-4 w-4" />
            Cotiza por WhatsApp
          </a>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 border-t border-white/10 px-4 py-4 text-xs text-white/40 sm:flex-row sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {import.meta.env.VITE_APP_TITLE} · Todos los
          derechos reservados
        </p>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <Lock className="h-3 w-3" />
          Panel de Administración
        </Link>
      </div>
    </footer>
  )
}

export default Footer