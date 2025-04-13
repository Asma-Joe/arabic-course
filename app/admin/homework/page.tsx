import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AdminHomeworkPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#4a4a4a]">Домашние задания</h1>
        <p className="text-[#6b6b6b] mt-2">Проверка домашних заданий учениц</p>
      </div>

      <Card className="border-none shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-[#4a4a4a]">Ожидают проверки</CardTitle>
          <Badge className="bg-[#8a6552]">0</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[#6b6b6b]">
            Нет домашних заданий, ожидающих проверки. Они появятся здесь, когда ученицы отправят свои работы.
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow">
        <CardHeader>
          <CardTitle className="text-xl text-[#4a4a4a]">Недавно проверенные</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[#6b6b6b]">
            Нет проверенных домашних заданий. История проверенных заданий будет отображаться здесь.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
