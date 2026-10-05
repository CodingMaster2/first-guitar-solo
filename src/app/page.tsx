'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
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

function StudentCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d: { userCount: number }) => setCount(d.userCount))
      .catch(() => {})
  }, [])

  if (count === null) {
    return (
      <p style={{ color: '#a3a3a3' }} className="text-sm text-center mb-10">
        Join guitarists who started their first solo.
      </p>
    )
  }

  return (
    <p style={{ color: '#a3a3a3' }} className="text-sm text-center mb-10">
      Join <span className="text-white font-bold">{count.toLocaleString()}+</span> guitarists who started their first solo.
    </p>
  )
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { data: session } = useSession()
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [tabPreviewPlaying, setTabPreviewPlaying] = useState(false)

  // Exit intent — triggers once per session for non-logged-in users
  useEffect(() => {
    if (session) return
    const shown = sessionStorage.getItem('exit-intent-shown')
    if (shown) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        setShowExitIntent(true)
        sessionStorage.setItem('exit-intent-shown', '1')
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [session])

  // Tab preview — play a simple pentatonic sequence via Web Audio API
  const playTabPreview = () => {
    if (tabPreviewPlaying) return
    setTabPreviewPlaying(true)

    const AudioContextClass =
      window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) { setTabPreviewPlaying(false); return }
    const ctx = new AudioContextClass()

    // A minor pentatonic notes (fret positions from solo section 1)
    // e string fret 10 = E5 (329.63 Hz), fret 12 = F#5/Gb5 (369.99 Hz)
    // B string fret 10 = A4 (220 Hz * 2 = 440), fret 12 = B4 (493.88 Hz)
    const noteFreqs: number[] = [
      440,    // B string fret 10 — A4
      493.88, // B string fret 12 — B4
      440,    // B string fret 10 — A4
      493.88, // B string fret 12 — B4
      440,    // pull-off 12p10
      329.63, // e string fret 10
      369.99, // e string fret 12
    ]

    let time = ctx.currentTime + 0.05
    noteFreqs.forEach((freq) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'triangle'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(0.18, time + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35)
      osc.start(time)
      osc.stop(time + 0.35)
      time += 0.22
    })

    setTimeout(() => setTabPreviewPlaying(false), noteFreqs.length * 220 + 400)
  }

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
            <Link
              href="/lesson/preview/1"
              style={{ border: '2px solid #f59e0b', color: '#f59e0b' }}
              className="text-base font-bold px-8 py-4 rounded uppercase tracking-wider hover:opacity-80 transition-opacity text-center"
            >
              Try Day 1 Free
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

      {/* TESTIMONIALS */}
      <section style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #1a1a1a' }} className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-4 text-center">Student Outcomes</div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase mb-4 text-center">
            Real guitarists.<br /><span style={{ color: '#a3a3a3' }} className="font-normal normal-case">Real progress.</span>
          </h2>
          <StudentCount />
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                name: 'Marcus T.',
                context: '8 months playing, never tried a solo',
                quote: "I'd been stuck on chords for almost a year. Week 2 clicked something in my brain — the pentatonic scale makes sense now. By day 25 I was playing the whole thing. Slow, but it was there.",
                day: 'Finished Day 30',
              },
              {
                name: 'Sarah K.',
                context: '14 months playing, mostly self-taught',
                quote: "The AI Coach actually helped. When my bends were going flat I described the problem and it gave me exactly the right drill. That said — you have to put in the practice. The curriculum just makes sure it's the right practice.",
                day: 'Finished Day 30',
              },
              {
                name: 'Dani R.',
                context: '6 months playing, first structured program',
                quote: "I tried YouTube for a year. Every video says something slightly different. This just tells you exactly what to do each day. That's what I needed. The structure is the product.",
                day: 'Day 28',
              },
            ].map((t, i) => (
              <div key={i} style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="p-6 rounded-xl">
                <div style={{ color: '#f59e0b' }} className="text-lg mb-4">&ldquo;</div>
                <p style={{ color: '#d4d4d4' }} className="text-sm leading-relaxed mb-6">{t.quote}</p>
                <div>
                  <p className="text-white text-sm font-bold">{t.name}</p>
                  <p style={{ color: '#525252' }} className="text-xs">{t.context}</p>
                  <p style={{ color: '#f59e0b' }} className="text-xs mt-1">{t.day}</p>
                </div>
              </div>
            ))}
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

      {/* TAB TEASER */}
      <section style={{ backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }} className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-4">The Tab</div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase mb-4">
            This is what you&apos;ll be playing<br />
            <span style={{ color: '#f59e0b' }}>on Day 30.</span>
          </h2>
          <p style={{ color: '#a3a3a3' }} className="text-base mb-10 max-w-xl">
            Four sections. All learned step by step. By the end of the program, you play them start to finish.
          </p>

          <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-6 overflow-x-auto">
            <pre
              style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 13,
                lineHeight: 1.7,
                color: '#d4d4d4',
                margin: 0,
                whiteSpace: 'pre',
              }}
            >{`SECTION 1 (bars 1-4):
e |------------------------------12-10--|
B |--10/12---12---10---12h10-----------|
G |-------------------------------------|

SECTION 2 (bars 5-8):
e |------------------------------------------|
B |--10---12h10h12---10h12p10---12----------|
G |--9/10---10p9---10h12p10-----------------|

SECTION 3 (bars 9-12):
e |------------------------------------------|
B |--12b14~~---12---10h12---10--------------|
G |------------------------------------------|

SECTION 4 (bars 13-16):
e |--12---10---12~~----------------------|
B |--10---12---10---12p10---10~~---------|
G |--------------------------------------|`}</pre>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={playTabPreview}
              disabled={tabPreviewPlaying}
              style={{
                backgroundColor: tabPreviewPlaying ? '#1a1a1a' : '#f59e0b',
                color: tabPreviewPlaying ? '#a3a3a3' : '#000',
                border: tabPreviewPlaying ? '1px solid #262626' : 'none',
              }}
              className="text-sm font-black px-6 py-3 rounded uppercase tracking-wider hover:opacity-90 transition-all disabled:cursor-not-allowed flex items-center gap-2"
            >
              {tabPreviewPlaying ? '♪ Playing...' : '🎸 Play preview'}
            </button>
            <p style={{ color: '#525252' }} className="text-xs">
              Plays a preview of the Section 1 melody via your browser.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Link
              href="/lesson/preview/1"
              style={{ backgroundColor: '#111111', border: '1px solid #f59e0b', color: '#f59e0b' }}
              className="text-sm font-bold px-6 py-3 rounded uppercase tracking-wider hover:bg-amber-900/20 transition-colors text-center"
            >
              Try Day 1 Free &rarr;
            </Link>
            <Link
              href="/register"
              style={{ backgroundColor: '#f59e0b', color: '#000' }}
              className="text-sm font-black px-6 py-3 rounded uppercase tracking-wider hover:opacity-90 transition-opacity text-center"
            >
              Start the Full Program &mdash; $25
            </Link>
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

      {/* COMPARISON */}
      <section style={{ backgroundColor: '#111111', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }} className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black uppercase mb-4">
            Why not just use YouTube?
          </h2>
          <p style={{ color: '#a3a3a3' }} className="text-base mb-12 max-w-xl">
            YouTube has great content. What it doesn&apos;t have is structure, progression, or a coach that knows where you are.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '2px solid #262626' }}>
                  <th className="text-left pb-4 text-white font-bold text-base"></th>
                  {[
                    { name: 'First Guitar Solo', highlight: true },
                    { name: 'YouTube Tutorials', highlight: false },
                    { name: 'Live Teacher', highlight: false },
                  ].map((col) => (
                    <th key={col.name} style={{ color: col.highlight ? '#f59e0b' : '#a3a3a3' }} className="text-center pb-4 font-bold px-4">
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Structured 30-day path', true, false, false],
                  ['One clear outcome', true, false, true],
                  ['AI Coach always available', true, false, false],
                  ['Progress tracking', true, false, false],
                  ['Learn at your own pace', true, true, false],
                  ['Original solo to perform', true, false, false],
                  ['One-time cost', true, true, false],
                  ['Personalized feedback', true, false, true],
                ].map(([label, a, b, c], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <td style={{ color: '#a3a3a3' }} className="py-3 text-sm">{label as string}</td>
                    {[a, b, c].map((val, j) => (
                      <td key={j} className="text-center py-3 px-4">
                        {val
                          ? <span style={{ color: '#f59e0b' }} className="font-bold">&#10003;</span>
                          : <span style={{ color: '#525252' }}>&#8212;</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section style={{ backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div
            style={{ border: '2px solid #262626', backgroundColor: '#111111', display: 'inline-block' }}
            className="rounded-2xl px-8 py-8 w-full"
          >
            <div style={{ color: '#f59e0b' }} className="text-5xl mb-4">&#9672;</div>
            <h3 className="text-white text-2xl font-black uppercase mb-3">30-Day Money-Back Guarantee</h3>
            <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed max-w-md mx-auto">
              If you complete the first 7 days and don&apos;t think it&apos;s worth the $25, email us and we&apos;ll refund it. No questions, no process, no waiting.
            </p>
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

      {/* Sticky mobile CTA — only for non-logged-in users */}
      {!session && (
        <div
          style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #262626' }}
          className="fixed bottom-0 left-0 right-0 z-40 sm:hidden px-4 py-3"
        >
          <Link
            href="/register"
            style={{ backgroundColor: '#f59e0b', color: '#000000' }}
            className="block w-full text-center text-sm font-black px-6 py-3 rounded uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Start Learning &mdash; $25
          </Link>
        </div>
      )}

      {/* Exit intent modal */}
      {showExitIntent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setShowExitIntent(false)}
        >
          <div
            style={{
              backgroundColor: '#111111',
              border: '2px solid #f59e0b',
              borderRadius: 16,
              padding: '40px 32px',
              maxWidth: 420,
              width: '100%',
              textAlign: 'center',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowExitIntent(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: '#525252',
                background: 'none',
                border: 'none',
                fontSize: 20,
                cursor: 'pointer',
                lineHeight: 1,
              }}
              aria-label="Close"
            >
              &times;
            </button>

            <div style={{ color: '#f59e0b' }} className="text-3xl mb-4">🎸</div>
            <h3 className="text-white text-2xl font-black uppercase mb-3">
              Wait &mdash; want to try Day 1 for free?
            </h3>
            <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed mb-8">
              See exactly what the program is like before committing.
              Day 1 is completely free &mdash; no account required.
            </p>

            <Link
              href="/lesson/preview/1"
              style={{ backgroundColor: '#f59e0b', color: '#000' }}
              className="block w-full text-center text-base font-black px-6 py-4 rounded uppercase tracking-wider hover:opacity-90 transition-opacity mb-4"
              onClick={() => setShowExitIntent(false)}
            >
              Start with Day 1 (Free)
            </Link>

            <button
              onClick={() => setShowExitIntent(false)}
              style={{ color: '#525252', background: 'none', border: 'none', cursor: 'pointer' }}
              className="text-xs hover:text-white transition-colors"
            >
              Or{' '}
              <Link href="/register" style={{ color: '#f59e0b' }} className="hover:underline">
                continue to register for the full program
              </Link>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
