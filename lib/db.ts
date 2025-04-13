// Простая "база данных" на основе JSON-файлов
import fs from "fs"
import path from "path"

// Пути к файлам данных
const dataDir = path.join(process.cwd(), "data")
const studentsFile = path.join(dataDir, "students.json")
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
initializeFile(studentsFile, [])
initializeFile(lessonsFile, [])
initializeFile(homeworkFile, [])

// Типы данных
export interface Student {
  id: number
  name: string
  email: string
  telegramUsername: string
  progress: number
  lastActive: string
  status: "active" | "inactive"
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
  studentId: number
  lessonId: number
  submittedFile: string
  submittedDate: string
  feedback: string | null
  status: "submitted" | "checked"
}

// Функции для работы с данными
export function getStudents(): Student[] {
  try {
    const data = fs.readFileSync(studentsFile, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading students file:", error)
    return []
  }
}

export function saveStudents(students: Student[]): void {
  try {
    fs.writeFileSync(studentsFile, JSON.stringify(students, null, 2), "utf8")
  } catch (error) {
    console.error("Error writing students file:", error)
  }
}

export function getLessons(): Lesson[] {
  try {
    const data = fs.readFileSync(lessonsFile, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading lessons file:", error)
    return []
  }
}

export function saveLessons(lessons: Lesson[]): void {
  try {
    fs.writeFileSync(lessonsFile, JSON.stringify(lessons, null, 2), "utf8")
  } catch (error) {
    console.error("Error writing lessons file:", error)
  }
}

export function getHomework(): Homework[] {
  try {
    const data = fs.readFileSync(homeworkFile, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading homework file:", error)
    return []
  }
}

export function saveHomework(homework: Homework[]): void {
  try {
    fs.writeFileSync(homeworkFile, JSON.stringify(homework, null, 2), "utf8")
  } catch (error) {
    console.error("Error writing homework file:", error)
  }
}

// Функции для работы с отдельными записями
export function getStudentById(id: number): Student | null {
  const students = getStudents()
  return students.find((student) => student.id === id) || null
}

export function addStudent(student: Omit<Student, "id">): Student {
  const students = getStudents()
  const newId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1
  const newStudent = { ...student, id: newId }
  students.push(newStudent)
  saveStudents(students)
  return newStudent
}

export function updateStudent(id: number, data: Partial<Student>): Student | null {
  const students = getStudents()
  const index = students.findIndex((student) => student.id === id)
  if (index === -1) return null

  students[index] = { ...students[index], ...data }
  saveStudents(students)
  return students[index]
}

export function deleteStudent(id: number): boolean {
  const students = getStudents()
  const filteredStudents = students.filter((student) => student.id !== id)
  if (filteredStudents.length === students.length) return false

  saveStudents(filteredStudents)
  return true
}

export function getLessonById(id: number): Lesson | null {
  const lessons = getLessons()
  return lessons.find((lesson) => lesson.id === id) || null
}

export function addLesson(lesson: Omit<Lesson, "id">): Lesson {
  const lessons = getLessons()
  const newId = lessons.length > 0 ? Math.max(...lessons.map((l) => l.id)) + 1 : 1
  const newLesson = { ...lesson, id: newId }
  lessons.push(newLesson)
  saveLessons(lessons)
  return newLesson
}

export function updateLesson(id: number, data: Partial<Lesson>): Lesson | null {
  const lessons = getLessons()
  const index = lessons.findIndex((lesson) => lesson.id === id)
  if (index === -1) return null

  lessons[index] = { ...lessons[index], ...data }
  saveLessons(lessons)
  return lessons[index]
}

export function deleteLesson(id: number): boolean {
  const lessons = getLessons()
  const filteredLessons = lessons.filter((lesson) => lesson.id !== id)
  if (filteredLessons.length === lessons.length) return false

  saveLessons(filteredLessons)
  return true
}

export function getHomeworkById(id: number): Homework | null {
  const homeworkItems = getHomework()
  return homeworkItems.find((item) => item.id === id) || null
}

export function getHomeworkByStudentAndLesson(studentId: number, lessonId: number): Homework | null {
  const homeworkItems = getHomework()
  return homeworkItems.find((item) => item.studentId === studentId && item.lessonId === lessonId) || null
}

export function addHomework(homework: Omit<Homework, "id">): Homework {
  const homeworkItems = getHomework()
  const newId = homeworkItems.length > 0 ? Math.max(...homeworkItems.map((h) => h.id)) + 1 : 1
  const newHomework = { ...homework, id: newId }
  homeworkItems.push(newHomework)
  saveHomework(homeworkItems)
  return newHomework
}

export function updateHomework(id: number, data: Partial<Homework>): Homework | null {
  const homeworkItems = getHomework()
  const index = homeworkItems.findIndex((item) => item.id === id)
  if (index === -1) return null

  homeworkItems[index] = { ...homeworkItems[index], ...data }
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
