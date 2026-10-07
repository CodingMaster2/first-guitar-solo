import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Best Guitar Gear for Beginners — Everything You Actually Need',
  description: 'A no-fluff guide to the guitars, amps, and accessories a beginner electric guitarist actually needs — plus what you can safely skip.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Best Beginner Guitar Gear',
  description: 'Top gear recommendations for beginner electric guitarists.',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Product',
        name: 'Squier Stratocaster',
        description: 'A Fender-owned budget line that delivers the classic Stratocaster look, feel, and versatile single-coil tone at a beginner price point.',
        offers: { '@type': 'Offer', priceSpecification: { '@type': 'PriceSpecification', price: 250, priceCurrency: 'USD' } },
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Product',
        name: 'Epiphone Les Paul Standard',
        description: 'Gibson\'s budget sister brand produces a Les Paul with humbuckers, warm tone, and iconic aesthetics at a beginner-accessible price.',
        offers: { '@type': 'Offer', priceSpecification: { '@type': 'PriceSpecification', price: 300, priceCurrency: 'USD' } },
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Product',
        name: 'Yamaha Pacifica 112V',
        description: 'Consistently praised for quality control and playability above its price point, with a humbucker-in-the-bridge configuration that covers rock tones easily.',
        offers: { '@type': 'Offer', priceSpecification: { '@type': 'PriceSpecification', price: 350, priceCurrency: 'USD' } },
      },
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: { '@type': 'Product', name: 'Fender Frontman 10G', description: 'A small, affordable solid-state practice amp.' },
    },
    {
      '@type': 'ListItem',
      position: 5,
      item: { '@type': 'Product', name: 'Boss Katana-Mini', description: 'A battery-powered mini amp with surprising tone variety for its size.' },
    },
    {
      '@type': 'ListItem',
      position: 6,
      item: { '@type': 'Product', name: 'Blackstar Fly 3', description: 'Stereo sound from a tiny package; headphone out makes it apartment-friendly.' },
    },
  ],
}

interface GearItemProps {
  name: string
  price: string
  badge?: string
  description: string
  href?: string
}

