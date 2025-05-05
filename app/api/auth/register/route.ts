import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createUserSession } from "@/lib/auth-vercel"

// Временное хранилище для новых пользователей
const newUsers: any[] = []

export async function POST(request: Request) {
  try {
    console.log("Получен запрос на регистрацию")

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

    const { name, email, password } = body

    // Проверяем наличие обязательных полей
    if (!name || !email || !password) {
      console.error("Отсутствуют обязательные поля")
      return NextResponse.json({ error: "Имя, email и пароль обязательны" }, { status: 400, headers })
    }

    // Проверяем, не существует ли уже пользователь с таким email
    const existingUser = newUsers.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 400, headers })
    }

    // Создаем нового пользователя
    const newUser = {
      id: `student-${Date.now()}`,
      name,
      email,
      password,
      role: "student",
    }

    // Добавляем пользователя в хранилище
    newUsers.push(newUser)

    // Создаем сессию
    const sessionToken = createUserSession({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    })

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
