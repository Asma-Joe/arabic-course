import { type NextRequest, NextResponse } from "next/server"
import { getStudents, addStudent, type Student } from "@/lib/db"

export async function GET() {
  const students = getStudents()
  return NextResponse.json(students)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Проверка обязательных полей
    if (!data.name || !data.telegramUsername) {
      return NextResponse.json({ error: "Имя и Telegram обязательны" }, { status: 400 })
    }

    // Создание новой ученицы
    const newStudent: Omit<Student, "id"> = {
      name: data.name,
      email: data.email || "",
      telegramUsername: data.telegramUsername,
      progress: 0,
      lastActive: new Date().toISOString(),
      status: "active",
    }

    const student = addStudent(newStudent)
    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error("Error creating student:", error)
    return NextResponse.json({ error: "Ошибка при создании ученицы" }, { status: 500 })
  }
}
