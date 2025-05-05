import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Предустановленные пользователи
const USERS = [
  {
    id: "admin-1",
    email: "asmajoe18@gmail.com",
    name: "Асма",
    role: "admin",
    password: "123asma",
  },
  {
    id: "student-1",
    email: "asmacheck@gmail.com",
    name: "Тестовая Ученица",
    role: "student",
    password: "123asma",
  },
]

export async function POST(request: Request) {
  console.log("Получен запрос на вход")

  try {
    // Устанавливаем заголовки CORS
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    }

    // Получаем данные из запроса
    let body
    try {
      body = await request.json()
      console.log("Получены данные:", body)
    } catch (error) {
      console.error("Ошибка при парсинге JSON:", error)
      return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400, headers })
    }

    // Проверяем наличие обязательных полей
    const { email, password } = body || {}

    if (!email || !password) {
      console.error("Отсутствуют обязательные поля:", { email, password })
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400, headers })
    }

    // Ищем пользователя
    const user = USERS.find((u) => u.email === email && u.password === password)

    if (!user) {
      console.error("Пользователь не найден или неверный пароль")
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401, headers })
    }

    // Создаем сессию
    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 дней
    }

    const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString("base64")

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
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
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
