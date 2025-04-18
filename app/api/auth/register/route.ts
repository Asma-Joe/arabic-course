import { NextResponse } from "next/server"
import { addUser, getUserByEmail } from "@/lib/storage"

export async function POST(request) {
  try {
    const { name, email, password, telegramUsername } = await request.json()

    // Проверка обязательных полей
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 })
    }

    // Проверка, что пользователь с таким email не существует
    const existingUser = getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Создание нового пользователя
    const newUser = addUser({
      name,
      email,
      password,
      role: "student",
    })

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
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Error during registration" }, { status: 500 })
  }
}
