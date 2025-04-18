"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Edit, Calendar, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export default function AdminLessonsPage() {
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
          setLessons(data)
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

  // Удаление урока
  const deleteLessonHandler = async (id, title) => {
    if (!confirm(`Вы уверены, что хотите удалить урок "${title}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/lessons/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Обновляем локальное состояние
        setLessons(lessons.filter((lesson) => lesson.id !== id))

        toast({
          title: "Урок удален",
          description: `Урок "${title}" успешно удален`,
        })
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить урок",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting lesson:", error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при удалении урока",
        variant: "destructive",
      })
    }
  }

  // Группировка уроков по статусу
  const publishedLessons = lessons.filter((lesson) => lesson.status === "published")
  const scheduledLessons = lessons.filter((lesson) => lesson.status === "scheduled")
  const draftLessons = lessons.filter((lesson) => lesson.status === "draft")

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#4a4a4a]">Уроки</h1>
            <p className="text-[#6b6b6b] mt-2">Загрузка данных...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#4a4a4a]">Уроки</h1>
          <p className="text-[#6b6b6b] mt-2">Управление видеоуроками курса</p>
        </div>
        <Button asChild className="bg-[#8a6552] hover:bg-[#6d503f]">
          <Link href="/admin/lessons/add">
            <Plus className="mr-2 h-4 w-4" />
            Добавить урок
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        {lessons.length === 0 ? (
          <Card className="border-none shadow">
            <CardContent className="text-center py-8">
              <p className="text-[#6b6b6b]">Уроки не найдены. Добавьте первый урок!</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {scheduledLessons.length > 0 && (
              <Card className="border-none shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-[#4a4a4a]">Запланированные уроки</CardTitle>
                  <Badge className="bg-blue-500">{scheduledLessons.length}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-[#f8f5f2]">
                            <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b]">Название</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b] hidden md:table-cell">
                              Дата публикации
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b]">Статус</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-[#6b6b6b]">Действия</th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {scheduledLessons.map((lesson) => (
                            <tr key={lesson.id} className="border-b transition-colors hover:bg-[#f8f5f2]">
                              <td className="p-4 align-middle">
                                <div className="font-medium text-[#4a4a4a]">{lesson.title}</div>
                              </td>
                              <td className="p-4 align-middle hidden md:table-cell text-[#6b6b6b]">
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-[#8a6552]" />
                                  {new Date(lesson.publishDate).toLocaleDateString("ru-RU")}
                                </div>
                              </td>
                              <td className="p-4 align-middle">
                                <Badge className="bg-blue-500">Запланирован</Badge>
                              </td>
                              <td className="p-4 align-middle text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Открыть меню</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/admin/lessons/${lesson.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Редактировать
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href={`/admin/lessons/${lesson.id}/preview`}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Предпросмотр
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => deleteLessonHandler(lesson.id, lesson.title)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Удалить
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {publishedLessons.length > 0 && (
              <Card className="border-none shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-[#4a4a4a]">Опубликованные уроки</CardTitle>
                  <Badge className="bg-green-500">{publishedLessons.length}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-[#f8f5f2]">
                            <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b]">Название</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b] hidden md:table-cell">
                              Дата публикации
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b]">Статус</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-[#6b6b6b]">Действия</th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {publishedLessons.map((lesson) => (
                            <tr key={lesson.id} className="border-b transition-colors hover:bg-[#f8f5f2]">
                              <td className="p-4 align-middle">
                                <div className="font-medium text-[#4a4a4a]">{lesson.title}</div>
                              </td>
                              <td className="p-4 align-middle hidden md:table-cell text-[#6b6b6b]">
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-[#8a6552]" />
                                  {new Date(lesson.publishDate).toLocaleDateString("ru-RU")}
                                </div>
                              </td>
                              <td className="p-4 align-middle">
                                <Badge className="bg-green-500">Опубликован</Badge>
                              </td>
                              <td className="p-4 align-middle text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Открыть меню</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/admin/lessons/${lesson.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Редактировать
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href={`/admin/lessons/${lesson.id}/preview`}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Просмотреть
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => deleteLessonHandler(lesson.id, lesson.title)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Удалить
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {draftLessons.length > 0 && (
              <Card className="border-none shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-[#4a4a4a]">Черновики</CardTitle>
                  <Badge className="bg-gray-500">{draftLessons.length}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-[#f8f5f2]">
                            <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b]">Название</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b] hidden md:table-cell">
                              Дата создания
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b]">Статус</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-[#6b6b6b]">Действия</th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {draftLessons.map((lesson) => (
                            <tr key={lesson.id} className="border-b transition-colors hover:bg-[#f8f5f2]">
                              <td className="p-4 align-middle">
                                <div className="font-medium text-[#4a4a4a]">{lesson.title}</div>
                              </td>
                              <td className="p-4 align-middle hidden md:table-cell text-[#6b6b6b]">
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-[#8a6552]" />
                                  {new Date(lesson.createdAt).toLocaleDateString("ru-RU")}
                                </div>
                              </td>
                              <td className="p-4 align-middle">
                                <Badge variant="outline">Черновик</Badge>
                              </td>
                              <td className="p-4 align-middle text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Открыть меню</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/admin/lessons/${lesson.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Редактировать
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href={`/admin/lessons/${lesson.id}/preview`}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Предпросмотр
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => deleteLessonHandler(lesson.id, lesson.title)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Удалить
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
