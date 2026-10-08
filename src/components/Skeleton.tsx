interface SkeletonProps {
  width?: string | number
  height?: string | number
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  className?: string
}

export function Skeleton({ width = '100%', height = 16, rounded = 'md', className }: SkeletonProps) {
  const radiusMap = { sm: 4, md: 6, lg: 8, full: 9999 }
  return (
    <>
      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .skeleton { background: linear-gradient(90deg, #161616 25%, #1f1f1f 50%, #161616 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
      `}</style>
      <div
        className={`skeleton ${className ?? ''}`}
        style={{ width, height, borderRadius: radiusMap[rounded] }}
        aria-hidden="true"
      />
    </>
  )
}

// Compound variants
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} height={14} />
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: 12, padding: 20 }}>
      <Skeleton width={48} height={48} rounded="lg" />
      <div style={{ marginTop: 12 }}>
        <Skeleton width="70%" height={20} />
        <div style={{ marginTop: 8 }}>
          <SkeletonText lines={2} />
        </div>
      </div>
    </div>
  )
}
