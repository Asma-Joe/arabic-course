// Система аутентификации для Vercel
import { cookies } from "next/headers"

// Типы данных
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "student"
  password?: string
}

// Предустановленные пользователи
const ADMIN_USER: User = {
  id: "admin-1",
  email: "asmajoe18@gmail.com",
  name: "Асма",
  role: "admin",
  password: "123asma",
}

const STUDENT_USER: User = {
  id: "student-1",
  email: "asmacheck@gmail.com",
  name: "Тестовая Ученица",
  role: "student",
  password: "123asma",
}

// Функция для аутентификации пользователя
export function authenticateUser(email: string, password: string): User | null {
  console.log(`Попытка аутентификации: ${email}`)

  // Проверка для админа
  if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
    console.log("Успешная аутентификация администратора")
    const { password, ...userWithoutPassword } = ADMIN_USER
    return userWithoutPassword
  }

  // Проверка для ученицы
  if (email === STUDENT_USER.email && password === STUDENT_USER.password) {
    console.log("Успешная аутентификация ученицы")
    const { password, ...userWithoutPassword } = STUDENT_USER
    return userWithoutPassword
  }

  console.log("Аутентификация не удалась")
  return null
}

// Функция для создания сессии
export function createUserSession(user: User): string {
  const sessionData = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 дней
  }

  return Buffer.from(JSON.stringify(sessionData)).toString("base64")
}

// Функция для получения текущего пользователя
export function getCurrentUser(): User | null {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return null
    }

    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString())

    // Проверка срока действия
    if (sessionData.exp && sessionData.exp < Math.floor(Date.now() / 1000)) {
      console.log("Сессия истекла")
      return null
    }

    return {
      id: sessionData.id,
      email: sessionData.email,
      name: sessionData.name,
      role: sessionData.role,
    }
  } catch (error) {
    console.error("Ошибка при получении текущего пользователя:", error)
    return null
  }
}

// Функция для проверки, является ли пользователь администратором
export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === "admin"
}

// Функция для проверки, является ли пользователь студентом
export function isStudent(): boolean {
  const user = getCurrentUser()
  return user?.role === "student"
}
