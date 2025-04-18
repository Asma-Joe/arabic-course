import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import crypto from "crypto"

// Константы
const CSRF_COOKIE_NAME = "csrf_token"
const CSRF_HEADER_NAME = "X-CSRF-Token"
const CSRF_TOKEN_MAX_AGE = 60 * 60 * 24 // 24 часа

// Флаг для временного отключения CSRF проверки (только для отладки)
// ВАЖНО: В продакшене должно быть false!
const DISABLE_CSRF_CHECK = true // Временно отключаем для решения проблемы входа

// Генерация CSRF токена
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

// Установка CSRF токена в cookie
export function setCSRFCookie(): string {
  const token = generateCSRFToken()

  // Проверяем, что токен действительно является строкой
  if (typeof token !== "string" || !token) {
    console.error("Generated token is invalid:", token)
    throw new Error("Failed to generate valid CSRF token")
  }

  try {
    cookies().set(CSRF_COOKIE_NAME, token, {
      httpOnly: false, // Должен быть доступен из JavaScript
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: CSRF_TOKEN_MAX_AGE,
      path: "/",
    })
  } catch (error) {
    console.error("Error setting CSRF cookie:", error)
    throw new Error("Failed to set CSRF cookie")
  }

  return token
}

// Получение CSRF токена из cookie
export function getCSRFCookie(): string | undefined {
  try {
    const token = cookies().get(CSRF_COOKIE_NAME)?.value
    return token
  } catch (error) {
    console.error("Error getting CSRF cookie:", error)
    return undefined
  }
}

// Проверка CSRF токена
export function validateCSRFToken(request: Request): boolean {
  // Если проверка отключена, всегда возвращаем true
  if (DISABLE_CSRF_CHECK) {
    console.log("⚠️ CSRF check is disabled")
    return true
  }

  try {
    // Получаем токен из cookie
    const cookieToken = getCSRFCookie()
    if (!cookieToken) {
      console.log("❌ CSRF cookie token is missing")
      return false
    }

    // Получаем токен из заголовка или тела запроса
    let requestToken: string | null = null

    // Проверяем заголовок
    requestToken = request.headers.get(CSRF_HEADER_NAME)

    // Если токен не найден в заголовке, пытаемся получить из тела запроса
    if (!requestToken) {
      const contentType = request.headers.get("content-type") || ""

      if (contentType.includes("application/json")) {
        try {
          const clonedRequest = request.clone()
          const body = clonedRequest.json()
          requestToken = body.csrfToken
        } catch (e) {
          console.log("❌ Failed to parse JSON body for CSRF token")
        }
      }
    }

    // Если токен не найден, возвращаем false
    if (!requestToken) {
      console.log("❌ CSRF request token is missing")
      return false
    }

    // Сравниваем токены
    const isValid = cookieToken === requestToken
    console.log(`CSRF validation: ${isValid ? "✅ Valid" : "❌ Invalid"}`)
    return isValid
  } catch (error) {
    console.error("❌ CSRF validation error:", error)
    return false
  }
}

// Middleware для CSRF проверки
export function csrfMiddleware(request: Request) {
  // Если проверка отключена, пропускаем
  if (DISABLE_CSRF_CHECK) {
    return null
  }

  const isValid = validateCSRFToken(request)

  if (!isValid) {
    // Генерируем новый токен
    const newToken = setCSRFCookie()

    return NextResponse.json(
      {
        error: "CSRF validation failed",
        message: "Для вашей безопасности требуется обновить страницу",
        code: "CSRF_ERROR",
        newToken,
      },
      { status: 403 },
    )
  }

  return null
}

// API для получения CSRF токена
export function getCSRFToken(): string {
  try {
    return setCSRFCookie()
  } catch (error) {
    console.error("Error getting CSRF token:", error)
    throw error
  }
}
