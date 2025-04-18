// Хранилище данных для сайта
// Используем серверное хранилище для демонстрации
import fs from "fs"
import path from "path"

// Типы данных
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "student"
  password: string // В реальном приложении пароли должны быть хешированы
}

export interface Lesson {
  id: number
  title: string
  description: string
  videoUrl: string
  homeworkUrl: string
  status: "draft" | "published" | "scheduled"
  publishDate: string
  createdAt: string
  updatedAt: string
}

export interface Homework {
  id: number
  studentId: string
  lessonId: number
  submittedFile: string
  submittedDate: string
  feedback: string | null
  status: "submitted" | "checked"
}

// Начальные данные
const initialUsers: User[] = [
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

const initialLessons: Lesson[] = []
const initialHomework: Homework[] = []

// Пути к файлам данных
const dataDir = path.join(process.cwd(), "data")
const usersFile = path.join(dataDir, "users.json")
const lessonsFile = path.join(dataDir, "lessons.json")
const homeworkFile = path.join(dataDir, "homework.json")

// Убедимся, что директория существует
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Инициализация файлов, если они не существуют
function initializeFile(filePath: string, initialData: any) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), "utf8")
  }
}

// Инициализация файлов с начальными данными
initializeFile(usersFile, initialUsers)
initializeFile(lessonsFile, initialLessons)
initializeFile(homeworkFile, initialHomework)

// Функции для работы с данными
function readFile<T>(filePath: string, defaultValue: T): T {
  try {
    const data = fs.readFileSync(filePath, "utf8")
    return JSON.parse(data) as T
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return defaultValue
  }
}

function writeFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8")
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error)
  }
}

// Пользователи
export function getUsers(): User[] {
  return readFile<User[]>(usersFile, initialUsers)
}

export function saveUsers(users: User[]): void {
  writeFile(usersFile, users)
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers()
  return users.find((user) => user.email === email)
}

export function getUserById(id: string): User | undefined {
  const users = getUsers()
  return users.find((user) => user.id === id)
}

export function addUser(user: Omit<User, "id">): User {
  const users = getUsers()
  const newUser: User = {
    ...user,
    id: `user-${Date.now()}`,
  }
  users.push(newUser)
  saveUsers(users)
  return newUser
}

export function updateUser(id: string, data: Partial<User>): User | undefined {
  const users = getUsers()
  const index = users.findIndex((user) => user.id === id)
  if (index === -1) return undefined

  users[index] = {
    ...users[index],
    ...data,
  }
  saveUsers(users)
  return users[index]
}

// Уроки
export function getLessons(): Lesson[] {
  return readFile<Lesson[]>(lessonsFile, initialLessons)
}

export function saveLessons(lessons: Lesson[]): void {
  writeFile(lessonsFile, lessons)
}

export function getLessonById(id: number): Lesson | undefined {
  const lessons = getLessons()
  return lessons.find((lesson) => lesson.id === id)
}

export function addLesson(lesson: Omit<Lesson, "id" | "createdAt" | "updatedAt">): Lesson {
  const lessons = getLessons()
  const now = new Date().toISOString()
  const newLesson: Lesson = {
    ...lesson,
    id: lessons.length > 0 ? Math.max(...lessons.map((l) => l.id)) + 1 : 1,
    createdAt: now,
    updatedAt: now,
  }
  lessons.push(newLesson)
  saveLessons(lessons)
  return newLesson
}

export function updateLesson(id: number, data: Partial<Lesson>): Lesson | undefined {
  const lessons = getLessons()
  const index = lessons.findIndex((lesson) => lesson.id === id)
  if (index === -1) return undefined

  lessons[index] = {
    ...lessons[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  saveLessons(lessons)
  return lessons[index]
}

export function deleteLesson(id: number): boolean {
  const lessons = getLessons()
  const newLessons = lessons.filter((lesson) => lesson.id !== id)
  if (newLessons.length === lessons.length) return false
  saveLessons(newLessons)
  return true
}

// Домашние задания
export function getHomework(): Homework[] {
  return readFile<Homework[]>(homeworkFile, initialHomework)
}

export function saveHomework(homework: Homework[]): void {
  writeFile(homeworkFile, homework)
}

export function getHomeworkById(id: number): Homework | undefined {
  const homework = getHomework()
  return homework.find((hw) => hw.id === id)
}

export function getHomeworkByStudentAndLesson(studentId: string, lessonId: number): Homework | undefined {
  const homework = getHomework()
  return homework.find((hw) => hw.studentId === studentId && hw.lessonId === lessonId)
}

export function addHomework(homework: Omit<Homework, "id">): Homework {
  const homeworkItems = getHomework()
  const newHomework: Homework = {
    ...homework,
    id: homeworkItems.length > 0 ? Math.max(...homeworkItems.map((hw) => hw.id)) + 1 : 1,
  }
  homeworkItems.push(newHomework)
  saveHomework(homeworkItems)
  return newHomework
}

export function updateHomework(id: number, data: Partial<Homework>): Homework | undefined {
  const homeworkItems = getHomework()
  const index = homeworkItems.findIndex((item) => item.id === id)
  if (index === -1) return undefined

  homeworkItems[index] = {
    ...homeworkItems[index],
    ...data,
  }
  saveHomework(homeworkItems)
  return homeworkItems[index]
}

export function deleteHomework(id: number): boolean {
  const homeworkItems = getHomework()
  const filteredHomework = homeworkItems.filter((item) => item.id !== id)
  if (filteredHomework.length === homeworkItems.length) return false
  saveHomework(filteredHomework)
  return true
}

// Получение публичных уроков для студентов
export function getPublishedLessons(): Lesson[] {
  const lessons = getLessons()
  const now = new Date()

  return lessons.filter((lesson) => {
    if (lesson.status === "published") {
      return true
    }

    if (lesson.status === "scheduled") {
      const publishDate = new Date(lesson.publishDate)
      return publishDate <= now
    }

    return false
  })
}

// Получение домашних заданий студента
export function getStudentHomework(studentId: string): Homework[] {
  const homework = getHomework()
  return homework.filter((hw) => hw.studentId === studentId)
}

// Получение домашних заданий, ожидающих проверки
export function getPendingHomework(): Homework[] {
  const homework = getHomework()
  return homework.filter((hw) => hw.status === "submitted")
}
