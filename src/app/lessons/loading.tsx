export default function LessonsLoading() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', padding: '24px 16px' }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        .skel { animation: pulse 1.5s ease-in-out infinite; border-radius: 8px; background: #1a1a1a; }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Heading */}
        <div className="skel" style={{ height: '40px', width: '200px', marginBottom: '32px' }} />

        {/* Grid of 6 lesson cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skel" style={{ height: '140px' }} />
          ))}
        </div>
      </div>
    </div>
  )
}
