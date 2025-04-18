"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { BookOpen, FileText, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [studentData, setStudentData] = useState({
    name: "",
    progress: 0,
    completedLessons: 0,
    totalLessons: 0,
    submittedHomework: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Загрузка данных ученицы
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем профиль пользователя
        const profileResponse = await fetch("/api/user/profile")
        if (!profileResponse.ok) {
          throw new Error("Failed to fetch profile")
        }
        const profileData = await profileResponse.json()

        // Загружаем статистику
        const statsResponse = await fetch("/api/user/stats")
        if (!statsResponse.ok) {
          throw new Error("Failed to fetch stats")
        }
        const statsData = await statsResponse.json()

        setStudentData({
          name: profileData.name,
          progress: statsData.progress || 0,
          completedLessons: statsData.completedLessons || 0,
          totalLessons: statsData.totalLessons || 0,
          submittedHomework: statsData.submittedHomework || 0,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8a6552]" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#4a4a4a]">Добро пожаловать, {studentData.name}</h1>
        <p className="text-[#6b6b6b] mt-2">Ваш прогресс в изучении арабского языка</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#6b6b6b]">Общий прогресс</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#4a4a4a]">{studentData.progress}%</div>
            <Progress value={studentData.progress} className="h-2 mt-2" />
            <p className="text-xs text-[#6b6b6b] mt-2">
              Пройдено {studentData.completedLessons} из {studentData.totalLessons} уроков
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#6b6b6b]">Пройденные уроки</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <BookOpen className="h-8 w-8 text-[#8a6552] mr-4" />
            <div>
              <div className="text-2xl font-bold text-[#4a4a4a]">{studentData.completedLessons}</div>
              <p className="text-xs text-[#6b6b6b]">уроков</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#6b6b6b]">Выполненные задания</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <FileText className="h-8 w-8 text-[#8a6552] mr-4" />
            <div>
              <div className="text-2xl font-bold text-[#4a4a4a]">{studentData.submittedHomework}</div>
              <p className="text-xs text-[#6b6b6b]">заданий</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow">
          <CardHeader>
            <CardTitle className="text-xl text-[#4a4a4a]">Последние уроки</CardTitle>
          </CardHeader>
          <CardContent>
            {studentData.totalLessons > 0 ? (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-[#4a4a4a] mb-1">Продолжить обучение</h3>
                  <p className="text-sm text-[#6b6b6b] mb-2">
                    Перейдите к урокам, чтобы продолжить изучение арабского языка
                  </p>
                  <Link
                    href="/dashboard/lessons"
                    className="inline-block bg-[#8a6552] text-white px-4 py-2 rounded-md hover:bg-[#6d503f] transition-colors"
                  >
                    Перейти к урокам →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-[#f8f5f2] p-6 rounded-lg text-center">
                <h3 className="font-semibold text-[#8a6552] text-xl mb-3">Добро пожаловать на курс арабского языка!</h3>
                <p className="text-[#6b6b6b] mb-4">
                  Уроки будут появляться здесь по мере их публикации преподавателем.
                </p>
                <Link
                  href="/dashboard/lessons"
                  className="inline-block bg-[#8a6552] text-white px-4 py-2 rounded-md hover:bg-[#6d503f] transition-colors"
                >
                  Перейти к урокам →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow">
          <CardHeader>
            <CardTitle className="text-xl text-[#4a4a4a]">Полезная информация</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-[#4a4a4a] mb-1">Как проходить уроки</h3>
                <p className="text-sm text-[#6b6b6b]">
                  Просматривайте видеоуроки, выполняйте домашние задания и отправляйте их на проверку.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-[#4a4a4a] mb-1">Как отправлять домашние задания</h3>
                <p className="text-sm text-[#6b6b6b]">
                  После просмотра урока перейдите на вкладку "Домашнее задание", загрузите файл и отправьте его.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-[#4a4a4a] mb-1">Нужна помощь?</h3>
                <p className="text-sm text-[#6b6b6b]">
                  Если у вас возникли вопросы, напишите преподавателю на email: asmajoe18@gmail.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
