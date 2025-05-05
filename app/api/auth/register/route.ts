import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Временное хранилище для новых пользователей
const newUsers = []

export async function POST(request: Request) {
  console.log("Получен запрос на регистрацию")

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
    const { name, email, password } = body || {}

    if (!name || !email || !password) {
      console.error("Отсутствуют обязательные поля:", { name, email, password })
      return NextResponse.json({ error: "Имя, email и пароль обязательны" }, { status: 400, headers })
    }

    // Создаем нового пользователя
    const newUser = {
      id: `student-${Date.now()}`,
      name,
      email,
      password,
      role: "student",
      telegramUsername: body.telegramUsername,
      message: body.message,
    }

    // Добавляем пользователя в хранилище
    newUsers.push(newUser)
    console.log("Новый пользователь создан:", newUser)

    // Создаем сессию
    const sessionData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
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
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201, headers },
    )
  } catch (error) {
    console.error("Ошибка при регистрации:", error)
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
