import { getAuthToken, logout, markSessionExpired } from "../lib/auth"

const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "")

const envUrl = import.meta.env.VITE_API_URL || ""
const envPointsToLocal = /(^|:\/\/)(localhost|127\.0\.0\.1)([:/]|$)/.test(envUrl)
const canUseEnvUrl = !!envUrl && (!envPointsToLocal || isLocalHost)

// La carpeta 'api' vive en la raíz del servidor, por lo que '/api' resuelve a
// https://estab.com.bo/api en producción y a localhost/api en desarrollo.
export const API_BASE_URL = canUseEnvUrl ? envUrl : "/api"

export const BASE_URL = API_BASE_URL

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export const isUnauthorizedError = (err) => err?.status === 401

const getToken = () => getAuthToken()

/**
 * Cierra la sesión y manda al usuario al login cuando el backend responde 401
 * (token ausente, inválido o expirado).
 */
const handleUnauthorized = () => {
  logout()
  markSessionExpired()

  if (typeof window === "undefined") return
  if (window.location.pathname === "/login" || window.location.pathname === "/admin/login") {
    return
  }
  window.location.assign("/login")
}

async function request(path, { method = "GET", body, isForm, skipAuthRedirect = false } = {}) {
  const headers = {}
  const token = getToken()
  if (token) headers["Authorization"] = `Bearer ${token}`
  if (body && !isForm) headers["Content-Type"] = "application/json"

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      // Envía cookies de sesión (PHPSESSID) junto al token Bearer.
      credentials: "include",
      body: isForm ? body : body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(
      "No se pudo conectar con el servidor. Verifica que el backend esté activo.",
      0
    )
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (res.status === 401 && !skipAuthRedirect) {
    handleUnauthorized()
  }

  if (!res.ok) {
    throw new ApiError(data?.error || `Error del servidor (${res.status})`, res.status)
  }

  return data
}

const normalizeEspecificaciones = (specs = []) =>
  specs.map((s) => (typeof s === "string" ? s : s.especificacion))

const normalizeImagenes = (imgs = []) =>
  imgs.map((i) => (typeof i === "string" ? i : i.url_imagen))

export const normalizeProducto = (p) => ({
  id: p.id,
  nombre: p.nombre,
  descripcion: p.descripcion || "",
  marca: p.marca || "",
  procedencia: p.procedencia || "",
  precio_referencial: Number(p.precio_referencial || 0),
  categoria_id: Number(p.categoria_id),
  categoria_nombre: p.categoria_nombre || "",
  estado: p.estado === 0 || p.estado === "inactivo" ? "inactivo" : "activo",
  imagenes: normalizeImagenes(p.imagenes),
  especificaciones: normalizeEspecificaciones(p.especificaciones),
})

const toProductoPayload = (producto) => ({
  nombre: producto.nombre,
  descripcion: producto.descripcion || "",
  marca: producto.marca || "",
  procedencia: producto.procedencia || "",
  precio_referencial: Number(producto.precio_referencial) || 0,
  categoria_id: Number(producto.categoria_id) || 0,
  estado: producto.estado === "inactivo" ? 0 : 1,
  imagenes: producto.imagenes || [],
  especificaciones: producto.especificaciones || [],
})

export const api = {
  login: (email, password) =>
    request("/login.php", {
      method: "POST",
      body: { email, password },
      // Un 401 en el login son credenciales inválidas, no una sesión expirada.
      skipAuthRedirect: true,
    }),

  uploadImage: (file) => {
    const fd = new FormData()
    fd.append("file", file)
    return request("/upload.php", { method: "POST", body: fd, isForm: true })
  },

  getProductos: async () => {
    const data = await request("/productos.php")
    return (data.productos || []).map(normalizeProducto)
  },

  createProducto: async (producto) => {
    const data = await request("/productos.php", {
      method: "POST",
      body: toProductoPayload(producto),
    })
    return normalizeProducto(data)
  },

  updateProducto: async (id, producto) => {
    const data = await request(`/productos.php?id=${id}`, {
      method: "PUT",
      body: toProductoPayload(producto),
    })
    return normalizeProducto(data)
  },

  // Edición rápida de precio: reutiliza el PUT completo con el nuevo valor.
  updatePrecio: async (id, producto, precio) => {
    const data = await request(`/productos.php?id=${id}`, {
      method: "PUT",
      body: toProductoPayload({ ...producto, precio_referencial: precio }),
    })
    return normalizeProducto(data)
  },

  deleteProducto: (id) =>
    request(`/productos.php?id=${id}`, { method: "DELETE" }),
}

export default api