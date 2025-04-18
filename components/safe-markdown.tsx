"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSanitize from "rehype-sanitize"
import { cn } from "@/lib/utils"

interface SafeMarkdownProps {
  content: string
  className?: string
}

export default function SafeMarkdown({ content, className }: SafeMarkdownProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={cn("animate-pulse bg-gray-200 h-20 rounded", className)} />
  }

  return (
    <ReactMarkdown
      className={cn("prose prose-sm max-w-none", className)}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
    >
      {content}
    </ReactMarkdown>
  )
}
