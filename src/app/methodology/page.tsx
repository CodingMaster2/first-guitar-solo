import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'The Science Behind 30-Day Guitar Learning — Methodology',
  description:
    'Learn the research-backed principles behind the First Guitar Solo curriculum: spaced repetition, motor learning, the 80/20 rule, and the psychology of completion.',
  openGraph: {
    title: 'The Science Behind 30-Day Guitar Learning',
    description: 'Deliberate practice, spaced repetition, and the psychology of completion — the method behind the course.',
    type: 'article',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'The Science Behind 30-Day Guitar Learning',
  description:
    'Research-backed principles behind the First Guitar Solo curriculum: spaced repetition, motor learning, the 80/20 rule, and the psychology of completion.',
  author: {
    '@type': 'Person',
    name: 'Zachary Lee',
    affiliation: {
      '@type': 'Organization',
      name: 'Sixth String Labs',
    },
  },
  publisher: {
    '@type': 'Organization',
    name: 'Sixth String Labs',
    url: 'https://first-guitar-solo.vercel.app',
  },
  datePublished: '2025-09-01',
  dateModified: '2025-10-07',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://first-guitar-solo.vercel.app/methodology',
  },
}

interface Section {
  id: string
  number: string
  heading: string
  body: string[]
  callout: {
    label: string
    text: string
  }
}

