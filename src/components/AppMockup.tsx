const NAV_ITEMS = ['Lessons', 'Progress', 'Coach']

const STATS: Array<{ label: string; value: string }> = [
  { label: 'Current Day', value: '12' },
  { label: 'Total XP', value: '2,450' },
  { label: 'Streak', value: '7 days 🔥' },
  { label: 'Completed', value: '11/30' },
]

const TRAFFIC_DOTS = ['#ff5f57', '#febc2e', '#28c840']

export default function AppMockup() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 600,
        aspectRatio: '16/10',
        background: '#0d0d0d',
        border: '1px solid #2a2a2a',
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ── Browser address bar ── */}
      <div
        style={{
          flexShrink: 0,
          background: '#1a1a1a',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: '1px solid #2a2a2a',
        }}
      >
        {/* Traffic-light dots */}
        <div style={{ display: 'flex', gap: 5 }}>
          {TRAFFIC_DOTS.map((color) => (
            <div
              key={color}
              style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color }}
            />
          ))}
        </div>

        {/* URL bar */}
        <div
          style={{
            flex: 1,
            background: '#111111',
            border: '1px solid #333333',
            borderRadius: 5,
            padding: '3px 10px',
            fontSize: 10,
            color: '#737373',
            textAlign: 'center',
          }}
        >
          firstguitarsolo.com/dashboard
        </div>
      </div>

      {/* ── App shell ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* App nav bar */}
        <div
          style={{
            flexShrink: 0,
            background: '#111111',
            borderBottom: '1px solid #1f1f1f',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              color: '#f59e0b',
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            First Guitar Solo
          </span>
          <div style={{ display: 'flex', gap: 12 }}>
            {NAV_ITEMS.map((item) => (
              <span key={item} style={{ color: '#525252', fontSize: 9 }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard content */}
        <div
          style={{
            flex: 1,
            background: '#0a0a0a',
            padding: '12px 14px',
            display: 'flex',
            gap: 10,
            overflow: 'hidden',
          }}
        >
          {/* Left column — 2/3 */}
          <div
            style={{
              flex: '0 0 63%',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              overflow: 'hidden',
            }}
          >
            {/* Greeting */}
            <p style={{ color: '#e5e5e5', fontSize: 11, fontWeight: 700, margin: 0 }}>
              Good morning! Ready to practice? 🎸
            </p>

            {/* Today's Mission card */}
            <div
              style={{
                background: '#111111',
                border: '1px solid #1f1f1f',
                borderLeft: '3px solid #f59e0b',
                borderRadius: 6,
                padding: '8px 10px',
              }}
            >
              <p
                style={{
                  color: '#737373',
                  fontSize: 8,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  margin: '0 0 4px',
                }}
              >
                Today&apos;s Mission
              </p>
              <p style={{ color: '#ffffff', fontSize: 10, fontWeight: 700, margin: '0 0 6px' }}>
                Day 12: The Blues Scale
              </p>
              <div
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000000',
                  fontSize: 8,
                  fontWeight: 900,
                  padding: '3px 8px',
                  borderRadius: 4,
                }}
              >
                Start Lesson →
              </div>
            </div>

            {/* Stats grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 5,
              }}
            >
              {STATS.map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    background: '#111111',
                    border: '1px solid #1f1f1f',
                    borderRadius: 5,
                    padding: '5px 8px',
                  }}
                >
                  <p
                    style={{
                      color: '#525252',
                      fontSize: 7,
                      margin: '0 0 2px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {label}
                  </p>
                  <p style={{ color: '#f59e0b', fontSize: 11, fontWeight: 900, margin: 0 }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — AI Coach */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 7,
              overflow: 'hidden',
            }}
          >
            <p
              style={{
                color: '#737373',
                fontSize: 8,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: 0,
                flexShrink: 0,
              }}
            >
              AI Coach
            </p>

            {/* User message */}
            <div
              style={{
                background: '#1a1a1a',
                border: '1px solid #262626',
                borderRadius: '8px 8px 2px 8px',
                padding: '6px 8px',
                alignSelf: 'flex-end',
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  color: '#e5e5e5',
                  fontSize: 8.5,
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                How do I get my bends to sound better?
              </p>
            </div>

            {/* Coach response */}
            <div
              style={{
                background: '#0f1a00',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '8px 8px 8px 2px',
                padding: '6px 8px',
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  color: '#a3a3a3',
                  fontSize: 8,
                  margin: '0 0 4px',
                  lineHeight: 1.5,
                }}
              >
                Focus on using your ring finger supported by middle and index. Target the pitch above
                the starting note — aim for a full step up.
              </p>
              <p style={{ color: '#f59e0b', fontSize: 7.5, margin: 0 }}>AI Coach ✦</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
