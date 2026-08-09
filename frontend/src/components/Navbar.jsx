import { Search, LayoutDashboard, Menu, X } from "lucide-react"
import { useState } from "react"
import { CATEGORIES } from "../data/mockProducts"

function Navbar({
  searchTerm,
  setSearchTerm,
  admin,
  onToggleView,
  onSelectCategory,
  onHome,
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-navy shadow-lg shadow-navy/20">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <button onClick={onHome} className="flex shrink-0 items-center gap-3 text-left">
          <img
            src="/logo-estab.svg"
            alt="Logo Estab Group"
            className="h-11 w-11 rounded-xl"
          />
          <span className="hidden leading-tight sm:block">
            <span className="block text-lg font-bold tracking-wide text-white">
              ESTAB GROUP
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-brand-green">
              S.R.L.
            </span>
          </span>
        </button>

        <div className="relative max-w-xl flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full rounded-full border border-white/10 bg-white/10 py-2 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-white/50 focus:border-brand-green focus:bg-white/15"
          />
        </div>

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
          onClick={() => {
            onToggleView()
            setMenuOpen(false)
          }}
          className={`ml-auto flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition lg:ml-0 ${
            admin
              ? "bg-pulse text-white hover:bg-pulse/90"
              : "bg-brand-green text-white hover:bg-brand-green/90"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden sm:inline">{admin ? "Ver Sitio" : "Panel Admin"}</span>
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
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar