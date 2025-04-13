import { type NextRequest, NextResponse } from "next/server"
import { getHomeworkById, updateHomework, deleteHomework } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const homework = getHomeworkById(id)

  if (!homework) {
    return NextResponse.json({ error: "Домашнее задание не найдено" }, { status: 404 })
  }

  return NextResponse.json(homework)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

    const updatedHomework = updateHomework(id, data)

    if (!updatedHomework) {
      return NextResponse.json({ error: "Домашнее задание не найдено" }, { status: 404 })
    }

    return NextResponse.json(updatedHomework)
  } catch (error) {
    console.error("Error updating homework:", error)
    return NextResponse.json({ error: "Ошибка при обновлении домашнего задания" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const success = deleteHomework(id)

  if (!success) {
    return NextResponse.json({ error: "Домашнее задание не найдено" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
