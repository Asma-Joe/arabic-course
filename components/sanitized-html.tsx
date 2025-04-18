"use client"

import { useEffect, useRef } from "react"
import DOMPurify from "dompurify"

interface SanitizedHTMLProps {
  html: string
  className?: string
}

export default function SanitizedHTML({ html, className }: SanitizedHTMLProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      // Очищаем HTML от потенциально опасных элементов
      const sanitizedHTML = DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "p",
          "a",
          "ul",
          "ol",
          "li",
          "b",
          "i",
          "strong",
          "em",
          "br",
          "div",
          "span",
          "img",
        ],
        ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "class", "id", "style"],
        FORBID_TAGS: ["script", "iframe", "object", "embed"],
        FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
      })

      containerRef.current.innerHTML = sanitizedHTML
    }
  }, [html])

  return <div ref={containerRef} className={className} />
}
