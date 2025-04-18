import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getUserById } from "@/lib/storage"

export async function POST(request) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentId, title, message } = await request.json()

    if (!studentId || !title || !message) {
      return NextResponse.json({ error: "studentId, title and message are required" }, { status: 400 })
    }

    // Получаем данные о студенте
    const student = getUserById(studentId)
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // В реальном приложении здесь будет отправка уведомления
    // Например, через email, push-уведомление или сохранение в базе данных
    console.log(`Отправка уведомления для ${student.name}:`)
    console.log(`Заголовок: ${title}`)
    console.log(`Сообщение: ${message}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
