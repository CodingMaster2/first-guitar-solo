import Link from 'next/link'

export default function Footer() {
  return (
    <div className="relative">
      <div style={{ height: '80px', background: 'linear-gradient(to bottom, transparent, #0a0a0a)', pointerEvents: 'none' }} />
      <footer style={{ backgroundColor: '#050505', borderTop: '1px solid rgba(245,158,11,0.1)' }} className="py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center sm:items-start">
              <div style={{ borderLeft: '2px solid #f59e0b', paddingLeft: '12px' }}>
                <span style={{ color: '#f59e0b' }} className="text-xs font-bold tracking-widest uppercase">
                  Sixth String Labs
                </span>
                <span className="text-white text-sm font-black tracking-wider uppercase block">First Guitar Solo</span>
              </div>
            </div>

            <nav className="flex flex-wrap justify-center gap-6">
              <Link href="/faq" style={{ color: '#a3a3a3' }} className="text-base hover:text-amber-400 transition-colors">
                FAQ
              </Link>
              <Link href="/privacy" style={{ color: '#a3a3a3' }} className="text-base hover:text-amber-400 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" style={{ color: '#a3a3a3' }} className="text-base hover:text-amber-400 transition-colors">
                Terms
              </Link>
              <a
                href="mailto:support@sixthstringlabs.com"
                style={{ color: '#a3a3a3' }}
                className="text-base hover:text-amber-400 transition-colors"
              >
                Contact
              </a>
            </nav>

            <p style={{ color: '#2a2a2a' }} className="text-xs">
              &copy; {new Date().getFullYear()} Sixth String Labs
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
