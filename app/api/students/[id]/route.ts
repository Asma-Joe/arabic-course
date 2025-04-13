import { type NextRequest, NextResponse } from "next/server"
import { getStudentById, updateStudent, deleteStudent } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const student = getStudentById(id)

  if (!student) {
    return NextResponse.json({ error: "Ученица не найдена" }, { status: 404 })
  }

  return NextResponse.json(student)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

    const updatedStudent = updateStudent(id, data)

    if (!updatedStudent) {
      return NextResponse.json({ error: "Ученица не найдена" }, { status: 404 })
    }

    return NextResponse.json(updatedStudent)
  } catch (error) {
    console.error("Error updating student:", error)
    return NextResponse.json({ error: "Ошибка при обновлении данных ученицы" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const success = deleteStudent(id)

  if (!success) {
    return NextResponse.json({ error: "Ученица не найдена" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
