"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  // Состояние для хранения данных пользователя
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const { toast } = useToast()

  // Загрузка данных пользователя при монтировании компонента
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile")
        if (response.ok) {
          const data = await response.json()
          setUserData((prevData) => ({
            ...prevData,
            name: data.name,
            email: data.email,
          }))
        } else {
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить данные профиля",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Ошибка",
          description: "Произошла ошибка при загрузке данных",
          variant: "destructive",
        })
      } finally {
        setIsDataLoading(false)
      }
    }

    fetchUserData()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
        }),
      })

      if (response.ok) {
        toast({
          title: "Профиль обновлен",
          description: "Ваши данные успешно сохранены",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Ошибка",
          description: data.error || "Не удалось обновить профиль",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обновлении профиля",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (userData.newPassword !== userData.confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Новые пароли не совпадают",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: userData.currentPassword,
          newPassword: userData.newPassword,
        }),
      })

      if (response.ok) {
        toast({
          title: "Пароль обновлен",
          description: "Ваш пароль успешно изменен",
        })
        setUserData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }))
      } else {
        const data = await response.json()
        toast({
          title: "Ошибка",
          description: data.error || "Не удалось обновить пароль",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обновлении пароля",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (isDataLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8a6552]" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#4a4a4a]">Профиль</h1>
        <p className="text-[#6b6b6b] mt-2">Управление вашими персональными данными</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-none shadow">
          <CardHeader>
            <CardTitle className="text-xl text-[#4a4a4a]">Личная информация</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-6">
              <Avatar className="h-16 w-16 mr-4 bg-[#8a6552]">
                <AvatarFallback className="text-xl">{getInitials(userData.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-[#4a4a4a]">{userData.name}</p>
                <p className="text-sm text-[#6b6b6b]">{userData.email}</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input id="name" name="name" value={userData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={userData.email} onChange={handleChange} required />
              </div>
              <Button type="submit" className="bg-[#8a6552] hover:bg-[#6d503f]" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  "Сохранить изменения"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-none shadow">
          <CardHeader>
            <CardTitle className="text-xl text-[#4a4a4a]">Изменить пароль</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Текущий пароль</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={userData.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Новый пароль</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={userData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="bg-[#8a6552] hover:bg-[#6d503f]" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Обновление...
                  </>
                ) : (
                  "Обновить пароль"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
