import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { updateUser } from "@/lib/storage"

export async function PUT(request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { currentPassword, newPassword } = data

    // Проверяем текущий пароль
    if (user.password !== currentPassword) {
      return NextResponse.json({ error: "Неверный текущий пароль" }, { status: 400 })
    }

    // Обновляем пароль пользователя
    const updatedUser = updateUser(user.id, {
      password: newPassword,
    })

    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating password:", error)
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
}
