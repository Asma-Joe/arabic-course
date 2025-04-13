import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { BookOpen, FileText } from "lucide-react"

export default function DashboardPage() {
  // Данные ученицы - в реальном приложении будут загружаться из API
  const studentData = {
    name: "Тестовая Ученица",
    progress: 0,
    completedLessons: 0,
    totalLessons: 0,
    submittedHomework: 0,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#4a4a4a]">Добро пожаловать, {studentData.name}</h1>
        <p className="text-[#6b6b6b] mt-2">Ваш прогресс в изучении арабского языка</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#6b6b6b]">Общий прогресс</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#4a4a4a]">{studentData.progress}%</div>
            <Progress value={studentData.progress} className="h-2 mt-2" />
            <p className="text-xs text-[#6b6b6b] mt-2">
              Пройдено {studentData.completedLessons} из {studentData.totalLessons} уроков
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#6b6b6b]">Пройденные уроки</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <BookOpen className="h-8 w-8 text-[#8a6552] mr-4" />
            <div>
              <div className="text-2xl font-bold text-[#4a4a4a]">{studentData.completedLessons}</div>
              <p className="text-xs text-[#6b6b6b]">уроков</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#6b6b6b]">Выполненные задания</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <FileText className="h-8 w-8 text-[#8a6552] mr-4" />
            <div>
              <div className="text-2xl font-bold text-[#4a4a4a]">{studentData.submittedHomework}</div>
              <p className="text-xs text-[#6b6b6b]">заданий</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow">
          <CardHeader>
            <CardTitle className="text-xl text-[#4a4a4a]">Начните обучение</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-[#f8f5f2] p-6 rounded-lg text-center">
              <h3 className="font-semibold text-[#8a6552] text-xl mb-3">Добро пожаловать на курс арабского языка!</h3>
              <p className="text-[#6b6b6b] mb-4">
                Вы только начинаете свой путь изучения арабского языка. Перейдите к урокам, чтобы начать обучение.
              </p>
              <Link
                href="/dashboard/lessons"
                className="inline-block bg-[#8a6552] text-white px-4 py-2 rounded-md hover:bg-[#6d503f] transition-colors"
              >
                Перейти к урокам →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow">
          <CardHeader>
            <CardTitle className="text-xl text-[#4a4a4a]">Полезная информация</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-[#4a4a4a] mb-1">Как проходить уроки</h3>
                <p className="text-sm text-[#6b6b6b]">
                  Просматривайте видеоуроки, выполняйте домашние задания и отправляйте их на проверку.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-[#4a4a4a] mb-1">Как отправлять домашние задания</h3>
                <p className="text-sm text-[#6b6b6b]">
                  После просмотра урока перейдите на вкладку "Домашнее задание", загрузите файл и отправьте его.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-[#4a4a4a] mb-1">Нужна помощь?</h3>
                <p className="text-sm text-[#6b6b6b]">
                  Если у вас возникли вопросы, напишите преподавателю на email: asmajoe18@gmail.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
