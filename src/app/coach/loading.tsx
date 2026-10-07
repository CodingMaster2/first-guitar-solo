export default function CoachLoading() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        .skel { animation: pulse 1.5s ease-in-out infinite; border-radius: 8px; background: #1a1a1a; }
      `}</style>

      <div style={{ maxWidth: '720px', width: '100%', margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Alternating message bubbles */}
        {[
          { align: 'flex-start', width: '60%' },
          { align: 'flex-end',   width: '45%' },
          { align: 'flex-start', width: '70%' },
          { align: 'flex-end',   width: '35%' },
          { align: 'flex-start', width: '55%' },
          { align: 'flex-end',   width: '50%' },
        ].map((bubble, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: bubble.align }}>
            <div className="skel" style={{ height: '48px', width: bubble.width, borderRadius: '16px' }} />
          </div>
        ))}

        <div style={{ flex: 1 }} />

        {/* Input box */}
        <div className="skel" style={{ height: '52px', width: '100%', borderRadius: '12px' }} />
      </div>
    </div>
  )
}