const SECTIONS: Section[] = [
  {
    id: 'ten-thousand-hours',
    number: '01',
    heading: 'The 10,000 Hours Myth',
    body: [
      "Malcolm Gladwell popularised the idea that mastery requires 10,000 hours of practice. The actual research by Anders Ericsson — the psychologist Gladwell cited — says something quite different: it's not 10,000 hours of any practice, it's 10,000 hours of deliberate practice. Deliberate practice means working at the edge of your ability, with immediate feedback, on specifically identified weaknesses.",
      "Most guitarists practise the things they already know how to do. That feels good — it sounds like music — but it produces almost no improvement. Deliberate practice means slowing down to the tempo where you can play it perfectly, isolating the two bars that break down, and repeating them with focused attention until the movement becomes automatic.",
      "This reframes the mountain entirely. You do not need 10,000 hours. You need the right kind of focused repetition — and 20–30 minutes of deliberate daily practice will produce more progress in 30 days than years of casual noodling.",
    ],
    callout: {
      label: 'In this course',
      text: 'Every lesson targets a specific technique at a specific BPM. You are never told to "just practise more." Each day specifies what to work on and at what tempo, so every minute is deliberate.',
    },
  },
  {
    id: 'spaced-repetition',
    number: '02',
    heading: 'Spaced Repetition',
    body: [
      "The forgetting curve, described by Hermann Ebbinghaus in 1885, shows that the brain discards information exponentially unless it is reviewed. Review it once the next day and you reset the curve. Review it a week later and the curve resets further. Each review makes the memory more durable and extends how long until the next review is needed.",
      "This is the SM-2 algorithm, originally developed for language learning and now backed by decades of cognitive science research. The key insight is that the optimal review interval is neither too soon (wasteful — you haven't had time to forget) nor too late (after forgetting has already occurred). The spacing effect means that reviewing at longer and longer intervals is dramatically more efficient than daily review.",
      "Applied to guitar, this means that a lick learned on Day 7 should be reviewed on Day 8, then Day 10, then Day 14, then Day 21 — not every day. Reviewing it every day is a waste of practice time. Reviewing it at the right interval locks it into muscle memory permanently.",
    ],
    callout: {
      label: 'In this course',
      text: 'The Spaced Review system automatically schedules every lick you have learned for review at the scientifically optimal interval. When you open the app, your queue is already prepared. You never have to decide what to review.',
    },
  },
  {
    id: 'motor-learning',
    number: '03',
    heading: 'Motor Learning Science',
    body: [
      "Playing guitar is a motor skill. Your brain is not memorising notes — it is building neural pathways that control fine motor movements in your fingers. This is fundamentally different from memorising facts, and the research on how motor skills form is unambiguous: speed does not come from playing fast. Speed comes from playing slowly and correctly, with focused attention, until the movement is automatic.",
      "The research — from Schmidt and Lee's Motor Control and Learning to Gabriele Wulf's attention focus work — consistently shows that practising beyond your current speed ceiling creates bad movement patterns that are extremely hard to undo. The brain encodes what you actually do, not what you intend to do. If you play a passage sloppily at fast tempo, you are encoding a sloppy movement pattern.",
      "Conversely, practising at a tempo where every note is clean and controlled creates a precise, efficient movement pattern. Once that pattern is encoded, gradually increasing tempo is straightforward. The apparently slow approach is always faster in the long run.",
    ],
    callout: {
      label: 'In this course',
      text: 'Every lesson includes a target BPM range. Lessons start at a tempo where any beginner can play cleanly. The curriculum increases speed gradually — typically 5 BPM per progression — so you are always encoding correct movement patterns.',
    },
  },
  {
    id: 'eighty-twenty',
    number: '04',
    heading: 'The 80/20 Rule in Guitar',
    body: [
      "Vilfredo Pareto observed that 80% of outcomes come from 20% of inputs. In guitar, this principle is startlingly precise: a small set of techniques — the minor pentatonic scale, whole-step bends, vibrato, hammer-ons, and pull-offs — appear in the vast majority of blues and rock guitar solos ever recorded. You could spend years learning exotic scales and theory, or you could master the 20% that covers 80% of the music you actually want to play.",
      "Most guitar courses teach everything. They cover major scales, minor scales, modes, arpeggios, sweep picking, tapping, and dozens of other techniques before you have ever completed a single solo. The result is shallow knowledge of many things and mastery of nothing.",
      "The 80/20 curriculum inverts this. It identifies the handful of techniques with the highest leverage — the ones that appear most often in blues-rock solos — and builds the entire 30 days around mastering just those. You finish the course having deeply internalised the 20% that matters most.",
    ],
    callout: {
      label: 'In this course',
      text: 'The entire 30-day curriculum is built on five core techniques: the A minor pentatonic scale, string bending, vibrato, hammer-ons/pull-offs, and phrasing. These five techniques will let you improvise over any blues or rock backing track.',
    },
  },
  {
    id: 'one-goal',
    number: '05',
    heading: 'Why One Goal Works',
    body: [
      "Psychologists Edwin Locke and Gary Latham spent 35 years studying goal-setting and found that specific, challenging goals consistently outperform vague, easy ones. The more concrete the goal, the more the brain can organise behaviour to achieve it. 'Get better at guitar' is not a goal. 'Play a complete 12-bar blues solo from memory at 90 BPM by October 31st' is a goal.",
      "Research on completion and the Zeigarnik effect shows that the brain keeps unfinished tasks in working memory, creating low-level background stress. Completing a task — actually finishing something — produces a disproportionately large psychological reward. For guitar learners who have 'started guitar' multiple times and never finished, the experience of completion is transformative.",
      "A single, specific, achievable goal also eliminates decision fatigue. When the goal is clear, every daily session has an obvious answer to the question: what should I practise today? You do not need to choose between techniques, styles, or songs. The path is already decided.",
    ],
    callout: {
      label: 'In this course',
      text: 'The goal is stated on Day 1 and repeated every day: play a complete blues-rock solo from memory. Every single lesson is a step toward that one goal, nothing else. On Day 30, you achieve it.',
    },
  },
  {
    id: 'habit-formation',
    number: '06',
    heading: 'Daily Habit Formation',
    body: [
      "BJ Fogg's research at Stanford and James Clear's analysis of habit loops agree on a core principle: consistency beats intensity. A 20-minute daily practice session builds a faster, stronger neural pathway than a 3-hour weekly binge. The brain consolidates motor memories during sleep — which is why you often play something better the next morning than you did the night before. Daily repetition means daily consolidation.",
      "Twenty to thirty minutes is also short enough to fit into almost any schedule without friction. The primary reason people quit guitar is not lack of ability or motivation — it is that the perceived effort required becomes too high relative to the immediate reward. A 20-minute session is achievable on a busy weeknight. A 2-hour session is not.",
      "The 30-day format also exploits what researchers call 'commitment and consistency' — once a person has committed to a 30-day programme and completed two weeks, the psychological cost of stopping becomes higher than the cost of continuing. Momentum is a real, measurable cognitive phenomenon.",
    ],
    callout: {
      label: 'In this course',
      text: 'Every lesson is designed to be completed in 20–30 minutes. The practice calendar streak shows your consecutive days — a visual reinforcement of the habit chain you are building. Miss a day and the streak resets; keep going and it grows.',
    },
  },
]

