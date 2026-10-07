import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = { width: 1200, height: 630 }

export const contentType = 'image/png'

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#0a0a0a',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '60px 80px',
          borderLeft: '4px solid #f59e0b',
        }}
      >
        {/* Left side */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            First Guitar Solo
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#f59e0b',
              marginBottom: 24,
            }}
          >
            30 days. One complete solo.
          </div>
          <div
            style={{
              fontSize: 20,
              color: '#737373',
              marginBottom: 60,
            }}
          >
            AI Guitar Coach • Personalized Solo • $25 one-time
          </div>
          <div
            style={{
              fontSize: 16,
              color: '#525252',
            }}
          >
            Sixth String Labs
          </div>
        </div>

        {/* Right side */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 120,
            marginLeft: 60,
          }}
        >
          🎸
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
