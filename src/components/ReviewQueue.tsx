'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DueReview {
  day: number
  title: string
  nextReviewAt: string
  reviewCount: number
}

interface ReviewQueueData {
  due: DueReview[]
  nextReviewDays: number | null
}

export default function ReviewQueue() {
  const [data, setData] = useState<ReviewQueueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    fetch('/api/review')
      .then((r) => r.json())
      .then((d: ReviewQueueData) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div
      style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
      className="rounded-xl p-5 mb-6"
    >
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex justify-between items-center"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: '#f59e0b', fontSize: '1rem' }}>&#9654;</span>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">
            Review Queue
          </h3>
          {!loading && data && data.due.length > 0 && (
            <span
              style={{
                backgroundColor: '#f59e0b',
                color: '#000',
                fontSize: '0.65rem',
                fontWeight: 900,
              }}
              className="px-1.5 py-0.5 rounded"
            >
              {data.due.length} due
            </span>
          )}
        </div>
        <span style={{ color: '#525252', fontSize: '0.75rem' }}>
          {collapsed ? '+ Expand' : '- Collapse'}
        </span>
      </button>

      {!collapsed && (
        <div className="mt-4">
          {loading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  style={{ backgroundColor: '#1a1a1a', height: 40 }}
                  className="rounded animate-pulse"
                />
              ))}
            </div>
          ) : !data || data.due.length === 0 ? (
            <div>
              <p className="text-sm" style={{ color: '#22c55e' }}>
                &#10003; All caught up! No reviews due today.
              </p>
              {data?.nextReviewDays != null && (
                <p className="text-xs mt-1" style={{ color: '#525252' }}>
                  Next review: in {data.nextReviewDays} day
                  {data.nextReviewDays !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {data.due.map((item) => (
                <div
                  key={item.day}
                  style={{ backgroundColor: '#1a1000', border: '1px solid #3d2700' }}
                  className="rounded-lg px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white text-sm font-medium">
                      Day {item.day}: {item.title}
                    </p>
                    <p style={{ color: '#a3a3a3' }} className="text-xs">
                      Due for review &middot; Reviewed {item.reviewCount}&#215; before
                    </p>
                  </div>
                  <Link
                    href={`/lesson/${item.day}`}
                    style={{
                      backgroundColor: '#f59e0b',
                      color: '#000',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                    className="px-3 py-1.5 rounded whitespace-nowrap hover:opacity-90 transition-opacity"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
