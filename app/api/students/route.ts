import { type NextRequest, NextResponse } from "next/server"
import { getUsers, addUser } from "@/lib/storage"

export async function GET() {
  try {
    const users = getUsers()
    const students = users.filter((user) => user.role === "student")
    return NextResponse.json(students)
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Ошибка при получении списка учениц" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Проверка обязательных полей
    if (!data.name || !data.email) {
      return NextResponse.json({ error: "Имя и Email обязательны" }, { status: 400 })
    }

    // Проверка, что пользователь с таким email не существует
    const users = getUsers()
    const existingUser = users.find((user) => user.email === data.email)
    if (existingUser) {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 400 })
    }

    // Создание новой ученицы
    const newUser = addUser({
      name: data.name,
      email: data.email,
      telegramUsername: data.telegramUsername || "",
      role: "student",
      password: data.password || "password123", // В реальном приложении генерировать безопасный пароль
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("Error creating student:", error)
    return NextResponse.json({ error: "Ошибка при создании ученицы" }, { status: 500 })
  }
}
