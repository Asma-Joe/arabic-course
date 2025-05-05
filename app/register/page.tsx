"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, BellIcon as BrandTelegram } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [telegramUsername, setTelegramUsername] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Валидация на клиенте
    if (!name.trim()) {
      setError("Имя обязательно для заполнения")
      return
    }

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
      console.log("Отправляем данные:", { name, email, password, telegramUsername })

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          telegramUsername: telegramUsername || undefined,
          message: message || undefined,
        }),
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
        setError(data.error || "Произошла ошибка при регистрации")
        setLoading(false)
        return
      }

      if (data.success) {
        setIsSubmitted(true)
        // Перенаправляем пользователя в личный кабинет через 2 секунды
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setError(data.error || "Неизвестная ошибка")
      }
    } catch (err) {
      console.error("Ошибка при регистрации:", err)
      setError("Произошла ошибка при подключении к серверу")
    } finally {
      setLoading(false)
    }
  }

  const handleTelegramRedirect = () => {
    window.open("https://t.me/Studywithmearabic", "_blank")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="text-4xl font-bold text-[#8a6552]">كن</div>
          </div>
          <CardTitle className="text-2xl text-[#4a4a4a]">Получить приглашение</CardTitle>
          <CardDescription className="text-[#6b6b6b]">Заполните форму для получения доступа к курсу</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isSubmitted ? (
            <div className="text-center py-4">
              <p className="text-[#4a4a4a] mb-4">
                Спасибо за вашу заявку! Вы успешно зарегистрированы и будете перенаправлены в личный кабинет.
              </p>
              <p className="text-sm text-[#6b6b6b]">
                Если у вас есть вопросы, вы можете{" "}
                <button onClick={handleTelegramRedirect} className="text-[#0088cc] hover:underline">
                  написать нам напрямую
                </button>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ваше имя"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
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
                  placeholder="Придумайте пароль"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram (необязательно)</Label>
                <Input
                  id="telegram"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="@ваш_username"
                />
                <p className="text-xs text-[#6b6b6b]">
                  Укажите ваш username в Telegram, чтобы мы могли связаться с вами
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Сообщение (необязательно)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Расскажите, почему вы хотите изучать арабский язык"
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full bg-[#8a6552] hover:bg-[#6d503f]" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  "Отправить заявку"
                )}
              </Button>
            </form>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#e9e2dc]"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-[#6b6b6b]">или</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleTelegramRedirect}
            className="w-full bg-[#0088cc] hover:bg-[#0077b5] flex items-center justify-center gap-2"
          >
            <BrandTelegram className="h-5 w-5" />
            Написать напрямую в Telegram
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-[#6b6b6b]">
            Уже есть доступ?{" "}
            <Link href="/login" className="text-[#8a6552] hover:underline">
              Войти
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
