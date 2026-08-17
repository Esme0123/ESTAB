import { PRODUCTS } from "../data/mockProducts"

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost/backend/api"

const TOKEN_KEY = "estab_admin_token"

const getToken = () => localStorage.getItem(TOKEN_KEY)

async function request(path, { method = "GET", body, isForm } = {}) {
  const headers = {}
  const token = getToken()
  if (token) headers["Authorization"] = `Bearer ${token}`
  if (body && !isForm) headers["Content-Type"] = "application/json"

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: isForm ? body : body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Verifica que el backend esté activo."
    )
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    throw new Error(data?.error || `Error del servidor (${res.status})`)
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
  precio_referencial: Number(p.precio_referencial || 0),
  categoria_id: Number(p.categoria_id),
  categoria_nombre: p.categoria_nombre || "",
  estado: p.estado === 0 || p.estado === "inactivo" ? "inactivo" : "activo",
  imagenes: normalizeImagenes(p.imagenes),
  especificaciones: normalizeEspecificaciones(p.especificaciones),
})

export const mockProductos = () => PRODUCTS.map((p) => ({ ...p }))

export const api = {
  login: (email, password) =>
    request("/login.php", { method: "POST", body: { email, password } }),

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
      body: {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio_referencial: producto.precio_referencial,
        categoria_id: producto.categoria_id,
        estado: producto.estado === "inactivo" ? 0 : 1,
        imagenes: producto.imagenes,
        especificaciones: producto.especificaciones,
      },
    })
    return normalizeProducto(data)
  },

  updateProducto: async (id, producto) => {
    const data = await request(`/productos.php?id=${id}`, {
      method: "PUT",
      body: {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio_referencial: producto.precio_referencial,
        categoria_id: producto.categoria_id,
        estado: producto.estado === "inactivo" ? 0 : 1,
        imagenes: producto.imagenes,
        especificaciones: producto.especificaciones,
      },
    })
    return normalizeProducto(data)
  },

  deleteProducto: (id) =>
    request(`/productos.php?id=${id}`, { method: "DELETE" }),
}

export default api