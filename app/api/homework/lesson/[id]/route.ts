import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getHomeworkByStudentAndLesson } from "@/lib/storage"

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const lessonId = Number(params.id)
    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 })
    }

    const homework = getHomeworkByStudentAndLesson(user.id, lessonId)

    if (!homework) {
      return NextResponse.json({ error: "Homework not found" }, { status: 404 })
    }

    return NextResponse.json(homework)
  } catch (error) {
    console.error("Error fetching homework:", error)
    return NextResponse.json({ error: "Failed to fetch homework" }, { status: 500 })
  }
}
