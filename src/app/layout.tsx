import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'First Guitar Solo | Sixth String Labs',
  description:
    'A structured 30-day program to take you from basic guitar skills to confidently performing your first complete guitar solo.',
  keywords: ['guitar', 'guitar solo', 'learn guitar', 'guitar lessons', 'blues rock'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased" style={{ backgroundColor: '#0a0a0a', color: '#ffffff' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
