export const ADMIN_TOKEN_KEY = "estab_admin_token"
export const ADMIN_USER_KEY = "estab_admin_user"
export const REMEMBER_CREDENTIALS_KEY = "estab_remember_credentials"
export const SESSION_EXPIRED_KEY = "estab_session_expired"

// Claves legadas admitidas como fuente del token de autenticación.
const LEGACY_TOKEN_KEYS = ["token", "auth_token"]

const readStore = (store, key) => {
  try {
    return store.getItem(key)
  } catch {
    return null
  }
}

const stores = () => {
  try {
    return [localStorage, sessionStorage]
  } catch {
    return []
  }
}

/**
 * Devuelve el token de autenticación sin importar si la sesión se guardó
 * en localStorage ("Recordarme") o en sessionStorage (sesión de la pestaña).
 * También acepta las claves legadas 'token' y 'auth_token'.
 */
export const getAuthToken = () => {
  for (const store of stores()) {
    for (const key of [ADMIN_TOKEN_KEY, ...LEGACY_TOKEN_KEYS]) {
      const value = readStore(store, key)
      if (value) return value
    }
  }
  return null
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

export const isAuthenticated = () => !!getAuthToken()

export const setSession = (token, user, remember = false) => {
  const store = remember ? localStorage : sessionStorage
  const other = remember ? sessionStorage : localStorage
  store.setItem(ADMIN_TOKEN_KEY, token)
  store.setItem(ADMIN_USER_KEY, JSON.stringify(user))
  other.removeItem(ADMIN_TOKEN_KEY)
  other.removeItem(ADMIN_USER_KEY)
}

export const logout = () => {
  stores().forEach((store) => {
    store.removeItem(ADMIN_TOKEN_KEY)
    store.removeItem(ADMIN_USER_KEY)
    LEGACY_TOKEN_KEYS.forEach((key) => store.removeItem(key))
  })
}

// Marca que la sesión expiró para poder avisar al usuario en la pantalla de login.
export const markSessionExpired = () => {
  try {
    sessionStorage.setItem(SESSION_EXPIRED_KEY, "1")
  } catch {
    // Almacenamiento no disponible: se omite el aviso.
  }
}

export const consumeSessionExpired = () => {
  try {
    const expired = sessionStorage.getItem(SESSION_EXPIRED_KEY) === "1"
    sessionStorage.removeItem(SESSION_EXPIRED_KEY)
    return expired
  } catch {
    return false
  }
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