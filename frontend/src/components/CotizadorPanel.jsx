import { useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import {
  X,
  FileText,
  FileSpreadsheet,
  MessageCircle,
  Trash2,
  Calculator,
  Loader2,
  Inbox,
  PackagePlus,
} from "lucide-react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import { numeroALetras } from "../utils/numberToLiteral"
import { CATEGORIES, WHATSAPP_NUMBER, EMAIL_CONTACT } from "../data/mockProducts"

const EMPRESA_NOMBRE = "ESTAB GROUP S.R.L."
const EMPRESA_NIT = "1029129025"
const EMPRESA_DIRECCION =
  "Ciudad Satélite C. Fernando Caballero # 1158, El Alto - La Paz, Bolivia"
const EMPRESA_TELEFONO = "+591 71814954"
const LOGO_URL = "/logo_nombre_2_transparent.png"
const DIAS_VALIDEZ = 15

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100

const formatMoneda = (n) =>
  `Bs. ${round2(n).toLocaleString("es-BO", { minimumFractionDigits: 2 })}`

const formatNumero = (n) =>
  round2(n).toLocaleString("es-BO", { minimumFractionDigits: 2 })

const toISODate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`

const hoyISO = () => toISODate(new Date())

const fechaPorDefecto = () => {
  const d = new Date()
  d.setDate(d.getDate() + DIAS_VALIDEZ)
  return toISODate(d)
}

const formatFecha = (iso) => {
  if (!iso) return "—"
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y}`
}

const nombreCategoria = (p) =>
  p.categoria_nombre ||
  CATEGORIES.find((c) => String(c.id) === String(p.categoria_id))?.nombre ||
  "General"

const normalizarTelefono = (raw) => {
  const t = String(raw || "").replace(/[^0-9]/g, "")
  if (!t) return ""
  if (t.startsWith("591")) return t
  if (t.startsWith("0")) return `591${t.slice(1)}`
  return `591${t}`
}

async function cargarLogo() {
  try {
    const res = await fetch(LOGO_URL)
    const blob = await res.blob()
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error("logo"))
      reader.readAsDataURL(blob)
    })
    const img = new Image()
    img.src = dataUrl
    await img.decode()
    return { dataUrl, w: img.naturalWidth, h: img.naturalHeight }
  } catch {
    return null
  }
}

