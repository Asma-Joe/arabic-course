import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { addHomework, getHomework, getPendingHomework, getStudentHomework } from "@/lib/storage"

export async function GET(request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Администратор видит все домашние задания
    if (user.role === "admin") {
      const searchParams = new URL(request.url).searchParams
      const pending = searchParams.get("pending")

      if (pending === "true") {
        const pendingHomework = getPendingHomework()
        return NextResponse.json(pendingHomework)
      }

      const homework = getHomework()
      return NextResponse.json(homework)
    }

    // Студент видит только свои домашние задания
    const studentHomework = getStudentHomework(user.id)
    return NextResponse.json(studentHomework)
  } catch (error) {
    console.error("Error fetching homework:", error)
    return NextResponse.json({ error: "Ошибка при получении домашних заданий" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Проверка обязательных полей
    if (!data.lessonId || !data.submittedFile) {
      return NextResponse.json({ error: "ID урока и файл обязательны" }, { status: 400 })
    }

    // Создаем новую запись о домашнем задании
    const newHomework = addHomework({
      studentId: user.id,
      lessonId: data.lessonId,
      submittedFile: data.submittedFile,
      submittedDate: new Date().toISOString(),
      feedback: null,
      status: "submitted",
    })

    return NextResponse.json(newHomework, { status: 201 })
  } catch (error) {
    console.error("Error creating homework:", error)
    return NextResponse.json({ error: "Failed to save homework" }, { status: 500 })
  }
}
