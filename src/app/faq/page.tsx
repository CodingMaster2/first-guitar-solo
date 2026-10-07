'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

const faqs = [
  {
    q: 'Do I need to be an advanced guitarist?',
    a: "No. You need basic guitar fundamentals — you should know what a fret is, how to hold a pick, and ideally be able to play some basic chords. If you've played guitar for at least a few months, you're ready. Complete beginners (day 1 of ever picking up a guitar) may want to learn basic fundamentals first.",
  },
  {
    q: 'Can I use an acoustic or electric guitar?',
    a: "Yes to both. All techniques in the program work on either instrument. Electric guitar makes bends and vibrato somewhat easier due to lighter string action and string gauge, but everything is achievable on acoustic. If you have both, you can switch between them.",
  },
  {
    q: 'What if I miss a day?',
    a: "The program doesn't expire and there's no penalty for missing days. Pick up where you left off whenever you're ready. The AI Coach can help you re-establish momentum after a break. Missing days is normal — what matters is returning.",
  },
  {
    q: 'Can the AI Guitar Coach hear my guitar?',
    a: "No. The AI Coach cannot hear audio and does not analyze your playing technically. It gives advice based on your progress data, what day you're on, your self-reported skill levels from onboarding, and what you describe in your messages to it. Think of it as a knowledgeable teacher giving advice based on your description of the problem.",
  },
  {
    q: 'Is this a subscription?',
    a: 'No. $25 is a one-time payment. You own lifetime access to the program. No recurring charges.',
  },
  {
    q: 'What guitar techniques will I learn?',
    a: "Week 1 covers: single-note picking, alternate picking, hammer-ons, pull-offs, and slides. Week 2 adds: the minor pentatonic scale, creating phrases, string bending, vibrato, and legato phrasing. Weeks 3-4 apply all of these to learning a complete original blues-rock solo.",
  },
  {
    q: 'How long is each lesson?',
    a: "Lessons are designed to take 15-30 minutes depending on the day. Some early technique lessons are 15-20 minutes. The solo learning lessons in Weeks 3-4 run 25-30 minutes. The program is designed around the reality that most people have 20-30 minutes per day, not hours.",
  },
  {
    q: "What's the solo like?",
    a: "The solo is an original blues-rock piece in A minor using the minor pentatonic scale. It has four sections: a melodic opening, a legato-heavy build, an expressive peak with a big bend and vibrato, and a resolved ending. It's approximately 16 bars at a medium tempo. It was designed specifically for this program to use exactly the techniques taught.",
  },
  {
    q: 'What if the program is too hard or too easy?',
    a: "The onboarding assessment customizes how the AI Coach advises you based on your current level. If you're finding it too easy, move through lessons more quickly. If it's too hard, the AI Coach can give you simplified exercises for any technique, and you can repeat any lesson before moving on.",
  },
  {
    q: 'Do I need any special equipment?',
    a: "Just a guitar and a pick. A metronome (free apps are fine) is recommended for timing practice. A quiet place to practice. Everything else — audio demos, backing tracks, curriculum — is provided in the program.",
  },
  {
    q: 'What is the refund policy?',
    a: "30-day money-back guarantee. If you complete the program and feel it wasn't worth it, email support@sixthstringlabs.com within 30 days of purchase for a full refund. No questions asked.",
  },
  {
    q: 'Can I access it on my phone?',
    a: "Yes. The program is fully mobile-responsive. It's designed with the assumption that you'll hold your phone next to your guitar while practicing.",
  },
  {
    q: 'What makes this different from YouTube tutorials?',
    a: "YouTube guitar lessons are excellent but unstructured. You can watch hundreds of lessons and not make progress because there's no path, no progression, and no goal. This program has one goal (perform a complete solo on Day 30), a clear path to get there (30 structured days), and an AI Coach to help when you're stuck. Every lesson exists for a reason.",
  },
]

export default function FAQPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <Link href="/" style={{ color: '#a3a3a3' }} className="text-sm hover:text-white transition-colors">
            &#8592; Back
          </Link>
          <h1 className="text-4xl font-black uppercase mt-4 mb-2">FAQ</h1>
          <p style={{ color: '#a3a3a3' }} className="text-base">Everything you need to know about First Guitar Solo.</p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
              className="rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-6 py-4 flex justify-between items-start gap-4"
              >
                <span className="text-white font-medium text-sm">{faq.q}</span>
                <span style={{ color: '#f59e0b' }} className="text-xl flex-shrink-0 mt-0.5">
                  {openFaq === i ? '−' : '+'}
                </span>
              </button>
              {openFaq === i && (
                <div style={{ borderTop: '1px solid #1a1a1a' }} className="px-6 py-4">
                  <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #262626' }} className="mt-12 pt-8 text-center">
          <p style={{ color: '#a3a3a3' }} className="text-sm mb-4">
            Still have questions?
          </p>
          <Link
            href="/contact"
            style={{ backgroundColor: '#f59e0b', color: '#000000' }}
            className="inline-block px-6 py-3 rounded-lg text-sm font-black uppercase tracking-wider hover:opacity-90 transition-all mb-4"
          >
            Contact Us
          </Link>
          <p style={{ color: '#525252' }} className="text-xs">
            Or email us at{' '}
            <a
              href="mailto:support@sixthstringlabs.com"
              style={{ color: '#737373' }}
              className="hover:underline"
            >
              support@sixthstringlabs.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
