"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LoginDirectPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Максимально простой обработчик входа
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError(null)

    // Проверяем, что email и пароль не пустые
    if (!email || !password) {
      setLoginError("Email и пароль обязательны")
      setIsLoading(false)
      return
    }

    try {
      // Создаем объект с данными для отправки
      const loginData = {
        email,
        password,
      }

      // Отправляем запрос с использованием XMLHttpRequest вместо fetch
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "/api/auth/login-simple", true)
      xhr.setRequestHeader("Content-Type", "application/json")

      xhr.onload = () => {
        setIsLoading(false)

        if (xhr.status >= 200 && xhr.status < 300) {
          // Успешный вход
          try {
            const data = JSON.parse(xhr.responseText)
            if (data.user.role === "admin") {
              router.push("/admin")
            } else {
              router.push("/dashboard")
            }
          } catch (error) {
            console.error("Error parsing response:", error)
            setLoginError("Ошибка при обработке ответа сервера")
          }
        } else {
          // Ошибка входа
          try {
            const data = JSON.parse(xhr.responseText)
            setLoginError(data.message || data.error || "Неверный email или пароль")
          } catch (error) {
            setLoginError("Ошибка при входе в систему")
          }
        }
      }

      xhr.onerror = () => {
        setIsLoading(false)
        setLoginError("Ошибка соединения с сервером")
        console.error("XHR error:", xhr.statusText)
      }

      // Отправляем данные
      xhr.send(JSON.stringify(loginData))
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("Произошла ошибка при входе в систему")
      setIsLoading(false)
    }
  }

  // Функция для заполнения тестовыми данными
  const fillTestData = () => {
    setEmail("asmajoe18@gmail.com")
    setPassword("123asma")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2] px-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="text-4xl font-bold text-[#8a6552]">كن</div>
          </div>
          <CardTitle className="text-2xl text-[#4a4a4a]">Прямой вход</CardTitle>
          <CardDescription className="text-[#6b6b6b]">Упрощенная форма входа для преподавателя</CardDescription>
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
                placeholder="asmajoe18@gmail.com"
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

          <div className="mt-6 text-center text-sm">
            <p className="text-[#6b6b6b]">
              <Link href="/login" className="text-[#8a6552] hover:underline">
                Вернуться к обычной форме входа
              </Link>
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            variant="outline"
            className="w-full border-[#8a6552] text-[#8a6552] hover:bg-[#8a6552] hover:text-white"
            onClick={fillTestData}
          >
            Заполнить тестовыми данными
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
