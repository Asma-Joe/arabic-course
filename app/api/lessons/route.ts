import { type NextRequest, NextResponse } from "next/server"
import { getLessons, addLesson } from "@/lib/storage"
import { getCurrentUser, isAdmin } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const lessons = getLessons()

    // Если пользователь не админ, возвращаем только опубликованные уроки
    if (user.role !== "admin") {
      const publishedLessons = lessons.filter(
        (lesson) =>
          lesson.status === "published" ||
          (lesson.status === "scheduled" && new Date(lesson.publishDate) <= new Date()),
      )
      return NextResponse.json(publishedLessons)
    }

    return NextResponse.json(lessons)
  } catch (error) {
    console.error("Error fetching lessons:", error)
    return NextResponse.json({ error: "Ошибка при получении списка уроков" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Проверяем, что пользователь - админ
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Проверка обязательных полей
    if (!data.title) {
      return NextResponse.json({ error: "Название урока обязательно" }, { status: 400 })
    }

    // Создание нового урока
    const newLesson = addLesson({
      title: data.title,
      description: data.description || "",
      videoUrl: data.videoUrl || "",
      homeworkUrl: data.homeworkUrl || "",
      status: data.status || "draft",
      publishDate: data.publishDate || new Date().toISOString(),
    })

    return NextResponse.json(newLesson, { status: 201 })
  } catch (error) {
    console.error("Error creating lesson:", error)
    return NextResponse.json({ error: "Ошибка при создании урока" }, { status: 500 })
  }
}
