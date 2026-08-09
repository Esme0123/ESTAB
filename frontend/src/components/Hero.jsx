import { MessageCircle, ChevronRight, Sparkles } from "lucide-react"

const WA_URL = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola, deseo más información sobre sus soluciones."
)}`

function Hero({ onBrowse }) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-green blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-pulse blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 lg:flex-row lg:text-left">
        <div className="flex-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-green/40 bg-brand-green/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-green">
            <Sparkles className="h-3.5 w-3.5" />
            Soluciones integrales
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Soluciones Integrales para tu{" "}
            <span className="bg-gradient-to-r from-brand-green to-pulse bg-clip-text text-transparent">
              Empresa
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70 lg:mx-0">
            En Estab Group S.R.L. proveemos material de escritorio y limpieza,
            equipamiento médico, mobiliario, tecnología, importación y
            comercialización. Innovación, Tecnología y Confianza en cada
            entrega.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <button
              onClick={onBrowse}
              className="flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 font-semibold text-white shadow-lg shadow-brand-green/30 transition hover:bg-brand-green-dark"
            >
              Ver nuestro catálogo
              <ChevronRight className="h-5 w-5" />
            </button>
            <a
              href={WA_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-pulse hover:bg-pulse/10"
            >
              <MessageCircle className="h-5 w-5 text-brand-green" />
              Contacto directo
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/60">
            {["🇧🇴 La Paz - Bolivia", "✅ Proveedor certificado", "📦 Entregas en todo el país"].map(
              (item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        <div className="relative hidden flex-1 lg:block">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=60"
              alt="Equipo trabajando con Estab Group"
              className="h-full w-full rounded-3xl object-cover shadow-2xl"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 text-navy shadow-xl">
              <p className="text-2xl font-extrabold text-brand-green-dark">+500</p>
              <p className="text-xs font-medium text-slate-600">Empresas atendidas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center gap-2 border-t border-white/10 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
        Innovación <span className="text-brand-green">·</span> Tecnología{" "}
        <span className="text-pulse">·</span> Confianza
      </div>
    </section>
  )
}

export default Hero