// Простая система аутентификации
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

// Учетные данные администратора и тестовой ученицы
const ADMIN_EMAIL = "asmajoe18@gmail.com"
const ADMIN_PASSWORD = "123asma" // В реальном приложении пароль должен быть хешированным

const TEST_STUDENT_EMAIL = "asmacheck@gmail.com"
const TEST_STUDENT_PASSWORD = "123asma"

// Типы пользователей
export type UserRole = "admin" | "student"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

// Проверка аутентификации
export async function authenticate(email: string, password: string): Promise<User | null> {
  // Проверка администратора
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return {
      id: "admin-1",
      email: ADMIN_EMAIL,
      name: "Асма",
      role: "admin",
    }
  }

  // Проверка тестовой ученицы
  if (email === TEST_STUDENT_EMAIL && password === TEST_STUDENT_PASSWORD) {
    return {
      id: "student-1",
      email: TEST_STUDENT_EMAIL,
      name: "Тестовая Ученица",
      role: "student",
    }
  }

  return null
}

// Создание сессии
export async function createSession(user: User): Promise<string> {
  // В реальном приложении здесь должна быть генерация JWT или другого токена
  // Для простоты используем JSON строку
  const sessionData = JSON.stringify(user)
  return Buffer.from(sessionData).toString("base64")
}

// Получение текущего пользователя из сессии
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    const sessionData = Buffer.from(sessionCookie.value, "base64").toString()
    const user = JSON.parse(sessionData) as User
    return user
  } catch (error) {
    console.error("Error parsing session:", error)
    return null
  }
}

// Проверка, является ли пользователь администратором
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === "admin"
}

// Middleware для защиты административных маршрутов
export async function adminAuthMiddleware(request: NextRequest) {
  const user = await getCurrentUser()

  if (!user || user.role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}
