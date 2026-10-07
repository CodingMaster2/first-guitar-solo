type CellVal = boolean | string

const COLS = ['First Guitar Solo', 'Fender Play', 'Yousician'] as const

const ROWS: [string, CellVal, CellVal, CellVal][] = [
  ['Price', '$25 one-time', '$10/mo ($120/yr)', '$10/mo ($120/yr)'],
  ['Yours forever', true, false, false],
  ['AI Guitar Coach', true, false, false],
  ['Personalized Solo', true, false, false],
  ['Focused curriculum', '30 days, 1 goal', '1,000+ random songs', 'Gamified drills'],
  ['Science-backed', true, false, false],
]

function Cell({ val, isHighlighted }: { val: CellVal; isHighlighted: boolean }) {
  if (typeof val === 'boolean') {
    return val ? (
      <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '1rem' }}>✓</span>
    ) : (
      <span style={{ color: '#404040', fontSize: '1rem' }}>✗</span>
    )
  }
  return (
    <span
      style={{
        color: isHighlighted ? '#ffffff' : '#6b7280',
        fontWeight: isHighlighted ? 600 : 400,
        fontSize: '0.8125rem',
      }}
    >
      {val}
    </span>
  )
}

export default function ComparisonTable() {
  return (
    <section
      style={{
        backgroundColor: '#111111',
        borderTop: '1px solid #1f1f1f',
        borderBottom: '1px solid #1f1f1f',
      }}
      className="py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto">
        <p
          style={{ color: '#f59e0b' }}
          className="text-xs font-bold uppercase tracking-widest mb-3"
        >
          THE VALUE
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
          One payment. No subscriptions.
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
            <thead>
              <tr>
                <th
                  style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    borderBottom: '1px solid #262626',
                    width: '30%',
                  }}
                />
                {COLS.map((col, i) => (
                  <th
                    key={col}
                    style={{
                      padding: '0.875rem 1rem',
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      fontWeight: i === 0 ? 900 : 600,
                      color: i === 0 ? '#000000' : '#a3a3a3',
                      backgroundColor: i === 0 ? '#f59e0b' : 'transparent',
                      borderTop: i === 0 ? '1px solid #f59e0b' : 'none',
                      borderLeft: i === 0 ? '1px solid #f59e0b' : 'none',
                      borderRight: i === 0 ? '1px solid #f59e0b' : 'none',
                      borderBottom: i === 0 ? 'none' : '1px solid #262626',
                      borderRadius: i === 0 ? '0.5rem 0.5rem 0 0' : undefined,
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, a, b, c], rowIdx) => {
                const vals: CellVal[] = [a, b, c]
                return (
                  <tr
                    key={rowIdx}
                    style={{ borderBottom: '1px solid #1a1a1a' }}
                  >
                    <td
                      style={{
                        padding: '0.875rem 1rem',
                        color: '#a3a3a3',
                        fontSize: '0.875rem',
                      }}
                    >
                      {label}
                    </td>
                    {vals.map((val, colIdx) => (
                      <td
                        key={colIdx}
                        style={{
                          padding: '0.875rem 1rem',
                          textAlign: 'center',
                          backgroundColor:
                            colIdx === 0 ? 'rgba(245,158,11,0.04)' : 'transparent',
                          borderLeft:
                            colIdx === 0 ? '1px solid rgba(245,158,11,0.2)' : 'none',
                          borderRight:
                            colIdx === 0 ? '1px solid rgba(245,158,11,0.2)' : 'none',
                        }}
                      >
                        <Cell val={val} isHighlighted={colIdx === 0} />
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td />
                <td
                  style={{
                    borderBottom: '1px solid #f59e0b',
                    borderLeft: '1px solid rgba(245,158,11,0.2)',
                    borderRight: '1px solid rgba(245,158,11,0.2)',
                    borderRadius: '0 0 0.5rem 0.5rem',
                    backgroundColor: 'rgba(245,158,11,0.04)',
                    padding: '0.5rem',
                  }}
                />
                <td />
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  )
}
