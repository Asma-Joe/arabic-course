import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { updateUser } from "@/lib/storage"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Возвращаем данные пользователя без пароля
    const { password, ...userData } = user
    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Обновляем данные пользователя
    const updatedUser = updateUser(user.id, {
      name: data.name,
      email: data.email,
    })

    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }

    // Возвращаем обновленные данные без пароля
    const { password, ...userData } = updatedUser
    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 })
  }
}
