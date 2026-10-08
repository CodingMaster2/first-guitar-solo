import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'First Guitar Solo vs Alternatives — Comparison',
  description:
    'How does First Guitar Solo compare to YouTube, Yousician, Fender Play, Guitar Tricks, and private lessons? One-time $25, one goal, 30 days.',
  openGraph: {
    title: 'First Guitar Solo vs Alternatives',
    description: 'See why a $25 one-time course beats $1,000+ in lessons and monthly subscriptions.',
    type: 'website',
  },
}

// ─── Table data ───────────────────────────────────────────────────
interface Feature {
  label: string
  fgs: string | boolean
  youtube: string | boolean
  yousician: string | boolean
  fenderPlay: string | boolean
  guitarTricks: string | boolean
  privateLesson: string | boolean
}

const TABLE_FEATURES: Feature[] = [
  {
    label: 'Price',
    fgs: '$25 one-time',
    youtube: 'Free',
    yousician: '$120 / yr',
    fenderPlay: '$100 / yr',
    guitarTricks: '$240 / yr',
    privateLesson: '$1,000+ / yr',
  },
  {
    label: 'Structured path to one goal',
    fgs: true,
    youtube: false,
    yousician: false,
    fenderPlay: false,
    guitarTricks: false,
    privateLesson: false,
  },
  {
    label: 'No ongoing subscription',
    fgs: true,
    youtube: true,
    yousician: false,
    fenderPlay: false,
    guitarTricks: false,
    privateLesson: false,
  },
  {
    label: 'AI Coach included',
    fgs: true,
    youtube: false,
    yousician: false,
    fenderPlay: false,
    guitarTricks: false,
    privateLesson: false,
  },
  {
    label: 'Spaced repetition reviews',
    fgs: true,
    youtube: false,
    yousician: false,
    fenderPlay: false,
    guitarTricks: false,
    privateLesson: false,
  },
  {
    label: 'Progress tracking',
    fgs: true,
    youtube: false,
    yousician: true,
    fenderPlay: true,
    guitarTricks: false,
    privateLesson: false,
  },
  {
    label: 'Guaranteed completion path',
    fgs: true,
    youtube: false,
    yousician: false,
    fenderPlay: false,
    guitarTricks: false,
    privateLesson: false,
  },
  {
    label: 'Human-created curriculum',
    fgs: true,
    youtube: true,
    yousician: true,
    fenderPlay: true,
    guitarTricks: true,
    privateLesson: true,
  },
  {
    label: 'No ads or distractions',
    fgs: true,
    youtube: false,
    yousician: true,
    fenderPlay: true,
    guitarTricks: true,
    privateLesson: true,
  },
  {
    label: 'Graduation certificate',
    fgs: true,
    youtube: false,
    yousician: false,
    fenderPlay: false,
    guitarTricks: false,
    privateLesson: false,
  },
]

// ─── Competitor detail cards ───────────────────────────────────────
interface Competitor {
  name: string
  tagline: string
  icon: string
  price: string
  pros: string[]
  cons: string[]
  fgsWins: string[]
}

