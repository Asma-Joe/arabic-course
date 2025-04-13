"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Search, Plus, MoreHorizontal, Trash2, UserX, UserCheck } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import type { Student } from "@/lib/db"

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Загрузка списка учениц
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students")
        if (response.ok) {
          const data = await response.json()
          setStudents(data)
        } else {
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить список учениц",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching students:", error)
        toast({
          title: "Ошибка",
          description: "Произошла ошибка при загрузке данных",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [toast])

  // Фильтрация учениц по поисковому запросу
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.telegramUsername.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Изменение статуса ученицы (активна/неактивна)
  const toggleStudentStatus = async (id: number, currentStatus: "active" | "inactive") => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Обновляем локальное состояние
        setStudents(students.map((student) => (student.id === id ? { ...student, status: newStatus } : student)))

        toast({
          title: "Статус обновлен",
          description: `Ученица ${newStatus === "active" ? "активирована" : "деактивирована"}`,
        })
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить статус ученицы",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating student status:", error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обновлении статуса",
        variant: "destructive",
      })
    }
  }

  // Удаление ученицы
  const deleteStudentHandler = async (id: number, name: string) => {
    if (!confirm(`Вы уверены, что хотите удалить ученицу "${name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Обновляем локальное состояние
        setStudents(students.filter((student) => student.id !== id))

        toast({
          title: "Ученица удалена",
          description: `Ученица "${name}" успешно удалена`,
        })
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить ученицу",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting student:", error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при удалении ученицы",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#4a4a4a]">Ученицы</h1>
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
          <h1 className="text-3xl font-bold text-[#4a4a4a]">Ученицы</h1>
          <p className="text-[#6b6b6b] mt-2">Управление ученицами курса</p>
        </div>
        <Button asChild className="bg-[#8a6552] hover:bg-[#6d503f]">
          <Link href="/admin/students/add">
            <Plus className="mr-2 h-4 w-4" />
            Добавить ученицу
          </Link>
        </Button>
      </div>

      <Card className="border-none shadow">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl text-[#4a4a4a]">Все ученицы</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#6b6b6b]" />
              <Input
                type="search"
                placeholder="Поиск по имени или Telegram..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-[#6b6b6b]">
              {searchQuery ? "Ученицы не найдены" : "Нет учениц. Добавьте первую ученицу!"}
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-[#f8f5f2]">
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b]">Имя</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b] hidden md:table-cell">
                        Telegram
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b] hidden md:table-cell">
                        Прогресс
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b] hidden sm:table-cell">
                        Последняя активность
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b]">Статус</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-[#6b6b6b]">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b transition-colors hover:bg-[#f8f5f2]">
                        <td className="p-4 align-middle">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#8a6552] flex items-center justify-center text-white font-medium mr-3">
                              {student.name.charAt(0)}
                            </div>
                            <span className="font-medium text-[#4a4a4a]">{student.name}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle hidden md:table-cell text-[#6b6b6b]">
                          {student.telegramUsername}
                        </td>
                        <td className="p-4 align-middle hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Progress value={student.progress} className="h-2 w-[60px]" />
                            <span className="text-[#6b6b6b]">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle hidden sm:table-cell text-[#6b6b6b]">
                          {new Date(student.lastActive).toLocaleDateString("ru-RU")}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge
                            variant="outline"
                            className={`${
                              student.status === "active"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }`}
                          >
                            {student.status === "active" ? "Активна" : "Неактивна"}
                          </Badge>
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
                                <Link href={`/admin/students/${student.id}`}>Просмотреть профиль</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/students/${student.id}/edit`}>Редактировать</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/students/${student.id}/progress`}>Просмотреть прогресс</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleStudentStatus(student.id, student.status)}>
                                {student.status === "active" ? (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Деактивировать
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Активировать
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteStudentHandler(student.id, student.name)}
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
