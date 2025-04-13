import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Получаем текущий путь
  const path = request.nextUrl.pathname

  // Проверяем, является ли путь административным
  const isAdminPath = path.startsWith("/admin")

  // Получаем сессионный cookie
  const sessionCookie = request.cookies.get("session")

  // Если путь административный и нет сессии, перенаправляем на страницу входа
  if (isAdminPath && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Если есть сессия, проверяем роль пользователя
  if (isAdminPath && sessionCookie) {
    try {
      const sessionData = Buffer.from(sessionCookie.value, "base64").toString()
      const user = JSON.parse(sessionData)

      // Если пользователь не администратор, перенаправляем на страницу входа
      if (user.role !== "admin") {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    } catch (error) {
      // Если возникла ошибка при разборе сессии, перенаправляем на страницу входа
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Если путь /dashboard и нет сессии, перенаправляем на страницу входа
  if (path.startsWith("/dashboard") && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// Указываем, для каких путей должен срабатывать middleware
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}
