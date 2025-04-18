import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { addHomework, getLessonById } from "@/lib/storage"
import { sendTelegramMessage, formatNewHomeworkMessage } from "@/lib/telegram"

export async function POST(request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Получаем данные формы
    const formData = await request.formData()
    const file = formData.get("file")
    const lessonId = Number.parseInt(formData.get("lessonId"))

    if (!file || !lessonId) {
      return NextResponse.json({ error: "File and lessonId are required" }, { status: 400 })
    }

    // Получаем информацию об уроке
    const lesson = getLessonById(lessonId)
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // В реальном приложении здесь будет загрузка файла на сервер
    // и сохранение пути к файлу в базе данных

    // Создаем запись о домашнем задании
    const homework = addHomework({
      studentId: user.id,
      lessonId,
      submittedFile: file.name,
      submittedDate: new Date().toISOString(),
      feedback: null,
      status: "submitted",
    })

    // Отправляем уведомление в Telegram, если настроено
    try {
      if (typeof sendTelegramMessage === "function") {
        const message = formatNewHomeworkMessage(user.name, lesson.title, file.name)
        await sendTelegramMessage(message)
      }
    } catch (telegramError) {
      console.error("Error sending Telegram notification:", telegramError)
      // Продолжаем выполнение, даже если уведомление не отправлено
    }

    return NextResponse.json({ success: true, homework }, { status: 201 })
  } catch (error) {
    console.error("Error submitting homework:", error)
    return NextResponse.json({ error: "Failed to submit homework" }, { status: 500 })
  }
}
