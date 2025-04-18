import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getUserById } from "@/lib/storage"

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Студент может получить только свои данные
    if (user.role === "student" && user.id !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const student = getUserById(id)
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Не возвращаем пароль
    const { password, ...studentData } = student

    return NextResponse.json(studentData)
  } catch (error) {
    console.error("Error fetching student:", error)
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 })
  }
}
