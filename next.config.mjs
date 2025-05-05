/** @type {import('next').NextConfig} */
const nextConfig = {
  // Отключаем строгий режим для совместимости
  reactStrictMode: false,
  // Игнорируем ошибки ESLint при сборке
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Игнорируем ошибки TypeScript при сборке
  typescript: {
    ignoreBuildErrors: true,
  },
  // Отключаем оптимизацию изображений
  images: {
    unoptimized: true,
  },
  // Разрешаем использование экспериментальных функций
  experimental: {
    serverActions: true,
  },
}

export default nextConfig
