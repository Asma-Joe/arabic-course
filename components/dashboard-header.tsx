"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Notifications from "@/components/notifications"

export default function DashboardHeader({ userName, isAdmin = false }: { userName: string; isAdmin?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Выход выполнен",
          description: "Вы успешно вышли из системы",
        })
        router.push("/login")
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось выйти из системы",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при выходе из системы",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const dashboardRoot = isAdmin ? "/admin" : "/dashboard"

  return (
    <header className="bg-white border-b border-[#e9e2dc] sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href={dashboardRoot} className="flex items-center">
              <div className="text-2xl font-bold mr-2 text-[#8a6552]">كن</div>
              <span className="hidden md:inline-block text-sm font-medium text-[#4a4a4a]">Арабский с нуля для дам</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href={dashboardRoot}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                isActive(dashboardRoot)
                  ? "bg-[#f8f5f2] text-[#8a6552]"
                  : "text-[#6b6b6b] hover:text-[#8a6552] hover:bg-[#f8f5f2]"
              }`}
            >
              Главная
            </Link>

            {isAdmin ? (
              <>
                <Link
                  href="/admin/students"
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isActive("/admin/students")
                      ? "bg-[#f8f5f2] text-[#8a6552]"
                      : "text-[#6b6b6b] hover:text-[#8a6552] hover:bg-[#f8f5f2]"
                  }`}
                >
                  Ученицы
                </Link>
                <Link
                  href="/admin/lessons"
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isActive("/admin/lessons")
                      ? "bg-[#f8f5f2] text-[#8a6552]"
                      : "text-[#6b6b6b] hover:text-[#8a6552] hover:bg-[#f8f5f2]"
                  }`}
                >
                  Уроки
                </Link>
                <Link
                  href="/admin/homework"
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isActive("/admin/homework")
                      ? "bg-[#f8f5f2] text-[#8a6552]"
                      : "text-[#6b6b6b] hover:text-[#8a6552] hover:bg-[#f8f5f2]"
                  }`}
                >
                  Домашние задания
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/lessons"
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isActive("/dashboard/lessons")
                      ? "bg-[#f8f5f2] text-[#8a6552]"
                      : "text-[#6b6b6b] hover:text-[#8a6552] hover:bg-[#f8f5f2]"
                  }`}
                >
                  Уроки
                </Link>
                <Link
                  href="/dashboard/homework"
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isActive("/dashboard/homework")
                      ? "bg-[#f8f5f2] text-[#8a6552]"
                      : "text-[#6b6b6b] hover:text-[#8a6552] hover:bg-[#f8f5f2]"
                  }`}
                >
                  Домашние задания
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center">
            {isAdmin && (
              <div className="mr-2">
                <Notifications />
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 bg-[#8a6552]">
                    <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{userName}</p>
                    {isAdmin && <p className="text-xs text-muted-foreground">Преподаватель</p>}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`${dashboardRoot}/profile`}>Профиль</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Выйти</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-2">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#e9e2dc]">
            <nav className="flex flex-col space-y-2">
              <Link
                href={dashboardRoot}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(dashboardRoot) ? "bg-[#f8f5f2] text-[#8a6552]" : "text-[#6b6b6b]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Главная
              </Link>

              {isAdmin ? (
                <>
                  <Link
                    href="/admin/students"
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      isActive("/admin/students") ? "bg-[#f8f5f2] text-[#8a6552]" : "text-[#6b6b6b]"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ученицы
                  </Link>
                  <Link
                    href="/admin/lessons"
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      isActive("/admin/lessons") ? "bg-[#f8f5f2] text-[#8a6552]" : "text-[#6b6b6b]"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Уроки
                  </Link>
                  <Link
                    href="/admin/homework"
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      isActive("/admin/homework") ? "bg-[#f8f5f2] text-[#8a6552]" : "text-[#6b6b6b]"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Домашние задания
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard/lessons"
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      isActive("/dashboard/lessons") ? "bg-[#f8f5f2] text-[#8a6552]" : "text-[#6b6b6b]"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Уроки
                  </Link>
                  <Link
                    href="/dashboard/homework"
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      isActive("/dashboard/homework") ? "bg-[#f8f5f2] text-[#8a6552]" : "text-[#6b6b6b]"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Домашние задания
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
