import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TechniquesClient, { type Technique } from '@/components/TechniquesClient'
import Link from 'next/link'

// ─── Technique data ───────────────────────────────────────────────────────────

const TECHNIQUES: Technique[] = [
  {
    name: 'Alternate Picking',
    slug: 'alternate-picking',
    day: 2,
    difficulty: 'Beginner',
    description: 'Alternating between downstrokes and upstrokes for speed and efficiency.',
    tip: 'Keep your wrist relaxed. The motion comes from the wrist, not the elbow.',
    tab: 'e|--5--5--5--5--|\nB|---------------|\n(down-up-down-up on each note)',
    exercises: [
      'Chromatic exercise at 60 BPM using strict down-up alternation',
      'Single string scales ascending and descending',
      'String crossing drills — jump strings without breaking the alternation',
    ],
  },
  {
    name: 'Hammer-On',
    slug: 'hammer-on',
    day: 5,
    difficulty: 'Beginner',
    description: 'Sounding a note by tapping the fretting finger onto the string without picking.',
    tip: 'The hammer must be decisive — a weak tap produces a ghost note.',
    tab: 'e|--5h7--|\n       (pick 5, hammer 7)',
    exercises: [
      'Single string hammer-ons across all fret pairs',
      'Pentatonic pattern with hammer-ons from root to 3rd',
      'Chromatic hammer-on runs: 1h2, 2h3, 3h4 on each string',
    ],
  },
  {
    name: 'Pull-Off',
    slug: 'pull-off',
    day: 6,
    difficulty: 'Beginner',
    description: 'Removing a fretting finger with a slight downward motion to sound the lower note.',
    tip: 'Pull slightly downward (toward the floor) as you lift — this plucks the string.',
    tab: 'e|--7p5--|\n       (pick 7, pull to 5)',
    exercises: [
      'Single string pull-offs with consistent volume',
      'Combined hammer-pull trills: 5h7p5h7p5',
      'Pentatonic descending run using pull-offs only',
    ],
  },
  {
    name: 'String Bending',
    slug: 'bending',
    day: 8,
    difficulty: 'Intermediate',
    description: 'Pushing or pulling the string across the fret to raise the pitch.',
    tip: 'Use 3 fingers to push — ring finger bends, middle and index support from behind.',
    tab: 'e|--8b10--|\n        (bend 8th fret up to sound of 10th fret)',
    exercises: [
      'Whole-step bends on B string — tune to target pitch first',
      'Bend and release: bend up, hold, release back down cleanly',
      'Pre-bend and release: bend before picking, then release',
    ],
  },
  {
    name: 'Vibrato',
    slug: 'vibrato',
    day: 12,
    difficulty: 'Intermediate',
    description: 'Repeatedly bending and releasing a note slightly to create a singing quality.',
    tip: 'Think of the wrist rotating, not just the finger wiggling. Keep it rhythmic.',
    tab: 'e|--9~~~--|\n        (bend up and down repeatedly)',
    exercises: [
      'Slow wide vibrato on long notes — one cycle per beat at 60 BPM',
      'Fast narrow vibrato for intensity',
      'Vibrato at the end of pentatonic phrases',
    ],
  },
  {
    name: 'Slide',
    slug: 'slide',
    day: 7,
    difficulty: 'Beginner',
    description: 'Gliding a fretting finger up or down the string to change pitch smoothly.',
    tip: 'Maintain pressure as you slide — releasing kills the tone.',
    tab: 'e|--5/9--|\n        (slide from 5 to 9)',
    exercises: [
      'Ascending slides on the high e string: 5/9, 7/12',
      'Descending slides: 12\\9, 9\\5',
      'Slide into position: use a slide to arrive at the first note of a phrase',
    ],
  },
  {
    name: 'Palm Muting',
    slug: 'palm-muting',
    day: 10,
    difficulty: 'Beginner',
    description: 'Resting the pick-hand palm lightly on the strings near the bridge to dampen them.',
    tip: 'Contact the strings right at the bridge saddles. Moving further back = more muted.',
    tab: 'e|--PM--5--5--5--5--|',
    exercises: [
      'Open string muting — control the decay cleanly',
      'Power chord riffs with palm muting for a tight "chug" sound',
      'Alternating muted and open picking in the same phrase',
    ],
  },
  {
    name: 'Pentatonic Scale',
    slug: 'pentatonic',
    day: 9,
    difficulty: 'Intermediate',
    description: 'A 5-note scale that is the foundation of rock and blues guitar solos.',
    tip: 'Learn Box 1 first. All other boxes connect to it — the neck is one continuous pattern.',
    tab: 'e|--5--8--|\nB|--5--8--|\nG|--5--7--|\nD|--5--7--|\nA|--5--7--|\nE|--5--8--|',
    exercises: [
      'Box 1 ascending and descending at 60 BPM with a metronome',
      'Box 1 with hammer-ons on the way up and pull-offs on the way down',
      'Connecting Box 1 to Box 2 — find the overlap notes',
    ],
  },
  {
    name: 'Tapping',
    slug: 'tapping',
    day: 18,
    difficulty: 'Advanced',
    description: 'Using the pick-hand index finger to hammer-on notes on the fretboard.',
    tip: 'Keep the pick between your ring and pinky finger while tapping with the index.',
    tab: 'e|--T12p8p5--|',
    exercises: [
      'Single string tap lick: T12p8p5 — slow and even first',
      'Two-string tapping patterns across the pentatonic shape',
      'Tapping with string muting to avoid unwanted noise',
    ],
  },
  {
    name: 'Legato',
    slug: 'legato',
    day: 15,
    difficulty: 'Intermediate',
    description: 'Playing smoothly with minimal picking, using hammer-ons and pull-offs.',
    tip: 'The goal is evenness — each note the same volume as the picked note.',
    tab: 'e|--5h7h8p7p5--|',
    exercises: [
      '3-note legato runs ascending and descending',
      'Pentatonic box 1 using legato only — one pick per string',
      'Full scale runs with no re-picking — build finger independence',
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TechniquesPage() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero header */}
        <div className="mb-8">
          <p style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-2">
            Reference
          </p>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Technique <span style={{ color: '#f59e0b' }}>Library</span>
          </h1>
          <p style={{ color: '#a3a3a3' }} className="text-sm mt-2">
            Every skill in the curriculum — with animated demos, tab examples, and practice exercises.
          </p>
        </div>

        {/* Stats strip */}
        <div
          style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
          className="rounded-xl p-4 mb-8 flex flex-wrap gap-6"
        >
          {[
            { value: TECHNIQUES.length, label: 'Techniques' },
            { value: TECHNIQUES.filter(t => t.difficulty === 'Beginner').length, label: 'Beginner' },
            { value: TECHNIQUES.filter(t => t.difficulty === 'Intermediate').length, label: 'Intermediate' },
            { value: TECHNIQUES.filter(t => t.difficulty === 'Advanced').length, label: 'Advanced' },
          ].map(stat => (
            <div key={stat.label}>
              <span style={{ color: '#f59e0b' }} className="text-2xl font-black">{stat.value}</span>
              <span style={{ color: '#525252' }} className="text-xs ml-2 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Client-side filter + cards */}
        <TechniquesClient techniques={TECHNIQUES} />

        {/* Quick nav */}
        <div className="flex flex-wrap gap-3 mt-10 pt-8" style={{ borderTop: '1px solid #1f1f1f' }}>
          <Link
            href="/dashboard"
            style={{ backgroundColor: '#111111', border: '1px solid #262626', color: '#a3a3a3' }}
            className="text-xs px-4 py-2.5 rounded-lg hover:border-amber-600 hover:text-white transition-colors font-bold uppercase tracking-wider"
          >
            ← Dashboard
          </Link>
          <Link
            href="/journey"
            style={{ backgroundColor: '#111111', border: '1px solid #262626', color: '#a3a3a3' }}
            className="text-xs px-4 py-2.5 rounded-lg hover:border-amber-600 hover:text-white transition-colors font-bold uppercase tracking-wider"
          >
            Fretboard Journey
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  )
}
