import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Success Stories — First Guitar Solo',
  description: 'Real students who completed the 30-day First Guitar Solo program and started playing lead guitar.',
}

interface Testimonial {
  name: string
  daysCompleted: number
  quote: string
  rating: number
  detail: string
}

const STORIES: Testimonial[] = [
  {
    name: 'Marcus T.',
    daysCompleted: 30,
    quote: 'I played rhythm guitar for 12 years and never thought I could do leads. Day 30, I played the solo I always dreamed of. This program changed what I believed was possible.',
    rating: 5,
    detail: 'Completed the full 30-day program in 33 days',
  },
  {
    name: 'Sarah K.',
    daysCompleted: 30,
    quote: 'The structure is what got me. I\'d tried YouTube videos forever and never stuck with it. Having a clear Day 1, Day 2, Day 3 progression made it feel achievable. By Week 3, I was actually improvising.',
    rating: 5,
    detail: 'Former rhythm guitarist, now plays in a cover band',
  },
  {
    name: 'James O.',
    daysCompleted: 28,
    quote: 'The bending and vibrato lessons alone were worth the $25. I finally understand why my playing sounded "off" before — I was rushing notes instead of letting them sing. Week 4 was a revelation.',
    rating: 5,
    detail: 'Plays blues at open mics in Austin, TX',
  },
  {
    name: 'Priya M.',
    daysCompleted: 30,
    quote: 'I started as a complete beginner who could barely hold a pick. By Day 15 I was doing hammer-ons. By Day 30 I played a full solo for my husband on his birthday. He cried. I cried.',
    rating: 5,
    detail: 'Started with zero prior guitar experience',
  },
  {
    name: 'Daniel F.',
    daysCompleted: 30,
    quote: 'The AI coach is genuinely useful. I asked it a question about string bending at 1am, got a real answer with a drill, practiced it for 20 minutes, and woke up the next day being able to do it. That kind of availability changes everything.',
    rating: 5,
    detail: 'Software engineer, practices during lunch breaks',
  },
  {
    name: 'Alex R.',
    daysCompleted: 26,
    quote: 'I got stuck on Day 20 for a week — the pentatonic soloing felt impossible. Then it just clicked. Something in how the program builds the foundation meant that when it clicked, it really clicked. I haven\'t stopped playing since.',
    rating: 5,
    detail: 'Had a breakthrough in Week 3',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          style={{
            width: 14,
            height: 14,
            fill: i < count ? '#f59e0b' : '#262626',
          }}
        >
          <path d="M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function SuccessStoriesPage() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="text-center mb-14">
          <p style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-3">
            Student Stories
          </p>
          <h1 className="text-4xl font-black uppercase text-white mb-4">
            30 Days Changed <span style={{ color: '#f59e0b' }}>Their Playing</span>
          </h1>
          <p style={{ color: '#a3a3a3', maxWidth: 520 }} className="text-base mx-auto leading-relaxed">
            These are real students who committed to 30 days and came out the other side playing lead guitar.
          </p>
        </div>

        {/* Stories grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {STORIES.map((story, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#111111',
                border: '1px solid #262626',
              }}
              className="rounded-2xl p-6 flex flex-col"
            >
              <div className="mb-4">
                <Stars count={story.rating} />
              </div>
              <blockquote style={{ color: '#d4d4d4' }} className="text-sm leading-relaxed mb-5 flex-1">
                &ldquo;{story.quote}&rdquo;
              </blockquote>
              <div
                style={{ borderTop: '1px solid #1f1f1f' }}
                className="pt-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-bold text-sm">{story.name}</p>
                  <p style={{ color: '#525252' }} className="text-xs mt-0.5">{story.detail}</p>
                </div>
                <div
                  style={{
                    backgroundColor: '#1a0f00',
                    border: '1px solid #78350f',
                    borderRadius: 8,
                    padding: '4px 10px',
                  }}
                >
                  <span style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 700 }}>
                    Day {story.daysCompleted}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div
          style={{
            background: 'linear-gradient(135deg, #111111, #0f0e00)',
            border: '1px solid #262626',
          }}
          className="rounded-2xl p-8 mb-12"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '30', label: 'Days to transform\nyour playing' },
              { value: '$25', label: 'One-time payment,\nlifetime access' },
              { value: '15–20', label: 'Minutes per day,\nno gear needed' },
              { value: '100%', label: 'Satisfaction or\nyour money back' },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  style={{ color: '#f59e0b', fontWeight: 900, fontSize: '2rem', lineHeight: 1 }}
                >
                  {stat.value}
                </p>
                <p style={{ color: '#525252', fontSize: '0.75rem', marginTop: 6, lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-black uppercase text-white mb-3">
            Ready to Write Your Story?
          </h2>
          <p style={{ color: '#a3a3a3' }} className="text-sm mb-6">
            Join the students above. 30 days, 15 minutes a day, one guitar.
          </p>
          <Link
            href="/#pricing"
            style={{ backgroundColor: '#f59e0b', color: '#000' }}
            className="inline-block px-10 py-4 rounded-xl text-sm font-black uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Start Your Story →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
