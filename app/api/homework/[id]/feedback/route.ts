import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getHomeworkById, updateHomework, getUserById, getLessonById } from "@/lib/storage"
import { notifyStudentAboutFeedback } from "@/lib/telegram"

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const { feedback } = await request.json()

    if (!feedback) {
      return NextResponse.json({ error: "Feedback is required" }, { status: 400 })
    }

    // Получаем информацию о домашнем задании
    const homework = getHomeworkById(id)
    if (!homework) {
      return NextResponse.json({ error: "Homework not found" }, { status: 404 })
    }

    // Обновляем домашнее задание
    const updatedHomework = updateHomework(id, {
      feedback,
      status: "checked",
    })

    // Получаем информацию о студенте
    const student = getUserById(homework.studentId)
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Получаем информацию об уроке
    const lesson = getLessonById(homework.lessonId)
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Отправляем уведомление студенту через Telegram
    if (student.telegramUsername) {
      await notifyStudentAboutFeedback(student.telegramUsername, lesson.title, feedback)
    }

    return NextResponse.json({ success: true, homework: updatedHomework })
  } catch (error) {
    console.error("Error sending feedback:", error)
    return NextResponse.json({ error: "Failed to send feedback" }, { status: 500 })
  }
}
