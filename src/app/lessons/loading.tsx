import { Skeleton } from '@/components/Skeleton'

export default function LessonsLoading() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      {/* Navbar skeleton */}
      <div style={{ height: 64, backgroundColor: 'rgba(10,10,10,0.85)', borderBottom: '1px solid rgba(255,255,255,0.06)' }} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Heading */}
        <div style={{ marginBottom: 32 }}>
          <Skeleton width={200} height={40} />
        </div>

        {/* 3 rows of 10 day-card skeletons */}
        {[0, 1, 2].map((row) => (
          <div key={row} style={{ marginBottom: 32 }}>
            {/* Week heading */}
            <div style={{ marginBottom: 12 }}>
              <Skeleton width={120} height={18} />
            </div>
            {/* Day cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
                gap: 10,
              }}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <Skeleton key={i} height={80} rounded="lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
