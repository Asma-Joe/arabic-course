// Функция для получения значения cookie по имени
export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") {
    return undefined
  }

  const cookies = document.cookie.split("; ")
  const cookie = cookies.find((c) => c.startsWith(`${name}=`))
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : undefined
}

// Функция для установки cookie
export function setCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number
    expires?: Date
    path?: string
    domain?: string
    secure?: boolean
    sameSite?: "strict" | "lax" | "none"
  } = {},
): void {
  if (typeof document === "undefined") {
    return
  }

  let cookieString = `${name}=${encodeURIComponent(value)}`

  if (options.maxAge) {
    cookieString += `; max-age=${options.maxAge}`
  }

  if (options.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`
  }

  if (options.path) {
    cookieString += `; path=${options.path}`
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`
  }

  if (options.secure) {
    cookieString += "; secure"
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`
  }

  document.cookie = cookieString
}

// Функция для удаления cookie
export function deleteCookie(name: string, path = "/"): void {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}