const COMPETITORS: Competitor[] = [
  {
    name: 'YouTube',
    tagline: 'Infinite content, zero structure',
    icon: '▶',
    price: 'Free',
    pros: ['Enormous free library', 'Great individual tutors', 'Any topic covered'],
    cons: [
      'No structure — you have to build the curriculum yourself',
      'Rabbit holes kill focus and momentum',
      'No progress tracking or spaced review',
      'Easy to spend hours watching without actually practising',
    ],
    fgsWins: [
      '30-day path: one lesson per day, zero decisions',
      'Built-in spaced repetition keeps licks in long-term memory',
      'Progress bar shows exactly where you are in the journey',
    ],
  },
  {
    name: 'Yousician',
    tagline: 'Gamified, broad, and forever monthly',
    icon: '🎮',
    price: '$120 / year',
    pros: ['Fun gamification mechanics', 'Broad instrument coverage', 'Instant pitch feedback'],
    cons: [
      'Monthly subscription that never ends',
      'Breadth over depth — no focused solo curriculum',
      'Gamification can replace actual progress',
      'No AI coach to answer specific questions',
    ],
    fgsWins: [
      '$25 one-time — own it forever after one payment',
      'Specific goal: play your first complete solo',
      'AI Coach explains theory, technique, and context on demand',
    ],
  },
  {
    name: 'Fender Play',
    tagline: 'Celebrity instructors, no finish line',
    icon: '🎸',
    price: '$100 / year',
    pros: ['High production quality', 'Famous instructor names', 'Wide song selection'],
    cons: [
      'Subscription required — pay forever',
      'Song-focused, not technique-focused',
      'No clear 30-day completion arc',
      'Easy to drift between songs without mastering anything',
    ],
    fgsWins: [
      '$25 one-time, not $100/yr',
      'Every day has a clear outcome — no drift',
      'You actually finish something in 30 days',
    ],
  },
  {
    name: 'Guitar Tricks',
    tagline: '11,000+ lessons — overwhelming by design',
    icon: '🔧',
    price: '$240 / year',
    pros: ['Massive content library', 'Core learning system', 'Detailed theory coverage'],
    cons: [
      'Most expensive subscription in guitar ed',
      'Volume is paralysing — too many choices',
      'No focused solo curriculum',
      'Monthly fee accumulates to thousands over years',
    ],
    fgsWins: [
      '$25 one-time vs $240+/yr',
      'One focused goal instead of 11,000 rabbit holes',
      'Affordable enough to be an impulse purchase, not a commitment',
    ],
  },
  {
    name: 'Private Lessons',
    tagline: 'The gold standard — at a gold price',
    icon: '👨‍🏫',
    price: '$1,000+ / year',
    pros: [
      'Real-time personalised feedback',
      'Adapts to your specific weaknesses',
      'Relationship and accountability',
    ],
    cons: [
      '$80–$120 per hour, 52 weeks a year',
      'Schedule-dependent — miss a week and lose momentum',
      'Quality varies wildly by teacher',
      'No AI, no digital review tools, no 24/7 access',
    ],
    fgsWins: [
      '$25 vs $1,000+ — practise the same content for 1/40th the cost',
      'Practice anytime, any day, any timezone',
      'AI Coach answers questions instantly, 24/7',
      'Proven curriculum vs whatever the teacher decides that week',
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────
function BoolCell({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <span style={{ color: '#22c55e', fontWeight: 900, fontSize: '1rem' }}>✓</span>
    ) : (
      <span style={{ color: '#525252', fontWeight: 700, fontSize: '1rem' }}>✗</span>
    )
  }
  return <span style={{ color: '#a3a3a3', fontSize: '0.8rem' }}>{value}</span>
}

export default function ComparePage() {
  const cols = ['First Guitar Solo', 'YouTube', 'Yousician', 'Fender Play', 'Guitar Tricks', 'Private Lessons']

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <p
            style={{
              color: '#f59e0b',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '0.625rem',
            }}
          >
            First Guitar Solo vs the World
          </p>
          <h1
            style={{
              color: '#ffffff',
              fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
              fontWeight: 900,
              letterSpacing: '0.05em',
              lineHeight: 1.1,
              marginBottom: '0.875rem',
            }}
          >
            Why First Guitar Solo vs the Alternatives
          </h1>
          <p
            style={{
              color: '#a3a3a3',
              fontSize: '1.125rem',
              lineHeight: 1.7,
              maxWidth: '540px',
              margin: '0 auto',
            }}
          >
            You have a lot of options. Most of them will leave you with the same guitar collecting dust.
            {"Here's"} what makes this one different.
          </p>
        </div>

        {/* ─── Comparison table ─── */}
        <section style={{ marginBottom: '4rem' }}>
          <h2
            style={{
              color: '#ffffff',
              fontSize: '1.25rem',
              fontWeight: 900,
              letterSpacing: '0.05em',
              marginBottom: '1.25rem',
            }}
          >
            Feature Comparison
          </h2>

          {/* Scrollable wrapper */}
          <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid #1f1f1f' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '720px' }}>
              <thead>
                <tr>
                  {cols.map((col, i) => (
                    <th
                      key={col}
                      style={{
                        backgroundColor: i === 0 ? 'rgba(245,158,11,0.08)' : '#111111',
                        borderBottom: `1px solid ${i === 0 ? '#f59e0b' : '#262626'}`,
                        borderRight: '1px solid #1f1f1f',
                        padding: '0.875rem 1rem',
                        textAlign: i === 0 ? 'left' : 'center',
                        color: i === 0 ? '#f59e0b' : '#a3a3a3',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_FEATURES.map((feat, ri) => (
                  <tr key={feat.label} style={{ backgroundColor: ri % 2 === 0 ? '#0d0d0d' : '#111111' }}>
                    {/* Feature label */}
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        color: '#e5e5e5',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        borderRight: '1px solid #1f1f1f',
                        borderBottom: '1px solid #1a1a1a',
                      }}
                    >
                      {feat.label}
                    </td>
                    {/* FGS value — highlighted */}
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'center',
                        backgroundColor: 'rgba(245,158,11,0.04)',
                        borderRight: '1px solid #1f1f1f',
                        borderBottom: '1px solid #1a1a1a',
                      }}
                    >
                      <BoolCell value={feat.fgs} />
                    </td>
                    {/* Competitor values */}
                    {(['youtube', 'yousician', 'fenderPlay', 'guitarTricks', 'privateLesson'] as const).map((key) => (
                      <td
                        key={key}
                        style={{
                          padding: '0.75rem 1rem',
                          textAlign: 'center',
                          borderRight: '1px solid #1f1f1f',
                          borderBottom: '1px solid #1a1a1a',
                        }}
                      >
                        <BoolCell value={feat[key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Amber callout */}
          <div
            style={{
              backgroundColor: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>⭐</span>
            <p style={{ color: '#fde68a', fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>
              First Guitar Solo is the only option with a structured 30-day path, AI Coach, spaced repetition, and no subscription — all for a one-time $25.
            </p>
          </div>
        </section>

        {/* ─── Competitor detail sections ─── */}
        <section style={{ marginBottom: '4rem' }}>
          <h2
            style={{
              color: '#ffffff',
              fontSize: '1.25rem',
              fontWeight: 900,
              letterSpacing: '0.05em',
              marginBottom: '1.75rem',
            }}
          >
            Detailed Breakdown
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {COMPETITORS.map((comp) => (
              <div
                key={comp.name}
                style={{
                  backgroundColor: '#111111',
                  border: '1px solid #1f1f1f',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid #1f1f1f',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ fontSize: '1.75rem' }}>{comp.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <h3
                        style={{
                          color: '#ffffff',
                          fontSize: '1.1rem',
                          fontWeight: 900,
                          margin: 0,
                          fontFamily: 'inherit',
                          letterSpacing: 'normal',
                        }}
                      >
                        vs. {comp.name}
                      </h3>
                      <span
                        style={{
                          backgroundColor: '#1a1a1a',
                          color: '#a3a3a3',
                          border: '1px solid #262626',
                          borderRadius: 100,
                          padding: '1px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                        }}
                      >
                        {comp.price}
                      </span>
                    </div>
                    <p style={{ color: '#737373', fontSize: '0.8rem', margin: '2px 0 0' }}>{comp.tagline}</p>
                  </div>
                </div>

                {/* Card body */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '0',
                  }}
                >
                  {/* Pros */}
                  <div style={{ padding: '1.125rem 1.5rem', borderRight: '1px solid #1a1a1a' }}>
                    <p
                      style={{
                        color: '#525252',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '0.625rem',
                      }}
                    >
                      What they do well
                    </p>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      {comp.pros.map((pro) => (
                        <li key={pro} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                          <span style={{ color: '#22c55e', fontWeight: 900, flexShrink: 0, marginTop: '1px' }}>✓</span>
                          <span style={{ color: '#a3a3a3', fontSize: '0.8rem', lineHeight: 1.5 }}>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons */}
                  <div style={{ padding: '1.125rem 1.5rem', borderRight: '1px solid #1a1a1a' }}>
                    <p
                      style={{
                        color: '#525252',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '0.625rem',
                      }}
                    >
                      The drawbacks
                    </p>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      {comp.cons.map((con) => (
                        <li key={con} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                          <span style={{ color: '#ef4444', fontWeight: 900, flexShrink: 0, marginTop: '1px' }}>✗</span>
                          <span style={{ color: '#a3a3a3', fontSize: '0.8rem', lineHeight: 1.5 }}>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* FGS wins */}
                  <div
                    style={{
                      padding: '1.125rem 1.5rem',
                      backgroundColor: 'rgba(245,158,11,0.04)',
                    }}
                  >
                    <p
                      style={{
                        color: '#f59e0b',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '0.625rem',
                      }}
                    >
                      Why First Guitar Solo wins
                    </p>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      {comp.fgsWins.map((win) => (
                        <li key={win} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                          <span style={{ color: '#f59e0b', fontWeight: 900, flexShrink: 0, marginTop: '1px' }}>★</span>
                          <span style={{ color: '#e5e5e5', fontSize: '0.8rem', lineHeight: 1.5 }}>{win}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section
          style={{
            textAlign: 'center',
            backgroundColor: '#111111',
            border: '1px solid #262626',
            borderRadius: '1rem',
            padding: '3rem 2rem',
          }}
        >
          <h2
            style={{
              color: '#ffffff',
              fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
              fontWeight: 900,
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
            }}
          >
            Ready to actually finish something?
          </h2>
          <p style={{ color: '#a3a3a3', fontSize: '1rem', marginBottom: '2rem', maxWidth: '420px', margin: '0 auto 2rem' }}>
            30 days. One complete blues-rock solo. One payment.
            No subscription, no overwhelm, no rabbit holes.
          </p>
          <Link
            href="/register"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000000',
              fontWeight: 900,
              fontSize: '1rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '0.875rem 2.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
            }}
          >
            Start for $25 →
          </Link>
          <p style={{ color: '#525252', fontSize: '0.75rem', marginTop: '1rem' }}>
            One-time payment · Instant access · No subscription
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
