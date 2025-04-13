import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            <div className="text-4xl font-bold mr-2 text-[#8a6552]">كن</div>
            <h1 className="text-2xl font-semibold text-[#4a4a4a]">Арабский с нуля для дам</h1>
          </div>
          <div>
            <Button asChild className="bg-[#8a6552] hover:bg-[#6d503f] text-white">
              <Link href="/login">Войти</Link>
            </Button>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-[#4a4a4a]">Легко, интересно, быстро</h2>
              <p className="text-lg mb-6 text-[#6b6b6b]">
                Добро пожаловать на курс арабского языка, созданный специально для женщин, которые хотят изучать
                арабский с нуля в комфортной и поддерживающей атмосфере.
              </p>
              <p className="text-lg mb-8 text-[#6b6b6b]">
                Наш курс предлагает структурированный подход к обучению с еженедельными видеоуроками, практическими
                заданиями и персональной обратной связью.
              </p>
              <Button asChild className="bg-[#8a6552] hover:bg-[#6d503f] text-white">
                <Link href="/register">Получить приглашение</Link>
              </Button>
            </div>
            <Card className="overflow-hidden border-none shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-video bg-[#e9e2dc] flex items-center justify-center">
                  <p className="text-[#8a6552] text-xl font-medium">Демонстрация курса</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-[#4a4a4a]">Особенности курса</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white border-none shadow">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3 text-[#8a6552]">Видеоуроки</h3>
                  <p className="text-[#6b6b6b]">
                    Три новых видеоурока каждую неделю, доступных в вашем личном кабинете.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white border-none shadow">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3 text-[#8a6552]">Домашние задания</h3>
                  <p className="text-[#6b6b6b]">
                    Практические задания к каждому уроку с возможностью получить обратную связь.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white border-none shadow">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3 text-[#8a6552]">Персональный кабинет</h3>
                  <p className="text-[#6b6b6b]">
                    Отслеживайте свой прогресс и получайте доступ к материалам в удобном формате.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6 text-[#4a4a4a]">Начните изучать арабский уже сегодня</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-[#6b6b6b]">
              Доступ к курсу предоставляется только по приглашению. Напишите нам в Telegram, чтобы получить доступ к
              курсу.
            </p>
            <Button asChild className="bg-[#8a6552] hover:bg-[#6d503f] text-white">
              <Link href="https://t.me/your_telegram_username" target="_blank" rel="noopener noreferrer">
                Написать в Telegram
              </Link>
            </Button>
          </div>
        </main>

        <footer className="border-t border-[#e9e2dc] pt-8 text-[#6b6b6b]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="text-2xl font-bold mr-2 text-[#8a6552]">كن</div>
                <span className="text-sm">Арабский с нуля для дам</span>
              </div>
            </div>
            <div className="text-sm">© {new Date().getFullYear()} Все права защищены</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
