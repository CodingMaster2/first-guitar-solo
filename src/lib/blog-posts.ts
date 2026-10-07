export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
}

export const POSTS: BlogPost[] = [
  {
    slug: 'how-to-play-your-first-guitar-solo',
    title: 'How to Play Your First Guitar Solo (Complete Beginner Guide)',
    excerpt:
      "Most beginners think solos are for advanced players. They're wrong. Here's the exact process to play your first solo in 30 days.",
    date: '2025-01-15',
    readTime: '8 min read',
    category: 'Beginner Guide',
  },
  {
    slug: 'why-beginners-quit-guitar',
    title: 'Why 95% of Beginner Guitarists Quit (And How to Be the 5%)',
    excerpt:
      "The data is brutal: most people who buy a guitar never play it for more than 3 months. Here's the psychology behind quitting — and how to beat it.",
    date: '2025-01-22',
    readTime: '6 min read',
    category: 'Mindset',
  },
  {
    slug: 'pentatonic-scale-beginner',
    title: 'The Pentatonic Scale: Why Every Guitarist Starts Here',
    excerpt:
      "The pentatonic scale is the foundation of rock, blues, and country guitar. Here's what it is, why it matters, and how to learn it in one week.",
    date: '2025-02-01',
    readTime: '7 min read',
    category: 'Music Theory',
  },
  {
    slug: 'guitar-bending-technique',
    title: "How to Bend Guitar Strings Without Sounding Bad",
    excerpt:
      "String bending is what separates guitarists who sound good from those who sound... okay. Here's the technique most teachers never explain.",
    date: '2025-02-08',
    readTime: '5 min read',
    category: 'Technique',
  },
  {
    slug: 'practice-guitar-30-minutes',
    title: 'How to Practice Guitar in 30 Minutes and Actually Improve',
    excerpt:
      'Most guitarists waste 80% of their practice time. Here\'s a science-backed 30-minute routine that creates real progress.',
    date: '2025-02-15',
    readTime: '6 min read',
    category: 'Practice',
  },
  {
    slug: 'best-beginner-guitar-solos',
    title: '10 Best Guitar Solos for Beginners (Actually Playable)',
    excerpt:
      "These aren't \"easy\" solos that sound boring. These are real solos that will make people recognize what you're playing.",
    date: '2025-02-22',
    readTime: '9 min read',
    category: 'Songs',
  },
]
