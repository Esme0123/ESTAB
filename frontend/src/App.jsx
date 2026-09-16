import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { MessageCircle } from "lucide-react"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Login from "./components/Login"
import Home from "./pages/Home"
import Nosotros from "./pages/Nosotros"
import CatalogPage from "./pages/CatalogPage"
import Contacto from "./pages/Contacto"
import { buildGeneralWhatsAppUrl } from "./data/mockProducts"
import { api, API_BASE_URL } from "./services/api"

const WA_FAB_URL = buildGeneralWhatsAppUrl()

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
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

function App() {
  const [products, setProducts] = useState([])
  const [loadError, setLoadError] = useState("")

  useEffect(() => {
    let active = true

    // Despertar el servidor de Render apenas el usuario abra la página.
    fetch(`${API_BASE_URL}/ping.php`).catch(() => {})

    api
      .getProductos()
      .then((list) => {
        if (active) setProducts(list)
      })
      .catch((err) => {
        if (active) setLoadError(err.message || "No se pudo cargar el catálogo.")
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route
            path="/catalogo"
            element={
              <CatalogPage
                products={products}
                setProducts={setProducts}
                loadError={loadError}
              />
            }
          />
          <Route path="/contactenos" element={<Contacto />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Navigate to="/catalogo" replace />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App