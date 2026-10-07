const STEPS = [
  {
    num: '01',
    title: 'Sign Up',
    desc: 'Create an account, answer 5 questions about your playing level. Done in 60 seconds.',
    icon: '🎸',
  },
  {
    num: '02',
    title: 'Follow the Curriculum',
    desc: '30 structured lessons, each with exercises, AI coaching, and a progress check. 15–20 min/day.',
    icon: '📖',
  },
  {
    num: '03',
    title: 'Play Your Solo',
    desc: 'On Day 30, generate your AI-personalized 8-bar solo based on your style and guitar hero.',
    icon: '🎯',
  },
]

function StepCard({ step }: { step: (typeof STEPS)[0] }) {
  return (
    <div
      style={{
        backgroundColor: '#111111',
        border: '1px solid #1f1f1f',
        borderRadius: '0.75rem',
        padding: '2rem',
        height: '100%',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #f59e0b, #fde68a)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '3.5rem',
          fontFamily: "'Bebas Neue', sans-serif",
          letterSpacing: '0.05em',
          lineHeight: 1,
          marginBottom: '1rem',
        }}
      >
        {step.num}
      </div>
      <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{step.icon}</div>
      <h3
        style={{
          color: '#ffffff',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.5rem',
          letterSpacing: '0.05em',
          marginBottom: '0.75rem',
        }}
      >
        {step.title}
      </h3>
      <p style={{ color: '#a3a3a3', fontSize: '0.875rem', lineHeight: 1.65 }}>{step.desc}</p>
    </div>
  )
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{ backgroundColor: '#0a0a0a' }}
      className="py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto">
        <p
          style={{ color: '#f59e0b' }}
          className="text-xs font-bold uppercase tracking-widest mb-3"
        >
          THE PROCESS
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
          Three steps. Thirty days. One solo.
        </h2>

        {/* Desktop: steps with connectors */}
        <div
          className="hidden sm:grid"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}
        >
          {STEPS.map((step, i) => (
            <div key={step.num} style={{ position: 'relative' }}>
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    right: '-1.25rem',
                    top: '3.25rem',
                    color: '#f59e0b',
                    opacity: 0.4,
                    fontSize: '1.5rem',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                  aria-hidden="true"
                >
                  →
                </div>
              )}
              <StepCard step={step} />
            </div>
          ))}
        </div>

        {/* Mobile: stacked */}
        <div className="sm:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {STEPS.map((step) => (
            <StepCard key={step.num} step={step} />
          ))}
        </div>
      </div>
    </section>
  )
}
