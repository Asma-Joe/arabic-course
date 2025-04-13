import type React from "react"
import DashboardHeader from "@/components/dashboard-header"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Получаем текущего пользователя из сессии
  const user = await getCurrentUser()

  // Если пользователь не администратор, перенаправляем на страницу входа
  if (!user || user.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <DashboardHeader userName={user.name} isAdmin={true} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
