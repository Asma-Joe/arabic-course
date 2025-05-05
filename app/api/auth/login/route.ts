import { NextResponse } from "next/server"
import { authenticate, createSession } from "@/lib/auth-memory"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    // Устанавливаем заголовки CORS для отладки
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    }

    let email = ""
    let password = ""

    try {
      // Пытаемся получить данные из тела запроса
      const data = await request.json()
      email = data.email || ""
      password = data.password || ""
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json(
        {
          error: "Invalid request format",
          message: "Неверный формат запроса",
        },
        { status: 400, headers },
      )
    }

    // Проверяем наличие обязательных полей
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required",
          message: "Email и пароль обязательны для заполнения",
        },
        { status: 400, headers },
      )
    }

    // Аутентификация пользователя
    const user = authenticate(email, password)

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
          message: "Неверный email или пароль",
        },
        { status: 401, headers },
      )
    }

    // Создание сессии
    const sessionToken = createSession(user)

    // Установка сессионного cookie
    cookies().set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: "/",
    })

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
      { headers },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: "Error during login",
        message: "Произошла ошибка при входе в систему",
      },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

// Добавляем обработчик OPTIONS для CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
