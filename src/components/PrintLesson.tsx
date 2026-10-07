'use client'

interface PrintLessonProps {
  day: number
  title: string
}

export default function PrintLesson({ day, title }: PrintLessonProps) {
  return (
    <>
      <style>{`
        @media print {
          nav, .mobile-bottom-nav, .back-to-top, .cmd-overlay,
          [data-no-print], .reading-progress-bar {
            display: none !important;
          }
          body { background: white !important; color: black !important; }
          a { color: black !important; text-decoration: none !important; }
          .print-header { display: block !important; }
        }
      `}</style>
      <div className="print-header" style={{ display: 'none' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 4px' }}>
          Day {day} — {title}
        </h1>
      </div>
      <button
        onClick={() => window.print()}
        style={{
          backgroundColor: '#1a1a1a',
          color: '#737373',
          border: '1px solid #1f1f1f',
          borderRadius: '6px',
          padding: '6px 12px',
          fontSize: '0.75rem',
          cursor: 'pointer',
          fontWeight: 500,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#262626'
          e.currentTarget.style.color = '#a3a3a3'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#1a1a1a'
          e.currentTarget.style.color = '#737373'
        }}
      >
        🖨️ Print
      </button>
    </>
  )
}
