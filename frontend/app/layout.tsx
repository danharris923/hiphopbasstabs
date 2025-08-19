import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bass Tab Site - Learn Hip-Hop Bass Lines from Original Samples',
  description: 'Discover the bass lines behind classic hip-hop tracks by exploring their original samples. Interactive tabs with YouTube synchronization for the ultimate learning experience.',
  keywords: 'bass tabs, hip hop, samples, music education, bass guitar, whosampled',
  authors: [{ name: 'Bass Tab Site' }],
  creator: 'Bass Tab Site',
  publisher: 'Bass Tab Site',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3030'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bass-tab-site.com',
    siteName: 'Bass Tab Site',
    title: 'Bass Tab Site - Learn Hip-Hop Bass Lines from Original Samples',
    description: 'Discover the bass lines behind classic hip-hop tracks by exploring their original samples.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bass Tab Site - Hip-Hop Bass Learning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bass Tab Site - Learn Hip-Hop Bass Lines from Original Samples',
    description: 'Discover the bass lines behind classic hip-hop tracks by exploring their original samples.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        {/* YouTube IFrame API */}
        <script
          src="https://www.youtube.com/iframe_api"
          async
        />
      </head>
      <body className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  🎸 Bass Tab Site
                </h1>
                <span className="ml-2 text-sm text-gray-500">
                  Hip-Hop Sample Explorer
                </span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a
                  href="/"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Home
                </a>
                <a
                  href="/about"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  About
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  About
                </h3>
                <p className="mt-4 text-base text-gray-500">
                  Learn bass lines from classic hip-hop tracks by exploring their original samples.
                  Interactive tabs with synchronized YouTube playback.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Features
                </h3>
                <ul className="mt-4 space-y-2">
                  <li className="text-base text-gray-500">
                    Synchronized video playback
                  </li>
                  <li className="text-base text-gray-500">
                    ASCII bass tabs with timing
                  </li>
                  <li className="text-base text-gray-500">
                    Sample type classification
                  </li>
                  <li className="text-base text-gray-500">
                    Mobile-friendly interface
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Legal
                </h3>
                <p className="mt-4 text-sm text-gray-500">
                  All music content is used for educational purposes.
                  Videos are embedded from YouTube and remain property of their respective owners.
                </p>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="text-base text-gray-400 text-center">
                &copy; 2024 Bass Tab Site. Built with Next.js, FastAPI, and love for hip-hop.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}