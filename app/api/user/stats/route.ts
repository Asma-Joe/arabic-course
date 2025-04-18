import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getLessons, getHomework } from "@/lib/storage"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Получаем все уроки
    const allLessons = getLessons()
    const publishedLessons = allLessons.filter(
      (lesson) =>
        lesson.status === "published" || (lesson.status === "scheduled" && new Date(lesson.publishDate) <= new Date()),
    )

    // Получаем домашние задания пользователя
    const userHomework = getHomework().filter((hw) => hw.studentId === user.id)

    // Рассчитываем статистику
    const totalLessons = publishedLessons.length
    const completedLessons = userHomework.length
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    return NextResponse.json({
      totalLessons,
      completedLessons,
      submittedHomework: userHomework.length,
      progress,
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 })
  }
}
