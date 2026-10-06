'use client'

interface FretNote {
  string: number  // 1 = high e, 6 = low E
  fret: number
  label?: string
  color?: string
}

interface FretboardDiagramProps {
  notes?: FretNote[]
  title?: string
  startFret?: number
}

const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E']  // index 0 = high e (string 1)
const FRET_COUNT = 5  // frets 0 through 4 relative to startFret (fret 0 = nut/open)

const CELL_W = 44
const CELL_H = 28
const LEFT_PAD = 28  // space for string labels
const TOP_PAD = 22   // space for fret numbers
const NUT_W = 4
const DOT_R = 9

export default function FretboardDiagram({ notes = [], title, startFret = 0 }: FretboardDiagramProps) {
  const totalW = LEFT_PAD + NUT_W + FRET_COUNT * CELL_W + 4
  const totalH = TOP_PAD + 6 * CELL_H + 4

  // Map notes for quick lookup: key = `string-fret`
  const noteMap = new Map<string, FretNote>()
  for (const n of notes) {
    noteMap.set(`${n.string}-${n.fret}`, n)
  }

  const strings = [1, 2, 3, 4, 5, 6]   // 1=high e … 6=low E
  const fretCols = Array.from({ length: FRET_COUNT }, (_, i) => i)  // 0..4 relative fret offsets

  const stringY = (s: number) => TOP_PAD + (s - 1) * CELL_H + CELL_H / 2
  const fretX = (col: number) => LEFT_PAD + NUT_W + col * CELL_W + CELL_W / 2

  return (
    <div style={{ backgroundColor: '#111111', border: '1px solid #262626', borderRadius: '0.75rem', padding: '1rem', display: 'inline-block' }}>
      {title && (
        <p style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-wider mb-3">
          {title}
        </p>
      )}
      <svg
        width={totalW}
        height={totalH}
        style={{ display: 'block', overflow: 'visible' }}
        aria-label={title ?? 'Fretboard diagram'}
      >
        {/* Fret number labels across top */}
        {fretCols.map((col) => {
          const absF = startFret + col
          return (
            <text
              key={`fn-${col}`}
              x={fretX(col)}
              y={TOP_PAD - 6}
              textAnchor="middle"
              fill="#525252"
              fontSize={10}
              fontFamily="monospace"
            >
              {absF === 0 ? 'O' : absF}
            </text>
          )
        })}

        {/* String name labels on left */}
        {strings.map((s) => (
          <text
            key={`sn-${s}`}
            x={LEFT_PAD - 6}
            y={stringY(s) + 4}
            textAnchor="end"
            fill="#525252"
            fontSize={10}
            fontFamily="monospace"
          >
            {STRING_NAMES[s - 1]}
          </text>
        ))}

        {/* Nut */}
        <rect
          x={LEFT_PAD}
          y={TOP_PAD}
          width={NUT_W}
          height={6 * CELL_H}
          fill={startFret === 0 ? '#d4d4d4' : '#404040'}
          rx={1}
        />

        {/* Fret lines (vertical) */}
        {Array.from({ length: FRET_COUNT + 1 }, (_, i) => i).map((i) => (
          <line
            key={`fl-${i}`}
            x1={LEFT_PAD + NUT_W + i * CELL_W}
            y1={TOP_PAD}
            x2={LEFT_PAD + NUT_W + i * CELL_W}
            y2={TOP_PAD + 6 * CELL_H}
            stroke="#262626"
            strokeWidth={1}
          />
        ))}

        {/* String lines (horizontal) */}
        {strings.map((s) => {
          const thickness = 0.5 + (s - 1) * 0.25
          return (
            <line
              key={`sl-${s}`}
              x1={LEFT_PAD}
              y1={stringY(s)}
              x2={LEFT_PAD + NUT_W + FRET_COUNT * CELL_W}
              y2={stringY(s)}
              stroke="#404040"
              strokeWidth={thickness}
            />
          )
        })}

        {/* Notes */}
        {strings.map((s) =>
          fretCols.map((col) => {
            const absF = startFret + col
            const note = noteMap.get(`${s}-${absF}`)
            if (!note) return null
            const cx = fretX(col)
            const cy = stringY(s)
            const dotColor = note.color ?? '#f59e0b'
            return (
              <g key={`note-${s}-${absF}`}>
                <circle cx={cx} cy={cy} r={DOT_R} fill={dotColor} />
                {note.label && (
                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    fill="#000"
                    fontSize={9}
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {note.label}
                  </text>
                )}
              </g>
            )
          })
        )}

        {/* Open string indicators (fret 0) */}
        {startFret === 0 && strings.map((s) => {
          const note = noteMap.get(`${s}-0`)
          if (note) return null  // already drawn above
          return null
        })}
      </svg>
      {startFret > 0 && (
        <p style={{ color: '#525252' }} className="text-xs mt-2">
          Fret {startFret} position
        </p>
      )}
    </div>
  )
}
