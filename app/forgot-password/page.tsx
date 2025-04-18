"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Имитация отправки запроса
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      toast({
        title: "Инструкции отправлены",
        description: "Проверьте вашу электронную почту для сброса пароля",
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2] px-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="text-4xl font-bold text-[#8a6552]">كن</div>
          </div>
          <CardTitle className="text-2xl text-[#4a4a4a]">Восстановление пароля</CardTitle>
          <CardDescription className="text-[#6b6b6b]">
            Введите ваш email для получения инструкций по сбросу пароля
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="text-center py-4">
              <p className="text-[#4a4a4a] mb-4">
                Инструкции по сбросу пароля отправлены на указанный email. Пожалуйста, проверьте вашу почту.
              </p>
              <p className="text-sm text-[#6b6b6b]">
                Не получили письмо? Проверьте папку "Спам" или{" "}
                <button onClick={() => setIsSubmitted(false)} className="text-[#8a6552] hover:underline">
                  попробуйте снова
                </button>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ваш@email.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#8a6552] hover:bg-[#6d503f]" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  "Отправить инструкции"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-sm text-[#8a6552] hover:underline">
            Вернуться на страницу входа
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
