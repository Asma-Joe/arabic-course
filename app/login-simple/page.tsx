"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LoginSimplePage() {
  const [email, setEmail] = useState("asmajoe18@gmail.com")
  const [password, setPassword] = useState("123asma")
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Обработчик входа
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError(null)

    try {
      // Отправляем запрос на сервер
      const response = await fetch("/api/auth/login-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      let data
      try {
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
          <CardTitle className="text-2xl text-[#4a4a4a]">Упрощенный вход</CardTitle>
          <CardDescription className="text-[#6b6b6b]">Используйте эту форму для быстрого входа</CardDescription>
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
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
      </Card>
    </div>
  )
}
