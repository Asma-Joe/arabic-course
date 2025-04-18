"use client"

import { useEffect, useRef } from "react"
import DOMPurify from "dompurify"

interface SafeHTMLProps {
  html: string
  className?: string
  allowedTags?: string[]
  allowedAttributes?: string[]
}

export default function SafeHTML({
  html,
  className,
  allowedTags = ["p", "b", "i", "em", "strong", "a", "ul", "ol", "li", "br"],
  allowedAttributes = ["href", "target", "rel"],
}: SafeHTMLProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      // Очищаем HTML от потенциально опасных элементов
      const sanitizedHTML = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: allowedTags,
        ALLOWED_ATTR: allowedAttributes,
      })

      containerRef.current.innerHTML = sanitizedHTML
    }
  }, [html, allowedTags, allowedAttributes])

  return <div ref={containerRef} className={className} />
}
