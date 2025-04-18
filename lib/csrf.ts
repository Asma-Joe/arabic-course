import { generateCSRFToken } from "@/lib/auth"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Увеличиваем срок жизни токена до 24 часов
const CSRF_TOKEN_MAX_AGE = 60 * 60 * 24 // 24 часа

// Функция для проверки CSRF-токена
export async function validateCSRFToken(request: Request): Promise<{ isValid: boolean; error?: string }> {
  try {
    // Получаем сохраненный токен из cookie
    const storedCSRFToken = cookies().get("csrf_token")?.value

    // Если токен отсутствует в cookie, считаем проверку неуспешной
    if (!storedCSRFToken) {
      return {
        isValid: false,
        error: "CSRF token cookie is missing",
      }
    }

    // Пытаемся получить токен из запроса
    let csrfToken: string | undefined

    try {
      // Проверяем Content-Type запроса
      const contentType = request.headers.get("content-type") || ""

      if (contentType.includes("application/json")) {
        // Для JSON запросов
        const clonedRequest = request.clone()
        const text = await clonedRequest.text()

        // Проверяем, что тело запроса не пустое
        if (!text || text.trim() === "") {
          return {
            isValid: false,
            error: "Empty request body",
          }
        }

        try {
          const body = JSON.parse(text)
          csrfToken = body.csrfToken
        } catch (e) {
          console.error("JSON parse error:", e, "Raw text:", text)
          return {
            isValid: false,
            error: "Invalid JSON in request body",
          }
        }
      } else if (
        contentType.includes("multipart/form-data") ||
        contentType.includes("application/x-www-form-urlencoded")
      ) {
        // Для form-data запросов
        const clonedRequest = request.clone()
        const formData = await clonedRequest.formData()
        csrfToken = formData.get("csrfToken")?.toString()
      } else {
        // Для других типов запросов пробуем получить из URL
        const url = new URL(request.url)
        csrfToken = url.searchParams.get("csrfToken") || undefined
      }
    } catch (e) {
      console.error("Error extracting CSRF token:", e)
      return {
        isValid: false,
        error: "Failed to extract CSRF token from request",
      }
    }

    // Если токен не найден в запросе
    if (!csrfToken) {
      return {
        isValid: false,
        error: "CSRF token is missing in request",
      }
    }

    // Проверяем совпадение токенов
    if (storedCSRFToken !== csrfToken) {
      console.warn(`CSRF token mismatch: stored=${storedCSRFToken}, received=${csrfToken}`)
      return {
        isValid: false,
        error: "CSRF token is invalid",
      }
    }

    return { isValid: true }
  } catch (error) {
    console.error("Error validating CSRF token:", error)
    return {
      isValid: false,
      error: "Error validating CSRF token",
    }
  }
}

// Функция для обновления CSRF-токена
export function refreshCSRFToken() {
  // Генерация нового CSRF-токена
  const newCSRFToken = generateCSRFToken()

  // Установка cookie с увеличенным сроком жизни
  cookies().set("csrf_token", newCSRFToken, {
    httpOnly: false, // Должен быть доступен из JavaScript
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // Изменено с "strict" на "lax" для лучшей совместимости
    maxAge: CSRF_TOKEN_MAX_AGE, // 24 часа
    path: "/",
  })

  return newCSRFToken
}

// Middleware для проверки CSRF-токена с автоматическим обновлением
export async function csrfMiddleware(request: Request) {
  const { isValid, error } = await validateCSRFToken(request)

  if (!isValid) {
    console.log("CSRF validation failed:", error)

    // Генерируем новый токен при ошибке
    const newToken = refreshCSRFToken()

    return NextResponse.json(
      {
        error: "CSRF validation failed",
        message: "Для вашей безопасности требуется обновить страницу",
        code: "CSRF_ERROR",
        newToken: newToken, // Отправляем новый токен клиенту
        details: error, // Добавляем детали ошибки для отладки
      },
      { status: 403 },
    )
  }

  return null
}
