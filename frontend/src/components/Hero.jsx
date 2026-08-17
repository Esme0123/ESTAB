import { useEffect, useState } from "react"
import { MessageCircle, ChevronRight, ChevronLeft, Sparkles, BadgeCheck } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { buildGeneralWhatsAppUrl } from "../data/mockProducts"

const WA_URL = buildGeneralWhatsAppUrl()

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=70",
    alt: "Equipos de diagnóstico y monitores médicos de última generación",
    caption: "Diagnóstico de última generación",
  },
  {
    src: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1200&q=70",
    alt: "Laboratorio clínico moderno con microscopios e instrumental de alta precisión",
    caption: "Laboratorio clínico de alta precisión",
  },
  {
    src: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=1200&q=70",
    alt: "Quirófano y mobiliario clínico especializado en acero inoxidable",
    caption: "Quirófano y mobiliario clínico",
  },
]

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 90 : -90, scale: 1.03 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -90 : 90, scale: 0.98 }),
}

function HeroCarousel() {
  const [[index, direction], setSlide] = useState([0, 0])
  const [paused, setPaused] = useState(false)

  const paginate = (dir) =>
    setSlide(([i]) => [(i + dir + SLIDES.length) % SLIDES.length, dir])

  const goTo = (n) => setSlide(([i]) => [n, n > i ? 1 : -1])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => paginate(1), 5000)
    return () => clearInterval(id)
  }, [paused])

  return (
    <div
      className="group/carousel relative mx-auto aspect-square w-full max-w-md"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl p-[2px] shadow-2xl shadow-black/40">
        <div className="absolute inset-0 rounded-3xl running-gradient-border opacity-0 transition-opacity duration-300 group-hover/carousel:opacity-100" />
        <div className="relative h-full w-full overflow-hidden rounded-3xl">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0"
          >
            <motion.img
              src={SLIDES[index].src}
              alt={SLIDES[index].alt}
              className="h-full w-full object-cover"
              loading="lazy"
              animate={{ scale: [1, 1.06] }}
              transition={{ duration: 8, ease: "easeOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/10" />
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-black/20 backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#3BB54A]" />
              {SLIDES[index].caption}
            </motion.span>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => paginate(-1)}
          aria-label="Slide anterior"
          className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white opacity-0 backdrop-blur-md transition duration-300 hover:scale-110 hover:bg-white/25 group-hover/carousel:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => paginate(1)}
          aria-label="Slide siguiente"
          className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white opacity-0 backdrop-blur-md transition duration-300 hover:scale-110 hover:bg-white/25 group-hover/carousel:opacity-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-slate-950/40 px-3 py-1.5 backdrop-blur-md">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              onClick={() => goTo(i)}
              aria-label={`Ir al slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-[#3BB54A]" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute -bottom-6 -left-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-white shadow-xl shadow-black/30 backdrop-blur-md"
      >
        <p className="text-2xl font-extrabold text-[#3BB54A]">+500</p>
        <p className="text-xs font-medium text-white/70">Empresas atendidas</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.5 }}
        className="absolute -top-4 -right-4 flex items-center gap-1.5 rounded-full border border-[#3BB54A]/40 bg-[#3BB54A]/15 px-3 py-1.5 text-xs font-semibold text-[#3BB54A] shadow-lg shadow-black/20 backdrop-blur-md"
      >
        <BadgeCheck className="h-4 w-4" />
        Calidad certificada
      </motion.div>
    </div>
  )
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#1A1C38] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#3BB54A] blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#2E315C] blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 rounded-full bg-[#23255A] blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-20 text-center sm:px-6 lg:flex-row lg:text-left">
        <motion.div
          className="relative flex-1"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.14),rgba(245,158,11,0.08)_45%,transparent_70%)] blur-2xl" />
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-[#3BB54A]/40 bg-[#3BB54A]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#3BB54A]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Equipamiento médico e insumos
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
          >
            Equipamiento para tu{" "}
            <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]">
              Clínica
            </span>{" "}
            <span className="text-slate-200">o</span>{" "}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              Laboratorio
            </span>
          </motion.h1>

          <motion.p variants={item} className="mx-auto mt-5 max-w-2xl text-lg text-white/70 lg:mx-0">
            En Estab Group S.R.L. proveemos equipamiento médico, mobiliario de
            laboratorio y clínica, insumos médicos y material corporativo y de
            limpieza. Innovación, Tecnología y Confianza en cada entrega.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() =>
                document
                  .getElementById("categorias")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-[#3BB54A] px-6 py-3 font-semibold text-white shadow-lg shadow-[#3BB54A]/40 transition hover:bg-[#2E9E3C] hover:shadow-xl hover:shadow-[#3BB54A]/60"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="pointer-events-none absolute -inset-1 rounded-full bg-[#3BB54A]/40 opacity-0 blur-md transition group-hover:animate-pulse group-hover:opacity-100" />
              Ver nuestro catálogo
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
            <a
              href={WA_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:border-[#3BB54A]/60 hover:bg-[#3BB54A]/10 hover:text-[#3BB54A]"
            >
              <MessageCircle className="h-5 w-5 text-[#3BB54A]" />
              Contacto directo
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/60"
          >
            {["🇧🇴 La Paz - Bolivia", "✅ Proveedor certificado", "📦 Entregas en todo el país"].map(
              (tag) => (
                <span key={tag} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3BB54A]" />
                  {tag}
                </span>
              )
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="relative hidden flex-1 py-6 lg:block"
        >
          <HeroCarousel />
        </motion.div>
      </div>

      <div className="relative flex items-center justify-center gap-2 border-t border-white/10 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
        Innovación <span className="text-[#3BB54A]">·</span> Tecnología{" "}
        <span className="text-[#3BB54A]">·</span> Confianza
      </div>
    </section>
  )
}

export default Hero