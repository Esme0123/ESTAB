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
  1: Stethoscope,
  2: FlaskConical,
  3: Syringe,
  4: SprayCan,
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
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)
  const closeTimer = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-800/50 bg-slate-900/80 shadow-lg shadow-black/20 backdrop-blur-md"
          : "border-b border-transparent bg-slate-950/50 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          onClick={goTo}
          className="group relative flex shrink-0 items-center gap-3 text-left"
        >
          <span className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl bg-emerald-400/20 opacity-0 blur-xl transition duration-500 group-hover:opacity-70" />
          <img
            src="/logo_nombre_2_transparent.png"
            alt="Logo Estab Group S.R.L."
            className="h-12 w-auto object-contain drop-shadow-[0_4px_16px_rgba(16,185,129,0.35)] transition duration-300 md:h-14"
          />
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
                  className="absolute left-1/2 top-full z-50 mt-3 w-[420px] -translate-x-1/2 rounded-3xl border border-white/10 bg-slate-900/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                      Categorías
                    </span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {CATEGORIES.map((cat) => {
                      const Icon = CATEGORY_ICONS[cat.id]
                      return (
                        <Link
                          key={cat.id}
                          to={`/catalogo?categoria=${cat.id}`}
                          onClick={goTo}
                          className="group flex items-start gap-3 rounded-2xl p-3 transition hover:bg-white/10"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-lg transition group-hover:bg-brand-green">
                            {Icon ? (
                              <Icon className="h-5 w-5 text-brand-green group-hover:text-white" />
                            ) : (
                              <span className="group-hover:text-white">{cat.emoji}</span>
                            )}
                          </span>
                          <span>
                            <span className="block text-sm font-bold text-white transition">
                              {cat.nombre}
                            </span>
                            <span className="mt-0.5 block text-xs leading-snug text-slate-400 transition group-hover:text-white/70">
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
                    className="mt-4 flex items-center justify-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
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