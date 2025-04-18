import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getHomeworkById, updateHomework, deleteHomework } from "@/lib/storage"

export async function GET(request, { params }) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = Number.parseInt(params.id)
  const homework = getHomeworkById(id)

  if (!homework) {
    return NextResponse.json({ error: "Homework not found" }, { status: 404 })
  }

  // Студент может видеть только свои домашние задания
  if (user.role === "student" && homework.studentId !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json(homework)
}

export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const homework = getHomeworkById(id)

    if (!homework) {
      return NextResponse.json({ error: "Homework not found" }, { status: 404 })
    }

    // Студент может обновлять только свои домашние задания
    if (user.role === "student" && homework.studentId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Администратор может добавлять отзыв и менять статус
    if (user.role === "admin") {
      const updatedHomework = updateHomework(id, {
        feedback: data.feedback,
        status: data.status,
      })

      return NextResponse.json(updatedHomework)
    }

    // Студент может только обновлять файл
    const updatedHomework = updateHomework(id, {
      submittedFile: data.submittedFile,
      submittedDate: new Date().toISOString(),
      status: "submitted",
    })

    return NextResponse.json(updatedHomework)
  } catch (error) {
    console.error("Error updating homework:", error)
    return NextResponse.json({ error: "Failed to update homework" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const success = deleteHomework(id)

    if (!success) {
      return NextResponse.json({ error: "Homework not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting homework:", error)
    return NextResponse.json({ error: "Failed to delete homework" }, { status: 500 })
  }
}
