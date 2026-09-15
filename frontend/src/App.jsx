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
import { api, mockProductos, BASE_URL } from "./services/api"

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
  const [products, setProducts] = useState(() => mockProductos())

  useEffect(() => {
    let active = true

    // Despertar el servidor de Render apenas el usuario abra la página.
    fetch(`${BASE_URL}/ping.php`).catch(() => {})

    api
      .getProductos()
      .then((list) => {
        if (active && list.length > 0) setProducts(list)
      })
      .catch(() => {
        // Si el backend no está disponible, se mantienen los productos mock.
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
          <Route path="/catalogo" element={<CatalogPage products={products} setProducts={setProducts} />} />
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