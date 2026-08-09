import { useState } from "react"
import { MessageCircle } from "lucide-react"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import CategoryGrid from "./components/CategoryGrid"
import Catalog from "./components/Catalog"
import AdminPanel from "./components/AdminPanel"
import Footer from "./components/Footer"
import { PRODUCTS, buildWhatsAppUrl } from "./data/mockProducts"

const FAB_PRODUCT = {
  nombre: "servicios",
  descripcion: "",
  especificaciones: [],
}

function App() {
  const [admin, setAdmin] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState(null)
  const [products, setProducts] = useState(() =>
    PRODUCTS.map((p) => ({ ...p, estado: p.estado || "activo" }))
  )

  const scrollToCatalog = () => {
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSelectCategory = (id) => {
    setActiveCategory(id)
    if (id) scrollToCatalog()
  }

  const handleToggleAdmin = () => {
    setAdmin((v) => !v)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        admin={admin}
        onToggleView={handleToggleAdmin}
        onSelectCategory={handleSelectCategory}
        onHome={() => {
          setAdmin(false)
          setActiveCategory(null)
          setSearchTerm("")
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
      />

      <main className="flex-1">
        {admin ? (
          <AdminPanel products={products} setProducts={setProducts} />
        ) : (
          <>
            <Hero onBrowse={scrollToCatalog} />
            <CategoryGrid
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />
            <Catalog
              products={products.filter((p) => p.estado !== "inactivo")}
              searchTerm={searchTerm}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />
          </>
        )}
      </main>

      <Footer />

      {!admin && (
        <a
          href={buildWhatsAppUrl(FAB_PRODUCT)}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white shadow-xl shadow-brand-green/40 transition hover:scale-110 hover:bg-brand-green-dark"
          aria-label="Consultar por WhatsApp"
        >
          <MessageCircle className="h-7 w-7" />
        </a>
      )}
    </div>
  )
}

export default App