"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { VideoPlayer } from "@/components/video-player"
import { FileUploader } from "@/components/file-uploader"
import { Loader2, Download, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LessonPage() {
  const params = useParams()
  const lessonId = Number(params.id)
  const [lesson, setLesson] = useState(null)
  const [homework, setHomework] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const { toast } = useToast()

  // Загрузка данных урока и домашнего задания
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем урок
        const lessonResponse = await fetch(`/api/lessons/${lessonId}`)
        if (!lessonResponse.ok) {
          throw new Error("Failed to fetch lesson")
        }
        const lessonData = await lessonResponse.json()
        setLesson(lessonData)

        // Загружаем домашнее задание, если оно есть
        const homeworkResponse = await fetch(`/api/homework/lesson/${lessonId}`)
        if (homeworkResponse.ok) {
          const homeworkData = await homeworkResponse.json()
          setHomework(homeworkData)
        }
      } catch (error) {
        console.error("Error fetching lesson data:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные урока",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [lessonId, toast])

  // Обработчик отправки домашнего задания
  const handleSubmitHomework = async () => {
    if (!selectedFile) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите файл для отправки",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("lessonId", lessonId.toString())

      const response = await fetch("/api/homework/submit", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setHomework(data.homework)
        setSelectedFile(null)
        toast({
          title: "Успешно",
          description: "Домашнее задание успешно отправлено",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Ошибка",
          description: errorData.error || "Не удалось отправить домашнее задание",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting homework:", error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при отправке домашнего задания",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Обработчик скачивания файла домашнего задания
  const handleDownloadHomework = () => {
    if (!lesson?.homeworkUrl) {
      toast({
        title: "Ошибка",
        description: "Файл домашнего задания недоступен",
        variant: "destructive",
      })
      return
    }

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8a6552]" />
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#4a4a4a]">Урок не найден</h1>
          <p className="text-[#6b6b6b] mt-2">Запрошенный урок не существует или недоступен</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#4a4a4a]">{lesson.title}</h1>
        <p className="text-[#6b6b6b] mt-2">{lesson.description}</p>
      </div>

      <Tabs defaultValue="video" className="space-y-4">
        <TabsList>
          <TabsTrigger value="video">Видеоурок</TabsTrigger>
          <TabsTrigger value="homework">Домашнее задание</TabsTrigger>
        </TabsList>
        <TabsContent value="video" className="space-y-4">
          <Card className="border-none shadow">
            <CardContent className="p-0">
              <div className="aspect-video">
                <VideoPlayer videoUrl={lesson.videoUrl} />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow">
            <CardHeader>
              <CardTitle className="text-xl text-[#4a4a4a]">Описание урока</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p>{lesson.description}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="homework" className="space-y-4">
          <Card className="border-none shadow">
            <CardHeader>
              <CardTitle className="text-xl text-[#4a4a4a]">Домашнее задание</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-[#4a4a4a] mb-2">Инструкции</h3>
                  <p className="text-[#6b6b6b] mb-4">
                    Скачайте файл с заданием, выполните его и загрузите обратно для проверки.
                  </p>
                  <Button
                    onClick={handleDownloadHomework}
                    className="bg-[#8a6552] hover:bg-[#6d503f]"
                    disabled={!lesson.homeworkUrl}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Скачать задание
                  </Button>
                </div>

                {homework ? (
                  <div className="p-6 bg-[#f8f5f2] rounded-lg text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <h3 className="font-medium text-[#4a4a4a] text-lg mb-1">Домашнее задание отправлено</h3>
                    <p className="text-[#6b6b6b] mb-2">
                      Вы отправили домашнее задание {new Date(homework.submittedDate).toLocaleDateString("ru-RU")}
                    </p>
                    <p className="text-sm text-[#6b6b6b]">
                      Статус: {homework.status === "checked" ? "Проверено" : "На проверке"}
                    </p>
                    {homework.feedback && (
                      <div className="mt-4 p-3 bg-white rounded-md text-left">
                        <h4 className="font-medium text-[#4a4a4a] mb-1">Отзыв преподавателя:</h4>
                        <p className="text-[#6b6b6b]">{homework.feedback}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium text-[#4a4a4a] mb-2">Загрузите выполненное задание</h3>
                      <FileUploader
                        onFileSelect={setSelectedFile}
                        selectedFile={selectedFile}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </div>
                    <Button
                      onClick={handleSubmitHomework}
                      className="w-full bg-[#8a6552] hover:bg-[#6d503f]"
                      disabled={!selectedFile || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Отправка...
                        </>
                      ) : (
                        "Отправить домашнее задание"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