export default function MethodologyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
        <Navbar />

        <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div style={{ marginBottom: '3.5rem' }}>
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
              The Method
            </p>
            <h1
              style={{
                color: '#ffffff',
                fontSize: 'clamp(1.875rem, 5vw, 2.75rem)',
                fontWeight: 900,
                letterSpacing: '0.05em',
                lineHeight: 1.1,
                marginBottom: '1rem',
              }}
            >
              The Science Behind 30-Day Guitar Learning
            </h1>
            <p
              style={{
                color: '#a3a3a3',
                fontSize: '1.125rem',
                lineHeight: 1.75,
              }}
            >
              This course is not built on intuition or tradition. Every decision —
              how long each session is, what order techniques appear in, when licks are
              reviewed — is based on what cognitive science and motor learning research
              say about how humans actually build lasting skills.
            </p>
          </div>

          {/* Table of contents */}
          <nav
            style={{
              backgroundColor: '#111111',
              border: '1px solid #1f1f1f',
              borderRadius: '0.75rem',
              padding: '1.25rem 1.5rem',
              marginBottom: '3.5rem',
            }}
          >
            <p
              style={{
                color: '#525252',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '0.875rem',
              }}
            >
              Contents
            </p>
            <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {SECTIONS.map((s) => (
                <li key={s.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span
                    style={{
                      color: '#f59e0b',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      fontVariantNumeric: 'tabular-nums',
                      width: '20px',
                      flexShrink: 0,
                    }}
                  >
                    {s.number}
                  </span>
                  <a
                    href={`#${s.id}`}
                    style={{
                      color: '#a3a3a3',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                    }}
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {SECTIONS.map((section, i) => (
              <section key={section.id} id={section.id}>
                {/* Section heading */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                  <span
                    style={{
                      color: '#f59e0b',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      marginTop: '6px',
                      flexShrink: 0,
                      opacity: 0.7,
                    }}
                  >
                    {section.number}
                  </span>
                  <h2
                    style={{
                      color: '#f59e0b',
                      fontSize: 'clamp(1.375rem, 3vw, 1.75rem)',
                      fontWeight: 900,
                      letterSpacing: '0.05em',
                      lineHeight: 1.15,
                      margin: 0,
                    }}
                  >
                    {section.heading}
                  </h2>
                </div>

                {/* Body paragraphs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem', marginBottom: '1.75rem' }}>
                  {section.body.map((para, pi) => (
                    <p
                      key={pi}
                      style={{
                        color: '#d4d4d4',
                        fontSize: '1rem',
                        lineHeight: 1.8,
                        margin: 0,
                      }}
                    >
                      {para}
                    </p>
                  ))}
                </div>

                {/* Callout box */}
                <div
                  style={{
                    backgroundColor: 'rgba(245,158,11,0.07)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    borderLeft: '3px solid #f59e0b',
                    borderRadius: '0 0.625rem 0.625rem 0',
                    padding: '1rem 1.25rem',
                  }}
                >
                  <p
                    style={{
                      color: '#f59e0b',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginBottom: '0.375rem',
                    }}
                  >
                    {section.callout.label}
                  </p>
                  <p style={{ color: '#e5e5e5', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
                    {section.callout.text}
                  </p>
                </div>

                {/* Divider (not after last) */}
                {i < SECTIONS.length - 1 && (
                  <div
                    style={{
                      marginTop: '4rem',
                      height: '1px',
                      background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.15), transparent)',
                    }}
                  />
                )}
              </section>
            ))}
          </div>

          {/* Bottom CTA */}
          <div
            style={{
              marginTop: '4rem',
              textAlign: 'center',
              backgroundColor: '#111111',
              border: '1px solid #262626',
              borderRadius: '0.75rem',
              padding: '2.5rem 1.5rem',
            }}
          >
            <h3
              style={{
                color: '#ffffff',
                fontSize: '1.5rem',
                fontWeight: 900,
                letterSpacing: '0.05em',
                marginBottom: '0.75rem',
              }}
            >
              See the science in action
            </h3>
            <p style={{ color: '#a3a3a3', fontSize: '0.9375rem', marginBottom: '1.75rem', maxWidth: '380px', margin: '0 auto 1.75rem' }}>
              Every principle on this page is built into the 30-day curriculum. Try it and feel the difference.
            </p>
            <a
              href="/register"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000000',
                fontWeight: 900,
                fontSize: '0.9375rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
              }}
            >
              Start the 30-day course →
            </a>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
