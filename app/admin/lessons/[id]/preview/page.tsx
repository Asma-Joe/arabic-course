"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function LessonPreviewPage({ params }: { params: { id: string } }) {
  const lessonId = Number.parseInt(params.id)
  const [activeTab, setActiveTab] = useState("video")
  const [lesson, setLesson] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Загрузка данных урока
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`/api/lessons/${lessonId}`)

        if (response.ok) {
          const lessonData = await response.json()
          setLesson(lessonData)
        } else {
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить данные урока",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching lesson:", error)
        toast({
          title: "Ошибка",
          description: "Произошла ошибка при загрузке данных",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLesson()
  }, [lessonId, toast])

  // Функция для преобразования URL YouTube в формат для встраивания
  const getEmbedUrl = (url: string) => {
    if (!url) return ""

    // Если URL уже в формате для встраивания, возвращаем его
    if (url.includes("embed")) {
      return url
    }

    // Извлекаем ID видео из URL
    let videoId = ""

    // Формат: https://www.youtube.com/watch?v=VIDEO_ID
    if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(new URL(url).search)
      videoId = urlParams.get("v") || ""
    }
    // Формат: https://youtu.be/VIDEO_ID
    else if (url.includes("youtu.be")) {
      videoId = url.split("/").pop() || ""
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`
    }

    // Если не удалось извлечь ID, возвращаем исходный URL
    return url
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#4a4a4a]">Загрузка урока...</h1>
          <p className="text-[#6b6b6b] mt-2">Пожалуйста, подождите</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#4a4a4a]">Урок не найден</h1>
          <p className="text-[#6b6b6b] mt-2">
            <Link href="/admin/lessons" className="text-[#8a6552] hover:underline">
              Вернуться к списку уроков
            </Link>
          </p>
        </div>
      </div>
    )
  }

  const embedUrl = getEmbedUrl(lesson.videoUrl)

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-sm text-[#6b6b6b] mb-2">
          <Link href="/admin/lessons" className="hover:text-[#8a6552] flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Назад к списку уроков
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-[#4a4a4a]">{lesson.title}</h1>
        <p className="text-[#6b6b6b] mt-2">{lesson.description}</p>
      </div>

      <div className="flex items-center gap-2">
        <Badge
          className={`${
            lesson.status === "published"
              ? "bg-green-500"
              : lesson.status === "scheduled"
                ? "bg-blue-500"
                : "bg-gray-500"
          }`}
        >
          {lesson.status === "published" ? "Опубликован" : lesson.status === "scheduled" ? "Запланирован" : "Черновик"}
        </Badge>

        {lesson.status === "scheduled" && (
          <span className="text-sm text-[#6b6b6b]">
            Дата публикации: {new Date(lesson.publishDate).toLocaleDateString("ru-RU")}
          </span>
        )}
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
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    title={lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#f8f5f2]">
                    <p className="text-[#6b6b6b]">Видео не добавлено</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              asChild
              className="border-[#8a6552] text-[#8a6552] hover:bg-[#8a6552] hover:text-white"
            >
              <Link href="/admin/lessons">← Все уроки</Link>
            </Button>

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
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Доступно</Badge>
              </div>

              <p className="text-[#6b6b6b] mb-4">Файл с заданием для учеников.</p>

              {lesson.homeworkUrl ? (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 mb-6"
                  onClick={() => {
                    // В реальном приложении здесь будет скачивание файла
                    toast({
                      title: "Скачивание",
                      description: "Скачивание файла домашнего задания...",
                    })
                  }}
                >
                  <Download size={16} />
                  Скачать задание
                </Button>
              ) : (
                <p className="text-[#6b6b6b] mb-6">Файл домашнего задания не загружен</p>
              )}
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

            <Button asChild className="bg-[#8a6552] hover:bg-[#6d503f]">
              <Link href={`/admin/lessons/${lessonId}/edit`}>Редактировать урок →</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
