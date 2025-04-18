"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("student") // По умолчанию вкладка "Ученица"
  const [loginError, setLoginError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Определяем, находимся ли мы в режиме разработки
  const isDevelopment = process.env.NODE_ENV === "development"

  // Функция для заполнения тестовыми данными (только в режиме разработки)
  const fillTestData = () => {
    if (activeTab === "teacher") {
      setEmail("asmajoe18@gmail.com")
      setPassword("123asma")
    } else {
      setEmail("asmacheck@gmail.com")
      setPassword("123asma")
    }
  }

  // Обработчик входа
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
      // Отправляем запрос на сервер
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        cache: "no-store", // Отключаем кеширование
      })

      let data
      try {
        // Пытаемся получить JSON из ответа
        data = await response.json()
      } catch (error) {
        console.error("Error parsing response:", error)
        setLoginError("Сервер вернул неверный формат ответа")
        setIsLoading(false)
        return
      }

      if (response.ok) {
        // Успешный вход
        toast({
          title: "Успешный вход",
          description: `Добро пожаловать, ${data.user.name}!`,
        })

        // Перенаправляем пользователя в зависимости от роли
        if (data.user.role === "admin") {
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
      setLoginError("Произошла ошибка при входе в систему")
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
          <CardTitle className="text-2xl text-[#4a4a4a]">Вход в личный кабинет</CardTitle>
          <CardDescription className="text-[#6b6b6b]">Выберите тип аккаунта для входа</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="student">Ученица</TabsTrigger>
              <TabsTrigger value="teacher">Преподаватель</TabsTrigger>
            </TabsList>
            <TabsContent value="student">
              <p className="text-sm text-[#6b6b6b] mb-4">Вход для учениц курса арабского языка</p>
            </TabsContent>
            <TabsContent value="teacher">
              <p className="text-sm text-[#6b6b6b] mb-4">Вход для преподавателя и администратора курса</p>
            </TabsContent>
          </Tabs>

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
                placeholder={activeTab === "teacher" ? "asmajoe18@gmail.com" : "ваш@email.com"}
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
              Нет доступа?{" "}
              <Link href="/register" className="text-[#8a6552] hover:underline">
                Получить приглашение
              </Link>
            </p>
          </div>
        </CardContent>

        {/* Показываем кнопку для заполнения тестовыми данными только в режиме разработки */}
        {isDevelopment && (
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
        )}
      </Card>
    </div>
  )
}
