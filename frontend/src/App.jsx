import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom"
import { MessageCircle, LogOut, ExternalLink } from "lucide-react"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import CategoryGrid from "./components/CategoryGrid"
import Catalog from "./components/Catalog"
import AdminPanel from "./components/AdminPanel"
import Login from "./components/Login"
import Footer from "./components/Footer"
import { PRODUCTS, buildWhatsAppUrl } from "./data/mockProducts"
import { isAuthenticated, logout } from "./lib/auth"

const FAB_PRODUCT = {
  nombre: "servicios",
  descripcion: "",
  especificaciones: [],
}

function PublicSite({ products }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState(null)

  const scrollToCatalog = () => {
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSelectCategory = (id) => {
    setActiveCategory(id)
    if (id) scrollToCatalog()
  }

  const handleHome = () => {
    setActiveCategory(null)
    setSearchTerm("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <Navbar onSelectCategory={handleSelectCategory} onHome={handleHome} />
      <main className="flex-1">
        <Hero onBrowse={scrollToCatalog} />
        <CategoryGrid
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />
        <Catalog
          products={products.filter((p) => p.estado !== "inactivo")}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />
      </main>
      <Footer onSelectCategory={handleSelectCategory} />

      <a
        href={buildWhatsAppUrl(FAB_PRODUCT)}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white shadow-xl shadow-brand-green/40 transition hover:scale-110 hover:bg-brand-green-dark"
        aria-label="Consultar por WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </>
  )
}

function AdminHeader() {
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate("/admin/login", { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 bg-navy shadow-lg shadow-navy/20">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-3 text-left">
          <img src="/logo-estab.svg" alt="Logo Estab Group" className="h-11 w-11 rounded-xl" />
          <span className="hidden leading-tight sm:block">
            <span className="block text-lg font-bold tracking-wide text-white">ESTAB GROUP</span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-brand-green">
              S.R.L.
            </span>
          </span>
        </Link>

        <nav className="hidden flex-1 justify-center lg:flex">
          <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-brand-green">
            Panel de Administración
          </span>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Ver Sitio</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full bg-pulse px-4 py-2 text-sm font-semibold text-white transition hover:bg-pulse/90"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  )
}

function ProtectedAdmin({ products, setProducts }) {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AdminHeader />
      <main className="flex-1">
        <AdminPanel products={products} setProducts={setProducts} />
      </main>
    </div>
  )
}

function App() {
  const [products, setProducts] = useState(() =>
    PRODUCTS.map((p) => ({ ...p, estado: p.estado || "activo" }))
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<PublicSite products={products} />}
        />
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={<ProtectedAdmin products={products} setProducts={setProducts} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App