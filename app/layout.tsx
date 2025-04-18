import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Арабский с нуля для дам: легко, интересно, быстро",
  description:
    "Профессиональный курс арабского языка для женщин. Изучайте арабский язык с нуля в комфортной и поддерживающей атмосфере с еженедельными видеоуроками и персональной обратной связью.",
  keywords: "арабский язык, курс арабского, арабский для женщин, изучение арабского, онлайн курс арабского",
  authors: [{ name: "Асма", url: "https://your-domain.com" }],
  creator: "Асма",
  publisher: "Арабский с нуля для дам",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://your-domain.com",
    title: "Арабский с нуля для дам: легко, интересно, быстро",
    description:
      "Профессиональный курс арабского языка для женщин. Изучайте арабский язык с нуля в комфортной и поддерживающей атмосфере.",
    siteName: "Арабский с нуля для дам",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Арабский с нуля для дам",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Арабский с нуля для дам: легко, интересно, быстро",
    description: "Профессиональный курс арабского языка для женщин",
    images: ["https://your-domain.com/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Замените на ваш код верификации
    yandex: "yandex-verification-code", // Замените на ваш код верификации
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
