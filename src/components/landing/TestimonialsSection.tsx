const TESTIMONIALS = [
  {
    quote:
      "Finally broke through the plateau I'd been stuck at for 2 years.",
    name: 'Alex M.',
    bio: '3 years playing',
  },
  {
    quote:
      "The AI coach answered questions my local teacher never thought to explain.",
    name: 'Sarah K.',
    bio: 'Beginner',
  },
  {
    quote:
      "Played the solo for my friends on week 5. They couldn't believe it.",
    name: 'James T.',
    bio: 'Intermediate',
  },
]

export default function TestimonialsSection() {
  return (
    <section
      style={{ backgroundColor: '#0a0a0a' }}
      className="py-24 px-4 sm:px-6 lg:px-8"
      role="region"
      aria-label="Student testimonials"
    >
      <div className="max-w-5xl mx-auto">
        <p
          style={{ color: '#f59e0b' }}
          className="text-xs font-bold uppercase tracking-widest mb-3"
        >
          WHAT STUDENTS SAY
        </p>
        <h2
          style={{
            color: '#ffffff',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            letterSpacing: '0.05em',
            marginBottom: '4rem',
          }}
        >
          Real guitarists. Real progress.
        </h2>

        <div className="grid sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="card-hover"
              style={{
                backgroundColor: '#111111',
                border: '1px solid #262626',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Stars */}
              <div
                style={{
                  color: '#f59e0b',
                  fontSize: '0.875rem',
                  letterSpacing: '0.1em',
                  marginBottom: '1rem',
                }}
                aria-label="5 out of 5 stars"
              >
                ★★★★★
              </div>

              <p
                style={{
                  color: '#e5e5e5',
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  marginBottom: '1.5rem',
                  flexGrow: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              <div>
                <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.875rem' }}>
                  {t.name}
                </p>
                <p style={{ color: '#525252', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {t.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
