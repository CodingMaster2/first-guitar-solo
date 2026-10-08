'use client'

export default function CertificatePrint() {
  return (
    <button
      onClick={() => window.print()}
      style={{ backgroundColor: '#f59e0b', color: '#000000' }}
      className="text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
    >
      Print Certificate
    </button>
  )
}
