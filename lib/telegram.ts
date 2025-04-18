// Функция для отправки сообщения в Telegram
// Для работы требуется настроить Telegram Bot API
export async function sendTelegramMessage(
  message: string,
  chatId: string = process.env.TELEGRAM_ADMIN_CHAT_ID || "",
): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      console.error("Telegram bot token is not set")
      return false
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    })

    const data = await response.json()
    return data.ok
  } catch (error) {
    console.error("Error sending Telegram message:", error)
    return false
  }
}

// Функция для форматирования сообщения о новой заявке
export function formatNewApplicationMessage(name: string, telegramUsername: string, message = ""): string {
  return `
<b>🎉 Новая заявка на курс!</b>

<b>Имя:</b> ${name}
<b>Telegram:</b> ${telegramUsername}
${message ? `<b>Сообщение:</b> ${message}` : ""}

<i>Отправлено с сайта курса "Арабский с нуля для дам"</i>
  `.trim()
}

// Функция для форматирования сообщения о новом домашнем задании
export function formatNewHomeworkMessage(studentName: string, lessonTitle: string, fileName: string): string {
  return `
<b>📚 Новое домашнее задание!</b>

<b>Ученица:</b> ${studentName}
<b>Урок:</b> ${lessonTitle}
<b>Файл:</b> ${fileName}

<i>Проверьте задание в административной панели</i>
  `.trim()
}

// Функция для отправки уведомления ученице о проверке домашнего задания
export async function notifyStudentAboutFeedback(
  studentTelegram: string,
  lessonTitle: string,
  feedback: string,
): Promise<boolean> {
  const message = `
<b>✅ Ваше домашнее задание проверено!</b>

<b>Урок:</b> ${lessonTitle}
<b>Отзыв преподавателя:</b>
${feedback}

<i>Войдите в личный кабинет, чтобы увидеть подробности</i>
  `.trim()

  // Извлекаем username из формата @username
  const username = studentTelegram.startsWith("@") ? studentTelegram.substring(1) : studentTelegram

  return sendTelegramMessage(message, username)
}
