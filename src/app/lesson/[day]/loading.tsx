export default function LessonLoading() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', padding: '24px 16px' }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        .skel { animation: pulse 1.5s ease-in-out infinite; border-radius: 8px; background: #1a1a1a; }
      `}</style>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Day number area */}
        <div className="skel" style={{ height: '80px', width: '100%', marginBottom: '24px' }} />

        {/* 3 tab buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="skel" style={{ height: '40px', width: '100px' }} />
          ))}
        </div>

        {/* Large content block */}
        <div className="skel" style={{ height: '400px', width: '100%' }} />
      </div>
    </div>
  )
}
