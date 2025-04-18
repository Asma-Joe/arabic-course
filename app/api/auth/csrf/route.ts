import { NextResponse } from "next/server"
import { getCSRFToken } from "@/lib/csrf-simple"

export async function GET() {
  try {
    // Генерация и установка нового CSRF-токена
    const csrfToken = getCSRFToken()

    // Проверяем, что токен действительно является строкой
    if (typeof csrfToken !== "string" || !csrfToken) {
      console.error("Generated CSRF token is invalid:", csrfToken)
      return NextResponse.json(
        {
          error: "Failed to generate valid CSRF token",
          success: false,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      csrfToken,
      success: true,
    })
  } catch (error) {
    console.error("CSRF token generation error:", error)
    return NextResponse.json(
      {
        error: "Error generating CSRF token",
        success: false,
      },
      { status: 500 },
    )
  }
}
