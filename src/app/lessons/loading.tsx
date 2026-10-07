export default function LessonsLoading() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', padding: '24px 16px' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .skeleton { animation: pulse 1.5s ease-in-out infinite; }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Heading */}
        <div
          className="skeleton"
          style={{
            backgroundColor: '#1a1a1a',
            borderRadius: 8,
            height: '40px',
            width: '200px',
            marginBottom: '32px',
          }}
        />

        {/* 30-lesson grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
            gap: '12px',
          }}
        >
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{
                backgroundColor: '#1a1a1a',
                borderRadius: 8,
                aspectRatio: '1 / 1',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
