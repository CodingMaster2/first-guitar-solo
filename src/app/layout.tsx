import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import Providers from '@/components/Providers'
import MobileBottomNav from '@/components/MobileBottomNav'
import ToastContainer from '@/components/Toast'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import CommandPalette from '@/components/CommandPalette'
import BackToTop from '@/components/BackToTop'
import KeyboardShortcutsOverlay from '@/components/KeyboardShortcutsOverlay'
import OfflineBanner from '@/components/OfflineBanner'
import PWAInstallBanner from '@/components/PWAInstallBanner'

export const metadata: Metadata = {
  title: 'First Guitar Solo | Sixth String Labs',
  description:
    'A structured 30-day program to take you from basic guitar skills to confidently performing your first complete guitar solo.',
  keywords: ['guitar', 'guitar solo', 'learn guitar', 'guitar lessons', 'blues rock'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'First Guitar Solo',
  },
  icons: {
    apple: '/icon-192.png',
  },
  openGraph: {
    title: 'First Guitar Solo | Sixth String Labs',
    description: '30 days. One complete blues-rock solo. Structured curriculum + AI Guitar Coach. $25 one-time payment.',
    type: 'website',
    url: 'https://first-guitar-solo.vercel.app',
    siteName: 'First Guitar Solo by Sixth String Labs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'First Guitar Solo | Sixth String Labs',
    description: '30 days. One complete blues-rock solo. $25 one-time.',
  },
}

export const viewport: Viewport = {
  themeColor: '#f59e0b',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'First Guitar Solo',
  description:
    'A structured 30-day program to take you from basic guitar skills to confidently performing your first complete guitar solo.',
  provider: {
    '@type': 'Organization',
    name: 'Sixth String Labs',
  },
  offers: {
    '@type': 'Offer',
    price: '25',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    duration: 'P30D',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased" style={{ backgroundColor: '#0a0a0a', color: '#ffffff' }}>
        <Providers>
          <AnnouncementBanner />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
          <MobileBottomNav />
          <ToastContainer />
          <CommandPalette />
          <BackToTop />
          <KeyboardShortcutsOverlay />
          <OfflineBanner />
          <PWAInstallBanner />
        </Providers>
        <Script id="sw-register" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').catch(function() {});
            });
          }
        `}</Script>
      </body>
    </html>
  )
}
