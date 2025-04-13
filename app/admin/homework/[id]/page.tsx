"use client"

import type React from "react"

import { useState } from "react"
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
  const router = useRouter()
  const { toast } = useToast()

  // Mock data - in a real app, this would come from an API or database
  const homework = {
    id: homeworkId,
    studentName: "Мария Петрова",
    lessonTitle: "Урок 7: Местоимения",
    submittedDate: "Вчера, 15:45",
    fileUrl: "#", // In a real app, this would be the actual file URL
    status: "pending", // pending or checked
  }

  const handleSubmit = (e: React.FormEvent) => {
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

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Отзыв отправлен",
        description: `Отзыв для ${homework.studentName} успешно отправлен`,
      })
      router.push("/admin/homework")
    }, 1500)
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
            <Badge className="self-start sm:self-auto bg-[#8a6552]">Ожидает проверки</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-[#6b6b6b]">Ученица</h3>
                <p className="text-[#4a4a4a] font-medium">{homework.studentName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#6b6b6b]">Урок</h3>
                <p className="text-[#4a4a4a]">{homework.lessonTitle}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#6b6b6b]">Дата отправки</h3>
                <p className="text-[#4a4a4a]">{homework.submittedDate}</p>
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
                    <p className="font-medium text-[#4a4a4a]">homework-lesson-7.pdf</p>
                    <p className="text-xs text-[#6b6b6b]">1.2 MB</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#8a6552] text-[#8a6552] hover:bg-[#8a6552] hover:text-white"
                >
                  <Download className="mr-1 h-4 w-4" />
                  Скачать
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="border-t border-[#e9e2dc] pt-6">
              <h3 className="text-sm font-medium text-[#6b6b6b] mb-4">Отзыв преподавателя</h3>
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
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
