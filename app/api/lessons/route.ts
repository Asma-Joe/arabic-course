import { type NextRequest, NextResponse } from "next/server"
import { getLessons, addLesson, type Lesson } from "@/lib/db"

export async function GET() {
  const lessons = getLessons()
  return NextResponse.json(lessons)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Проверка обязательных полей
    if (!data.title) {
      return NextResponse.json({ error: "Название урока обязательно" }, { status: 400 })
    }

    // Создание нового урока
    const now = new Date().toISOString()
    const newLesson: Omit<Lesson, "id"> = {
      title: data.title,
      description: data.description || "",
      videoUrl: data.videoUrl || "",
      homeworkUrl: data.homeworkUrl || "",
      status: data.status || "draft",
      publishDate: data.publishDate || now,
      createdAt: now,
      updatedAt: now,
    }

    const lesson = addLesson(newLesson)
    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error("Error creating lesson:", error)
    return NextResponse.json({ error: "Ошибка при создании урока" }, { status: 500 })
  }
}
