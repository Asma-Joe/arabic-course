import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // Удаление cookie сессии
  const cookieStore = cookies()
  cookieStore.delete("session")

  return NextResponse.json({ success: true })
}
