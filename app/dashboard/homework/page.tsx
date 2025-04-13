import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { FileText } from "lucide-react"

export default function HomeworkPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#4a4a4a]">Домашние задания</h1>
        <p className="text-[#6b6b6b] mt-2">Ваши задания и их статус</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <Card className="border-none shadow">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-[#8a6552] mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-[#4a4a4a] mb-2">У вас пока нет домашних заданий</h3>
                <p className="text-[#6b6b6b] mb-4">Домашние задания появятся здесь, когда вы начнете проходить уроки</p>
                <Link href="/dashboard/lessons" className="text-[#8a6552] hover:underline font-medium">
                  Перейти к урокам →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
