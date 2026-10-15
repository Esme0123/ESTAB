import { useState } from "react"
import { ImageOff } from "lucide-react"

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
    return (
      <span
        role="img"
        aria-label={alt}
        className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#1A1C38] via-[#1A1C38] to-[#3BB54A] text-white ${className}`}
      >
        <ImageOff className="h-9 w-9 opacity-90" />
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
