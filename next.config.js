/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy for YouTube embeds
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://s.ytimg.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' blob: data: https://i.ytimg.com https://s.ytimg.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' http://localhost:8000 https://www.youtube.com",
              "frame-src 'self' https://www.youtube.com https://youtube.com",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "base-uri 'self'"
            ].join('; ')
          },
          // Other security headers
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  // Rewrites removed - using Next.js API routes instead
}

module.exports = nextConfig