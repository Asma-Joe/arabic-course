import { type NextRequest, NextResponse } from "next/server"
import { getLessonById, updateLesson, deleteLesson } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const lesson = getLessonById(id)

  if (!lesson) {
    return NextResponse.json({ error: "Урок не найден" }, { status: 404 })
  }

  return NextResponse.json(lesson)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

    // Добавляем дату обновления
    data.updatedAt = new Date().toISOString()

    const updatedLesson = updateLesson(id, data)

    if (!updatedLesson) {
      return NextResponse.json({ error: "Урок не найден" }, { status: 404 })
    }

    return NextResponse.json(updatedLesson)
  } catch (error) {
    console.error("Error updating lesson:", error)
    return NextResponse.json({ error: "Ошибка при обновлении урока" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const success = deleteLesson(id)

  if (!success) {
    return NextResponse.json({ error: "Урок не найден" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
