import { NextResponse } from "next/server"
import { authenticate, createSession } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
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
        { status: 400 },
      )
    }

    // Проверяем наличие обязательных полей
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required",
          message: "Email и пароль обязательны для заполнения",
        },
        { status: 400 },
      )
    }

    // Аутентификация пользователя
    const user = await authenticate(email, password)

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
          message: "Неверный email или пароль",
        },
        { status: 401 },
      )
    }

    // Создание сессии
    const sessionToken = await createSession(user)

    // Установка сессионного cookie
    cookies().set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: "Error during login",
        message: "Произошла ошибка при входе в систему",
      },
      { status: 500 },
    )
  }
}
