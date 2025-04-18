import { type NextRequest, NextResponse } from "next/server"

// Простая реализация ограничения скорости запросов
// В реальном приложении лучше использовать Redis или другое хранилище
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>()

// Функция для ограничения скорости запросов
export function rateLimit(
  request: NextRequest,
  options: {
    limit?: number // Максимальное количество запросов
    windowMs?: number // Временное окно в миллисекундах
    message?: string // Сообщение об ошибке
    bypassForCSRFErrors?: boolean // Обходить ограничение для ошибок CSRF
  } = {},
) {
  const {
    limit = 10, // Увеличиваем лимит с 5 до 10 попыток
    windowMs = 60 * 1000,
    message = "Слишком много запросов, пожалуйста, попробуйте позже.",
    bypassForCSRFErrors = true, // По умолчанию обходим ограничение для ошибок CSRF
  } = options

  // Получаем IP-адрес клиента
  const ip = request.ip || "unknown"

  // Проверяем, является ли запрос связанным с ошибкой CSRF
  if (bypassForCSRFErrors) {
    try {
      const url = new URL(request.url)
      const isCSRFRelated =
        url.pathname === "/api/auth/csrf" ||
        url.searchParams.has("csrf_error") ||
        request.headers.get("x-csrf-bypass") === "true"

      if (isCSRFRelated) {
        return null // Пропускаем ограничение для запросов, связанных с CSRF
      }
    } catch (error) {
      console.error("Error checking CSRF bypass:", error)
    }
  }

  // Получаем текущее время
  const now = Date.now()

  // Получаем данные о запросах для данного IP
  const ipData = ipRequestCounts.get(ip) || { count: 0, resetTime: now + windowMs }

  // Если время сброса прошло, сбрасываем счетчик
  if (ipData.resetTime < now) {
    ipData.count = 1
    ipData.resetTime = now + windowMs
  } else {
    ipData.count++
  }

  // Обновляем данные в Map
  ipRequestCounts.set(ip, ipData)

  // Если превышен лимит запросов, возвращаем ошибку 429
  if (ipData.count > limit) {
    return NextResponse.json(
      {
        error: message,
        retryAfter: Math.ceil((ipData.resetTime - now) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((ipData.resetTime - now) / 1000).toString(),
        },
      },
    )
  }

  // Если лимит не превышен, возвращаем null
  return null
}

// Функция для сброса счетчика запросов для IP
export function resetRateLimit(ip: string): void {
  ipRequestCounts.delete(ip)
}
