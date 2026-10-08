import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://firstguitarsolo.com${item.href}` } : {}),
    })),
  }

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '1rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol
        className="flex items-center gap-2 text-sm mb-4"
        style={{ listStyle: 'none', padding: 0, margin: 0 }}
      >
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && (
              <span aria-hidden="true" style={{ color: '#404040' }}>
                ›
              </span>
            )}
            {item.href ? (
              <Link href={item.href} style={{ color: '#737373', textDecoration: 'none' }}>
                {item.label}
              </Link>
            ) : (
              <span style={{ color: '#a3a3a3' }}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
