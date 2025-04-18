import { NextResponse } from "next/server"
import { sendTelegramMessage, formatNewApplicationMessage } from "@/lib/telegram"
import { rateLimit } from "@/lib/rate-limit"
import { csrfMiddleware } from "@/lib/csrf"

export async function POST(request: Request) {
  // Применяем ограничение скорости запросов
  const rateLimitResult = rateLimit(request, {
    limit: 5, // 5 попыток
    windowMs: 15 * 60 * 1000, // за 15 минут
    message: "Слишком много запросов. Пожалуйста, попробуйте позже.",
  })

  if (rateLimitResult) {
    return rateLimitResult
  }

  // Проверяем CSRF-токен
  const csrfResult = csrfMiddleware(request)
  if (csrfResult) {
    return csrfResult
  }

  try {
    const clonedRequest = request.clone()
    const { name, telegramUsername, message } = await clonedRequest.json()

    // Проверка обязательных полей
    if (!name || !telegramUsername) {
      return NextResponse.json({ error: "Имя и Telegram обязательны" }, { status: 400 })
    }

    // Форматируем сообщение для отправки в Telegram
    const formattedMessage = formatNewApplicationMessage(name, telegramUsername, message)

    // Отправляем сообщение в Telegram
    const success = await sendTelegramMessage(formattedMessage)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Не удалось отправить сообщение в Telegram" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error processing Telegram registration:", error)
    return NextResponse.json({ error: "Ошибка при обработке запроса" }, { status: 500 })
  }
}
