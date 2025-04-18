"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Download, ArrowLeft, Send } from "lucide-react"

export default function HomeworkCheckPage({ params }: { params: { id: string } }) {
  const homeworkId = Number.parseInt(params.id)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [homework, setHomework] = useState<any>(null)
  const [student, setStudent] = useState<any>(null)
  const [lesson, setLesson] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Загрузка данных о домашнем задании
  useEffect(() => {
    const fetchHomeworkData = async () => {
      try {
        // Загрузка домашнего задания
        const homeworkResponse = await fetch(`/api/homework/${homeworkId}`)

        if (!homeworkResponse.ok) {
          throw new Error("Failed to fetch homework")
        }

        const homeworkData = await homeworkResponse.json()
        setHomework(homeworkData)

        // Загрузка данных о студенте
        const studentResponse = await fetch(`/api/students/${homeworkData.studentId}`)
        if (studentResponse.ok) {
          const studentData = await studentResponse.json()
          setStudent(studentData)
        }

        // Загрузка данных об уроке
        const lessonResponse = await fetch(`/api/lessons/${homeworkData.lessonId}`)
        if (lessonResponse.ok) {
          const lessonData = await lessonResponse.json()
          setLesson(lessonData)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching homework data:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные о домашнем задании",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchHomeworkData()
  }, [homeworkId, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!feedback.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, добавьте отзыв перед отправкой",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Отправка отзыва
      const response = await fetch(`/api/homework/${homeworkId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback,
          status: "checked",
        }),
      })

      if (response.ok) {
        // Отправка уведомления ученице
        await fetch(`/api/notifications/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: homework.studentId,
            title: "Домашнее задание проверено",
            message: `Ваше домашнее задание по уроку "${lesson?.title}" проверено. Проверьте отзыв преподавателя.`,
          }),
        })

        toast({
          title: "Отзыв отправлен",
          description: `Отзыв для ${student?.name || "ученицы"} успешно отправлен`,
        })
        router.push("/admin/homework")
      } else {
        throw new Error("Failed to submit feedback")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при отправке отзыва",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#4a4a4a]">Загрузка данных...</h1>
          <p className="text-[#6b6b6b] mt-2">Пожалуйста, подождите</p>
        </div>
      </div>
    )
  }

  if (!homework || !lesson) {
    return (
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#6b6b6b] mb-2">
            <Link href="/admin/homework" className="hover:text-[#8a6552] flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Назад к списку
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-[#4a4a4a]">Домашнее задание не найдено</h1>
          <p className="text-[#6b6b6b] mt-2">Запрошенное домашнее задание не существует или было удалено</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-sm text-[#6b6b6b] mb-2">
          <Link href="/admin/homework" className="hover:text-[#8a6552] flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Назад к списку
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-[#4a4a4a]">Проверка домашнего задания</h1>
        <p className="text-[#6b6b6b] mt-2">Проверьте работу и оставьте отзыв</p>
      </div>

      <Card className="border-none shadow">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-xl text-[#4a4a4a]">Информация о задании</CardTitle>
            <Badge
              className={`self-start sm:self-auto ${homework.status === "checked" ? "bg-green-500" : "bg-[#8a6552]"}`}
            >
              {homework.status === "checked" ? "Проверено" : "Ожидает проверки"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-[#6b6b6b]">Ученица</h3>
                <p className="text-[#4a4a4a] font-medium">{student?.name || "Неизвестная ученица"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#6b6b6b]">Урок</h3>
                <p className="text-[#4a4a4a]">{lesson.title}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#6b6b6b]">Дата отправки</h3>
                <p className="text-[#4a4a4a]">{new Date(homework.submittedDate).toLocaleDateString("ru-RU")}</p>
              </div>
            </div>

            <div className="border-t border-[#e9e2dc] pt-6">
              <h3 className="text-sm font-medium text-[#6b6b6b] mb-4">Файл домашнего задания</h3>
              <div className="bg-[#f8f5f2] p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-[#8a6552] rounded-md flex items-center justify-center text-white mr-3">
                    PDF
                  </div>
                  <div>
                    <p className="font-medium text-[#4a4a4a]">{homework.submittedFile}</p>
                    <p className="text-xs text-[#6b6b6b]">Файл домашнего задания</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#8a6552] text-[#8a6552] hover:bg-[#8a6552] hover:text-white"
                  onClick={() => {
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
                  }}
                >
                  <Download className="mr-1 h-4 w-4" />
                  Скачать
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="border-t border-[#e9e2dc] pt-6">
              <h3 className="text-sm font-medium text-[#6b6b6b] mb-4">Отзыв преподавателя</h3>
              {homework.status === "checked" ? (
                <div className="bg-[#f8f5f2] p-4 rounded-lg">
                  <p className="text-[#4a4a4a]">{homework.feedback}</p>
                </div>
              ) : (
                <>
                  <Textarea
                    placeholder="Напишите отзыв о выполненном задании..."
                    className="min-h-[150px] mb-4"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-[#8a6552] hover:bg-[#6d503f]" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Отправка..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Отправить отзыв
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
