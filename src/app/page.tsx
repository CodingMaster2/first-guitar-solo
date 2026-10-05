'use client'

import Link from 'next/link'
import { useState } from 'react'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

const faqs = [
  {
    q: 'Do I need to be an advanced guitarist?',
    a: "No. You need basic guitar fundamentals — basic chords, how to hold a pick. If you've played guitar for at least a few months, you're ready.",
  },
  {
    q: 'Can I use an acoustic or electric guitar?',
    a: 'Yes to both. The techniques and solo work on either instrument. Electric makes some techniques (bends, vibrato) easier, but everything is achievable on acoustic.',
  },
  {
    q: 'What if I miss a day?',
    a: "The program doesn't expire. Pick up where you left off. The AI Coach can help you get back on track without any judgment.",
  },
  {
    q: 'Can the AI hear my guitar?',
    a: "No. The AI Coach gives advice based on your progress and what you tell it — not audio analysis. It's a coaching tool, not a listening tool.",
  },
  {
    q: 'Is this a subscription?',
    a: 'No. $25 one-time. You own the program.',
  },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff' }} className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-5xl mx-auto w-full">
          <div className="mb-6">
            <span
              style={{ backgroundColor: '#1a1a1a', color: '#f59e0b', border: '1px solid #262626' }}
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded"
            >
              30-Day Guitar Program
            </span>
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black uppercase leading-none tracking-tight mb-6">
            PLAY YOUR FIRST<br />
            GUITAR{' '}
            <span style={{ color: '#f59e0b' }}>SOLO.</span>
          </h1>
          <p style={{ color: '#a3a3a3' }} className="text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
            A structured 30-day program designed to take you from basic guitar skills to confidently
            performing your first complete guitar solo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link
              href="/register"
              style={{ backgroundColor: '#f59e0b', color: '#000000' }}
              className="text-base font-black px-8 py-4 rounded uppercase tracking-wider hover:opacity-90 transition-opacity text-center"
            >
              Start Learning &mdash; $25
            </Link>
            <a
              href="#how-it-works"
              style={{ border: '2px solid #262626', color: '#ffffff' }}
              className="text-base font-bold px-8 py-4 rounded uppercase tracking-wider hover:border-gray-400 transition-colors text-center"
            >
              See How It Works
            </a>
          </div>
          <p style={{ color: '#a3a3a3' }} className="text-sm">
            One-time payment &middot; 30-day money-back guarantee
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div style={{ color: '#262626' }} className="text-2xl animate-bounce">&#8595;</div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #1a1a1a' }} className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black uppercase mb-4">
            You know how to play guitar.<br />
            <span style={{ color: '#a3a3a3' }} className="font-normal normal-case">You just don&apos;t know how to play a solo.</span>
          </h2>
          <p style={{ color: '#a3a3a3' }} className="text-base mb-16 max-w-xl">
            Most guitarists hit a wall. They can play chords — but lead guitar feels like a different instrument.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'Too much content', body: 'YouTube has thousands of guitar lessons. None of them build toward anything. You watch, you learn a lick, you forget it.' },
              { title: 'Random tutorials', body: 'No direction means no progress. You practice what looks interesting, not what you actually need to improve.' },
              { title: 'Practice without purpose', body: "Noodling isn't practice. Without a clear goal and structure, 30 minutes of playing feels productive but isn't." },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a' }} className="p-6 rounded-lg">
                <div style={{ color: '#f59e0b' }} className="text-2xl font-black mb-3">&mdash;</div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE SOLUTION */}
      <section style={{ backgroundColor: '#111111', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }} className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black uppercase mb-4">
            First Guitar Solo gives you a path,<br />
            <span style={{ color: '#f59e0b' }}>not more information.</span>
          </h2>
          <p style={{ color: '#a3a3a3' }} className="text-base mb-16 max-w-xl">
            Every lesson exists for a reason. Every day builds on the last. The program has one goal: you perform a complete guitar solo on Day 30.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '&#8594;', title: 'Structure', body: 'Know exactly what to learn next. Every day, every lesson, every technique in the right order.' },
              { icon: '&#8593;', title: 'Progression', body: 'Each lesson builds toward the solo. Nothing is wasted. Everything connects.' },
              { icon: '&#9670;', title: 'Personalization', body: 'The onboarding assessment adapts the program to your current skill level.' },
              { icon: '&#9899;', title: 'AI Guitar Coach', body: 'Stuck on a technique? Get specific, actionable advice from an AI coach that knows exactly where you are.' },
              { icon: '&#9733;', title: 'Application', body: 'Every technique you learn, you use. The program culminates in a real, complete solo performance.' },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: '#0a0a0a', border: '1px solid #262626' }} className="p-6 rounded-lg">
                <div style={{ color: '#f59e0b' }} className="text-3xl font-black mb-4" dangerouslySetInnerHTML={{ __html: item.icon }} />
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black uppercase mb-16">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Complete the onboarding assessment', body: 'A 5-step assessment captures your experience level, technique confidence, and practice availability. The program adjusts accordingly.' },
              { num: '02', title: 'Follow the 30-day structured curriculum', body: 'Each day, a focused lesson. Technique practice. Audio demos. A clear exercise with a clear success criteria. The AI Coach is always available.' },
              { num: '03', title: 'Perform your first complete guitar solo', body: "On Day 30, you play the complete original blues-rock solo beginning to end with the backing track. That's the goal." },
            ].map((step, i) => (
              <div key={i} className="flex flex-col">
                <div style={{ color: '#f59e0b' }} className="text-5xl font-black mb-4">{step.num}</div>
                <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>
                <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 30-DAY ROADMAP */}
      <section style={{ backgroundColor: '#111111', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }} className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black uppercase mb-4">The 30-Day Roadmap</h2>
          <p style={{ color: '#a3a3a3' }} className="text-base mb-16 max-w-xl">
            Four weeks, one clear arc. Every week builds toward the performance.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { week: 'Week 1', title: 'Lead Guitar Foundations', color: '#f59e0b', items: ['Single-note picking', 'Alternate picking', 'Hammer-ons', 'Pull-offs', 'Slides'] },
              { week: 'Week 2', title: 'Sound Like a Lead Guitarist', color: '#0ea5e9', items: ['Minor pentatonic scale', 'Creating phrases', 'String bending', 'Vibrato', 'Legato phrasing'] },
              { week: 'Week 3', title: 'Learn the Solo', color: '#a855f7', items: ['Meet the solo', 'Section 1: Opening', 'Section 2: The Build', 'Connect sections', 'Tempo building'] },
              { week: 'Week 4', title: 'Performance', color: '#22c55e', items: ['Section 3: Peak', 'Section 4: Resolution', 'Full solo run-throughs', 'Backing track', 'Performance day'] },
            ].map((w, i) => (
              <div key={i} style={{ backgroundColor: '#0a0a0a', border: '1px solid #262626' }} className="p-6 rounded-lg">
                <div style={{ color: w.color }} className="text-xs font-bold uppercase tracking-widest mb-2">{w.week}</div>
                <h3 className="text-white font-bold text-base mb-4">{w.title}</h3>
                <ul className="space-y-1">
                  {w.items.map((item, j) => (
                    <li key={j} style={{ color: '#a3a3a3' }} className="text-sm flex items-center gap-2">
                      <span style={{ color: w.color }}>&#183;</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI COACH */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-4">AI Guitar Coach</div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase mb-6">
                Stuck? Your coach knows exactly where you are.
              </h2>
              <p style={{ color: '#a3a3a3' }} className="text-base leading-relaxed mb-6">
                The AI Guitar Coach knows your current day, your skill levels, and your practice history. It gives specific, actionable advice.
              </p>
              <p style={{ color: '#a3a3a3' }} className="text-sm">
                Note: The AI Coach responds to what you tell it. It cannot hear your guitar.
              </p>
            </div>
            <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl overflow-hidden">
              <div style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #262626' }} className="px-4 py-3">
                <p style={{ color: '#a3a3a3' }} className="text-xs">AI Guitar Coach &bull; Day 12 &bull; String Bending</p>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-end">
                  <div style={{ backgroundColor: '#f59e0b', color: '#000' }} className="rounded-2xl px-4 py-2 text-sm max-w-xs">
                    My bends don&apos;t sound right &mdash; they go flat before I finish.
                  </div>
                </div>
                <div className="flex justify-start">
                  <div style={{ backgroundColor: '#1a1a1a' }} className="rounded-2xl px-4 py-3 text-sm max-w-xs leading-relaxed">
                    Flat bends usually mean not enough finger support. Use all three fingers behind the fret and push from your wrist. Try G string fret 7: bend toward the ceiling and check against fret 9. The difference should be immediate.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE SOLO */}
      <section
        id="the-solo"
        style={{ backgroundColor: '#111111', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}
        className="py-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto">
          <div style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-4">The Solo</div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase mb-6">
            An original blues-rock solo.<br />Written specifically for this program.
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p style={{ color: '#a3a3a3' }} className="text-base leading-relaxed mb-6">
                Blues-rock feel. A minor pentatonic. Four sections that build from melodic opening to an expressive peak to a resonant resolution.
              </p>
              <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed">
                Designed to challenge you at exactly the right level &mdash; technically demanding enough to be satisfying, achievable within 30 days of structured practice.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Genre', value: 'Blues-Rock' },
                { label: 'Key', value: 'A minor' },
                { label: 'Scale', value: 'Minor Pentatonic' },
                { label: 'Tempo', value: '78 BPM' },
                { label: 'Techniques', value: 'Slides, Bends, Legato, Vibrato' },
                { label: 'Backing Track', value: 'Included' },
              ].map((item, i) => (
                <div key={i} style={{ borderBottom: '1px solid #262626' }} className="flex justify-between py-2">
                  <span style={{ color: '#a3a3a3' }} className="text-sm">{item.label}</span>
                  <span className="text-white text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-md mx-auto">
            <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl overflow-hidden">
              <div style={{ backgroundColor: '#f59e0b' }} className="px-8 py-6 text-center">
                <p className="text-black text-xs font-bold uppercase tracking-widest mb-1">Sixth String Labs</p>
                <h2 className="text-black text-2xl font-black uppercase tracking-wider">First Guitar Solo</h2>
              </div>
              <div className="px-8 py-8 text-center">
                <div className="mb-8">
                  <span className="text-white text-6xl font-black">$25</span>
                  <p style={{ color: '#a3a3a3' }} className="text-sm mt-1">One-time payment</p>
                </div>
                <ul className="space-y-3 text-left mb-8">
                  {['30-day structured curriculum', 'AI Guitar Coach', 'Progress tracking', 'Original blues-rock solo + backing tracks', '30-day money-back guarantee'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span style={{ color: '#f59e0b' }}>&#10003;</span>
                      <span style={{ color: '#a3a3a3' }} className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  style={{ backgroundColor: '#f59e0b', color: '#000000' }}
                  className="w-full block text-center text-base font-black px-8 py-4 rounded uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Start Learning &mdash; $25
                </Link>
                <p style={{ color: '#a3a3a3' }} className="text-xs mt-4 text-center">
                  Have questions?{' '}
                  <Link href="/faq" style={{ color: '#f59e0b' }} className="hover:underline">Read the FAQ &#8594;</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ backgroundColor: '#111111', borderTop: '1px solid #1a1a1a' }} className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black uppercase mb-12 text-center">Common Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} style={{ backgroundColor: '#0a0a0a', border: '1px solid #262626' }} className="rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center"
                >
                  <span className="text-white font-medium text-sm">{faq.q}</span>
                  <span style={{ color: '#f59e0b' }} className="text-xl ml-4 flex-shrink-0">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div style={{ borderTop: '1px solid #1a1a1a' }} className="px-6 py-4">
                    <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black uppercase mb-6">
            Stop jumping between random tutorials.<br />
            <span style={{ color: '#f59e0b' }}>Follow one clear path.</span>
          </h2>
          <p style={{ color: '#a3a3a3' }} className="text-lg mb-10">
            30 days. One solo. Your first complete lead guitar performance.
          </p>
          <Link
            href="/register"
            style={{ backgroundColor: '#f59e0b', color: '#000000' }}
            className="inline-block text-lg font-black px-10 py-5 rounded uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Start Learning &mdash; $25
          </Link>
          <p style={{ color: '#a3a3a3' }} className="text-sm mt-4">
            One-time payment &middot; 30-day money-back guarantee
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
