import { Card, CardContent } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export default function LessonsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#4a4a4a]">Видеоуроки</h1>
        <p className="text-[#6b6b6b] mt-2">Все уроки курса арабского языка</p>
      </div>

      <Card className="border-none shadow">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <BookOpen className="h-16 w-16 text-[#8a6552] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-[#4a4a4a] mb-2">Уроки пока не добавлены</h3>
            <p className="text-[#6b6b6b] mb-4">
              Преподаватель скоро добавит первые уроки. Пожалуйста, проверьте позже.
            </p>
            <p className="text-sm text-[#6b6b6b]">Вы получите уведомление, когда появятся новые уроки.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
