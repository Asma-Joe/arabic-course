"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AdminHomeworkPage() {
  const [pendingHomework, setPendingHomework] = useState([])
  const [checkedHomework, setCheckedHomework] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Загрузка домашних заданий
  useEffect(() => {
    const fetchHomework = async () => {
      try {
        // Загрузка заданий, ожидающих проверки
        const pendingResponse = await fetch("/api/homework?pending=true")
        if (pendingResponse.ok) {
          const pendingData = await pendingResponse.json()
          setPendingHomework(pendingData)
        }

        // Загрузка проверенных заданий
        const checkedResponse = await fetch("/api/homework?checked=true")
        if (checkedResponse.ok) {
          const checkedData = await checkedResponse.json()
          setCheckedHomework(checkedData)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching homework:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные о домашних заданиях",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchHomework()
  }, [toast])

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#4a4a4a]">Домашние задания</h1>
          <p className="text-[#6b6b6b] mt-2">Загрузка данных...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#4a4a4a]">Домашние задания</h1>
        <p className="text-[#6b6b6b] mt-2">Проверка домашних заданий учениц</p>
      </div>

      <Card className="border-none shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-[#4a4a4a]">Ожидают проверки</CardTitle>
          <Badge className="bg-[#8a6552]">{pendingHomework.length}</Badge>
        </CardHeader>
        <CardContent>
          {pendingHomework.length === 0 ? (
            <div className="text-center py-8 text-[#6b6b6b]">
              Нет домашних заданий, ожидающих проверки. Они появятся здесь, когда ученицы отправят свои работы.
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-[#f8f5f2]">
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b]">Ученица</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b]">Урок</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b] hidden md:table-cell">
                        Дата отправки
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b]">Статус</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-[#6b6b6b]">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {pendingHomework.map((homework) => (
                      <tr key={homework.id} className="border-b transition-colors hover:bg-[#f8f5f2]">
                        <td className="p-4 align-middle">
                          <div className="font-medium text-[#4a4a4a]">{homework.studentName || "Ученица"}</div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="text-[#4a4a4a]">{homework.lessonTitle || `Урок ${homework.lessonId}`}</div>
                        </td>
                        <td className="p-4 align-middle hidden md:table-cell">
                          <div className="flex items-center text-[#6b6b6b]">
                            <Calendar className="mr-2 h-4 w-4 text-[#8a6552]" />
                            {new Date(homework.submittedDate).toLocaleDateString("ru-RU")}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge className="bg-[#8a6552]">Ожидает проверки</Badge>
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
                                <Link href={`/admin/homework/${homework.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Проверить
                                </Link>
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

      <Card className="border-none shadow">
        <CardHeader>
          <CardTitle className="text-xl text-[#4a4a4a]">Недавно проверенные</CardTitle>
        </CardHeader>
        <CardContent>
          {checkedHomework.length === 0 ? (
            <div className="text-center py-8 text-[#6b6b6b]">
              Нет проверенных домашних заданий. История проверенных заданий будет отображаться здесь.
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-[#f8f5f2]">
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b]">Ученица</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b]">Урок</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b] hidden md:table-cell">
                        Дата проверки
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#6b6b6b]">Статус</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-[#6b6b6b]">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {checkedHomework.map((homework) => (
                      <tr key={homework.id} className="border-b transition-colors hover:bg-[#f8f5f2]">
                        <td className="p-4 align-middle">
                          <div className="font-medium text-[#4a4a4a]">{homework.studentName || "Ученица"}</div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="text-[#4a4a4a]">{homework.lessonTitle || `Урок ${homework.lessonId}`}</div>
                        </td>
                        <td className="p-4 align-middle hidden md:table-cell">
                          <div className="flex items-center text-[#6b6b6b]">
                            <Calendar className="mr-2 h-4 w-4 text-[#8a6552]" />
                            {new Date(homework.updatedAt || homework.submittedDate).toLocaleDateString("ru-RU")}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge className="bg-green-500">Проверено</Badge>
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
                                <Link href={`/admin/homework/${homework.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Просмотреть
                                </Link>
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
