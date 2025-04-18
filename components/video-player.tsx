"use client"

import { useState, useEffect } from "react"

interface VideoPlayerProps {
  url: string
  title: string
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  const [embedUrl, setEmbedUrl] = useState("")

  useEffect(() => {
    setEmbedUrl(getEmbedUrl(url))
  }, [url])

  // Функция для преобразования URL YouTube в формат для встраивания
  const getEmbedUrl = (url: string) => {
    if (!url) return ""

    // Если URL уже в формате для встраивания, возвращаем его
    if (url.includes("embed")) {
      return url
    }

    // Извлекаем ID видео из URL
    let videoId = ""

    try {
      // Формат: https://www.youtube.com/watch?v=VIDEO_ID
      if (url.includes("youtube.com/watch")) {
        const urlParams = new URLSearchParams(new URL(url).search)
        videoId = urlParams.get("v") || ""
      }
      // Формат: https://youtu.be/VIDEO_ID
      else if (url.includes("youtu.be")) {
        videoId = url.split("/").pop() || ""
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    } catch (error) {
      console.error("Error parsing YouTube URL:", error)
    }

    // Если не удалось извлечь ID, возвращаем исходный URL
    return url
  }

  return (
    <div className="aspect-video">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#f8f5f2]">
          <p className="text-[#6b6b6b]">Видео не доступно</p>
        </div>
      )}
    </div>
  )
}
