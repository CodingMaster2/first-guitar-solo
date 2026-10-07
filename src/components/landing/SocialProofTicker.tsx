const TICKER_ITEMS = [
  {
    action: '🎸 Sarah just completed Day 15',
    quote: "'The bending lesson finally clicked!'",
  },
  {
    action: '🎸 Mike completed the course',
    quote: "'Played the full solo for my band!'",
  },
  {
    action: '🎸 Jake is on Day 8',
    quote: "'Best $25 I've spent on guitar'",
  },
  {
    action: '🎸 Emma completed Day 22',
    quote: "'The AI coach is insanely helpful'",
  },
  {
    action: '🎸 Tom just graduated',
    quote: "'I can actually shred now'",
  },
]

export default function SocialProofTicker() {
  return (
    <div
      style={{
        backgroundColor: '#0d0d0d',
        borderTop: '1px solid rgba(245,158,11,0.15)',
        borderBottom: '1px solid rgba(245,158,11,0.15)',
        overflow: 'hidden',
        padding: '12px 0',
      }}
    >
      <div
        className="marquee-inner"
        style={{ display: 'flex', whiteSpace: 'nowrap', width: 'max-content' }}
      >
        {[0, 1].map((pass) => (
          <div key={pass} style={{ display: 'flex' }}>
            {TICKER_ITEMS.map((item, j) => (
              <span
                key={j}
                style={{
                  padding: '0 2.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                }}
              >
                <span style={{ color: '#f59e0b' }}>{item.action}</span>
                <span style={{ color: '#404040' }}>·</span>
                <span style={{ color: '#d4d4d4' }}>{item.quote}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
