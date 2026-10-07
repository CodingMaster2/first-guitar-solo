export default function DashboardLoading() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', padding: '24px 16px' }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        .skel { animation: pulse 1.5s ease-in-out infinite; border-radius: 8px; background: #1a1a1a; }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Greeting bar */}
        <div
          className="skel"
          style={{ height: '32px', width: '40%', marginBottom: '32px' }}
        />

        {/* 4 stat boxes */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skel" style={{ height: '96px' }} />
          ))}
        </div>

        {/* Two large panels side by side */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {[0, 1].map((i) => (
            <div key={i} className="skel" style={{ height: '280px' }} />
          ))}
        </div>
      </div>
    </div>
  )
}
