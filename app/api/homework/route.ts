import { type NextRequest, NextResponse } from "next/server"
import { getHomework, addHomework, type Homework } from "@/lib/db"

export async function GET() {
  const homework = getHomework()
  return NextResponse.json(homework)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Проверка обязательных полей
    if (!data.studentId || !data.lessonId || !data.submittedFile) {
      return NextResponse.json({ error: "ID ученицы, ID урока и файл обязательны" }, { status: 400 })
    }

    // Создание новой записи о домашнем задании
    const newHomework: Omit<Homework, "id"> = {
      studentId: data.studentId,
      lessonId: data.lessonId,
      submittedFile: data.submittedFile,
      submittedDate: new Date().toISOString(),
      feedback: null,
      status: "submitted",
    }

    const homework = addHomework(newHomework)
    return NextResponse.json(homework, { status: 201 })
  } catch (error) {
    console.error("Error creating homework:", error)
    return NextResponse.json({ error: "Ошибка при сохранении домашнего задания" }, { status: 500 })
  }
}