function GearCard({ name, price, badge, description, href = '#' }: GearItemProps) {
  return (
    <div
      style={{
        backgroundColor: '#111111',
        border: '1px solid #1f1f1f',
        borderRadius: 10,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>{name}</h3>
          <p style={{ fontSize: '0.875rem', color: '#f59e0b', fontWeight: 600, margin: '2px 0 0' }}>{price}</p>
        </div>
        {badge && (
          <span
            style={{
              backgroundColor: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.35)',
              color: '#f59e0b',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 999,
              whiteSpace: 'nowrap',
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <p style={{ fontSize: '0.875rem', color: '#a3a3a3', lineHeight: 1.65, margin: 0 }}>{description}</p>
      <a
        href={href}
        style={{
          display: 'inline-block',
          marginTop: 4,
          fontSize: '0.8rem',
          color: '#f59e0b',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Check current price →
      </a>
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: '1.35rem',
        fontWeight: 800,
        color: '#ffffff',
        borderBottom: '1px solid #1f1f1f',
        paddingBottom: 10,
        marginBottom: 24,
        marginTop: 0,
      }}
    >
      {children}
    </h2>
  )
}

export default function GearPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#e5e5e5' }}>
        <Navbar />

        <main id="main-content" style={{ maxWidth: 860, margin: '0 auto', padding: '48px 16px 80px' }}>
          {/* Back link */}
          <Link
            href="/lessons"
            style={{ color: '#a3a3a3', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}
          >
            ← Back to Learning
          </Link>

          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.25, marginBottom: 12 }}>
              Best Guitar Gear for Beginners
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#a3a3a3', lineHeight: 1.6 }}>
              Everything you actually need — and a frank list of what you do not. No affiliate-driven fluff, no $800 starter kits.
            </p>
          </div>

          {/* Section 1: Electric Guitars */}
          <section style={{ marginBottom: 48 }}>
            <SectionHeading>Your First Electric Guitar</SectionHeading>
            <p style={{ color: '#a3a3a3', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: 24 }}>
              Any of these three will see you through this course and well beyond. Buy the one that appeals to you visually — you will practice more on a guitar you think looks great.
            </p>
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              <GearCard
                name="Squier Stratocaster"
                price="~$250"
                badge="Best Value"
                description="Fender's budget line built in the same Stratocaster tradition. Single-coil pickups give you that bright, articulate tone ideal for blues-rock lead playing. The thinner neck profile is comfortable for beginners building chord and scale muscle memory."
              />
              <GearCard
                name="Epiphone Les Paul Standard"
                price="~$300"
                badge="Most Comfortable"
                description={'Gibson\'s sister brand delivers a genuine Les Paul experience — humbuckers for a warm, fat tone that works beautifully for rock bends and legato playing. The shorter scale length (24.75") requires slightly less fretting force, which new players often find comfortable.'}
              />
              <GearCard
                name="Yamaha Pacifica 112V"
                price="~$350"
                badge="Most Versatile"
                description="Yamaha's quality control at this price point is consistently excellent. The humbucker-single-single configuration covers everything from blues to classic rock. Widely regarded as the best-playing guitar under $400 — it often outplays guitars twice its price."
              />
            </div>
          </section>

          {/* Section 2: Amplifiers */}
          <section style={{ marginBottom: 48 }}>
            <SectionHeading>Amplifiers</SectionHeading>
            <p style={{ color: '#a3a3a3', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: 24 }}>
              Start small. A bedroom practice amp is all you need for the first year. The amp matters far less than your playing — work on that first.
            </p>
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              <GearCard
                name="Fender Frontman 10G"
                price="~$70"
                badge="Best Entry"
                description="Simple, reliable, and inexpensive — a clean tone with a basic overdrive channel. The 10-watt output is plenty loud for practicing at home. No frills, no confusion; exactly what a beginner needs to hear their playing clearly."
              />
              <GearCard
                name="Boss Katana-Mini"
                price="~$100"
                badge="Best Portability"
                description="Battery-powered and genuinely good-sounding for its size, the Katana-Mini has three onboard amp voicings including a crunch channel. Takes it wherever you practice — couch, bedroom, outdoors. Surprising tone depth from a 7-watt unit."
              />
              <GearCard
                name="Blackstar Fly 3"
                price="~$60"
                badge="Apartment-Friendly"
                description="The Fly 3 includes a dedicated ISF tone control and a tape delay effect — unusual at this price. A headphone output makes it ideal for apartment practicing at any hour. Stereo when paired with the optional Fly 3 Bass extension cabinet."
              />
            </div>
          </section>

          {/* Section 3: Accessories */}
          <section style={{ marginBottom: 48 }}>
            <SectionHeading>Essential Accessories</SectionHeading>
            <div
              style={{
                display: 'grid',
                gap: 12,
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              }}
            >
              {[
                {
                  name: 'Picks — Medium 0.73mm',
                  why: 'Medium picks are the standard starting point — flexible enough for strumming, stiff enough for single-note clarity. Dunlop Tortex 0.73mm (yellow) or Fender Medium are both excellent.',
                },
                {
                  name: 'Tuner — KLIQ UberTuner',
                  why: 'A clip-on tuner stays on the headstock and detects pitch through vibration, not a microphone. Accurate to ±0.5 cents. Always tune before practicing — intonation awareness starts day one.',
                },
                {
                  name: 'Capo — Kyser Quick-Change',
                  why: 'Spring-loaded capos attach and remove in one second. The Kyser is the industry standard for a reason — consistent clamping force, no string buzz, and lasts decades.',
                },
                {
                  name: 'Guitar Strap',
                  why: 'A strap lets you play standing up and keeps the guitar stable while seated. Lock-strap buttons (Dunlop Straploks) are a worthwhile upgrade to prevent the guitar from falling.',
                },
                {
                  name: 'Strings — D\'Addario EXL110',
                  why: '10–46 gauge nickel wound strings — the most popular gauge in rock and blues. Keep a fresh set on hand; new strings stay in tune better and ring more clearly than old ones.',
                },
                {
                  name: 'Guitar Stand',
                  why: 'Keeping the guitar on a stand instead of in its case means you will actually pick it up and practice. A $15 folding stand is one of the highest-ROI purchases you can make.',
                },
              ].map((item) => (
                <div
                  key={item.name}
                  style={{
                    backgroundColor: '#111111',
                    border: '1px solid #1f1f1f',
                    borderRadius: 8,
                    padding: '16px 18px',
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff', margin: '0 0 6px' }}>{item.name}</p>
                  <p style={{ fontSize: '0.8rem', color: '#a3a3a3', lineHeight: 1.6, margin: 0 }}>{item.why}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: What you don't need */}
          <section style={{ marginBottom: 48 }}>
            <SectionHeading>What You Do Not Need</SectionHeading>
            <div
              style={{
                backgroundColor: '#111111',
                border: '1px solid #262626',
                borderLeft: '3px solid #f59e0b',
                borderRadius: 8,
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <p style={{ color: '#d4d4d4', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>
                Gear shops and YouTube gear channels have a financial interest in you buying more. Here is what you can safely skip as a beginner:
              </p>
              {[
                {
                  item: 'Expensive pedals',
                  why: 'Effects pedals (reverb, delay, distortion) add color but mask your actual playing. Every weakness in your technique becomes invisible behind a wall of effects. Learn to play clean first — add effects when you can tell the difference they make.',
                },
                {
                  item: 'A big amp',
                  why: 'A 40-watt combo amp is completely unusable at home practice volumes without turning it down so far the tone suffers. Small amps sound better at low volumes. Stage volume comes later — when you have a stage.',
                },
                {
                  item: 'Multiple guitars',
                  why: 'Many beginners buy a second guitar thinking the new one will solve their progress problems. It will not. The guitar is not the limiting factor. Your practice time is. One good guitar is everything.',
                },
                {
                  item: 'Music theory books before playing',
                  why: 'Theory is most useful once you have something concrete to apply it to. Reading about intervals and modes before you can play a scale fluently is backwards. Learn to play first, understand why it works second.',
                },
              ].map(({ item, why }) => (
                <div key={item} style={{ borderTop: '1px solid #1f1f1f', paddingTop: 16 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff', margin: '0 0 4px' }}>{item}</p>
                  <p style={{ fontSize: '0.8rem', color: '#a3a3a3', lineHeight: 1.65, margin: 0 }}>{why}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Free tools */}
          <section style={{ marginBottom: 48 }}>
            <SectionHeading>Free Tools You Already Have</SectionHeading>
            <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              <div
                style={{
                  backgroundColor: '#111111',
                  border: '1px solid #262626',
                  borderRadius: 10,
                  padding: '20px 24px',
                }}
              >
                <p style={{ fontWeight: 700, fontSize: '1rem', color: '#f59e0b', margin: '0 0 6px' }}>
                  Built-in Chromatic Tuner
                </p>
                <p style={{ fontSize: '0.875rem', color: '#a3a3a3', lineHeight: 1.65, margin: '0 0 12px' }}>
                  A precision chromatic tuner is built into the Practice Room. No app download needed — open it on any device and tune instantly before every session.
                </p>
                <Link
                  href="/practice-room"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#f59e0b',
                    color: '#000000',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '7px 14px',
                    borderRadius: 6,
                    textDecoration: 'none',
                  }}
                >
                  Open Practice Room →
                </Link>
              </div>
              <div
                style={{
                  backgroundColor: '#111111',
                  border: '1px solid #262626',
                  borderRadius: 10,
                  padding: '20px 24px',
                }}
              >
                <p style={{ fontWeight: 700, fontSize: '1rem', color: '#f59e0b', margin: '0 0 6px' }}>
                  Built-in Metronome
                </p>
                <p style={{ fontSize: '0.875rem', color: '#a3a3a3', lineHeight: 1.65, margin: '0 0 12px' }}>
                  The metronome in the Practice Room runs from 30 to 250 BPM with tap-tempo. It is the most important practice tool you own — use it every single session.
                </p>
                <Link
                  href="/practice-room"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#f59e0b',
                    color: '#000000',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '7px 14px',
                    borderRadius: 6,
                    textDecoration: 'none',
                  }}
                >
                  Open Metronome →
                </Link>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <p
            style={{
              fontSize: '0.75rem',
              color: '#525252',
              lineHeight: 1.6,
              borderTop: '1px solid #1f1f1f',
              paddingTop: 20,
            }}
          >
            These are recommendations based on personal experience teaching beginner guitarists. Some links on this page may be affiliate links — if you purchase through them, we may receive a small commission at no extra cost to you. This does not influence which products we recommend.
          </p>
        </main>
      </div>
    </>
  )
}
