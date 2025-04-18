"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon, FileUp, Upload, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"

export default function AddLessonPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    publishStatus: "draft",
    publishDate: new Date(),
  })

  const [homeworkFile, setHomeworkFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { toast } = useToast()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, publishStatus: value }))
  }

  const handleHomeworkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHomeworkFile(e.target.files[0])
    }
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0])
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, publishDate: selectedDate }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Проверка обязательных полей
      if (!formData.title) {
        toast({
          title: "Ошибка",
          description: "Название урока обязательно для заполнения",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Подготовка данных для отправки
      const lessonData = {
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        status: formData.publishStatus,
        publishDate: formData.publishDate.toISOString(),
      }

      // Отправка данных на сервер
      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lessonData),
      })

      if (response.ok) {
        toast({
          title: "Урок создан",
          description:
            formData.publishStatus === "published"
              ? "Урок успешно опубликован"
              : formData.publishStatus === "scheduled"
                ? `Урок запланирован на ${format(formData.publishDate, "d MMMM yyyy", { locale: ru })}`
                : "Урок сохранен как черновик",
        })
        router.push("/admin/lessons")
      } else {
        const errorData = await response.json()
        toast({
          title: "Ошибка",
          description: errorData.error || "Не удалось создать урок",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating lesson:", error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при создании урока",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#4a4a4a]">Добавить новый урок</h1>
        <p className="text-[#6b6b6b] mt-2">Создайте новый видеоурок для курса</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-none shadow">
          <CardHeader>
            <CardTitle className="text-xl text-[#4a4a4a]">Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название урока</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Например: Урок 9: Вопросительные предложения"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание урока</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Краткое описание содержания урока"
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow">
          <CardHeader>
            <CardTitle className="text-xl text-[#4a4a4a]">Видеоматериал</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Ссылка на видео (YouTube)</Label>
              <Input
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-sm text-[#6b6b6b]">
                Вставьте ссылку на видео с YouTube. Например: https://www.youtube.com/watch?v=dQw4w9WgXcQ
              </p>
              <p className="text-sm text-[#6b6b6b]">
                Или вставьте код для встраивания: https://www.youtube.com/embed/dQw4w9WgXcQ
              </p>
            </div>

            <div className="space-y-2">
              <Label>Или загрузите видеофайл</Label>
              <div className="border-2 border-dashed border-[#e9e2dc] rounded-lg p-6 text-center">
                {videoFile ? (
                  <div className="flex items-center justify-between bg-[#f8f5f2] p-3 rounded-md">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#8a6552] rounded-md flex items-center justify-center text-white mr-3">
                        <FileUp className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-[#4a4a4a]">{videoFile.name}</p>
                        <p className="text-xs text-[#6b6b6b]">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setVideoFile(null)}
                      className="text-[#6b6b6b] hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-[#8a6552] mx-auto mb-2" />
                    <p className="text-sm text-[#6b6b6b] mb-4">Перетащите видеофайл сюда или нажмите для выбора</p>
                    <input
                      type="file"
                      id="video-file"
                      className="hidden"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("video-file")?.click()}
                      className="border-[#8a6552] text-[#8a6552] hover:bg-[#8a6552] hover:text-white"
                    >
                      Выбрать файл
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow">
          <CardHeader>
            <CardTitle className="text-xl text-[#4a4a4a]">Домашнее задание</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Загрузите файл с домашним заданием (PDF)</Label>
              <div className="border-2 border-dashed border-[#e9e2dc] rounded-lg p-6 text-center">
                {homeworkFile ? (
                  <div className="flex items-center justify-between bg-[#f8f5f2] p-3 rounded-md">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#8a6552] rounded-md flex items-center justify-center text-white mr-3">
                        PDF
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-[#4a4a4a]">{homeworkFile.name}</p>
                        <p className="text-xs text-[#6b6b6b]">{(homeworkFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setHomeworkFile(null)}
                      className="text-[#6b6b6b] hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <FileUp className="h-8 w-8 text-[#8a6552] mx-auto mb-2" />
                    <p className="text-sm text-[#6b6b6b] mb-4">Перетащите PDF-файл сюда или нажмите для выбора</p>
                    <input
                      type="file"
                      id="homework-file"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleHomeworkFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("homework-file")?.click()}
                      className="border-[#8a6552] text-[#8a6552] hover:bg-[#8a6552] hover:text-white"
                    >
                      Выбрать файл
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow">
          <CardHeader>
            <CardTitle className="text-xl text-[#4a4a4a]">Настройки публикации</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Статус публикации</Label>
              <RadioGroup
                defaultValue={formData.publishStatus}
                onValueChange={handleRadioChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="draft" id="draft" />
                  <Label htmlFor="draft" className="font-normal">
                    Сохранить как черновик
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="published" id="published" />
                  <Label htmlFor="published" className="font-normal">
                    Опубликовать сейчас
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scheduled" id="scheduled" />
                  <Label htmlFor="scheduled" className="font-normal">
                    Запланировать публикацию
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {formData.publishStatus === "scheduled" && (
              <div className="space-y-2">
                <Label>Дата публикации</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: ru }) : "Выберите дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/lessons")}
            className="border-[#8a6552] text-[#8a6552] hover:bg-[#8a6552] hover:text-white"
          >
            Отмена
          </Button>
          <Button type="submit" className="bg-[#8a6552] hover:bg-[#6d503f]" disabled={isLoading}>
            {isLoading
              ? "Сохранение..."
              : formData.publishStatus === "published"
                ? "Опубликовать урок"
                : formData.publishStatus === "scheduled"
                  ? "Запланировать урок"
                  : "Сохранить как черновик"}
          </Button>
        </div>
      </form>
    </div>
  )
}
