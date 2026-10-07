import type React from 'react'

interface GuitarIllustrationProps {
  className?: string
  style?: React.CSSProperties
}

const FRET_POSITIONS = [100, 116, 131, 145, 158, 169, 179, 188, 197, 205, 212, 219]

const SINGLE_MARKERS: Array<{ fret: number; y: number }> = [
  { fret: 3, y: 138 },
  { fret: 5, y: 164 },
  { fret: 7, y: 184 },
  { fret: 9, y: 201 },
]

const STRINGS: Array<{ x: number; strokeWidth: number }> = [
  { x: 127, strokeWidth: 0.5 },
  { x: 132, strokeWidth: 0.7 },
  { x: 137, strokeWidth: 0.9 },
  { x: 143, strokeWidth: 1.1 },
  { x: 148, strokeWidth: 1.5 },
  { x: 153, strokeWidth: 2.0 },
]

const KNOBS: Array<{ cx: number; cy: number; r: number }> = [
  { cx: 172, cy: 432, r: 8 },
  { cx: 186, cy: 448, r: 7 },
  { cx: 172, cy: 463, r: 7 },
]

const amber = '#f59e0b'
const SW = 1.5

export default function GuitarIllustration({ className, style }: GuitarIllustrationProps) {
  return (
    <div
      className={`animate-float${className ? ` ${className}` : ''}`}
      style={{ filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.3))', ...style }}
    >
      <svg
        viewBox="0 0 280 600"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* ── Headstock ── */}
        <rect
          x="106" y="12" width="68" height="70" rx="8"
          fill="rgba(245,158,11,0.05)"
          stroke={amber}
          strokeWidth={SW}
        />

        {/* Tuner pegs — left */}
        {[22, 42, 62].map((cy) => (
          <g key={`tl-${cy}`}>
            <line x1="106" y1={cy} x2="114" y2={cy} stroke={amber} strokeWidth={1} opacity={0.5} />
            <circle cx="108" cy={cy} r="5.5" fill="rgba(245,158,11,0.1)" stroke={amber} strokeWidth={1} />
          </g>
        ))}

        {/* Tuner pegs — right */}
        {[22, 42, 62].map((cy) => (
          <g key={`tr-${cy}`}>
            <line x1="166" y1={cy} x2="174" y2={cy} stroke={amber} strokeWidth={1} opacity={0.5} />
            <circle cx="172" cy={cy} r="5.5" fill="rgba(245,158,11,0.1)" stroke={amber} strokeWidth={1} />
          </g>
        ))}

        {/* ── Nut ── */}
        <rect x="122" y="80" width="36" height="5" rx="1" fill={amber} opacity={0.8} />

        {/* ── Neck ── */}
        <rect
          x="122" y="85" width="36" height="210"
          fill="rgba(245,158,11,0.03)"
          stroke={amber}
          strokeWidth={SW}
        />

        {/* ── Frets ── */}
        {FRET_POSITIONS.map((y, i) => (
          <line
            key={`fret-${i}`}
            x1="122" y1={y} x2="158" y2={y}
            stroke={amber}
            strokeWidth={i === 0 ? 2 : 0.8}
            opacity={0.6}
          />
        ))}

        {/* ── Fret markers — single dots ── */}
        {SINGLE_MARKERS.map(({ fret, y }) => (
          <circle key={`marker-${fret}`} cx="140" cy={y} r="2.5" fill={amber} opacity={0.55} />
        ))}

        {/* ── Fret 12 — double dot ── */}
        <circle cx="133" cy="215" r="2.2" fill={amber} opacity={0.55} />
        <circle cx="147" cy="215" r="2.2" fill={amber} opacity={0.55} />

        {/* ── Guitar Body — double-cutaway Strat style ── */}
        <path
          d={`
            M 140 510
            C 112 510 62 498 42 470
            C 26 448 26 420 36 398
            C 48 374 66 362 70 344
            C 74 326 72 310 66 298
            C 60 286 50 280 46 268
            C 40 254 44 240 56 236
            C 70 232 86 244 94 260
            C 102 276 104 294 108 310
            C 112 322 120 328 122 328
            L 122 295
            L 158 295
            L 158 328
            C 160 328 168 322 172 310
            C 176 294 178 276 186 260
            C 194 244 210 232 224 236
            C 236 240 240 254 234 268
            C 230 280 220 286 214 298
            C 208 310 206 326 210 344
            C 214 362 232 374 244 398
            C 254 420 254 448 238 470
            C 218 498 168 510 140 510
            Z
          `}
          fill="rgba(245,158,11,0.05)"
          stroke={amber}
          strokeWidth={SW}
        />

        {/* ── Pickguard ── */}
        <path
          d={`
            M 122 295
            L 122 398
            C 122 404 118 410 110 416
            C 102 422 94 424 88 422
            C 76 418 68 408 68 396
            L 68 368
            C 68 352 74 338 84 326
            C 92 316 104 310 112 303
            C 118 298 122 296 122 295
            Z
          `}
          fill="rgba(245,158,11,0.04)"
          stroke={amber}
          strokeWidth={0.8}
          opacity={0.6}
        />

        {/* ── Pickups ── */}
        <rect
          x="116" y="345" width="48" height="20" rx="3"
          fill="rgba(245,158,11,0.08)"
          stroke={amber}
          strokeWidth={1.2}
        />
        <rect
          x="116" y="382" width="48" height="20" rx="3"
          fill="rgba(245,158,11,0.08)"
          stroke={amber}
          strokeWidth={1.2}
        />

        {/* ── Bridge ── */}
        <rect
          x="126" y="420" width="28" height="10" rx="2"
          fill="rgba(245,158,11,0.12)"
          stroke={amber}
          strokeWidth={1.2}
        />

        {/* ── Volume/Tone knobs ── */}
        {KNOBS.map(({ cx, cy, r }, i) => (
          <circle
            key={`knob-${i}`}
            cx={cx} cy={cy} r={r}
            fill="rgba(245,158,11,0.1)"
            stroke={amber}
            strokeWidth={1}
          />
        ))}

        {/* ── Strings ── */}
        {STRINGS.map(({ x, strokeWidth }, i) => (
          <line
            key={`string-${i}`}
            x1={x} y1="85" x2={x} y2="430"
            stroke={amber}
            strokeWidth={strokeWidth}
            opacity={0.4}
          />
        ))}
      </svg>
    </div>
  )
}
