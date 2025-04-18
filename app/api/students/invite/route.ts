import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getUserById } from "@/lib/storage"
import { sendTelegramMessage } from "@/lib/telegram"

export async function POST(request) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentId } = await request.json()

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    // Получаем информацию о студенте
    const student = getUserById(studentId)
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Проверяем наличие Telegram username
    if (!student.telegramUsername) {
      return NextResponse.json({ error: "Student does not have a Telegram username" }, { status: 400 })
    }

    // Формируем сообщение-приглашение
    const message = `
<b>🎉 Добро пожаловать на курс "Арабский с нуля для дам"!</b>

Здравствуйте, ${student.name}!

Вы были добавлены на курс арабского языка. Для доступа к материалам курса, пожалуйста, используйте следующие данные:

<b>Логин:</b> ${student.email}
<b>Пароль:</b> Временный пароль будет отправлен отдельным сообщением

Для входа перейдите по ссылке: https://your-domain.com/login

Если у вас возникнут вопросы, не стесняйтесь обращаться к преподавателю.

С уважением,
Команда курса "Арабский с нуля для дам"
    `.trim()

    // Извлекаем username из формата @username
    const username = student.telegramUsername.startsWith("@")
      ? student.telegramUsername.substring(1)
      : student.telegramUsername

    // Отправляем сообщение в Telegram
    const success = await sendTelegramMessage(message, username)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error sending invitation:", error)
    return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 })
  }
}
