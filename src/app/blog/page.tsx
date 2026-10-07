import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { POSTS } from '@/lib/blog-posts'

export const metadata: Metadata = {
  title: 'Guitar Learning Blog — First Guitar Solo Tips',
  description:
    'Learn guitar faster with science-backed tips, technique guides, and beginner advice from First Guitar Solo.',
}

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'First Guitar Solo Blog',
  description:
    'Science-backed guitar learning tips, technique guides, and beginner advice from First Guitar Solo.',
  url: 'https://firstguitarsolo.com/blog',
  publisher: {
    '@type': 'Organization',
    name: 'Sixth String Labs',
  },
  blogPost: POSTS.map((p) => ({
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.excerpt,
    datePublished: p.date,
    url: `https://firstguitarsolo.com/blog/${p.slug}`,
  })),
}

const CATEGORIES = ['All', 'Beginner Guide', 'Mindset', 'Music Theory', 'Technique', 'Practice', 'Songs']

const CATEGORY_COLORS: Record<string, string> = {
  'Beginner Guide': '#f59e0b',
  Mindset: '#a855f7',
  'Music Theory': '#0ea5e9',
  Technique: '#22c55e',
  Practice: '#f97316',
  Songs: '#ec4899',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function BlogIndexPage() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <p
            style={{
              color: '#f59e0b',
              fontSize: '0.7rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              marginBottom: '0.75rem',
            }}
          >
            Sixth String Labs
          </p>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              letterSpacing: '0.05em',
              color: '#ffffff',
              marginBottom: '0.75rem',
              lineHeight: 1,
            }}
          >
            Guitar Learning Blog
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '1.0625rem', maxWidth: '40rem', lineHeight: 1.65 }}>
            Science-backed tips, technique breakdowns, and honest advice for guitarists who want to
            actually improve.
          </p>
        </div>

        {/* Category filter pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '3rem',
          }}
        >
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              style={{
                backgroundColor: cat === 'All' ? '#f59e0b' : '#111111',
                color: cat === 'All' ? '#000000' : '#a3a3a3',
                border: `1px solid ${cat === 'All' ? '#f59e0b' : '#262626'}`,
                borderRadius: '9999px',
                padding: '0.375rem 1rem',
                fontSize: '0.8rem',
                fontWeight: cat === 'All' ? 700 : 500,
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Post grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
            gap: '1.5rem',
          }}
        >
          {POSTS.map((post) => {
            const catColor = CATEGORY_COLORS[post.category] ?? '#f59e0b'
            return (
              <article
                key={post.slug}
                style={{
                  backgroundColor: '#111111',
                  border: '1px solid #1f1f1f',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.2s ease, transform 0.2s ease',
                }}
              >
                {/* Color bar */}
                <div style={{ height: 3, backgroundColor: catColor }} />

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Category badge */}
                  <div style={{ marginBottom: '0.875rem' }}>
                    <span
                      style={{
                        color: catColor,
                        backgroundColor: `${catColor}18`,
                        border: `1px solid ${catColor}40`,
                        borderRadius: '9999px',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    style={{
                      color: '#ffffff',
                      fontSize: '1.0625rem',
                      fontWeight: 700,
                      lineHeight: 1.4,
                      marginBottom: '0.625rem',
                    }}
                  >
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p
                    style={{
                      color: '#737373',
                      fontSize: '0.875rem',
                      lineHeight: 1.65,
                      marginBottom: '1.25rem',
                      flex: 1,
                    }}
                  >
                    {post.excerpt}
                  </p>

                  {/* Footer row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #1f1f1f',
                      paddingTop: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ color: '#525252', fontSize: '0.75rem' }}>
                        {formatDate(post.date)}
                      </span>
                      <span style={{ color: '#525252', fontSize: '0.75rem' }}>{post.readTime}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{
                        color: '#f59e0b',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      Read Article →
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </main>

      <Footer />
    </div>
  )
}
