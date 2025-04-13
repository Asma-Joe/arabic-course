"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

export default function AddStudentPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telegramUsername: "",
    sendInvitation: true,
  })

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, sendInvitation: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Проверка обязательных полей
      if (!formData.name || !formData.telegramUsername) {
        toast({
          title: "Ошибка",
          description: "Имя и Telegram обязательны для заполнения",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Отправка данных на сервер
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          telegramUsername: formData.telegramUsername,
        }),
      })

      if (response.ok) {
        toast({
          title: "Ученица добавлена",
          description: formData.sendInvitation
            ? `Приглашение отправлено в Telegram ${formData.telegramUsername}`
            : `${formData.name} добавлена без отправки приглашения`,
        })
        router.push("/admin/students")
      } else {
        const errorData = await response.json()
        toast({
          title: "Ошибка",
          description: errorData.error || "Не удалось добавить ученицу",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding student:", error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при добавлении ученицы",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#4a4a4a]">Добавить ученицу</h1>
        <p className="text-[#6b6b6b] mt-2">Добавьте новую ученицу в курс</p>
      </div>

      <Card className="border-none shadow max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl text-[#4a4a4a]">Информация об ученице</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Введите имя ученицы"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telegramUsername">Telegram</Label>
              <Input
                id="telegramUsername"
                name="telegramUsername"
                value={formData.telegramUsername}
                onChange={handleChange}
                placeholder="@username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (необязательно)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="send-invitation" checked={formData.sendInvitation} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="send-invitation">Отправить приглашение в Telegram</Label>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/students")}
                className="border-[#8a6552] text-[#8a6552] hover:bg-[#8a6552] hover:text-white"
              >
                Отмена
              </Button>
              <Button type="submit" className="bg-[#8a6552] hover:bg-[#6d503f]" disabled={isLoading}>
                {isLoading ? "Добавление..." : "Добавить ученицу"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
