"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { getCookie } from "@/lib/cookies"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface CSRFFormProps {
  children: React.ReactNode
  onSubmit: (e: React.FormEvent, token: string) => void
  className?: string
  onError?: () => void
}

export default function CSRFForm({ children, onSubmit, className, onError }: CSRFFormProps) {
  const [csrfToken, setCsrfToken] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchCSRFToken = useCallback(async () => {
    try {
      setIsRefreshing(true)

      // Добавляем случайный параметр для предотвращения кеширования
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/auth/csrf?t=${timestamp}`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token")
      }

      const data = await response.json()

      // Проверяем, что data.csrfToken существует и является строкой
      if (data && typeof data.csrfToken === "string" && data.csrfToken) {
        console.log("Received CSRF token:", data.csrfToken.substring(0, 5) + "...")
        setCsrfToken(data.csrfToken)
        return data.csrfToken
      } else {
        console.error("Invalid CSRF token received:", data)
        throw new Error("Invalid CSRF token format")
      }
    } catch (error) {
      console.error("Error fetching CSRF token:", error)
      if (onError) onError()
      return ""
    } finally {
      setIsRefreshing(false)
      setIsLoading(false)
    }
  }, [onError])

  useEffect(() => {
    // Получаем CSRF-токен из cookie
    const token = getCookie("csrf_token")
    if (token) {
      console.log(
        "CSRF token found in cookie:",
        typeof token === "string" ? token.substring(0, 5) + "..." : "invalid token",
      )
      setCsrfToken(token)
      setIsLoading(false)
    } else {
      // Если токен отсутствует, запрашиваем новый
      fetchCSRFToken()
    }
  }, [fetchCSRFToken])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Просто передаем событие и токен в родительский обработчик
    // Не пытаемся извлекать данные формы здесь
    if (csrfToken) {
      onSubmit(e, csrfToken)
    } else {
      // Если токен отсутствует, пытаемся получить новый
      try {
        const freshToken = await fetchCSRFToken()
        if (freshToken) {
          onSubmit(e, freshToken)
        } else {
          throw new Error("Failed to get CSRF token")
        }
      } catch (error) {
        console.error("Error getting CSRF token:", error)
        toast({
          title: "Ошибка безопасности",
          description: "Не удалось получить защитный токен. Пожалуйста, обновите страницу и попробуйте снова.",
          variant: "destructive",
        })
        if (onError) onError()
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-[#8a6552]" />
        <span className="ml-2 text-[#6b6b6b]">Загрузка...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <input type="hidden" name="csrfToken" value={csrfToken} />
      {isRefreshing && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <Loader2 className="h-6 w-6 animate-spin text-[#8a6552]" />
          <span className="ml-2 text-[#6b6b6b]">Обновление защиты...</span>
        </div>
      )}
      {children}
    </form>
  )
}
