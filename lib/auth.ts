import { cookies } from "next/headers"
import { getUserByEmail, getUserById, type User } from "./storage"
import crypto from "crypto"

// Аутентификация пользователя
export async function authenticate(email: string, password: string): Promise<User | null> {
  try {
    console.log(`Attempting to authenticate user: ${email}`)
    const user = getUserByEmail(email)

    if (!user) {
      console.log(`User not found: ${email}`)
      // Используем постоянное время для предотвращения timing attacks
      await new Promise((resolve) => setTimeout(resolve, 500))
      return null
    }

    // В реальном приложении пароли должны быть хешированы
    // Здесь для демонстрации используем простую проверку
    if (user.password === password) {
      console.log(`Authentication successful for user: ${email}`)
      return user
    }

    console.log(`Invalid password for user: ${email}`)
    return null
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

// Создание сессии
export async function createSession(user: User): Promise<string> {
  try {
    // Создаем JWT payload
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      // Добавляем время истечения токена (7 дней)
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      // Добавляем время создания токена
      iat: Math.floor(Date.now() / 1000),
    }

    console.log(`Creating session for user: ${user.email}, role: ${user.role}`)

    // В реальном приложении здесь должна быть подпись JWT с секретным ключом
    // Для простоты используем base64
    return Buffer.from(JSON.stringify(payload)).toString("base64")
  } catch (error) {
    console.error("Error creating session:", error)
    throw error
  }
}

// Получение текущего пользователя из сессии
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return null
    }

    try {
      const sessionData = Buffer.from(sessionCookie.value, "base64").toString()
      const userData = JSON.parse(sessionData)

      // Проверяем срок действия токена
      if (userData.exp && userData.exp < Math.floor(Date.now() / 1000)) {
        console.log("Session expired")
        return null
      }

      // Получаем полные данные пользователя из хранилища
      const user = getUserById(userData.id)

      if (!user) {
        console.log(`User not found for ID: ${userData.id}`)
        return null
      }

      return user
    } catch (error) {
      console.error("Error parsing session:", error)
      return null
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Проверка, является ли пользователь администратором
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    return user?.role === "admin"
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

// Функция для создания CSRF-токена
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString("hex")
}