function CotizadorPanel({ items: productosIniciales = [], onClose, modo = "interno" }) {
  const [cliente, setCliente] = useState("")
  const [nitCi, setNitCi] = useState("")
  const [atencion, setAtencion] = useState("")
  const [telefonoCliente, setTelefonoCliente] = useState("")
  const [telefonoError, setTelefonoError] = useState(false)
  const [fechaValidez, setFechaValidez] = useState(fechaPorDefecto)
  const [exportando, setExportando] = useState(null)
  const telefonoRef = useRef(null)

  const [items, setItems] = useState(() =>
    productosIniciales.map((p, idx) => ({
      key: idx,
      id: p.id,
      nombre: p.nombre,
      categoria: nombreCategoria(p),
      cantidad: 1,
      precioUnitario: round2(p.precio_referencial),
    }))
  )

  const total = useMemo(
    () =>
      round2(
        items.reduce((acc, it) => acc + it.cantidad * it.precioUnitario, 0)
      ),
    [items]
  )

  const totalLiteral = useMemo(() => numeroALetras(total), [total])
  const sonLiteral = `SON: ${totalLiteral}`

  const updateItem = (key, patch) =>
    setItems((prev) =>
      prev.map((it) => (it.key === key ? { ...it, ...patch } : it))
    )

  const removeItem = (key) =>
    setItems((prev) => prev.filter((it) => it.key !== key))

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-navy outline-none transition focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20"

  async function exportToPDF() {
    if (items.length === 0) return
    setExportando("pdf")
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" })
      const pageW = doc.internal.pageSize.getWidth()
      const pageH = doc.internal.pageSize.getHeight()
      const margin = 40
      const contentW = pageW - margin * 2
      const pieTop = pageH - 56
      let y = 0

      const asegurarEspacio = (espacio) => {
        if (y + espacio > pieTop) {
          doc.addPage()
          y = margin + 20
        }
      }

      const logo = await cargarLogo()

      const altoBanner = 104
      doc.setFillColor(26, 28, 56)
      doc.rect(0, 0, pageW, altoBanner, "F")

      let nombreX = margin
      if (logo) {
        const altoLogo = 54
        const anchoLogo = Math.min((altoLogo * logo.w) / logo.h, 168)
        doc.addImage(logo.dataUrl, "PNG", margin, (altoBanner - altoLogo) / 2, anchoLogo, altoLogo)
        nombreX = margin + anchoLogo + 16
      } else {
        nombreX = margin
      }

      const anchoIzquierda = Math.max(110, pageW - nombreX - 168)

      doc.setTextColor(255, 255, 255)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(19)
      doc.text(EMPRESA_NOMBRE, nombreX, 46)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8)
      doc.text(`NIT: ${EMPRESA_NIT}`, nombreX, 66)
      doc.text(
        doc.splitTextToSize(`Dirección: ${EMPRESA_DIRECCION}`, anchoIzquierda),
        nombreX,
        80
      )

      doc.setFont("helvetica", "bold")
      doc.setFontSize(15)
      doc.text("COTIZACIÓN", pageW - margin, 46, { align: "right" })
      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(234, 179, 8)
      doc.text(`Fecha: ${formatFecha(hoyISO())}`, pageW - margin, 62, {
        align: "right",
      })
      doc.setTextColor(255, 255, 255)
      doc.text(`Validez: ${formatFecha(fechaValidez)}`, pageW - margin, 78, {
        align: "right",
      })

      doc.setTextColor(26, 28, 56)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      y = 118
      doc.text("DATOS DEL CLIENTE", margin, y)
      doc.setLineWidth(0.6)
      doc.setDrawColor(26, 28, 56)
      doc.line(margin, y + 4, pageW - margin, y + 4)

      doc.setFontSize(9)
      const colX = margin + 200
      const campos = [
        ["Cliente:", cliente || "—", margin, y + 20],
        ["NIT / CI:", nitCi || "—", colX, y + 20],
        ["Atención a:", atencion || "—", margin, y + 34],
        ["Fecha de validez:", formatFecha(fechaValidez), colX, y + 34],
      ]
      campos.forEach(([label, valor, x, cy]) => {
        doc.setFont("helvetica", "bold")
        doc.setTextColor(71, 85, 105)
        doc.text(label, x, cy)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(26, 28, 56)
        doc.text(doc.splitTextToSize(valor, 150), x + 70, cy)
      })

      autoTable(doc, {
        startY: y + 50,
        margin: { left: margin, right: margin },
        head: [
          [
            "N°",
            "Producto",
            "Categoría",
            "Cantidad",
            "Precio Unit. (Bs)",
            "Subtotal (Bs)",
          ],
        ],
        body: items.map((it, i) => [
          i + 1,
          it.nombre,
          it.categoria,
          it.cantidad,
          formatNumero(it.precioUnitario),
          formatNumero(it.cantidad * it.precioUnitario),
        ]),
        theme: "grid",
        showHead: "everyPage",
        headStyles: {
          fillColor: [26, 28, 56],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9,
          halign: "center",
        },
        alternateRowStyles: { fillColor: [241, 245, 249] },
        styles: { font: "helvetica", fontSize: 8.5, cellPadding: 6 },
        columnStyles: {
          0: { halign: "center", cellWidth: 28 },
          3: { halign: "center", cellWidth: 60 },
          4: { halign: "right", cellWidth: 85 },
          5: { halign: "right", cellWidth: 85, fontStyle: "bold" },
          1: { cellWidth: "auto" },
          2: { cellWidth: "auto" },
        },
      })

      y = doc.lastAutoTable.finalY

      asegurarEspacio(150)
      doc.setFillColor(59, 181, 74)
      doc.roundedRect(margin, y + 12, contentW, 44, 6, 6, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      doc.text("TOTAL GENERAL", margin + 14, y + 31)
      doc.setFontSize(15)
      doc.text(
        `Bs. ${formatNumero(total)}`,
        pageW - margin - 14,
        y + 36,
        { align: "right" }
      )

      y = y + 12 + 44
      asegurarEspacio(60)
      doc.setTextColor(26, 28, 56)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(9.5)
      doc.text(
        doc.splitTextToSize(sonLiteral, contentW - 10),
        margin,
        y + 24
      )

      y = y + 42
      asegurarEspacio(190)
      doc.setFillColor(241, 245, 249)
      doc.setDrawColor(203, 213, 225)
      doc.setLineWidth(0.6)
      doc.roundedRect(margin, y + 8, contentW, 92, 6, 6, "FD")
      doc.setFont("helvetica", "bold")
      doc.setTextColor(26, 28, 56)
      doc.setFontSize(9)
      doc.text("TÉRMINOS DE LA COTIZACIÓN", margin + 12, y + 24)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(71, 85, 105)
      doc.setFontSize(8)
      const terminos = [
        "• La presente cotización es una oferta no vinculante y está sujeta a confirmación de stock y disponibilidad.",
        "• La validez de los precios es de 15 días calendario a partir de la fecha de emisión.",
        "• Plazo de entrega estimado de 5 a 10 días hábiles, previa confirmación del pedido.",
        "• Forma de pago: 50% de anticipo y saldo contra entrega (depósito o transferencia bancaria).",
        "• No incluye instalación ni transporte, salvo acuerdo previo con el asesor comercial.",
      ]
      terminos.forEach((t, i) =>
        doc.text(
          doc.splitTextToSize(t, contentW - 24),
          margin + 12,
          y + 38 + i * 12
        )
      )

      y = y + 8 + 92
      asegurarEspacio(80)
      doc.setDrawColor(26, 28, 56)
      doc.setLineWidth(0.8)
      doc.line(margin, y + 26, margin + 220, y + 26)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      doc.setTextColor(26, 28, 56)
      doc.text("Firma y sello del vendedor", margin, y + 40)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(71, 85, 105)
      doc.text("Asesor Comercial Estab Group S.R.L.", margin, y + 52)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8.5)
      doc.text(`Fecha de emisión: ${formatFecha(hoyISO())}`, pageW - margin, y + 40, {
        align: "right",
      })

      doc.setFillColor(26, 28, 56)
      doc.rect(0, pieTop, pageW, 56, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(8.5)
      doc.text(EMPRESA_NOMBRE, margin, pieTop + 20)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(226, 232, 240)
      doc.setFontSize(7.5)
      doc.text(`NIT: ${EMPRESA_NIT}`, margin, pieTop + 32)
      doc.text(
        doc.splitTextToSize(EMPRESA_DIRECCION, 300),
        margin,
        pieTop + 42
      )
      doc.setFont("helvetica", "bold")
      doc.setTextColor(234, 179, 8)
      doc.text(`Tel/WhatsApp: ${EMPRESA_TELEFONO}`, pageW - margin, pieTop + 20, {
        align: "right",
      })
      doc.setFont("helvetica", "normal")
      doc.setTextColor(226, 232, 240)
      doc.text(`Email: ${EMAIL_CONTACT}`, pageW - margin, pieTop + 32, {
        align: "right",
      })

      doc.save(`Cotizacion_EstabGroup_${(cliente || "Cliente").replace(/[\\/:*?"<>|]/g, "").trim()}.pdf`)
    } finally {
      setExportando(null)
    }
  }

  function exportToExcel() {
    if (items.length === 0) return
    setExportando("excel")
    try {
      const filas = [
        [EMPRESA_NOMBRE, "", "", "", "", ""],
        [`NIT: ${EMPRESA_NIT}`, "La Paz, Bolivia", "", "", "Tel/WhatsApp:", EMPRESA_TELEFONO],
        [EMPRESA_DIRECCION, "", "", "", "Email:", EMAIL_CONTACT],
        [],
        ["COTIZACIÓN INSTITUCIONAL", "", "", "", "", ""],
        ["Cliente:", cliente || "—", "", "", "Fecha de emisión:", formatFecha(hoyISO())],
        ["NIT / CI:", nitCi || "—", "", "", "Fecha de validez:", formatFecha(fechaValidez)],
        ["Atención a:", atencion || "—", "", "", "", ""],
        [],
        ["N°", "Producto", "Categoría", "Cantidad", "Precio Unitario (Bs)", "Subtotal (Bs)"],
        ...items.map((it, i) => [
          i + 1,
          it.nombre,
          it.categoria,
          it.cantidad,
          round2(it.precioUnitario),
          round2(it.cantidad * it.precioUnitario),
        ]),
        [],
        ["", "", "", "", "TOTAL GENERAL (Bs):", round2(total)],
        ["SON: " + totalLiteral, "", "", "", "", ""],
      ]

      const ws = XLSX.utils.aoa_to_sheet(filas)

      ws["!cols"] = [
        { wch: 6 },
        { wch: 48 },
        { wch: 30 },
        { wch: 10 },
        { wch: 20 },
        { wch: 20 },
      ]
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
        { s: { r: 4, c: 0 }, e: { r: 4, c: 5 } },
        { s: { r: 13, c: 1 }, e: { r: 13, c: 5 } },
      ]

      items.forEach((it, i) => {
        const r = 10 + i
        ws[XLSX.utils.encode_cell({ r, c: 3 })].z = "0"
        ws[XLSX.utils.encode_cell({ r, c: 4 })].z = "#,##0.00"
        ws[XLSX.utils.encode_cell({ r, c: 5 })].z = "#,##0.00"
      })

      const totalR = 12
      ws[XLSX.utils.encode_cell({ r: totalR, c: 5 })].z = "#,##0.00"

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Cotizacion")
      const nombreArchivo = `Cotizacion_EstabGroup_${(cliente || "Cliente").replace(/[\\/:*?"<>|]/g, "").trim()}.xlsx`
      XLSX.writeFile(wb, nombreArchivo)
    } finally {
      setExportando(null)
    }
  }

  function enviarWhatsApp() {
    if (items.length === 0) return

    const esInterno = modo === "interno"

    if (esInterno) {
      const telefono = normalizarTelefono(telefonoCliente)
      if (!telefono) {
        setTelefonoError(true)
        telefonoRef.current?.focus()
        return
      }
      setTelefonoError(false)
    }

    const lineas = items
      .map(
        (it, i) =>
          `${i + 1}. *${it.nombre}* — ${it.cantidad} und. × Bs. ${formatNumero(
            it.precioUnitario
          )} = Bs. ${formatNumero(it.cantidad * it.precioUnitario)}`
      )
      .join("\n")

    const resumen = [
      `Cliente: ${cliente || "—"}`,
      `NIT/CI: ${nitCi || "—"}`,
      `Teléfono: ${telefonoCliente || "—"}`,
      `Fecha de validez: ${formatFecha(fechaValidez)}`,
    ].join("\n")

    const mensaje = esInterno
      ? [
          `*COTIZACIÓN ${EMPRESA_NOMBRE}*`,
          EMPRESA_DIRECCION,
          `Tel/WhatsApp Estab: ${EMPRESA_TELEFONO} | Email: ${EMAIL_CONTACT}`,
          "——————————",
          `Estimado/a ${atencion || cliente || "cliente"}, le compartimos la cotización solicitada:`,
          "",
          resumen,
          "",
          "*DETALLE DE LOS PRODUCTOS*",
          lineas,
          "",
          `*TOTAL GENERAL: Bs. ${formatNumero(total)}*`,
          sonLiteral,
          "",
          "Los precios incluyen líneas de equipamiento, mobiliario e insumos del catálogo de Estab Group. Para confirmar su pedido responda este mensaje o llámenos. ¡Gracias por confiar en nosotros!",
        ].join("\n")
      : [
          `*COTIZACIÓN ${EMPRESA_NOMBRE}*`,
          EMPRESA_DIRECCION,
          "——————————",
          "Hola Estab Group, deseo solicitar la siguiente cotización:",
          "",
          resumen,
          "",
          "*DETALLE DE LOS PRODUCTOS*",
          lineas,
          "",
          `*TOTAL ESTIMADO: Bs. ${formatNumero(total)}*`,
          sonLiteral,
          "",
          "Quedo atento a su propuesta y disponibilidad. ¡Gracias!",
        ].join("\n")

    const destino = esInterno
      ? normalizarTelefono(telefonoCliente)
      : WHATSAPP_NUMBER
    const url = `https://wa.me/${destino}?text=${encodeURIComponent(mensaje)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const deshabilitado = items.length === 0

  return (
    <motion.div
      className="fixed inset-0 z-[120] bg-[#0B0D1F]/70 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="absolute right-0 top-0 flex h-full w-full max-w-3xl flex-col bg-slate-50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Modo Cotizador"
      >
        <header className="shrink-0 bg-[#1A1C38]">
          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3BB54A] to-[#10B981] text-white shadow-lg shadow-emerald-500/30">
                <Calculator className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-lg font-extrabold tracking-wide text-white">
                  Modo Cotizador
                </h2>
                <p className="text-xs text-white/60">
                  {EMPRESA_NOMBRE} · Propuesta comercial inmediata
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar cotizador"
              className="cursor-pointer rounded-full bg-white/10 p-2 text-white transition hover:bg-red-500/80"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-[#3BB54A] via-[#EAB308] to-[#06B6D4]" />
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy/5">
            <h3 className="text-sm font-bold text-navy">Datos del Cliente</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">
                  Nombre / Empresa
                </span>
                <input
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="Ej: Clínica San Martín S.R.L."
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">
                  NIT / CI
                </span>
                <input
                  value={nitCi}
                  onChange={(e) => setNitCi(e.target.value)}
                  placeholder="Ej: 1029344025"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">
                  Atención a
                </span>
                <input
                  value={atencion}
                  onChange={(e) => setAtencion(e.target.value)}
                  placeholder="Nombre de la persona de contacto"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">
                  Fecha de validez (por defecto {DIAS_VALIDEZ} días)
                </span>
                <input
                  type="date"
                  min={hoyISO()}
                  value={fechaValidez}
                  onChange={(e) => setFechaValidez(e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-xs font-semibold text-slate-500">
                  Teléfono / WhatsApp del Cliente *
                </span>
                <div className="relative">
                  <MessageCircle
                    className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${
                      telefonoError ? "text-red-400" : "text-brand-green"
                    }`}
                  />
                  <input
                    ref={telefonoRef}
                    type="tel"
                    inputMode="numeric"
                    value={telefonoCliente}
                    onChange={(e) => {
                      setTelefonoCliente(e.target.value)
                      if (telefonoError) setTelefonoError(false)
                    }}
                    placeholder="Ej: 706 12345"
                    className={`${inputClass} pl-10 ${
                      telefonoError
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                        : ""
                    }`}
                  />
                </div>
                {telefonoError && (
                  <span className="mt-1.5 block text-xs font-semibold text-red-500">
                    Ingresa el teléfono/WhatsApp del cliente para enviar la cotización.
                  </span>
                )}
                <span className="mt-1 block text-[11px] text-slate-400">
                  El resumen se envía directo a este número. Se agrega el prefijo 591
                  automáticamente si no lo incluyes.
                </span>
              </label>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-navy/5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-bold text-navy">
                Productos Seleccionados
              </h3>
              <span className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-bold text-brand-green-dark">
                {items.length} {items.length === 1 ? "ítem" : "ítems"}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-12 text-center">
                <Inbox className="mb-3 h-10 w-10 text-slate-300" />
                <p className="font-bold text-navy">Sin productos en la cotización</p>
                <p className="mt-1 text-sm text-slate-500">
                  Selecciona productos en el catálogo y vuelve a abrir el Modo Cotizador.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-[#1A1C38] text-white">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Producto</th>
                      <th className="px-4 py-3 font-semibold">Categoría</th>
                      <th className="px-4 py-3 font-semibold">Cantidad</th>
                      <th className="px-4 py-3 font-semibold">Precio Unitario (Bs)</th>
                      <th className="px-4 py-3 text-right font-semibold">Subtotal</th>
                      <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((it) => (
                      <tr key={it.key} className="transition-colors hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-navy">{it.nombre}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            {it.categoria}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={it.cantidad}
                            onChange={(e) =>
                              updateItem(it.key, {
                                cantidad: Math.max(1, Number(e.target.value) || 1),
                              })
                            }
                            className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm font-bold text-navy outline-none transition focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20"
                            aria-label={`Cantidad de ${it.nombre}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={it.precioUnitario}
                            onChange={(e) =>
                              updateItem(it.key, {
                                precioUnitario: Math.max(
                                  0,
                                  Number(e.target.value) || 0
                                ),
                              })
                            }
                            className="w-28 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right text-sm font-bold text-navy outline-none transition focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20"
                            aria-label={`Precio unitario de ${it.nombre}`}
                          />
                        </td>
                        <td className="px-4 py-3 text-right font-extrabold text-brand-green-dark">
                          {formatMoneda(it.cantidad * it.precioUnitario)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeItem(it.key)}
                            aria-label={`Eliminar ${it.nombre}`}
                            className="cursor-pointer rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="border-t border-slate-100 px-5 py-3 text-right text-sm">
              <span className="text-slate-400">
                Los precios unitarios se pueden negociar en tiempo real antes de exportar.
              </span>
            </div>
          </section>

          <section className="rounded-3xl bg-[#1A1C38] p-6 shadow-2xl ring-1 ring-[#EAB308]/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#EAB308]">
                Total General
              </p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70 ring-1 ring-white/15">
                {items.length} ítems
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-[#3BB54A] sm:text-4xl">
              {formatMoneda(total)}
            </p>
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#EAB308]">
                Total en Literal
              </p>
              <p className="mt-1.5 text-sm font-bold leading-relaxed text-[#EAB308] sm:text-base">
                {sonLiteral}
              </p>
            </div>
          </section>
        </div>

        <footer className="shrink-0 border-t border-slate-200 bg-white px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <motion.button
              whileTap={{ scale: deshabilitado || exportando ? 1 : 0.97 }}
              onClick={exportToPDF}
              disabled={deshabilitado || !!exportando}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exportando === "pdf" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              {exportando === "pdf" ? "Generando PDF..." : "Descargar PDF"}
            </motion.button>
            <motion.button
              whileTap={{ scale: deshabilitado || exportando ? 1 : 0.97 }}
              onClick={exportToExcel}
              disabled={deshabilitado || !!exportando}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#3BB54A] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand-green/25 transition hover:bg-[#2e943c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exportando === "excel" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              {exportando === "excel" ? "Generando Excel..." : "Exportar Excel"}
            </motion.button>
            <motion.button
              whileTap={{ scale: deshabilitado ? 1 : 0.97 }}
              onClick={enviarWhatsApp}
              disabled={deshabilitado}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-[#1ebe5a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MessageCircle className="h-4 w-4" />
              Enviar por WhatsApp
            </motion.button>
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
            <PackagePlus className="h-3.5 w-3.5" />
            {modo === "interno"
              ? "Cotización interna: el resumen se envía al WhatsApp del cliente registrado."
              : "Cotización pública: el resumen se envía directo a Estab Group."}
          </p>
        </footer>
      </motion.aside>
    </motion.div>
  )
}

export default CotizadorPanel