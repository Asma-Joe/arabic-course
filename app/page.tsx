import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f5f2]">
      {/* Баннер с предупреждением о проблемах входа */}
      <div className="bg-yellow-100 p-4 text-center">
        <p className="text-yellow-800 mb-2">
          <strong>Проблемы со входом?</strong> Используйте наши улучшенные страницы входа:
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/login-v2">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">Новая страница входа</Button>
          </Link>
          <Link href="/login-direct">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">Прямой вход</Button>
          </Link>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full text-center">
          <div className="mb-8">
            <div className="text-6xl font-bold text-[#8a6552] mb-4">كن</div>
            <h1 className="text-4xl font-bold text-[#4a4a4a] mb-2">Арабский с нуля для дам</h1>
            <p className="text-xl text-[#6b6b6b]">Легко, интересно, быстро</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-[#4a4a4a] mb-4">Для учениц</h2>
              <p className="text-[#6b6b6b] mb-4">Доступ к видеоурокам, домашним заданиям и отслеживание прогресса</p>
              <Link href="/login">
                <Button className="w-full bg-[#8a6552] hover:bg-[#6d503f]">Войти в личный кабинет</Button>
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-[#4a4a4a] mb-4">Новым ученицам</h2>
              <p className="text-[#6b6b6b] mb-4">Оставьте заявку для получения доступа к курсу арабского языка</p>
              <Link href="/register">
                <Button className="w-full bg-[#8a6552] hover:bg-[#6d503f]">Получить приглашение</Button>
              </Link>
            </div>
          </div>

          <div className="text-[#6b6b6b]">
            <p className="mb-4">Курс разработан специально для женщин, желающих изучать арабский язык с нуля.</p>
            <p>Присоединяйтесь к нашему сообществу и начните свой путь к освоению арабского языка!</p>
          </div>
        </div>
      </div>

      {/* Футер */}
      <footer className="bg-white p-4 text-center text-[#6b6b6b]">
        <p>© 2023 Арабский с нуля для дам. Все права защищены.</p>
        <div className="mt-2 text-sm">
          <Link href="/login-direct" className="text-[#8a6552] hover:underline">
            Прямой вход
          </Link>
          {" | "}
          <Link href="/login-v2" className="text-[#8a6552] hover:underline">
            Улучшенный вход
          </Link>
        </div>
      </footer>
    </div>
  )
}
