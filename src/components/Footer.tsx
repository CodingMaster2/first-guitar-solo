import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #262626' }} className="py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start">
            <span style={{ color: '#f59e0b' }} className="text-xs font-bold tracking-widest uppercase">
              Sixth String Labs
            </span>
            <span className="text-white text-sm font-black tracking-wider uppercase">First Guitar Solo</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/faq" style={{ color: '#a3a3a3' }} className="text-sm hover:text-white transition-colors">
              FAQ
            </Link>
            <Link href="/privacy" style={{ color: '#a3a3a3' }} className="text-sm hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" style={{ color: '#a3a3a3' }} className="text-sm hover:text-white transition-colors">
              Terms
            </Link>
            <a
              href="mailto:support@sixthstringlabs.com"
              style={{ color: '#a3a3a3' }}
              className="text-sm hover:text-white transition-colors"
            >
              Contact
            </a>
          </nav>

          <p style={{ color: '#a3a3a3' }} className="text-xs">
            &copy; {new Date().getFullYear()} Sixth String Labs
          </p>
        </div>
      </div>
    </footer>
  )
}
