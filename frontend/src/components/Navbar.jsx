import { Lock, Menu, X } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CATEGORIES } from "../data/mockProducts"

function Navbar({ onSelectCategory, onHome }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const goAdmin = () => {
    setMenuOpen(false)
    navigate("/admin")
  }

  return (
    <header className="sticky top-0 z-50 bg-navy shadow-lg shadow-navy/20">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <button onClick={onHome} className="flex shrink-0 items-center gap-3 text-left">
          <img
            src="/logo_nombre_2.jpeg"
            alt="Logo Estab Group S.R.L."
            className="h-12 w-auto rounded-xl"
          />
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {cat.nombre}
            </button>
          ))}
        </nav>

        <button
          onClick={goAdmin}
          title="Acceso de administración"
          aria-label="Acceso de administración"
          className="ml-auto flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-sm font-medium text-white/70 transition hover:border-brand-green hover:text-brand-green lg:ml-0"
        >
          <Lock className="h-4 w-4" />
          <span className="hidden sm:inline">Admin</span>
        </button>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-lg p-2 text-white lg:hidden"
          aria-label="Abrir menú"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 px-4 py-3 lg:hidden">
          <nav className="grid gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id)
                  setMenuOpen(false)
                }}
                className="rounded-lg px-3 py-2 text-left text-sm text-white/85 hover:bg-white/10"
              >
                {cat.emoji} {cat.nombre}
              </button>
            ))}
            <button
              onClick={goAdmin}
              className="mt-2 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-left text-sm font-semibold text-brand-green hover:bg-white/15"
            >
              <Lock className="h-4 w-4" />
              Panel de Administración
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar