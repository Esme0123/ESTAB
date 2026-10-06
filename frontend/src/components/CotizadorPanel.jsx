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
import * as XLSX from "xlsx-js-style"
import { numeroALetras } from "../utils/numberToLiteral"
import { CATEGORIES, UNIDADES, WHATSAPP_NUMBER, EMAIL_CONTACT } from "../data/mockProducts"

const EMPRESA_NOMBRE = "ESTAB GROUP S.R.L."
const EMPRESA_NIT = "1029129025"
const EMPRESA_DIRECCION =
  "Ciudad Satélite C. Fernando Caballero # 1158, El Alto - La Paz, Bolivia"
const EMPRESA_TELEFONO = "+591 71814954"
const LOGO_URL = "/logo_nombre_2_transparent.png"
const LOGO_ISOTIPO_URL = "/logo-estab.jpeg"
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

async function cargarLogo(url = LOGO_URL) {
  try {
    const res = await fetch(url)
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
    const formato =
      (String(dataUrl).match(/^data:image\/(png|jpe?g|gif|bmp)/i)?.[1] || "png")
        .toUpperCase()
        .replace("JPG", "JPEG")
    return { dataUrl, w: img.naturalWidth, h: img.naturalHeight, formato }
  } catch {
    return null
  }
}

const generarCorrelativo = () => {
  const d = new Date()
  const fecha = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate()
  ).padStart(2, "0")}`
  const serie = String(Math.floor(Math.random() * 9000) + 1000)
  return `EG-${fecha}-${serie}`
}

const detalleItem = (it) =>
  [it.nombre, ...(it.especificaciones || []).map((s) => `• ${s}`)].join("\n")

const fichaItem = (it) =>
  [it.marca ? `Marca: ${it.marca}` : "", it.procedencia ? `Proc: ${it.procedencia}` : ""]
    .filter(Boolean)
    .join(" · ")

function CotizadorPanel({ items: productosIniciales = [], onClose, modo = "interno" }) {
  const [cliente, setCliente] = useState("")
  const [nitCi, setNitCi] = useState("")
  const [atencion, setAtencion] = useState("")
  const [telefonoCliente, setTelefonoCliente] = useState("")
  const [telefonoError, setTelefonoError] = useState(false)
  const [fechaValidez, setFechaValidez] = useState(fechaPorDefecto)
  const [correlativo] = useState(generarCorrelativo)
  const [exportando, setExportando] = useState(null)
  const telefonoRef = useRef(null)

  const [items, setItems] = useState(() =>
    productosIniciales.map((p, idx) => ({
      key: idx,
      id: p.id,
      nombre: p.nombre,
      categoria: nombreCategoria(p),
      especificaciones: [...(p.especificaciones || [])],
      cantidad: 1,
      unidad: "UNIDAD",
      marca: p.marca || "",
      procedencia: p.procedencia || "",
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

      const [logo, isotipo] = await Promise.all([
        cargarLogo(),
        cargarLogo(LOGO_ISOTIPO_URL),
      ])

      const altoBanner = 104
      doc.setFillColor(26, 28, 56)
      doc.rect(0, 0, pageW, altoBanner, "F")

      if (logo) {
        const altoLogo = 60
        const anchoLogo = Math.min((altoLogo * logo.w) / logo.h, 200)
        doc.addImage(
          logo.dataUrl,
          logo.formato,
          margin,
          (altoBanner - altoLogo) / 2,
          anchoLogo,
          altoLogo
        )
      }

      // Datos institucionales a la derecha
      const xDer = pageW - margin
      const anchoDerecha = 255
      let ly = 30
      doc.setTextColor(255, 255, 255)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(15)
      doc.text(EMPRESA_NOMBRE, xDer, ly, { align: "right" })
      ly += 15
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8.5)
      doc.setTextColor(226, 232, 240)
      doc.text(`NIT: ${EMPRESA_NIT}`, xDer, ly, { align: "right" })
      ly += 12
      doc.splitTextToSize(`Dirección: ${EMPRESA_DIRECCION}`, anchoDerecha).forEach((linea) => {
        doc.text(linea, xDer, ly, { align: "right" })
        ly += 10
      })
      doc.setTextColor(234, 179, 8)
      doc.text(`Tel/WhatsApp: ${EMPRESA_TELEFONO}  ·  ${EMAIL_CONTACT}`, xDer, ly, {
        align: "right",
      })

      // Título de la cotización
      y = 128
      doc.setTextColor(26, 28, 56)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.text("COTIZACIÓN DE PRODUCTOS Y SERVICIOS", pageW / 2, y, { align: "center" })
      doc.setDrawColor(59, 181, 74)
      doc.setLineWidth(2)
      doc.line(pageW / 2 - 150, y + 8, pageW / 2 + 150, y + 8)

      y += 30
      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(71, 85, 105)
      doc.text(`Fecha de emisión: ${formatFecha(hoyISO())}`, margin, y)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(26, 28, 56)
      doc.text(`N° de Cotización: ${correlativo}`, pageW - margin, y, { align: "right" })

      y += 20
      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
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
            "ITEM",
            "CANT.",
            "UNIDAD",
            "DETALLE / ESPECIFICACIONES",
            "MARCA",
            "PROCEDENCIA",
            "P. UNIT (Bs)",
            "SUBTOTAL (Bs)",
          ],
        ],
        body: items.map((it, i) => [
          i + 1,
          it.cantidad,
          it.unidad,
          detalleItem(it),
          it.marca || "—",
          it.procedencia || "—",
          formatNumero(it.precioUnitario),
          formatNumero(it.cantidad * it.precioUnitario),
        ]),
        theme: "grid",
        showHead: "everyPage",
        headStyles: {
          fillColor: [22, 163, 74],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8,
          halign: "center",
          cellPadding: 5,
        },
        alternateRowStyles: { fillColor: [240, 253, 244] },
        styles: { font: "helvetica", fontSize: 8, cellPadding: 5, lineColor: [209, 250, 229] },
        columnStyles: {
          0: { halign: "center", cellWidth: 26 },
          1: { halign: "center", cellWidth: 34 },
          2: { halign: "center", cellWidth: 52 },
          3: { cellWidth: "auto", valign: "top" },
          4: { halign: "center", cellWidth: 58, valign: "top" },
          5: { halign: "center", cellWidth: 62, valign: "top" },
          6: { halign: "right", cellWidth: 52 },
          7: { halign: "right", cellWidth: 56, fontStyle: "bold" },
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
      doc.text(`N° de Cotización: ${correlativo}`, pageW - margin, y + 40, {
        align: "right",
      })
      doc.text(`Fecha de emisión: ${formatFecha(hoyISO())}  ·  Validez: ${formatFecha(fechaValidez)}`, pageW - margin, y + 52, {
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

      // Marca de agua institucional (isotipo ampliado, opacidad muy baja)
      const imagenMarca = isotipo || logo
      const paginas = doc.getNumberOfPages()
      for (let i = 1; i <= paginas; i++) {
        if (!imagenMarca) break
        doc.setPage(i)
        const maxW = pageW * 0.62
        const maxH = pageH * 0.62
        let w = maxW
        let h = (maxW * imagenMarca.h) / imagenMarca.w
        if (h > maxH) {
          h = maxH
          w = (maxH * imagenMarca.w) / imagenMarca.h
        }
        doc.setGState(new doc.GState({ opacity: 0.09 }))
        doc.addImage(
          imagenMarca.dataUrl,
          imagenMarca.formato,
          (pageW - w) / 2,
          (pageH - h) / 2,
          w,
          h
        )
        doc.setGState(new doc.GState({ opacity: 1 }))
      }

      doc.save(`Cotizacion_EstabGroup_${hoyISO().replace(/-/g, "")}.pdf`)
    } finally {
      setExportando(null)
    }
  }

  function exportToExcel() {
    if (items.length === 0) return
    setExportando("excel")
    try {
      const NAVY = { rgb: "1A1C38" }
      const GOLD = { rgb: "EAB308" }
      const WHITE = { rgb: "FFFFFF" }
      const BORDER = { rgb: "CBD5E1" }

      const filas = [
        [EMPRESA_NOMBRE, "", "", "", "", "", "", ""],
        ["COTIZACIÓN DE PRODUCTOS Y SERVICIOS", "", "", "", "", "", "", ""],
        [`Dirección: ${EMPRESA_DIRECCION}`, "", "", "", "", "", "", ""],
        [`NIT: ${EMPRESA_NIT}   ·   ${EMPRESA_TELEFONO}   ·   ${EMAIL_CONTACT}`, "", "", "", "", "", "", ""],
        [],
        ["DATOS DEL CLIENTE", "", "", "", "", "", "", ""],
        ["Cliente:", cliente || "—", "", "", "Fecha de emisión:", formatFecha(hoyISO()), "", ""],
        ["NIT / CI:", nitCi || "—", "", "", "Fecha de validez:", formatFecha(fechaValidez), "", ""],
        ["Atención a:", atencion || "—", "", "", "N° de Cotización:", correlativo, "", ""],
        [],
        [
          "ITEM",
          "CANTIDAD",
          "UNIDAD",
          "DETALLE / ESPECIFICACIONES",
          "MARCA",
          "PROCEDENCIA",
          "PRECIO UNITARIO (Bs)",
          "SUBTOTAL (Bs)",
        ],
        ...items.map((it, i) => [
          i + 1,
          it.cantidad,
          it.unidad,
          detalleItem(it),
          it.marca || "",
          it.procedencia || "",
          round2(it.precioUnitario),
          round2(it.cantidad * it.precioUnitario),
        ]),
        [],
        ["TOTAL GENERAL (Bs):", "", "", "", "", "", "", round2(total)],
        ["SON: " + totalLiteral, "", "", "", "", "", "", ""],
        [],
        ["TÉRMINOS DE LA COTIZACIÓN", "", "", "", "", "", "", ""],
        ["• La presente cotización es una oferta no vinculante y está sujeta a confirmación de stock y disponibilidad.", "", "", "", "", "", "", ""],
        ["• La validez de los precios es de 15 días calendario a partir de la fecha de emisión.", "", "", "", "", "", "", ""],
        ["• Plazo de entrega estimado de 5 a 10 días hábiles, previa confirmación del pedido.", "", "", "", "", "", "", ""],
        ["• Forma de pago: 50% de anticipo y saldo contra entrega (depósito o transferencia bancaria).", "", "", "", "", "", "", ""],
        ["• No incluye instalación ni transporte, salvo acuerdo previo con el asesor comercial.", "", "", "", "", "", "", ""],
        [],
        ["Firma y sello del vendedor", "", "", "", "", `N° ${correlativo}`, "", ""],
        ["Asesor Comercial Estab Group S.R.L.", "", "", "", "", `Fecha: ${formatFecha(hoyISO())}`, "", ""],
      ]

      const ws = XLSX.utils.aoa_to_sheet(filas)

      const styleCell = (r, c, s) => {
        const addr = XLSX.utils.encode_cell({ r, c })
        if (ws[addr]) ws[addr].s = s
      }
      const merge = (r, c1, c2) =>
        ws["!merges"] = [...(ws["!merges"] || []), { s: { r, c: c1 }, e: { r, c: c2 } }]

      // ------------------------------------------------------------
      // 1) ENCABEZADO PRINCIPAL (filas 0-3), fondo navy
      // ------------------------------------------------------------
      for (let r = 0; r <= 3; r++) {
        merge(r, 0, 7)
        for (let c = 0; c <= 7; c++) {
          styleCell(r, c, {
            font: { name: "Calibri", sz: r === 0 ? 18 : r === 1 ? 13 : 10, bold: r === 0 || r === 1, color: r === 1 ? GOLD : WHITE },
            fill: { patternType: "solid", fgColor: { rgb: "1A1C38" } },
            alignment: { horizontal: r === 1 || r === 2 ? "left" : "center", vertical: "center" },
            border: { bottom: { style: "hair", color: { rgb: "3D4056" } } },
          })
        }
      }

      // ------------------------------------------------------------
      // 2) DATOS DEL CLIENTE (filas 5-8)
      // ------------------------------------------------------------
      merge(5, 0, 7)
      for (let c = 0; c <= 7; c++) {
        styleCell(5, c, {
          font: { name: "Calibri", sz: 11, bold: true, color: NAVY },
          alignment: { horizontal: "left", vertical: "center" },
          border: { bottom: { style: "medium", color: BORDER } },
        })
      }
      for (let r = 6; r <= 8; r++) {
        merge(r, 1, 3)
        merge(r, 5, 7)
        for (let c = 0; c <= 7; c++) {
          styleCell(r, c, {
            font: { name: "Calibri", sz: 10, color: { rgb: "334155" } },
            alignment: { vertical: "center", horizontal: "left" },
          })
        }
        styleCell(r, 0, { font: { name: "Calibri", sz: 10, bold: true, color: NAVY }, alignment: { vertical: "center" } })
        styleCell(r, 4, { font: { name: "Calibri", sz: 10, bold: true, color: NAVY }, alignment: { vertical: "center", horizontal: "right" } })
      }

      // ------------------------------------------------------------
      // 3) TABLA DE PRODUCTOS
      // ------------------------------------------------------------
      const headerRow = 10
      const firstData = 11
      const lastData = firstData + items.length - 1
      const totalRow = lastData + 2
      const literalRow = totalRow + 1
      const termsTitleRow = literalRow + 2
      const termsStart = termsTitleRow + 1
      const termsRows = 5
      const firmaRow = termsStart + termsRows + 1

      for (let c = 0; c <= 7; c++) {
        styleCell(headerRow, c, {
          font: { name: "Calibri", sz: 10, bold: true, color: WHITE },
          fill: { patternType: "solid", fgColor: { rgb: "16A34A" } },
          alignment: { horizontal: "center", vertical: "center", wrapText: true },
          border: { top: { style: "thin", color: { rgb: "15803D" } }, bottom: { style: "thin", color: { rgb: "15803D" } } },
        })
      }
      for (let r = firstData; r <= lastData; r++) {
        const esPar = (r - firstData) % 2 === 1
        for (let c = 0; c <= 7; c++) {
          const esMonto = c === 6 || c === 7
          const cell = ws[XLSX.utils.encode_cell({ r, c })]
          cell.s = {
            font: { name: "Calibri", sz: 10, bold: esMonto, color: { rgb: esMonto ? "1A1C38" : "334155" } },
            fill: { patternType: "solid", fgColor: { rgb: esPar ? "F8FAFC" : "FFFFFF" } },
            alignment: {
              horizontal: c <= 2 || c === 4 || c === 5 ? "center" : esMonto ? "right" : "left",
              vertical: "center",
              wrapText: c === 3,
            },
            border: { top: { style: "hair", color: BORDER }, bottom: { style: "hair", color: BORDER } },
          }
        }
        ws[XLSX.utils.encode_cell({ r, c: 1 })].z = "0"
        ws[XLSX.utils.encode_cell({ r, c: 6 })].z = "#,##0.00"
        ws[XLSX.utils.encode_cell({ r, c: 7 })].z = "#,##0.00"
      }

      // ------------------------------------------------------------
      // 4) BANNER DE TOTAL GENERAL
      // ------------------------------------------------------------
      merge(totalRow, 0, 6)
      for (let c = 0; c <= 7; c++) {
        styleCell(totalRow, c, {
          font: { name: "Calibri", sz: 13, bold: true, color: WHITE },
          fill: { patternType: "solid", fgColor: { rgb: "16A34A" } },
          alignment: { vertical: "center", horizontal: c === 7 ? "right" : "left" },
        })
      }
      ws[XLSX.utils.encode_cell({ r: totalRow, c: 7 })].z = "#,##0.00"
      merge(literalRow, 0, 7)
      for (let c = 0; c <= 7; c++) {
        styleCell(literalRow, c, {
          font: { name: "Calibri", sz: 10, bold: true, color: { rgb: "166534" } },
          fill: { patternType: "solid", fgColor: { rgb: "DCFCE7" } },
          alignment: { horizontal: "left", vertical: "center", wrapText: true },
        })
      }
      merge(termsTitleRow, 0, 7)
      for (let c = 0; c <= 7; c++) {
        styleCell(termsTitleRow, c, {
          font: { name: "Calibri", sz: 10, bold: true, color: NAVY },
          alignment: { horizontal: "left", vertical: "center" },
          border: { bottom: { style: "medium", color: BORDER } },
        })
      }
      for (let r = termsStart; r < termsStart + termsRows; r++) {
        merge(r, 0, 7)
        for (let c = 0; c <= 7; c++) {
          styleCell(r, c, {
            font: { name: "Calibri", sz: 9, color: { rgb: "475569" } },
            alignment: { horizontal: "left", vertical: "top", wrapText: true },
          })
        }
      }
      merge(firmaRow, 0, 4)
      merge(firmaRow, 5, 7)
      for (let c = 0; c <= 7; c++) {
        styleCell(firmaRow, c, {
          font: { name: "Calibri", sz: 9, bold: true, color: NAVY },
          alignment: { horizontal: c >= 5 ? "right" : "left", vertical: "center" },
          border: { top: { style: "medium", color: NAVY } },
        })
      }

      // ------------------------------------------------------------
      // ANCHO DE COLUMNAS Y ALTURA DE FILAS
      // ------------------------------------------------------------
      ws["!cols"] = [
        { wch: 6 },
        { wch: 10 },
        { wch: 12 },
        { wch: 46 },
        { wch: 16 },
        { wch: 16 },
        { wch: 18 },
        { wch: 18 },
      ]
      ws["!rows"] = [
        { hpt: 30 },
        { hpt: 26 },
        { hpt: 16 },
        { hpt: 16 },
        { hpt: 8 },
        { hpt: 20 },
        { hpt: 18 },
        { hpt: 18 },
        { hpt: 18 },
        { hpt: 8 },
        { hpt: 26 },
        ...items.map((it) => ({
          hpt: it.especificaciones?.length ? 20 + it.especificaciones.length * 12 : 20,
        })),
        { hpt: 8 },
        { hpt: 30 },
        { hpt: 34 },
        { hpt: 8 },
        { hpt: 20 },
        ...Array.from({ length: termsRows }, () => ({ hpt: 30 })),
        { hpt: 8 },
        { hpt: 28 },
        { hpt: 16 },
      ]
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Cotizacion")
      XLSX.writeFile(wb, `Cotizacion_EstabGroup_${hoyISO().replace(/-/g, "")}.xlsx`)
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
      .map((it, i) => {
        const detalle = `${i + 1}. *${it.nombre}* — ${it.cantidad} ${it.unidad} × Bs. ${formatNumero(
          it.precioUnitario
        )} = Bs. ${formatNumero(it.cantidad * it.precioUnitario)}`
        const ficha = fichaItem(it)
        return ficha ? `${detalle}\n   ${ficha}` : detalle
      })
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
                <table className="w-full min-w-[1180px] text-left text-sm">
                  <thead className="bg-[#1A1C38] text-white">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Producto</th>
                      <th className="px-4 py-3 font-semibold">Categoría</th>
                      <th className="px-4 py-3 font-semibold">Cantidad</th>
                      <th className="px-4 py-3 font-semibold">Unidad</th>
                      <th className="px-4 py-3 font-semibold">Marca</th>
                      <th className="px-4 py-3 font-semibold">Procedencia</th>
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
                          <select
                            value={it.unidad}
                            onChange={(e) => updateItem(it.key, { unidad: e.target.value })}
                            className="w-32 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-bold text-navy outline-none transition focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20"
                            aria-label={`Unidad de ${it.nombre}`}
                          >
                            {UNIDADES.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            maxLength={100}
                            value={it.marca}
                            onChange={(e) => updateItem(it.key, { marca: e.target.value })}
                            placeholder="Ej: SAPOLIO"
                            className="w-32 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-navy outline-none transition focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20"
                            aria-label={`Marca de ${it.nombre}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            maxLength={100}
                            value={it.procedencia}
                            onChange={(e) => updateItem(it.key, { procedencia: e.target.value })}
                            placeholder="Ej: NACIONAL"
                            className="w-32 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-navy outline-none transition focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20"
                            aria-label={`Procedencia de ${it.nombre}`}
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
                Ajusta cantidad, unidad, marca, procedencia y precios en tiempo real antes de exportar.
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