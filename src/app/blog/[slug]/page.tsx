import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { POSTS, type BlogPost } from '@/lib/blog-posts'

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }))
}

// ─── Metadata ──────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params
  const post = POSTS.find((p) => p.slug === slug)
  if (!post) return {}
  return {
    title: `${post.title} — First Guitar Solo`,
    description: post.excerpt,
  }
}

// ─── Article content ───────────────────────────────────────────────────────────

interface ArticleContent {
  intro: string
  sections: { heading: string; body: string }[]
  takeaway: string
}

const ARTICLE_CONTENT: Record<string, ArticleContent> = {
  'how-to-play-your-first-guitar-solo': {
    intro:
      "There's a common lie told to beginners: solos are something you work up to after years of practice. That's backwards. Learning a solo — even a simple one — is one of the fastest ways to develop real technique, because it forces you to use bends, vibrato, and phrasing all at once. Here's a realistic 30-day process that actually works.",
    sections: [
      {
        heading: 'Start With the Pentatonic Scale — Nothing Else',
        body: "The minor pentatonic scale is the foundation of virtually every rock and blues solo. It has five notes, it's forgiving, and it's used by Clapton, Page, Hendrix, SRV, and every great rock guitarist you've ever heard. Don't start with full scales or modes. Just learn the five-note minor pentatonic in the first position on the neck. For a solo in A minor, that means starting your scale pattern at the fifth fret. Spend your first week just running this scale up and down until you can do it without looking at your hands.",
      },
      {
        heading: 'Learn Bending Before You Learn Speed',
        body: "Most beginners want to play fast. That's the wrong instinct. What makes a guitar solo sound like a guitar solo — and not just a series of notes — is expression. The main tool of expression is string bending. A bend is when you push or pull a string sideways to raise its pitch, usually by a whole step (two frets). It's harder than it sounds. Your fingertip needs to build up strength, and you need to train your ear to land on pitch accurately. Practice one bend, slowly, until it sounds in tune. Then practice it again. Speed comes naturally once you have control.",
      },
      {
        heading: 'Learn One Lick, Not a Hundred',
        body: "A guitar lick is a short, repeatable phrase — usually two to eight notes. Professional guitarists have a vocabulary of maybe 20-30 licks they've internalized completely, and they recombine them in new contexts. Don't try to learn 30 licks in a month. Learn one. Learn it until you can play it in your sleep, at different tempos, starting from different parts of the beat. That one lick, fully internalized, is worth more than 20 licks you've half-learned.",
      },
      {
        heading: 'Use a Backing Track From Day One',
        body: "Playing scales in silence teaches you scales. Playing over a backing track teaches you music. Find a simple blues backing track in A (search YouTube for 'A minor blues backing track 70 bpm'). Play your pentatonic scale over it. Just the scale. You'll immediately hear some notes sound better than others, which will teach you far more about music theory than any textbook. Start slow — 60 or 70 BPM — and only increase the tempo when your notes are landing in the pocket consistently.",
      },
      {
        heading: 'Build Toward One Complete Solo',
        body: 'Rather than noodling indefinitely, pick a target: one specific solo you want to be able to play. It could be a beginner-friendly classic like the intro to "Wonderful Tonight" or "Wish You Were Here," or it could be a custom-built solo designed for learning (like the 30-day program at First Guitar Solo). Having a clear finish line gives your practice structure and direction. Break the solo into four-bar sections and tackle one section per week. By day 30, you\'ll have something you can actually perform.',
      },
    ],
    takeaway:
      "The biggest mistake beginners make is thinking they need to master fundamentals before learning a solo. The reality is the opposite — the solo is the fastest path to fundamentals. Pick one scale, one lick, one backing track, and one target solo. Keep it that focused and you'll play something real within 30 days.",
  },

  'why-beginners-quit-guitar': {
    intro:
      "Guitar sales spike every year around Christmas and birthdays. Guitar teachers know what happens next: about 95% of those new players stop within three months. The guitars end up under beds and in closets. This isn't a talent problem. It's a design problem — most people approach guitar learning in a way that's almost guaranteed to fail.",
    sections: [
      {
        heading: 'The Plateau Trap',
        body: "The first two weeks of guitar feel amazing. You're learning chord shapes, your fingers are moving, progress is fast and visible. Then you hit a plateau. The F chord won't come. Chord transitions are sloppy. Nothing sounds like the songs you want to play. This plateau is completely normal — it's where real skill-building begins — but most beginners interpret it as a signal that they're not cut out for guitar. They're wrong. The plateau is just the point where learning shifts from collecting knowledge to building muscle memory. It requires patience. Most people quit here because they don't know it's normal.",
      },
      {
        heading: 'No Clear Goal = No Progress',
        body: "Ask someone why they're learning guitar and they'll say 'I just want to play.' That's not a goal — it's a wish. Real learning requires a specific, time-bound target. 'I want to play the solo from Comfortably Numb by March.' 'I want to perform one song at my friend's birthday.' When you have a concrete goal, you know what to practice and you can measure whether it's working. Without one, practice feels like wandering, and wandering gets abandoned.",
      },
      {
        heading: 'The Random Tutorial Problem',
        body: "YouTube has approximately six thousand guitar tutorial channels. This is catastrophic for beginners. You watch a lesson on barre chords, then a lesson on modes, then a video about alternate picking, then something about blues scale, then a chord theory breakdown. None of these connect. You end up with scattered fragments of knowledge that don't add up to any skill you can actually use. The musicians who progress fastest are almost always following a structured curriculum — either with a teacher or a program — not building a playlist of random lessons.",
      },
      {
        heading: 'Practice Without Feedback',
        body: "When you practice the same wrong motion a hundred times, you get very good at the wrong motion. This is the core problem with unsupervised practice for beginners. A teacher catches bad habits early. Without one, those habits calcify. Modern alternatives include video analysis (record yourself and compare to a professional), AI coaching tools, and structured programs with clear checkpoints. The key is some form of feedback loop — something that tells you whether what you're doing is working.",
      },
      {
        heading: 'The 5% Formula',
        body: "People who stick with guitar and actually get good share a few consistent traits: they have a specific goal, they follow a structured plan rather than random tutorials, they practice consistently (even 20 minutes per day beats two hours on weekends), and they have some form of accountability or feedback. That's it. It's not about talent. The students who make it aren't more gifted — they're just more structured.",
      },
    ],
    takeaway:
      "Quitting guitar is almost always a systems failure, not a talent failure. If you have a specific goal, a structured plan, and some form of feedback, you're already in the top 5% by default. Most people never put those three things in place.",
  },

  'pentatonic-scale-beginner': {
    intro:
      "If you've heard any rock, blues, or country guitar — you've heard the pentatonic scale. It's in virtually every Hendrix solo, every SRV lick, every Page riff. Beginners often ask which scale to learn first. The answer is always the same: minor pentatonic. Here's why, what it is, and how to get it under your fingers in one week.",
    sections: [
      {
        heading: "What 'Pentatonic' Actually Means",
        body: "The word pentatonic comes from the Greek word for five. The pentatonic scale has five notes, compared to seven notes in a standard major or minor scale. Those missing two notes are important: they're the ones most likely to clash with chord tones. By dropping them, the pentatonic scale becomes almost collision-proof. Nearly any note in the scale will sound decent over nearly any chord in the same key. This is why beginners sound better faster on the pentatonic — the margin of error is much wider.",
      },
      {
        heading: 'The First Position Pattern',
        body: "The minor pentatonic scale has five common positions on the neck, but you only need to know one to start: the first position. In A minor, this pattern starts at the fifth fret. Your index finger covers the fifth fret, your ring finger covers the seventh fret. The pattern is: low E string (5, 8), A string (5, 7), D string (5, 7), G string (5, 7), B string (5, 8), high E string (5, 8). That's the scale. Run it up and down until it's automatic. Most great guitar solos live entirely within this one pattern.",
      },
      {
        heading: 'Why This Scale Works Over Blues and Rock',
        body: "The minor pentatonic contains the root, minor third, fourth, fifth, and minor seventh of a minor key. These are the most harmonically stable intervals in Western music — the ones that create tension and resolution without becoming dissonant. In a blues context, the scale also works over dominant seventh chords (which are technically major-flavored), creating a pleasing tension called the 'blue note' effect. This cross-key compatibility is unique to the pentatonic and is why it became the foundation of American popular music.",
      },
      {
        heading: 'Moving It to Different Keys',
        body: "One of the most useful things about the pentatonic scale is that the shape stays exactly the same in every key — you just move it to a different starting fret. Want to play in E minor? Start the same pattern at the twelfth fret. G minor? Start at the third fret. This means once you learn the shape in one key, you can play in any key on the same night. That's the power of position-based guitar playing, and it's why the pentatonic is the professional's go-to tool for improvisation.",
      },
      {
        heading: 'Your One-Week Plan',
        body: "Day 1-2: Learn the pattern from memory. Run it slowly with a metronome at 60 BPM. Day 3-4: Find an A minor blues backing track and play the scale over it. Don't try to make music yet — just listen to how different notes feel over the chord. Day 5-6: Start playing with rhythm. Hold some notes longer, cut others short. Try landing on the first beat of each measure. Day 7: Put the metronome at 80 BPM and record yourself for two minutes. You'll be surprised how musical you already sound.",
      },
    ],
    takeaway:
      "The minor pentatonic scale is not a beginner shortcut — it's the actual foundation of lead guitar. Learn the first position pattern in A minor, play it over a backing track, and give yourself one week. The scale will start speaking for itself.",
  },

  'guitar-bending-technique': {
    intro:
      "You can tell within three notes whether a guitarist has good bending technique. A good bend sounds like a voice — it hits pitch accurately and hangs there with confidence. A bad bend sounds stiff, off-pitch, or weak. The difference isn't talent. It's a specific technique that most teachers either don't explain well or skip entirely.",
    sections: [
      {
        heading: 'Why Bending Matters',
        body: "String bending is how electric guitar expresses emotion. It's what makes a note cry, shout, or sigh. When B.B. King plays a single bent note, it communicates more feeling than most pianists can get out of a full chord. Bending is the primary expressive tool that separates guitar from keyboard instruments — keys can't bend pitch continuously in the same way. If you want your solos to feel like music rather than sequences of notes, bending is the skill you must develop.",
      },
      {
        heading: 'The Technique Most People Get Wrong',
        body: "Most beginners try to bend using only the finger that's fretting the note. That's wrong, and it's why their bends feel weak and hurt their fingers. Correct bending technique uses all three fretting fingers together as a unit. If you're bending with your ring finger at the seventh fret, your middle and index fingers should also be pressing down behind it on the same string. Those two extra fingers provide the leverage and strength to push the string smoothly. Without them, you're fighting the string one-fingered — which is both painful and inaccurate.",
      },
      {
        heading: 'Training Your Ear',
        body: "Accurate bending is an ear training problem as much as a physical one. The goal of a whole-step bend is to reach exactly the pitch of the note two frets higher. To train this, fret the note two frets above your bend target, listen carefully to its pitch, then release it and bend up to match that pitch. Do this slowly, repeatedly, until your hands know how far to push without your ear having to correct it every time. This is the drill professional guitarists use to lock in accurate bends.",
      },
      {
        heading: 'Common Bend Types',
        body: "Half-step bend: raise pitch one semitone (one fret). Whole-step bend: raise pitch two semitones (two frets) — the most common. Bend and release: bend up to pitch, then slowly release back to the original note. Pre-bend: bend silently before picking, then pick while releasing (the note starts high and falls). Each of these has a different emotional character. The bend-and-release is particularly expressive and is used constantly in blues and rock playing.",
      },
      {
        heading: 'Building Strength',
        body: "If bending feels physically hard, that's normal for beginners. The muscles needed for bending are different from those used for chord playing. You can build them quickly by doing a dedicated drill: set a timer for five minutes and just practice one slow, controlled whole-step bend on the B string at the seventh fret, using all three fingers, releasing slowly, and repeating. Do this every day for a week. By day seven, the motion will feel significantly easier and your pitch accuracy will have improved dramatically.",
      },
    ],
    takeaway:
      "Good bending technique comes down to three things: using all three fingers together for leverage, training your ear to land on pitch accurately, and building the specific muscle strength through daily repetition. Master these and your solos will immediately sound more professional.",
  },

  'practice-guitar-30-minutes': {
    intro:
      "Research on motor skill learning consistently shows that short, focused practice sessions beat long, distracted ones. Most guitarists do the opposite — they sit down, noodle through stuff they already know, play through a song a couple of times, and call it practice. Here's how a 30-minute session should actually be structured if you want to improve.",
    sections: [
      {
        heading: 'The Problem With Most Guitar Practice',
        body: "Effective practice requires working at the edge of your ability — playing things that are slightly beyond your current level, making mistakes, correcting them, and repeating. Most guitarists avoid this because it's uncomfortable and frustrating. Instead, they practice things they can already play, which feels satisfying but produces almost no improvement. The technical term for this is 'blocked practice' — repeating a skill you already have — and studies consistently show it creates the illusion of improvement without the reality.",
      },
      {
        heading: 'Minutes 0–5: Warm Up Properly',
        body: "Your fingers and wrists need blood flow before you ask them to do technical work. Spend five minutes on slow, controlled exercises — chromatic runs up and down the neck, slow scale patterns, or basic chord transitions. The key word is slow. This isn't the time to play fast or challenge yourself. The goal is to get your hands moving fluidly and your mind focused on the guitar.",
      },
      {
        heading: 'Minutes 5–15: Work on Your Weakness',
        body: "Identify the one specific thing that is limiting your playing right now. Maybe it's bending accuracy. Maybe it's a particular chord transition. Maybe it's a measure in a solo that you keep flubbing. Whatever it is, spend ten focused minutes on that specific thing and nothing else. Use a metronome. Start slower than feels necessary. Focus entirely on accuracy — speed follows accuracy, not the other way around. This is the highest-value part of your practice session.",
      },
      {
        heading: 'Minutes 15–25: Application',
        body: "Take the skill you just worked on and apply it in a musical context. If you practiced bending accuracy, now play over a backing track and try to use bends expressively. If you worked on a chord transition, play through a song that uses that transition. This is where isolated technique becomes musical capability. The brain consolidates skills better when it practices them in context after isolated drilling.",
      },
      {
        heading: 'Minutes 25–30: Play Something You Love',
        body: "End every practice session with five minutes of playing something you enjoy — a song you already know, a lick that feels good, free improvisation over a backing track. This serves two purposes: it recharges your motivation, and it gives your brain a 'reward' signal that strengthens the overall practice habit. Practice that ends in frustration is practice you'll dread tomorrow. Practice that ends with enjoyment is practice you'll look forward to.",
      },
    ],
    takeaway:
      "The 30-minute structure — 5 warm up, 10 focused weakness work, 10 application, 5 enjoyment — is more effective than two hours of unfocused noodling. What matters most is that you work on your actual weaknesses during the middle section. That's where real improvement happens.",
  },

  'best-beginner-guitar-solos': {
    intro:
      "Most 'beginner guitar solo' lists are useless — they're full of solos that either sound boring or aren't actually beginner-friendly. This list is different. These ten solos are genuinely playable for beginners, and they all sound like real music that other people will recognize. They're ordered roughly by difficulty, starting with the most accessible.",
    sections: [
      {
        heading: '1. "Smoke on the Water" Main Riff (Deep Purple)',
        body: 'Technically a riff rather than a solo, but it teaches power chords, two-string movement, and rhythm — three foundational skills. Most beginners can play the basic version within their first week. It\'s also immediately recognizable to anyone who\'s ever been near a guitar store.',
      },
      {
        heading: '2. "Wish You Were Here" Intro (Pink Floyd)',
        body: "This is a fingerpicked intro, not a lead solo, but it's perfect for training your picking hand independence and developing the melodic sensibility you'll need for solos. The tempo is slow enough that you have time to think, and it sounds genuinely beautiful from day one.",
      },
      {
        heading: '3. "Wonderful Tonight" Intro (Eric Clapton)',
        body: "A short, elegant solo-style melody played over clean tone. It uses bends very sparingly, which makes it approachable for beginners. The four-bar phrase structure teaches you how melodies are shaped. Clapton's phrasing here is worth studying carefully — notice how much space he leaves between notes.",
      },
      {
        heading: '4. "Knockin\' on Heaven\'s Door" (Guns N\' Roses version)',
        body: "Slash's solo on this song is relatively short and stays within a small area of the pentatonic scale. It introduces the concept of phrasing — playing a short phrase, pausing, playing another phrase — which is the core of expressive soloing. The bends are simple and the tempo is moderate.",
      },
      {
        heading: '5. "Comfortably Numb" First Solo (Pink Floyd)',
        body: "David Gilmour's first solo in this song (not the extended second one) is deceptively simple. It uses sustained notes, gentle bends, and very deliberate phrasing. The key lesson here is that space and timing matter as much as the notes themselves. This solo is where many guitarists first learn to 'sing' through the instrument.",
      },
      {
        heading: '6–10. The Pentatonic Vocabulary Builders',
        body: "The remaining solos worth learning are: \"Pride and Joy\" intro (SRV) — teaches shuffle rhythm and double stops; \"Crossroads\" intro (Cream) — faster but in a tight pentatonic box; \"Sunshine of Your Love\" riff (Cream) — one of the most recognizable riffs ever written; \"Back in Black\" riff and intro solo (AC/DC) — the perfect study in aggression and rhythm; \"Hey Joe\" intro (Hendrix) — teaches chord melody interaction. Each of these lives primarily in the minor pentatonic scale and teaches a different dimension of lead technique.",
      },
    ],
    takeaway:
      "The best beginner solos aren't the easiest — they're the ones that teach you something real while sounding like actual music. Start with Wonderful Tonight or Wish You Were Here to build your ear, then work up to the Comfortably Numb first solo when your bending is accurate. Each solo on this list will add something specific to your vocabulary.",
  },
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

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

function getRelatedPosts(current: BlogPost): BlogPost[] {
  return POSTS.filter((p) => p.slug !== current.slug).slice(0, 3)
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  const content = ARTICLE_CONTENT[slug]
  if (!content) notFound()

  const catColor = CATEGORY_COLORS[post.category] ?? '#f59e0b'
  const related = getRelatedPosts(post)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'Zachary Lee',
      affiliation: { '@type': 'Organization', name: 'Sixth String Labs' },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sixth String Labs',
    },
    url: `https://firstguitarsolo.com/blog/${slug}`,
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <div style={{ marginBottom: '2rem' }}>
          <Link
            href="/blog"
            style={{ color: '#525252', fontSize: '0.8rem', textDecoration: 'none' }}
          >
            ← Back to Blog
          </Link>
        </div>

        {/* Hero */}
        <header style={{ marginBottom: '3rem' }}>
          <span
            style={{
              color: catColor,
              backgroundColor: `${catColor}18`,
              border: `1px solid ${catColor}40`,
              borderRadius: '9999px',
              padding: '0.25rem 0.75rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              display: 'inline-block',
              marginBottom: '1rem',
            }}
          >
            {post.category}
          </span>
          <h1
            style={{
              color: '#ffffff',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            {post.title}
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap' as const,
              color: '#525252',
              fontSize: '0.85rem',
            }}
          >
            <span style={{ color: '#a3a3a3', fontWeight: 600 }}>
              Zachary Lee · Sixth String Labs
            </span>
            <span>·</span>
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: '#1f1f1f', marginBottom: '2.5rem' }} />

        {/* Article intro */}
        <p
          style={{
            color: '#d4d4d4',
            fontSize: '1.0625rem',
            lineHeight: 1.75,
            marginBottom: '2.5rem',
          }}
        >
          {content.intro}
        </p>

        {/* Article sections */}
        <article>
          {content.sections.map((section, i) => (
            <section key={i} style={{ marginBottom: '2.5rem' }}>
              <h2
                style={{
                  color: '#ffffff',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  marginBottom: '0.875rem',
                  lineHeight: 1.3,
                }}
              >
                {section.heading}
              </h2>
              <p style={{ color: '#a3a3a3', fontSize: '0.9375rem', lineHeight: 1.75 }}>
                {section.body}
              </p>
            </section>
          ))}
        </article>

        {/* Key takeaway box */}
        <div
          style={{
            borderLeft: '4px solid #f59e0b',
            backgroundColor: '#111111',
            borderRadius: '0 0.5rem 0.5rem 0',
            padding: '1.25rem 1.5rem',
            marginBottom: '3rem',
          }}
        >
          <p
            style={{
              color: '#f59e0b',
              fontSize: '0.7rem',
              fontWeight: 900,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.15em',
              marginBottom: '0.5rem',
            }}
          >
            Key Takeaway
          </p>
          <p style={{ color: '#d4d4d4', fontSize: '0.9375rem', lineHeight: 1.65 }}>
            {content.takeaway}
          </p>
        </div>

        {/* CTA box */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '2px solid #f59e0b',
            borderRadius: '0.75rem',
            padding: '2rem',
            textAlign: 'center' as const,
            marginBottom: '3rem',
          }}
        >
          <p
            style={{
              color: '#f59e0b',
              fontSize: '0.7rem',
              fontWeight: 900,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.15em',
              marginBottom: '0.75rem',
            }}
          >
            Try It Yourself
          </p>
          <h3
            style={{
              color: '#ffffff',
              fontSize: '1.375rem',
              fontWeight: 800,
              marginBottom: '0.75rem',
            }}
          >
            Ready to play your first complete solo?
          </h3>
          <p style={{ color: '#a3a3a3', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
            First Guitar Solo is a 30-day structured program built around one goal: getting you to
            play a real blues-rock solo, start to finish. $25 one-time. 30-day money-back guarantee.
          </p>
          <Link
            href="/register"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000000',
              fontWeight: 900,
              fontSize: '0.9375rem',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              padding: '0.875rem 2rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
            }}
          >
            Start Learning — $25
          </Link>
          <p style={{ color: '#525252', fontSize: '0.75rem', marginTop: '0.75rem' }}>
            One-time · No subscription · 30-day money-back guarantee
          </p>
        </div>

        {/* Related articles */}
        <div>
          <h3
            style={{
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              marginBottom: '1.25rem',
            }}
          >
            Related Articles
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
            {related.map((r) => {
              const rColor = CATEGORY_COLORS[r.category] ?? '#f59e0b'
              return (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    backgroundColor: '#111111',
                    border: '1px solid #1f1f1f',
                    borderRadius: '0.5rem',
                    padding: '1rem 1.25rem',
                    textDecoration: 'none',
                    gap: '1rem',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        color: rColor,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textTransform: 'uppercase' as const,
                        letterSpacing: '0.1em',
                        display: 'block',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {r.category}
                    </span>
                    <span style={{ color: '#d4d4d4', fontSize: '0.875rem', fontWeight: 600 }}>
                      {r.title}
                    </span>
                  </div>
                  <span style={{ color: '#f59e0b', flexShrink: 0, fontSize: '0.875rem' }}>→</span>
                </Link>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
