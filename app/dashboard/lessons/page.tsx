"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { PlayCircle, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LessonsPage() {
  const [lessons, setLessons] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Загрузка списка уроков
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch("/api/lessons")
        if (response.ok) {
          const data = await response.json()
          // Фильтруем только опубликованные уроки
          const publishedLessons = data.filter((lesson) => lesson.status === "published")
          setLessons(publishedLessons)
        } else {
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить список уроков",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching lessons:", error)
        toast({
          title: "Ошибка",
          description: "Произошла ошибка при загрузке данных",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLessons()
  }, [toast])

  // Группировка уроков по неделям (по 3 урока в неделю)
  const groupLessonsByWeeks = (lessons) => {
    const weeks = {}
    lessons.forEach((lesson) => {
      const weekNumber = Math.ceil(lesson.id / 3)
      const weekKey = `Неделя ${weekNumber}`

      if (!weeks[weekKey]) {
        weeks[weekKey] = []
      }

      weeks[weekKey].push(lesson)
    })
    return weeks
  }

  const weeks = groupLessonsByWeeks(lessons)

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#4a4a4a]">Видеоуроки</h1>
          <p className="text-[#6b6b6b] mt-2">Загрузка данных...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#4a4a4a]">Видеоуроки</h1>
        <p className="text-[#6b6b6b] mt-2">Все уроки курса арабского языка</p>
      </div>

      {lessons.length === 0 ? (
        <Card className="border-none shadow">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 text-[#8a6552] mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-[#4a4a4a] mb-2">Уроки пока не добавлены</h3>
              <p className="text-[#6b6b6b] mb-4">
                Преподаватель скоро добавит первые уроки. Пожалуйста, проверьте позже.
              </p>
              <p className="text-sm text-[#6b6b6b]">Вы получите уведомление, когда появятся новые уроки.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(weeks).map(([weekName, weekLessons]) => (
            <div key={weekName} className="space-y-4">
              <h2 className="text-xl font-semibold text-[#4a4a4a]">{weekName}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {weekLessons.map((lesson) => (
                  <Card key={lesson.id} className="border-none shadow overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-video bg-[#e9e2dc] flex items-center justify-center">
                        <Link
                          href={`/dashboard/lessons/${lesson.id}`}
                          className="w-full h-full flex items-center justify-center"
                        >
                          <PlayCircle className="h-16 w-16 text-[#8a6552] opacity-80" />
                        </Link>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-[#4a4a4a]">{lesson.title}</h3>
                          <Badge variant="outline" className="bg-[#f8f5f2] text-[#8a6552] border-[#8a6552]">
                            Доступен
                          </Badge>
                        </div>
                        <Link
                          href={`/dashboard/lessons/${lesson.id}`}
                          className="text-sm font-medium text-[#8a6552] hover:underline"
                        >
                          Начать урок →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
