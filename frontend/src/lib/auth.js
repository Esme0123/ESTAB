export const ADMIN_TOKEN_KEY = "estab_admin_token"
export const ADMIN_USER_KEY = "estab_admin_user"

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(ADMIN_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const isAuthenticated = () => !!localStorage.getItem(ADMIN_TOKEN_KEY)

export const setSession = (token, user) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user))
}

export const logout = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
  localStorage.removeItem(ADMIN_USER_KEY)
}