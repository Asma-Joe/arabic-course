"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LoginV2Page() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const router = useRouter()

  // Функция для прямого входа как администратор
  const loginAsAdmin = () => {
    setEmail("asmajoe18@gmail.com")
    setPassword("123asma")
    handleLogin()
  }

  // Функция для прямого входа как ученица
  const loginAsStudent = () => {
    setEmail("asmacheck@gmail.com")
    setPassword("123asma")
    handleLogin()
  }

  // Обработчик входа
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsLoading(true)
    setLoginError(null)
    setDebugInfo(null)

    try {
      // Отправляем запрос на сервер
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      })

      // Сохраняем текст ответа для отладки
      const responseText = await response.text()
      setDebugInfo(`Статус: ${response.status}, Ответ: ${responseText}`)

      let data
      try {
        // Пытаемся распарсить JSON
        data = JSON.parse(responseText)
      } catch (error) {
        setLoginError(`Ошибка формата ответа: ${responseText.substring(0, 100)}...`)
        setIsLoading(false)
        return
      }

      if (response.ok && data.success) {
        // Успешный вход - создаем сессию вручную
        const user = data.user
        const sessionData = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
          iat: Math.floor(Date.now() / 1000),
        }

        // Устанавливаем cookie вручную
        document.cookie = `session=${btoa(JSON.stringify(sessionData))};path=/;max-age=${60 * 60 * 24 * 7}`

        // Перенаправляем пользователя
        if (user.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } else {
        // Ошибка входа
        setLoginError(data.message || data.error || "Неверный email или пароль")
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoginError(`Ошибка сети: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2] px-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="text-4xl font-bold text-[#8a6552]">كن</div>
          </div>
          <CardTitle className="text-2xl text-[#4a4a4a]">Улучшенный вход</CardTitle>
          <CardDescription className="text-[#6b6b6b]">
            Используйте эту страницу для надежного входа в систему
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ошибка входа</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#8a6552] hover:bg-[#6d503f]" disabled={isLoading}>
              {isLoading ? (
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
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#e9e2dc]"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-[#6b6b6b]">или быстрый вход</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={loginAsAdmin}
                className="bg-[#8a6552] hover:bg-[#6d503f]"
                disabled={isLoading}
              >
                Войти как Админ
              </Button>
              <Button
                type="button"
                onClick={loginAsStudent}
                className="bg-[#8a6552] hover:bg-[#6d503f]"
                disabled={isLoading}
              >
                Войти как Ученица
              </Button>
            </div>
          </div>

          {debugInfo && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
              <p className="font-bold">Отладочная информация:</p>
              <pre>{debugInfo}</pre>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-[#6b6b6b]">
            <Link href="/" className="text-[#8a6552] hover:underline">
              Вернуться на главную
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
