"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function LessonPage({ params }: { params: { id: string } }) {
  const lessonId = Number.parseInt(params.id)
  const [activeTab, setActiveTab] = useState("video")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  // Данные урока - в реальном приложении будут загружаться из API
  const lesson = {
    id: lessonId,
    title: `Урок ${lessonId}`,
    description: `Описание урока ${lessonId}. В этом уроке вы изучите основные концепции и практические примеры.`,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Замените на реальное видео
    homeworkAvailable: true,
    homeworkSubmitted: false,
    nextLessonId: lessonId + 1,
    prevLessonId: lessonId > 1 ? lessonId - 1 : null,
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите файл для загрузки",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Создаем FormData для отправки файла
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("lessonId", lessonId.toString())

      // В реальном приложении здесь будет отправка файла на сервер
      // Для демонстрации имитируем успешную отправку

      // Имитация отправки на email
      toast({
        title: "Отправка на email",
        description: "Отправка домашнего задания на asmajoe18@gmail.com...",
      })

      // Имитация задержки отправки
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitting(false)
      setSelectedFile(null)

      toast({
        title: "Отличная работа!",
        description: "Домашнее задание отправлено на email преподавателя. Молодец!",
      })
    } catch (error) {
      console.error("Error submitting homework:", error)
      setIsSubmitting(false)

      toast({
        title: "Ошибка",
        description: "Произошла ошибка при отправке домашнего задания. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-sm text-[#6b6b6b] mb-2">
          <Link href="/dashboard/lessons" className="hover:text-[#8a6552]">
            Все уроки
          </Link>
          <span>/</span>
          <span>{lesson.title}</span>
        </div>
        <h1 className="text-3xl font-bold text-[#4a4a4a]">{lesson.title}</h1>
        <p className="text-[#6b6b6b] mt-2">{lesson.description}</p>
      </div>

      <Tabs defaultValue="video" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-[#f0ebe5]">
          <TabsTrigger value="video" className="data-[state=active]:bg-white">
            Видеоурок
          </TabsTrigger>
          <TabsTrigger value="homework" className="data-[state=active]:bg-white">
            Домашнее задание
          </TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="space-y-4">
          <Card className="border-none shadow overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video">
                <iframe
                  src={lesson.videoUrl}
                  className="w-full h-full"
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            {lesson.prevLessonId ? (
              <Button
                variant="outline"
                asChild
                className="border-[#8a6552] text-[#8a6552] hover:bg-[#8a6552] hover:text-white"
              >
                <Link href={`/dashboard/lessons/${lesson.prevLessonId}`}>← Предыдущий урок</Link>
              </Button>
            ) : (
              <div></div>
            )}

            <Button onClick={() => setActiveTab("homework")} className="bg-[#8a6552] hover:bg-[#6d503f]">
              Перейти к домашнему заданию
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="homework" className="space-y-6">
          <Card className="border-none shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#4a4a4a]">Домашнее задание</h2>
                {lesson.homeworkSubmitted && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Выполнено</Badge>
                )}
              </div>

              <p className="text-[#6b6b6b] mb-4">
                Скачайте файл с заданием, выполните его и загрузите обратно для проверки.
              </p>

              <Button variant="outline" className="flex items-center gap-2 mb-6">
                <Download size={16} />
                Скачать задание
              </Button>

              <div className="border-t border-[#e9e2dc] pt-6">
                <h3 className="font-medium text-[#4a4a4a] mb-4">Загрузить выполненное задание</h3>

                {lesson.homeworkSubmitted ? (
                  <div className="bg-[#f8f5f2] p-4 rounded-lg">
                    <p className="text-[#6b6b6b]">
                      Вы уже отправили домашнее задание. Если хотите отправить новую версию, загрузите файл ниже.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="border-2 border-dashed border-[#e9e2dc] rounded-lg p-6 text-center">
                      <FileUp className="h-8 w-8 text-[#8a6552] mx-auto mb-2" />
                      <p className="text-sm text-[#6b6b6b] mb-4">Перетащите файл сюда или нажмите для выбора</p>
                      <input
                        type="file"
                        id="homework-file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("homework-file")?.click()}
                        className="border-[#8a6552] text-[#8a6552] hover:bg-[#8a6552] hover:text-white"
                      >
                        Выбрать файл
                      </Button>
                      {selectedFile && <p className="mt-2 text-sm text-[#4a4a4a]">Выбран файл: {selectedFile.name}</p>}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#8a6552] hover:bg-[#6d503f]"
                      disabled={!selectedFile || isSubmitting}
                    >
                      {isSubmitting ? "Отправка..." : "Отправить домашнее задание"}
                    </Button>

                    <p className="text-xs text-[#6b6b6b] text-center">
                      Домашнее задание будет отправлено на email преподавателя: asmajoe18@gmail.com
                    </p>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setActiveTab("video")}
              className="border-[#8a6552] text-[#8a6552] hover:bg-[#8a6552] hover:text-white"
            >
              ← Вернуться к видео
            </Button>

            {lesson.nextLessonId && (
              <Button asChild className="bg-[#8a6552] hover:bg-[#6d503f]">
                <Link href={`/dashboard/lessons/${lesson.nextLessonId}`}>Следующий урок →</Link>
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
