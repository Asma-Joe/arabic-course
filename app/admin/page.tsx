"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, BookOpen, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalLessons: 0,
    publishedLessons: 0,
    pendingHomework: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Загрузка статистики
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // В реальном приложении здесь будет запрос к API для получения статистики
        // Для демонстрации просто имитируем загрузку
        setTimeout(() => {
          setStats({
            totalStudents: 0,
            activeStudents: 0,
            totalLessons: 0,
            publishedLessons: 0,
            pendingHomework: 0,
          })
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching stats:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить статистику",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#4a4a4a]">Панель преподавателя</h1>
          <p className="text-[#6b6b6b] mt-2">Загрузка данных...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#4a4a4a]">Панель преподавателя</h1>
          <p className="text-[#6b6b6b] mt-2">Добро пожаловать, Асма! Управление курсом и учениками</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-none shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#6b6b6b]">Ученицы</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Users className="h-8 w-8 text-[#8a6552] mr-4" />
            <div>
              <div className="text-2xl font-bold text-[#4a4a4a]">{stats.totalStudents}</div>
              <p className="text-xs text-[#6b6b6b]">{stats.activeStudents} активных</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#6b6b6b]">Уроки</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <BookOpen className="h-8 w-8 text-[#8a6552] mr-4" />
            <div>
              <div className="text-2xl font-bold text-[#4a4a4a]">{stats.publishedLessons}</div>
              <p className="text-xs text-[#6b6b6b]">из {stats.totalLessons} опубликовано</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#6b6b6b]">Домашние задания</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <FileText className="h-8 w-8 text-[#8a6552] mr-4" />
            <div>
              <div className="text-2xl font-bold text-[#4a4a4a]">{stats.pendingHomework}</div>
              <p className="text-xs text-[#6b6b6b]">ожидают проверки</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow bg-[#8a6552] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Общий прогресс</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <div className="h-2 mt-2 bg-white/20 rounded-full">
              <div className="h-full bg-white rounded-full" style={{ width: "0%" }}></div>
            </div>
            <p className="text-xs text-white/80 mt-2">Средний прогресс учениц</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-[#4a4a4a]">Недавние ученицы</CardTitle>
            <Link href="/admin/students" className="text-sm font-medium text-[#8a6552] hover:underline">
              Все ученицы
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-[#6b6b6b]">Нет учениц. Добавьте первую ученицу!</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-[#4a4a4a]">Недавняя активность</CardTitle>
            <Link href="/admin/activity" className="text-sm font-medium text-[#8a6552] hover:underline">
              Вся активность
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-[#6b6b6b]">
              Нет активности. Активность появится, когда ученицы начнут использовать сайт.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-[#4a4a4a]">Предстоящие публикации уроков</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-[#6b6b6b]">Нет запланированных уроков. Добавьте новый урок!</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow">
          <CardHeader>
            <CardTitle className="text-xl text-[#4a4a4a]">Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button asChild className="w-full justify-start bg-[#8a6552] hover:bg-[#6d503f]">
                <Link href="/admin/students/add">
                  <Users className="mr-2 h-4 w-4" />
                  Добавить новую ученицу
                </Link>
              </Button>

              <Button asChild className="w-full justify-start bg-[#8a6552] hover:bg-[#6d503f]">
                <Link href="/admin/lessons/add">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Добавить новый урок
                </Link>
              </Button>

              <Button asChild className="w-full justify-start bg-[#8a6552] hover:bg-[#6d503f]">
                <Link href="/admin/homework">
                  <FileText className="mr-2 h-4 w-4" />
                  Проверить домашние задания
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
