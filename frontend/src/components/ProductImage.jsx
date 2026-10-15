import { useState } from "react"
import {
  Stethoscope,
  Building2,
  Laptop,
  FileText,
  Sparkles,
  Wrench,
  Zap,
  Scissors,
  ImageOff,
} from "lucide-react"

const CATEGORY_INITIALS = {
  1: "MED",
  2: "MOB",
  3: "COM",
  4: "PAP",
  5: "LIM",
  6: "IND",
  7: "ELE",
  8: "TEX",
}

const CATEGORY_ICONS = {
  1: Stethoscope,
  2: Building2,
  3: Laptop,
  4: FileText,
  5: Sparkles,
  6: Wrench,
  7: Zap,
  8: Scissors,
}

function getInitials(categoryId, name, categoryName) {
  const fromMap = CATEGORY_INITIALS[Number(categoryId)]
  if (fromMap) return fromMap
  const base = (name || categoryName || "ESTAB").trim()
  return base
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

/**
 * Imagen de producto con fallback corporativo.
 * Si la URL está vacía o falla al cargar (onError), renderiza un
 * contenedor con gradiente Azul Marino (#1A1C38) / Verde (#3BB54A),
 * el ícono y las iniciales de la categoría.
 */
function ProductImage({
  src,
  alt = "",
  categoryId,
  categoryName,
  className = "",
  imgClassName = "",
}) {
  const [failed, setFailed] = useState(false)
  const showFallback = !src || failed

  if (showFallback) {
    const CategoryIcon = CATEGORY_ICONS[Number(categoryId)] || ImageOff
    return (
      <span
        role="img"
        aria-label={alt}
        className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#1A1C38] via-[#1A1C38] to-[#3BB54A] text-white ${className}`}
      >
        <CategoryIcon className="h-9 w-9 opacity-90" />
        <span className="mt-1.5 text-[11px] font-extrabold tracking-[0.2em]">
          {getInitials(categoryId, alt, categoryName)}
        </span>
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      loading="lazy"
      className={imgClassName}
    />
  )
}

export default ProductImage
