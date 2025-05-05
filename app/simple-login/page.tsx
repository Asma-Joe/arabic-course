"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

export default function SimpleLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  // Функция для установки cookie напрямую
  const setCookie = (name, value, days) => {
    let expires = ""
    if (days) {
      const date = new Date()
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      expires = "; expires=" + date.toUTCString()
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/"
  }

  // Функция для входа администратора
  const loginAsAdmin = () => {
    setIsLoading(true)
    setError("")
    setSuccess("Выполняется вход...")

    try {
      // Создаем данные сессии администратора
      const sessionData = {
        id: "admin-1",
        name: "Асма",
        email: "asmajoe18@gmail.com",
        role: "admin",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 дней
      }

      // Кодируем данные в base64
      const sessionToken = btoa(JSON.stringify(sessionData))

      // Устанавливаем cookie напрямую
      setCookie("session", sessionToken, 7)

      // Показываем сообщение об успехе
      setSuccess("Вход выполнен успешно! Перенаправление...")

      // Перенаправляем на страницу администратора
      setTimeout(() => {
        router.push("/admin")
      }, 1000)
    } catch (error) {
      console.error("Login error:", error)
      setError("Произошла ошибка при входе в систему")
      setSuccess("")
    } finally {
      setIsLoading(false)
    }
  }

  // Функция для входа студента
  const loginAsStudent = () => {
    setIsLoading(true)
    setError("")
    setSuccess("Выполняется вход...")

    try {
      // Создаем данные сессии студента
      const sessionData = {
        id: "student-1",
        name: "Тестовая Ученица",
        email: "asmacheck@gmail.com",
        role: "student",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 дней
      }

      // Кодируем данные в base64
      const sessionToken = btoa(JSON.stringify(sessionData))

      // Устанавливаем cookie напрямую
      setCookie("session", sessionToken, 7)

      // Показываем сообщение об успехе
      setSuccess("Вход выполнен успешно! Перенаправление...")

      // Перенаправляем на страницу студента
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      console.error("Login error:", error)
      setError("Произошла ошибка при входе в систему")
      setSuccess("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2] p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="text-4xl font-bold text-[#8a6552]">كن</div>
          </div>
          <CardTitle className="text-2xl text-[#4a4a4a]">Простой вход</CardTitle>
          <CardDescription className="text-[#6b6b6b]">Выберите тип аккаунта для входа</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
          )}

          <div className="space-y-4">
            <Button onClick={loginAsAdmin} className="w-full bg-[#8a6552] hover:bg-[#6d503f]" disabled={isLoading}>
              Войти как Администратор
            </Button>
            <Button onClick={loginAsStudent} className="w-full bg-[#8a6552] hover:bg-[#6d503f]" disabled={isLoading}>
              Войти как Ученица
            </Button>
            <div className="text-center mt-4">
              <Link href="/" className="text-[#8a6552] hover:underline">
                Вернуться на главную
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
