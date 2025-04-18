"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { FileText, Eye, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function HomeworkPage() {
  const [homework, setHomework] = useState([])
  const [lessons, setLessons] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Загрузка домашних заданий и уроков
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем домашние задания
        const homeworkResponse = await fetch("/api/homework")
        if (!homeworkResponse.ok) {
          throw new Error("Failed to fetch homework")
        }
        const homeworkData = await homeworkResponse.json()
        setHomework(homeworkData)

        // Загружаем уроки для отображения названий
        const lessonsResponse = await fetch("/api/lessons")
        if (!lessonsResponse.ok) {
          throw new Error("Failed to fetch lessons")
        }
        const lessonsData = await lessonsResponse.json()

        // Создаем объект для быстрого доступа к урокам по ID
        const lessonsMap = {}
        lessonsData.forEach((lesson) => {
          lessonsMap[lesson.id] = lesson
        })
        setLessons(lessonsMap)
      } catch (error) {
        console.error("Error fetching homework data:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные о домашних заданиях",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleDownload = (homeworkItem) => {
    // В реальном приложении здесь будет скачивание файла
    toast({
      title: "Скачивание",
      description: "Скачивание файла домашнего задания...",
    })

    // Имитация скачивания файла
    setTimeout(() => {
      toast({
        title: "Готово",
        description: "Файл домашнего задания скачан",
      })
    }, 1500)
  }

  const showFeedback = (feedback) => {
    toast({
      title: "Отзыв преподавателя",
      description: feedback || "Отличная работа!",
    })
  }

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
        <h1 className="text-3xl font-bold text-[#4a4a4a]">Домашние задания</h1>
        <p className="text-[#6b6b6b] mt-2">Ваши задания и их статус</p>
      </div>

      {homework.length === 0 ? (
        <div className="space-y-8">
          <div className="space-y-4">
            <Card className="border-none shadow">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-[#8a6552] mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium text-[#4a4a4a] mb-2">У вас пока нет домашних заданий</h3>
                  <p className="text-[#6b6b6b] mb-4">
                    Домашние задания появятся здесь, когда вы начнете проходить уроки
                  </p>
                  <Link href="/dashboard/lessons" className="text-[#8a6552] hover:underline font-medium">
                    Перейти к урокам →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="border-none shadow">
            <CardHeader>
              <CardTitle className="text-xl text-[#4a4a4a]">Все домашние задания</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-[#f8f5f2]">
                        <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b]">Урок</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b] hidden md:table-cell">
                          Дата отправки
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b]">Статус</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-[#6b6b6b]">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {homework.map((hw) => (
                        <tr key={hw.id} className="border-b transition-colors hover:bg-[#f8f5f2]">
                          <td className="p-4 align-middle">
                            <div className="font-medium text-[#4a4a4a]">
                              {lessons[hw.lessonId] ? lessons[hw.lessonId].title : `Урок ${hw.lessonId}`}
                            </div>
                          </td>
                          <td className="p-4 align-middle hidden md:table-cell text-[#6b6b6b]">
                            {new Date(hw.submittedDate).toLocaleDateString("ru-RU")}
                          </td>
                          <td className="p-4 align-middle">
                            <Badge className={hw.status === "checked" ? "bg-green-500" : "bg-[#8a6552]"}>
                              {hw.status === "checked" ? "Проверено" : "На проверке"}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#8a6552] text-[#8a6552] hover:bg-[#8a6552] hover:text-white"
                                onClick={() => handleDownload(hw)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>

                              {hw.status === "checked" && hw.feedback && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                  onClick={() => showFeedback(hw.feedback)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
