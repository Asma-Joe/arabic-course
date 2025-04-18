"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { BellIcon as BrandTelegram, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [telegramUsername, setTelegramUsername] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Проверка обязательных полей
    if (!name || !telegramUsername) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Имитация отправки запроса
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      toast({
        title: "Заявка отправлена",
        description: "Мы свяжемся с вами в ближайшее время через Telegram",
      })
    }, 1500)
  }

  const handleTelegramRedirect = () => {
    // Открываем Telegram в новой вкладке
    window.open("https://t.me/Studywithmearabic", "_blank")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2] px-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="text-4xl font-bold text-[#8a6552]">كن</div>
          </div>
          <CardTitle className="text-2xl text-[#4a4a4a]">Получить приглашение</CardTitle>
          <CardDescription className="text-[#6b6b6b]">
            Оставьте заявку для получения доступа к курсу через Telegram
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="text-center py-4">
              <p className="text-[#4a4a4a] mb-4">
                Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время через Telegram.
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
                <Label htmlFor="telegram">Telegram</Label>
                <Input
                  id="telegram"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="@ваш_username"
                  required
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
              <Button type="submit" className="w-full bg-[#8a6552] hover:bg-[#6d503f]" disabled={isLoading}>
                {isLoading ? (
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
