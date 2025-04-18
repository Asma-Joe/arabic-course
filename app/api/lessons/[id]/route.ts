import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getLessonById, updateLesson, deleteLesson } from "@/lib/storage"

export async function GET(request, { params }) {
  const id = Number.parseInt(params.id)
  const lesson = getLessonById(id)

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
  }

  return NextResponse.json(lesson)
}

export async function PUT(request, { params }) {
  try {
    // Проверяем, что пользователь авторизован как администратор
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const data = await request.json()

    const updatedLesson = updateLesson(id, data)

    if (!updatedLesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    return NextResponse.json(updatedLesson)
  } catch (error) {
    console.error("Error updating lesson:", error)
    return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    // Проверяем, что пользователь авторизован как администратор
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const success = deleteLesson(id)

    if (!success) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting lesson:", error)
    return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 })
  }
}
