import { useState, useRef, useEffect } from "react"
import { Link, NavLink } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  Menu,
  X,
  Lock,
  ChevronDown,
  Stethoscope,
  FlaskConical,
  Syringe,
  SprayCan,
  ArrowRight,
  MessageCircle,
} from "lucide-react"
import { CATEGORIES, buildGeneralWhatsAppUrl } from "../data/mockProducts"

const CATEGORY_ICONS = {
  "equipamiento-medico": Stethoscope,
  "mobiliario-laboratorio": FlaskConical,
  "insumos-medicos": Syringe,
  "material-corporativo": SprayCan,
}

const WA_CONTACT_URL = buildGeneralWhatsAppUrl()

const NAV_LINKS = [
  { label: "Inicio", to: "/" },
  { label: "Nosotros", to: "/nosotros" },
]

const NAV_TAIL = [{ label: "Contáctenos", to: "/contactenos" }]

function NavItem({ to, label, isActive, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={`relative rounded-lg px-4 py-2 text-sm font-semibold transition ${
        isActive ? "text-white" : "text-white/70 hover:text-white"
      }`}
    >
      {label}
      {isActive && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-0 -z-10 rounded-lg bg-white/10"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </NavLink>
  )
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const closeTimer = useRef(null)

  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  const openDropdown = () => {
    clearTimeout(closeTimer.current)
    setDropdownOpen(true)
  }

  const closeDropdown = () => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 150)
  }

  const goTo = () => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-navy shadow-lg shadow-navy/20">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" onClick={goTo} className="flex shrink-0 items-center gap-3 text-left">
          <span className="flex items-center justify-center rounded-2xl bg-white p-1.5 shadow-md">
            <img
              src="/logo_nombre_2.jpeg"
              alt="Logo Estab Group S.R.L."
              className="h-14 w-auto rounded-xl object-contain"
            />
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map(({ label, to }) => (
            <NavItem key={to} to={to} label={label} />
          ))}

          <div
            ref={dropdownRef}
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
            className="relative"
          >
            <NavLink
              to="/catalogo"
              className={({ isActive }) =>
                `flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isActive ? "text-white" : "text-white/70 hover:text-white"
                }`
              }
            >
              Catálogo
              <motion.span
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </NavLink>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute left-1/2 top-full z-50 mt-3 w-[420px] -translate-x-1/2 rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-navy/5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                      Categorías
                    </span>
                    <span className="h-px flex-1 bg-slate-100" />
                  </div>

                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {CATEGORIES.map((cat) => {
                      const Icon = CATEGORY_ICONS[cat.id]
                      return (
                        <Link
                          key={cat.id}
                          to={`/catalogo?categoria=${cat.id}`}
                          onClick={goTo}
                          className="group flex items-start gap-3 rounded-2xl p-3 transition hover:bg-navy"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green-dark transition group-hover:bg-brand-green group-hover:text-white">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span>
                            <span className="block text-sm font-bold text-navy transition group-hover:text-white">
                              {cat.nombre}
                            </span>
                            <span className="mt-0.5 block text-xs leading-snug text-slate-400 transition group-hover:text-white/60">
                              {cat.descripcion}
                            </span>
                          </span>
                        </Link>
                      )
                    })}
                  </div>

                  <Link
                    to="/catalogo"
                    onClick={goTo}
                    className="mt-4 flex items-center justify-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-soft"
                  >
                    Ver todo el catálogo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {NAV_TAIL.map(({ label, to }) => (
            <NavItem key={to} to={to} label={label} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={WA_CONTACT_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 text-sm font-semibold text-brand-green transition hover:bg-brand-green hover:text-white lg:flex"
          >
            <MessageCircle className="h-4 w-4" />
            Cotizar
          </a>

          <Link
            to="/admin/login"
            title="Acceso de administración"
            aria-label="Acceso de administración"
            onClick={goTo}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/50 transition hover:border-brand-green hover:text-brand-green"
          >
            <Lock className="h-4 w-4" />
          </Link>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-2 text-white lg:hidden"
            aria-label="Abrir menú"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <nav className="grid gap-1 px-4 py-3">
              {NAV_LINKS.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={goTo}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-semibold ${
                      isActive ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              <NavLink
                to="/catalogo"
                onClick={goTo}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold ${
                    isActive ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10"
                  }`
                }
              >
                Catálogo
              </NavLink>

              <div className="mt-2 grid gap-1 rounded-xl bg-white/5 p-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/catalogo?categoria=${cat.id}`}
                    onClick={goTo}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                  >
                    <span className="text-base">{cat.emoji}</span>
                    {cat.nombre}
                  </Link>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar