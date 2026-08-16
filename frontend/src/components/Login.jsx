import { useState } from "react"
import { Navigate, Link, useNavigate } from "react-router-dom"
import { Lock, Mail, LogIn, ArrowLeft, MessageCircle, Loader2 } from "lucide-react"
import { isAuthenticated, setSession } from "../lib/auth"
import { api } from "../services/api"
import { WHATSAPP_NUMBER } from "../data/mockProducts"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (isAuthenticated()) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!email.trim() || !password.trim()) {
      setError("Ingresa tu correo y contraseña.")
      return
    }
    setLoading(true)
    try {
      const data = await api.login(email.trim(), password)
      setSession(data.token, {
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
      })
      navigate("/admin", { replace: true })
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-brand-green focus:bg-white/15 focus:ring-2 focus:ring-brand-green/30"

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy px-4">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-green blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-pulse blur-3xl" />
      </div>

      <Link
        to="/"
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al sitio
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex items-center justify-center rounded-2xl bg-white p-1.5 shadow-md">
            <img
              src="/logo_nombre_2.jpeg"
              alt="Logo Estab Group S.R.L."
              className="h-14 w-auto rounded-xl object-contain"
            />
          </span>
          <h1 className="mt-6 text-2xl font-extrabold text-white">Panel de Administración</h1>
          <p className="mt-1 text-sm text-white/60">
            Accede para gestionar el catálogo y las cotizaciones
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white/5 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-sm"
        >
          <label className="mb-1 block text-sm font-semibold text-white/80">Correo</label>
          <div className="relative mb-4">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@estabgroup.com"
              autoComplete="username"
              className={inputClass}
            />
          </div>

          <label className="mb-1 block text-sm font-semibold text-white/80">Contraseña</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className={inputClass}
            />
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-500/15 px-4 py-2 text-sm font-medium text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-3 font-semibold text-white shadow-lg shadow-brand-green/30 transition hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            {loading ? "Verificando..." : "Iniciar sesión"}
          </button>

          <div className="mt-4 rounded-xl bg-white/5 p-3 text-xs leading-relaxed text-white/50">
            <p className="font-semibold text-white/70">Acceso demo</p>
            <p>
              Admin: <span className="font-semibold text-white/80">admin@estabgroup.com</span> ·{" "}
              <span className="font-semibold text-white/80">password</span>
            </p>
            <p>
              Ventas: <span className="font-semibold text-white/80">ventas@estabgroup.com</span> ·{" "}
              <span className="font-semibold text-white/80">password</span>
            </p>
          </div>
        </form>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            "Hola, necesito ayuda con el acceso al panel de administración."
          )}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-white/50 transition hover:text-brand-green"
        >
          <MessageCircle className="h-4 w-4" />
          ¿Problemas para acceder? Contáctanos
        </a>
      </div>
    </div>
  )
}

export default Login