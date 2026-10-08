import { Skeleton, SkeletonCard } from '@/components/Skeleton'

export default function DashboardLoading() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      {/* Navbar skeleton */}
      <div style={{ height: 64, backgroundColor: 'rgba(10,10,10,0.85)', borderBottom: '1px solid rgba(255,255,255,0.06)' }} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* XP bar skeleton */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <Skeleton width="40%" height={28} />
          <div style={{ marginTop: 16 }}>
            <Skeleton height={8} rounded="full" />
          </div>
          <div className="grid grid-cols-3 gap-4" style={{ marginTop: 16 }}>
            <Skeleton height={64} rounded="lg" />
            <Skeleton height={64} rounded="lg" />
            <Skeleton height={64} rounded="lg" />
          </div>
        </div>
        {/* Cards grid skeleton */}
        <div className="grid md:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  )
}
