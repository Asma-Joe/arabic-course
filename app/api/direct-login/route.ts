import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request) {
  try {
    // Получаем данные из запроса
    const body = await request.text()
    let data

    try {
      data = JSON.parse(body)
    } catch (e) {
      return NextResponse.json(
        {
          success: false,
          message: "Неверный формат запроса",
        },
        { status: 400 },
      )
    }

    const { email, password } = data

    // Проверяем учетные данные администратора
    if (email === "asmajoe18@gmail.com" && password === "123asma") {
      // Создаем простой токен сессии
      const sessionData = {
        id: "admin-1",
        name: "Асма",
        email: "asmajoe18@gmail.com",
        role: "admin",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 дней
      }

      const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString("base64")

      // Устанавливаем cookie
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
          id: "admin-1",
          name: "Асма",
          email: "asmajoe18@gmail.com",
          role: "admin",
        },
      })
    }

    // Проверяем учетные данные студента
    if (email === "asmacheck@gmail.com" && password === "123asma") {
      // Создаем простой токен сессии
      const sessionData = {
        id: "student-1",
        name: "Тестовая Ученица",
        email: "asmacheck@gmail.com",
        role: "student",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 дней
      }

      const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString("base64")

      // Устанавливаем cookie
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
          id: "student-1",
          name: "Тестовая Ученица",
          email: "asmacheck@gmail.com",
          role: "student",
        },
      })
    }

    // Если учетные данные неверны
    return NextResponse.json(
      {
        success: false,
        message: "Неверный email или пароль",
      },
      { status: 401 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Произошла ошибка при входе в систему",
      },
      { status: 500 },
    )
  }
}
