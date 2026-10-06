import { LESSONS } from '@/lib/lessons'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TryClient from './TryClient'

export const metadata = {
  title: 'Try Day 1 Free — First Guitar Solo',
  description: 'Access the full Day 1 lesson from the First Guitar Solo 30-day program — completely free.',
}

export default function TryPage() {
  const lesson = LESSONS[0]

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Hero */}
        <div className="text-center mb-10">
          <p style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-3">
            Free Preview
          </p>
          <h1 className="text-4xl font-black uppercase text-white mb-3">
            Day 1 — On Us
          </h1>
          <p style={{ color: '#a3a3a3' }} className="text-base leading-relaxed max-w-md mx-auto">
            See what the First Guitar Solo program is really like before you pay a cent. Enter your email and the full Day 1 lesson unlocks instantly.
          </p>
        </div>

        <TryClient lesson={lesson} />
      </main>
      <Footer />
    </div>
  )
}
