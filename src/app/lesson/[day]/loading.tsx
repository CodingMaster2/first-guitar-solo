export default function LessonLoading() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', padding: '24px 16px' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .skeleton { animation: pulse 1.5s ease-in-out infinite; }
      `}</style>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Heading area */}
        <div
          className="skeleton"
          style={{
            backgroundColor: '#1a1a1a',
            borderRadius: 8,
            height: '36px',
            width: '60%',
            marginBottom: '8px',
          }}
        />
        <div
          className="skeleton"
          style={{
            backgroundColor: '#1a1a1a',
            borderRadius: 8,
            height: '20px',
            width: '40%',
            marginBottom: '32px',
          }}
        />

        {/* Tab buttons */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton"
              style={{
                backgroundColor: '#1a1a1a',
                borderRadius: 8,
                height: '40px',
                width: '100px',
              }}
            />
          ))}
        </div>

        {/* Content area */}
        <div
          className="skeleton"
          style={{
            backgroundColor: '#1a1a1a',
            borderRadius: 8,
            height: '400px',
            width: '100%',
          }}
        />
      </div>
    </div>
  )
}
