export default function DashboardLoading() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', padding: '24px 16px' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .skeleton { animation: pulse 1.5s ease-in-out infinite; }
      `}</style>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
          maxWidth: '1200px',
          margin: '0 auto 32px',
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              backgroundColor: '#1a1a1a',
              borderRadius: 8,
              height: '96px',
            }}
          />
        ))}
      </div>

      {/* Two-column cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              backgroundColor: '#1a1a1a',
              borderRadius: 8,
              height: '200px',
            }}
          />
        ))}
      </div>
    </div>
  )
}
