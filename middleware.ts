import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Получаем текущий путь
  const path = request.nextUrl.pathname
  console.log(`Middleware обрабатывает путь: ${path}`)

  // Создаем базовый ответ
  const response = NextResponse.next()

  // Добавляем заголовки безопасности для всех страниц
  const securityHeaders = new Headers(response.headers)
  securityHeaders.set("X-Content-Type-Options", "nosniff")
  securityHeaders.set("X-Frame-Options", "DENY")
  securityHeaders.set("X-XSS-Protection", "1; mode=block")
  securityHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // Проверяем, является ли путь административным или пользовательским
  const isAdminPath = path.startsWith("/admin")
  const isDashboardPath = path.startsWith("/dashboard")
  const isApiPath = path.startsWith("/api")
  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path === "/forgot-password" ||
    path === "/login-direct" ||
    path === "/simple-login" ||
    path.startsWith("/_next") ||
    path.startsWith("/favicon") ||
    path.includes(".") // Статические файлы

  // Получаем сессионный cookie
  const sessionCookie = request.cookies.get("session")
  console.log(`Сессионный cookie: ${sessionCookie ? "присутствует" : "отсутствует"}`)

  // Если путь требует аутентификации и нет сессии, перенаправляем на страницу входа
  if ((isAdminPath || isDashboardPath) && !sessionCookie) {
    console.log(`Перенаправление неаутентифицированного пользователя с ${path} на /login`)
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Если есть сессия, проверяем роль пользователя для админ-панели
  if (isAdminPath && sessionCookie) {
    try {
      const sessionData = Buffer.from(sessionCookie.value, "base64").toString()
      const user = JSON.parse(sessionData)
      console.log(`Пользователь: ${user.name}, роль: ${user.role}`)

      // Если пользователь не администратор, перенаправляем на страницу входа
      if (user.role !== "admin") {
        console.log(`Перенаправление не-администратора с ${path} на /dashboard`)
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      // Если возникла ошибка при разборе сессии, перенаправляем на страницу входа
      console.error("Ошибка при разборе сессии:", error)
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Защита API-эндпоинтов, кроме аутентификации
  if (isApiPath && !path.startsWith("/api/auth") && !path.startsWith("/api/health") && !isPublicPath) {
    // Для API-эндпоинтов, кроме аутентификации, требуем сессию
    if (!sessionCookie) {
      console.log(`Блокировка доступа к API: ${path}`)
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }
  }

  // Добавляем заголовки безопасности к ответу
  Object.entries(Object.fromEntries(securityHeaders.entries())).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

// Указываем, для каких путей должен срабатывать middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for static files and resources
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
