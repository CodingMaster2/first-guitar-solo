interface NotePosition {
  string: number
  fret: number
  finger?: number
  label?: string
  color?: string
}

interface FretboardDiagramProps {
  title?: string
  /** Finger/note positions to render. */
  positions?: NotePosition[]
  /** Alias for `positions` — accepted for backwards compatibility. */
  notes?: NotePosition[]
  startFret?: number
  fretCount?: number
  strings?: number
}

export default function FretboardDiagram({
  title,
  positions,
  notes,
  startFret = 1,
  fretCount = 5,
  strings = 6,
}: FretboardDiagramProps) {
  const resolvedPositions: NotePosition[] = positions ?? notes ?? []
  const WIDTH = 120
  const FRET_HEIGHT = 24
  const NUT_HEIGHT = startFret === 1 ? 6 : 3
  const TOP_MARGIN = 40 // space above nut for open/muted markers
  const LEFT_MARGIN = 20 // space for fret numbers
  const RIGHT_MARGIN = 10
  const HEIGHT = TOP_MARGIN + NUT_HEIGHT + fretCount * FRET_HEIGHT + 8

  const innerWidth = WIDTH - LEFT_MARGIN - RIGHT_MARGIN
  const stringSpacing = strings > 1 ? innerWidth / (strings - 1) : innerWidth

  // string 6 (low E) = leftmost, string 1 (high e) = rightmost
  const stringX = (s: number) => LEFT_MARGIN + (strings - s) * stringSpacing

  // fret row y: startFret row top = TOP_MARGIN + NUT_HEIGHT
  const fretY = (f: number) => TOP_MARGIN + NUT_HEIGHT + (f - startFret) * FRET_HEIGHT

  // center of a fret cell
  const dotY = (f: number) => fretY(f) + FRET_HEIGHT / 2

  // Separate open vs fretted positions
  const frettedPositions = resolvedPositions.filter((p) => p.fret > 0)
  const openStrings = new Set(resolvedPositions.filter((p) => p.fret === 0).map((p) => p.string))
  const mutedStrings = new Set<number>()

  // Any string not in resolvedPositions at all that we want to show as muted — only if no position on that string
  const allStringsWithPositions = new Set(resolvedPositions.map((p) => p.string))

  return (
    <figure style={{ display: 'inline-block', textAlign: 'center', margin: 0 }}>
      {title && (
        <figcaption
          style={{
            fontSize: '0.75rem',
            color: '#a3a3a3',
            marginBottom: 4,
            fontWeight: 600,
          }}
        >
          {title}
        </figcaption>
      )}
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ display: 'block' }}
        aria-label={title ?? 'Fretboard diagram'}
        role="img"
      >
        {/* Fret number labels on the left */}
        {Array.from({ length: fretCount }, (_, i) => {
          const fretNum = startFret + i
          return (
            <text
              key={fretNum}
              x={LEFT_MARGIN - 4}
              y={fretY(fretNum) + FRET_HEIGHT / 2 + 4}
              textAnchor="end"
              fontSize="9"
              fill="#6b7280"
              fontFamily="monospace"
            >
              {fretNum}
            </text>
          )
        })}

        {/* Nut (thick bar when startFret === 1) */}
        <rect
          x={LEFT_MARGIN}
          y={TOP_MARGIN}
          width={innerWidth}
          height={NUT_HEIGHT}
          fill={startFret === 1 ? '#e5e7eb' : '#374151'}
        />

        {/* Fret lines */}
        {Array.from({ length: fretCount + 1 }, (_, i) => {
          const y = TOP_MARGIN + NUT_HEIGHT + i * FRET_HEIGHT
          return (
            <line
              key={i}
              x1={LEFT_MARGIN}
              y1={y}
              x2={LEFT_MARGIN + innerWidth}
              y2={y}
              stroke="#374151"
              strokeWidth={1}
            />
          )
        })}

        {/* String lines */}
        {Array.from({ length: strings }, (_, i) => {
          const s = i + 1
          const x = stringX(s)
          return (
            <line
              key={s}
              x1={x}
              y1={TOP_MARGIN}
              x2={x}
              y2={TOP_MARGIN + NUT_HEIGHT + fretCount * FRET_HEIGHT}
              stroke="#6b7280"
              strokeWidth={s <= 3 ? 1 : s === 4 ? 1.5 : s === 5 ? 2 : 2.5}
            />
          )
        })}

        {/* Open string circles above nut */}
        {Array.from({ length: strings }, (_, i) => {
          const s = i + 1
          const x = stringX(s)
          if (openStrings.has(s)) {
            return (
              <circle
                key={`open-${s}`}
                cx={x}
                cy={TOP_MARGIN - 10}
                r={5}
                fill="none"
                stroke="#f59e0b"
                strokeWidth={1.5}
              />
            )
          }
          void mutedStrings
          void allStringsWithPositions
          return null
        })}

        {/* Finger position dots */}
        {frettedPositions.map((pos, idx) => {
          const x = stringX(pos.string)
          const y = dotY(pos.fret)
          const hasLabel = pos.finger !== undefined || pos.label !== undefined
          const labelText = pos.finger !== undefined ? String(pos.finger) : pos.label ?? ''
          return (
            <g key={idx}>
              <circle cx={x} cy={y} r={9} fill={pos.color ?? '#f59e0b'} />
              {hasLabel && (
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="700"
                  fill="#000"
                  fontFamily="sans-serif"
                >
                  {labelText}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
