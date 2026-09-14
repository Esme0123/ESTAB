export const ADMIN_TOKEN_KEY = "estab_admin_token"
export const ADMIN_USER_KEY = "estab_admin_user"
export const REMEMBER_CREDENTIALS_KEY = "estab_remember_credentials"

const readStore = (store, key) => {
  try {
    return store.getItem(key)
  } catch {
    return null
  }
}

export const getStoredUser = () => {
  const raw =
    readStore(localStorage, ADMIN_USER_KEY) ||
    readStore(sessionStorage, ADMIN_USER_KEY)
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const isAuthenticated = () =>
  !!readStore(localStorage, ADMIN_TOKEN_KEY) ||
  !!readStore(sessionStorage, ADMIN_TOKEN_KEY)

export const setSession = (token, user, remember = false) => {
  const store = remember ? localStorage : sessionStorage
  const other = remember ? sessionStorage : localStorage
  store.setItem(ADMIN_TOKEN_KEY, token)
  store.setItem(ADMIN_USER_KEY, JSON.stringify(user))
  other.removeItem(ADMIN_TOKEN_KEY)
  other.removeItem(ADMIN_USER_KEY)
}

export const logout = () => {
  ;[localStorage, sessionStorage].forEach((store) => {
    store.removeItem(ADMIN_TOKEN_KEY)
    store.removeItem(ADMIN_USER_KEY)
  })
}

export const saveRememberedCredentials = (email, password) => {
  localStorage.setItem(REMEMBER_CREDENTIALS_KEY, JSON.stringify({ email, password }))
}

export const clearRememberedCredentials = () => {
  localStorage.removeItem(REMEMBER_CREDENTIALS_KEY)
}

export const getRememberedCredentials = () => {
  try {
    const raw = localStorage.getItem(REMEMBER_CREDENTIALS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const normalizeRole = (user) =>
  String(user?.rol || user?.role || "").toLowerCase()

export const isAdminRole = (user) => normalizeRole(user) === "admin"

export const isCotizadorRole = (user) =>
  normalizeRole(user) === "cotizador" || normalizeRole(user) === "ventas"