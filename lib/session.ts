const SESSION_COOKIE_NAME = "fs_session"
const CART_COOKIE_NAME = "fs_cart"
const CLIENT_COOKIE_NAME = "fs_client"
const CART_TTL_SECONDS = 60 * 60 * 6 // 6 hours
const CART_TTL_MS = CART_TTL_SECONDS * 1000

interface CookieOptions {
  maxAge?: number
}

const isBrowser = typeof window !== "undefined"

function setCookie(name: string, value: string, options: CookieOptions = {}) {
  if (!isBrowser) return
  const segments = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    `SameSite=Lax`,
  ]

  if (options.maxAge) {
    segments.push(`Max-Age=${options.maxAge}`)
  }

  if (window.location.protocol === "https:") {
    segments.push("Secure")
  }

  document.cookie = segments.join("; ")
}

function deleteCookie(name: string) {
  if (!isBrowser) return
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`
}

function getCookie(name: string): string | null {
  if (!isBrowser) return null
  const cookies = document.cookie ? document.cookie.split(";") : []
  for (const cookie of cookies) {
    const trimmed = cookie.trim()
    if (trimmed.startsWith(`${name}=`)) {
      return decodeURIComponent(trimmed.substring(name.length + 1))
    }
  }
  return null
}

export function ensureSessionToken(): string | null {
  if (!isBrowser) return null
  const existing = getCookie(SESSION_COOKIE_NAME)
  if (existing) {
    setCookie(SESSION_COOKIE_NAME, existing, { maxAge: CART_TTL_SECONDS })
    return existing
  }

  //const token = crypto.randomUUID()
  let token: string
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    token = crypto.randomUUID()
  } else {
    // Fallback a un UUID v4 manual si randomUUID no está disponible
    token = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
  setCookie(SESSION_COOKIE_NAME, token, { maxAge: CART_TTL_SECONDS })
  return token
}

export interface StoredCartItem {
  id: number
  title: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartCookiePayload {
  items: StoredCartItem[]
  expiresAt: number
}

export function loadCartFromCookie(): StoredCartItem[] {
  if (!isBrowser) return []
  const raw = getCookie(CART_COOKIE_NAME)
  if (!raw) return []
  try {
    const payload = JSON.parse(raw) as CartCookiePayload
    if (!Array.isArray(payload.items) || typeof payload.expiresAt !== "number") {
      deleteCookie(CART_COOKIE_NAME)
      return []
    }

    if (payload.expiresAt < Date.now()) {
      deleteCookie(CART_COOKIE_NAME)
      return []
    }

    return payload.items.map((item) => ({ ...item, title: item.title ?? item.name }))
  } catch (error) {
    console.error("No pudimos leer el carrito almacenado", error)
    deleteCookie(CART_COOKIE_NAME)
    return []
  }
}

export function persistCartToCookie(items: StoredCartItem[]): void {
  if (!isBrowser) return

  if (!items.length) {
    deleteCookie(CART_COOKIE_NAME)
    return
  }

  ensureSessionToken()
  const normalizedItems = items.map((item) => ({ ...item, title: item.title ?? item.name }))
  const payload: CartCookiePayload = {
    items: normalizedItems,
    expiresAt: Date.now() + CART_TTL_MS,
  }

  setCookie(CART_COOKIE_NAME, JSON.stringify(payload), { maxAge: CART_TTL_SECONDS })
}

const CLIENT_TTL_SECONDS = 60 * 60 * 24 * 30 // 30 days

export function saveClientIdToCookie(id: number): void {
  if (!isBrowser) return
  setCookie(CLIENT_COOKIE_NAME, id.toString(), { maxAge: CLIENT_TTL_SECONDS })
}

export function getClientIdFromCookie(): number | null {
  const raw = getCookie(CLIENT_COOKIE_NAME)
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isNaN(parsed) ? null : parsed
}
