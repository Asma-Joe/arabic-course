"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Валидация на клиенте
    if (!email.trim()) {
      setError("Email обязателен для заполнения")
      return
    }

    if (!password.trim()) {
      setError("Пароль обязателен для заполнения")
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log("Отправляем данные:", { email, password })

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      })

      let data
      try {
        const text = await response.text()
        console.log("Ответ сервера:", text)
        data = JSON.parse(text)
      } catch (e) {
        console.error("Ошибка парсинга ответа:", e)
        setError("Сервер вернул неверный формат ответа")
        setLoading(false)
        return
      }

      if (!response.ok) {
        setError(data.error || "Произошла ошибка при входе")
        setLoading(false)
        return
      }

      if (data.success) {
        // Перенаправляем пользователя в зависимости от роли
        if (data.user.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } else {
        setError(data.error || "Неизвестная ошибка")
      }
    } catch (err) {
      console.error("Ошибка при входе:", err)
      setError("Произошла ошибка при подключении к серверу")
    } finally {
      setLoading(false)
    }
  }

  const loginAsAdmin = () => {
    setEmail("asmajoe18@gmail.com")
    setPassword("123asma")

    // Небольшая задержка для обновления состояния
    setTimeout(() => {
      const form = document.getElementById("loginForm") as HTMLFormElement
      if (form) form.dispatchEvent(new Event("submit", { cancelable: true }))
    }, 100)
  }

  const loginAsStudent = () => {
    setEmail("asmacheck@gmail.com")
    setPassword("123asma")

    // Небольшая задержка для обновления состояния
    setTimeout(() => {
      const form = document.getElementById("loginForm") as HTMLFormElement
      if (form) form.dispatchEvent(new Event("submit", { cancelable: true }))
    }, 100)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="text-4xl font-bold text-[#8a6552]">كن</div>
          </div>
          <CardTitle className="text-2xl text-[#4a4a4a]">Вход в личный кабинет</CardTitle>
          <CardDescription className="text-[#6b6b6b]">Введите свои данные для входа</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form id="loginForm" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Пароль</Label>
                <Link href="/forgot-password" className="text-sm text-[#8a6552] hover:underline">
                  Забыли пароль?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#8a6552] hover:bg-[#6d503f]" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Вход...
                </>
              ) : (
                "Войти"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Быстрый вход</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={loginAsAdmin}
                disabled={loading}
                className="border-[#8a6552] text-[#8a6552] hover:bg-[#8a6552] hover:text-white"
              >
                Войти как Админ
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={loginAsStudent}
                disabled={loading}
                className="border-[#8a6552] text-[#8a6552] hover:bg-[#8a6552] hover:text-white"
              >
                Войти как Ученица
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-center text-sm text-gray-500">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-[#8a6552] hover:underline">
              Получить приглашение
            </Link>
          </p>
          <Link href="/" className="text-center text-sm text-[#8a6552] hover:underline">
            Вернуться на главную
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
