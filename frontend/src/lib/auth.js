export const ADMIN_TOKEN_KEY = "estab_admin_token"
export const ADMIN_CREDENTIALS = { usuario: "admin", contrasena: "12345" }

export const isAuthenticated = () => {
  return localStorage.getItem(ADMIN_TOKEN_KEY) === "true"
}

export const login = (usuario, contrasena) => {
  if (
    usuario === ADMIN_CREDENTIALS.usuario &&
    contrasena === ADMIN_CREDENTIALS.contrasena
  ) {
    localStorage.setItem(ADMIN_TOKEN_KEY, "true")
    return true
  }
  return false
}

export const logout = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}