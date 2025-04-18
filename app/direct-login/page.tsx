"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function DirectLoginPage() {
  const [email, setEmail] = useState("asmajoe18@gmail.com")
  const [password, setPassword] = useState("123asma")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Используем XMLHttpRequest вместо fetch для большей совместимости
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "/api/direct-login", true)
      xhr.setRequestHeader("Content-Type", "application/json")

      xhr.onload = () => {
        setIsLoading(false)

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            if (response.success) {
              // Перенаправляем на нужную страницу
              if (response.user.role === "admin") {
                router.push("/admin")
              } else {
                router.push("/dashboard")
              }
            } else {
              setError(response.message || "Ошибка входа")
            }
          } catch (e) {
            setError("Ошибка при обработке ответа сервера")
          }
        } else {
          try {
            const response = JSON.parse(xhr.responseText)
            setError(response.message || "Ошибка входа")
          } catch (e) {
            setError("Ошибка при обработке ответа сервера")
          }
        }
      }

      xhr.onerror = () => {
        setIsLoading(false)
        setError("Ошибка соединения с сервером")
      }

      xhr.send(JSON.stringify({ email, password }))
    } catch (error) {
      setIsLoading(false)
      setError("Произошла ошибка при входе")
      console.error("Login error:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2] p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="text-4xl font-bold text-[#8a6552]">كن</div>
          </div>
          <CardTitle className="text-2xl text-[#4a4a4a]">Прямой вход</CardTitle>
          <CardDescription className="text-[#6b6b6b]">Упрощенная форма входа для администратора</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
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
        </CardContent>
      </Card>
    </div>
  )
}
