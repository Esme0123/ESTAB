import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, Outlet } from "react-router-dom"
import { MessageCircle, LogOut, ExternalLink } from "lucide-react"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import AdminPanel from "./components/AdminPanel"
import Login from "./components/Login"
import Home from "./pages/Home"
import Nosotros from "./pages/Nosotros"
import CatalogPage from "./pages/CatalogPage"
import Contacto from "./pages/Contacto"
import { PRODUCTS } from "./data/mockProducts"
import { isAuthenticated, logout } from "./lib/auth"

const WA_FAB_URL = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola, deseo más información sobre sus soluciones."
)}`

function PublicLayout({ products }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet context={{ products }} />
      </main>
      <Footer />

      <a
        href={WA_FAB_URL}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white shadow-xl shadow-brand-green/40 transition hover:scale-110 hover:bg-brand-green-dark"
        aria-label="Consultar por WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
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
          <span className="flex items-center justify-center rounded-xl bg-white p-1.5 shadow-md">
            <img
              src="/logo_nombre_2.jpeg"
              alt="Logo Estab Group"
              className="h-9 w-auto rounded-lg object-contain"
            />
          </span>
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
        <Route element={<PublicLayout products={products} />}>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/contactenos" element={<Contacto />} />
        </Route>

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