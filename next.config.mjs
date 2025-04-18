/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Скрываем заголовок X-Powered-By для безопасности
  
  // Настройки для изображений
  images: {
    domains: ['your-domain.com'],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
  
  // Настройки для перенаправлений
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/page',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/dashboard/page',
        permanent: true,
      },
    ]
  },
  
  // Игнорирование ошибок ESLint при сборке
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Игнорирование ошибок TypeScript при сборке
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
