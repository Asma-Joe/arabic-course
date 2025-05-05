// Простая система аутентификации, работающая в памяти
// Это решение для Vercel, где файловая система доступна только для чтения

// Типы данных
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "student"
  password: string
}

// Предустановленные пользователи
const users: User[] = [
  {
    id: "admin-1",
    email: "asmajoe18@gmail.com",
    name: "Асма",
    role: "admin",
    password: "123asma",
  },
  {
    id: "student-1",
    email: "asmacheck@gmail.com",
    name: "Тестовая Ученица",
    role: "student",
    password: "123asma",
  },
]

// Функции для работы с пользователями
export function getUserByEmail(email: string): User | undefined {
  return users.find((user) => user.email === email)
}

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id)
}

export function authenticate(email: string, password: string): User | null {
  const user = getUserByEmail(email)

  if (!user) {
    return null
  }

  if (user.password === password) {
    return user
  }

  return null
}

export function createSession(user: User): string {
  // Создаем простой токен сессии
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 дней
    iat: Math.floor(Date.now() / 1000),
  }

  return Buffer.from(JSON.stringify(payload)).toString("base64")
}
