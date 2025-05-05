import { NextResponse } from "next/server"
import { authenticateUser, createUserSession } from "@/lib/auth-vercel"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    console.log("Получен запрос на вход")

    // Устанавливаем заголовки CORS
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    }

    // Парсим тело запроса
    const body = await request.json().catch((err) => {
      console.error("Ошибка при парсинге JSON:", err)
      return null
    })

    if (!body) {
      console.error("Неверный формат запроса: отсутствует тело")
      return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400, headers })
    }

    const { email, password } = body

    // Проверяем наличие обязательных полей
    if (!email || !password) {
      console.error("Отсутствуют обязательные поля")
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400, headers })
    }

    // Аутентифицируем пользователя
    const user = authenticateUser(email, password)

    if (!user) {
      console.error("Неверные учетные данные")
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401, headers })
    }

    // Создаем сессию
    const sessionToken = createUserSession(user)

    // Устанавливаем cookie
    cookies().set({
      name: "session",
      value: sessionToken,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    })

    // Возвращаем успешный ответ
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200, headers },
    )
  } catch (error) {
    console.error("Ошибка при входе:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json",
        },
      },
    )
  }
}

// Обработка OPTIONS запросов для CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  )
}
