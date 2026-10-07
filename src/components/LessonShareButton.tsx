'use client'

interface LessonShareButtonProps {
  day: number
  title: string
}

export default function LessonShareButton({ day, title }: LessonShareButtonProps) {
  const handleShare = () => {
    const text = encodeURIComponent(
      `I just completed Day ${day} of First Guitar Solo — '${title}' 🎸 #FirstGuitarSolo`
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      onClick={handleShare}
      style={{
        border: '1px solid #262626',
        color: '#737373',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        padding: '6px 14px',
        borderRadius: '0.5rem',
        fontSize: '0.75rem',
        fontWeight: 500,
        transition: 'border-color 0.15s ease, color 0.15s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#f59e0b'
        e.currentTarget.style.color = '#f59e0b'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#262626'
        e.currentTarget.style.color = '#737373'
      }}
    >
      Share on X
    </button>
  )
}
