export default function Loading() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        .skel { animation: pulse 1.5s ease-in-out infinite; border-radius: 8px; background: #1a1a1a; }
      `}</style>
      <div style={{ width: 40, height: 40, border: '3px solid #1f1f1f', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
}
