import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: 'Guitar Glossary — First Guitar Solo',
  description: 'Every guitar technique and term you will encounter in the First Guitar Solo course, defined in plain English.',
}

interface Term {
  term: string
  definition: string
  usedInDay?: number
}

const TERMS: Term[] = [
  {
    term: 'Alternate Picking',
    definition: 'A picking technique where down and up strokes alternate continuously — down, up, down, up. It is the most efficient way to play fast, clean single-note lines because the pick travels in both directions, halving wasted motion compared to all-downstrokes.',
    usedInDay: 3,
  },
  {
    term: 'Bend',
    definition: 'A technique where the string is pushed or pulled sideways across the fretboard to raise its pitch smoothly, without moving to a new fret. Bends can be half-step (one fret\'s worth of pitch) or whole-step (two frets). It is the most expressive single technique in lead guitar.',
    usedInDay: 12,
  },
  {
    term: 'Capo',
    definition: 'A clamp placed across all strings at a chosen fret, effectively raising the pitch of every open string by the number of frets clamped. A capo allows a player to use open-chord shapes in a higher key without retuning.',
  },
  {
    term: 'Chord',
    definition: 'Three or more notes played simultaneously. In rhythm guitar, chords form the harmonic foundation of a song. Lead guitarists primarily play single notes but use chord knowledge to choose which scale positions sound good over a given progression.',
  },
  {
    term: 'Chromatic',
    definition: 'Relating to all 12 semitones (half-steps) in Western music, including sharps and flats. A chromatic exercise moves one fret at a time through consecutive notes regardless of key. It is used as a technical warm-up because it forces every finger to operate independently.',
    usedInDay: 1,
  },
  {
    term: 'Double-Stop',
    definition: 'Playing two strings simultaneously to produce a two-note harmony. Double-stops are common in blues and country lead playing and produce a thicker, more aggressive sound than single notes. The term comes from violin technique where "stopping" a string means pressing it down.',
  },
  {
    term: 'Economy Picking',
    definition: 'A picking approach that combines alternate picking within a string with directional picking when crossing strings — using a downstroke when moving to a lower (thicker) string and an upstroke when moving to a higher string. It minimizes pick travel and is often faster than strict alternate picking for scale runs.',
  },
  {
    term: 'Fingerpicking',
    definition: 'Using the fingers of the picking hand directly on the strings, instead of a plectrum. The thumb typically handles the bass strings and each finger is assigned to a treble string. Fingerpicking allows simultaneous melody, bass, and harmony that is impossible with a single pick.',
  },
  {
    term: 'Fret',
    definition: 'A metal strip embedded in the fretboard that divides the neck into semitone intervals. Pressing a string down behind a fret shortens its vibrating length and raises its pitch by one semitone per fret. The term "fret" also refers to the space between two fret wires (e.g., "play the 5th fret" means press behind the 5th metal strip).',
    usedInDay: 1,
  },
  {
    term: 'Fretboard',
    definition: 'The flat face of the guitar neck, made of hardwood (usually rosewood or maple), where frets are embedded and where the fretting hand presses strings. The fretboard is the physical map of every note on the guitar.',
    usedInDay: 1,
  },
  {
    term: 'Full Step',
    definition: 'An interval of two semitones (two frets). Also called a "whole step." Moving up one full step from A gives B. A whole-step bend raises the pitch by two frets\' worth, which is the most common bend size in rock and blues.',
    usedInDay: 12,
  },
  {
    term: 'Hammer-On',
    definition: 'A legato technique where a note is sounded by forcefully bringing a fretting finger down onto the string — without picking again. The impact of the finger creates the sound. Notated in tab as "h" between two fret numbers (e.g., 5h7).',
    usedInDay: 4,
  },
  {
    term: 'Half Step',
    definition: 'The smallest interval in Western music — one fret on the guitar. Also called a "semitone." Moving up one half step from E gives F. A half-step bend raises the pitch by one fret\'s worth.',
    usedInDay: 12,
  },
  {
    term: 'Hybrid Picking',
    definition: 'Using both a pick (held between thumb and index finger) and the middle, ring, and pinky fingers simultaneously. It combines the attack precision of a pick with the multi-string capability of fingerpicking, and is common in country, blues-rock, and fusion styles.',
  },
  {
    term: 'Interval',
    definition: 'The distance in pitch between two notes, measured in semitones or named steps (half step, whole step, minor third, etc.). Understanding intervals lets you predict how notes will sound together and is the foundation of scale and chord construction.',
  },
  {
    term: 'Legato',
    definition: 'Italian for "tied" or "smooth." In guitar playing, legato refers to phrases where notes flow into each other with minimal individual picking — primarily achieved through hammer-ons, pull-offs, and slides. Legato playing produces a fluid, vocal quality compared to the sharper attack of picked notes.',
    usedInDay: 11,
  },
  {
    term: 'Lick',
    definition: 'A short, reusable musical phrase that has a recognizable shape or feel. Licks are the vocabulary of lead guitar — guitarists build a library of licks that they deploy in improvisation. A lick is longer than a single note but shorter than a full solo phrase.',
    usedInDay: 7,
  },
  {
    term: 'Muting',
    definition: 'Deliberately silencing strings to prevent unwanted noise. Left-hand muting uses the fretting fingers to lightly touch strings you are not playing. Right-hand (palm) muting rests the heel of the picking hand on the bridge saddles to produce a percussive, damped tone.',
  },
  {
    term: 'Open String',
    definition: 'A string played without any fretting-hand finger pressing it down. Open strings ring at the guitar\'s tuned pitch (E, A, D, G, B, e in standard tuning). In tab, an open string is notated as 0.',
  },
  {
    term: 'Palm Muting',
    definition: 'Resting the heel of the picking hand lightly on the bridge saddles while picking, creating a muffled, chunky sound. The further from the bridge the heel rests, the more muted the tone. Widely used in rock rhythm guitar and occasionally in lead playing for contrast.',
  },
  {
    term: 'Pentatonic',
    definition: 'A scale with five notes per octave (penta = five). The minor pentatonic scale is the foundation of blues and rock lead guitar — its five notes avoid the clashes that occur in 7-note scales, making nearly every note sound good over the matching chord.',
    usedInDay: 8,
  },
  {
    term: 'Phrase',
    definition: 'A short musical idea with a beginning, motion, and implied ending — the equivalent of a sentence in speech. Great lead guitar is built from well-crafted phrases separated by space (silence), not from continuous streams of notes.',
    usedInDay: 10,
  },
  {
    term: 'Pick Attack',
    definition: 'The character of how the pick strikes the string — the initial transient sound before the note sustains. A sharp pick attack produces a bright, defined tone. A softer pick attack (from a lighter touch or angled pick) sounds rounder and warmer. Controlling pick attack is central to dynamics and tone shaping.',
    usedInDay: 3,
  },
  {
    term: 'Pickup (guitar)',
    definition: 'A magnetic device mounted under the strings that converts string vibrations into an electrical signal. Single-coil pickups produce a bright, clear tone but can hum. Humbuckers use two coils to cancel hum and produce a thicker, warmer sound. Pickup selection affects tone dramatically.',
  },
  {
    term: 'Position',
    definition: 'A specific area of the fretboard defined by which fret the index finger anchors to. "Fifth position" means the index finger sits at the 5th fret, covering frets 5 through 8 with all four fingers. Playing in position allows efficient, organized fretboard movement.',
    usedInDay: 9,
  },
  {
    term: 'Pull-Off',
    definition: 'The reverse of a hammer-on. With two fingers fretted on the same string, you pick the higher note then pull the fretting finger slightly downward off the string — the pulling motion plucks the string and sounds the lower note. Notated as "p" in tab (e.g., 7p5).',
    usedInDay: 5,
  },
  {
    term: 'Riff',
    definition: 'A repeating musical figure that forms the backbone of a song — typically played in the rhythm context rather than as a solo. Unlike a lick (which appears once), a riff is heard multiple times throughout a song. The opening of Smoke on the Water is one of the most famous guitar riffs.',
  },
  {
    term: 'Scale',
    definition: 'A defined sequence of notes within an octave, organized by the intervals between them. Scales provide the note pool for both melody and harmony. The minor pentatonic scale (5 notes) and the natural minor scale (7 notes) are the most used lead guitar scales in rock and blues.',
    usedInDay: 8,
  },
  {
    term: 'Slide (technique)',
    definition: 'Moving a fretting finger along the string from one fret to another while maintaining string pressure, so the pitch glides continuously between two notes. Notated as "/" (slide up) or "\\" (slide down) in tab. A legato slide picks only the starting note; a shift slide picks both the start and end.',
    usedInDay: 6,
  },
  {
    term: 'Slur',
    definition: 'A general term for any technique that sounds a note without a separate pick stroke. On guitar, slurs include hammer-ons, pull-offs, and slides. The term comes from classical music notation where a curved line above or below notes indicates they should be played smoothly and connected.',
  },
  {
    term: 'Staccato',
    definition: 'Short, detached notes — the opposite of legato. Staccato on guitar is achieved by quickly releasing the fretting-hand pressure after each note (causing the note to stop ringing) or by lifting the picking hand from the strings. Combining staccato and legato within a phrase creates rhythmic contrast and dynamics.',
  },
  {
    term: 'String Gauge',
    definition: 'The thickness of guitar strings, measured in thousandths of an inch. Lighter gauges (e.g., 0.009–0.042) are easier to bend and fret but produce less volume and sustain. Heavier gauges (0.010–0.046 or higher) require more force but reward with richer tone. Most beginners start with 9s or 10s.',
  },
  {
    term: 'Sweep Picking',
    definition: 'An advanced picking technique where the pick glides across adjacent strings in one smooth motion (a "sweep"), with each string fretted and released in sequence. Used for fast arpeggios across multiple strings. Requires highly coordinated left and right hand synchronization.',
  },
  {
    term: 'Tablature (TAB)',
    definition: 'A notation system for guitar that uses six horizontal lines (one per string) with numbers indicating which fret to press. Tab shows where to play but not rhythm unless rhythm notation is added above. It is the standard notation format for self-taught guitarists and is how most rock and blues music is shared online.',
    usedInDay: 2,
  },
  {
    term: 'Technique',
    definition: 'The physical method of producing a sound on the instrument — how the pick moves, how the fretting finger lands, how a bend is executed. Technique is the "how" of playing, distinct from musicality which is the "what" and "why." Poor technique limits speed, tone, and stamina; good technique removes limitations.',
    usedInDay: 1,
  },
  {
    term: 'Trill',
    definition: 'A rapid, continuous alternation between two adjacent notes using hammer-ons and pull-offs in a repeated cycle — for example, 5h7p5h7p5h7. Trills can be sustained for several beats and are used for ornamentation and intensity. The speed of a trill is determined by the strength and independence of the fretting fingers.',
    usedInDay: 5,
  },
  {
    term: 'Vibrato',
    definition: 'A rapid, controlled oscillation of pitch around a held note — the note bends slightly sharp and returns repeatedly in a rhythmic pattern. On guitar, vibrato is produced by repeatedly bending the string up and releasing, driven by wrist rotation. It is the most personal and identifiable element of a guitarist\'s sound.',
    usedInDay: 13,
  },
  {
    term: 'Whole Step',
    definition: 'An interval of two semitones (two frets). The same as a full step. Moving up one whole step from D gives E. Whole-step bends — bending up by two frets\' worth of pitch — are the most common bend in blues-rock soloing.',
    usedInDay: 12,
  },
  {
    term: 'Whammy Bar',
    definition: 'Also called a tremolo arm or vibrato bar, this lever attached to the bridge of some electric guitars (e.g., Stratocaster, Floyd Rose) allows the player to lower or raise the pitch of all strings simultaneously by pushing or pulling the bar. Used for dramatic pitch dips, dive bombs, and subtle vibrato effects.',
  },
  {
    term: 'Nut',
    definition: 'The small slotted piece of bone, plastic, or synthetic material at the top of the guitar neck, between the headstock and fretboard. The nut sets the spacing and height (action) of the open strings. A poorly cut nut causes tuning instability and buzzing on open strings.',
  },
]

// Group terms alphabetically
function buildAlphabetGroups(terms: Term[]): Record<string, Term[]> {
  const sorted = [...terms].sort((a, b) => a.term.localeCompare(b.term))
  const groups: Record<string, Term[]> = {}
  for (const t of sorted) {
    const letter = t.term[0].toUpperCase()
    if (!groups[letter]) groups[letter] = []
    groups[letter].push(t)
  }
  return groups
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  name: 'Guitar Glossary — First Guitar Solo',
  description: 'A comprehensive glossary of guitar techniques and terms used in the First Guitar Solo course.',
  hasDefinedTerm: TERMS.map((t) => ({
    '@type': 'DefinedTerm',
    name: t.term,
    description: t.definition,
  })),
}

export default function GlossaryPage() {
  const groups = buildAlphabetGroups(TERMS)
  const presentLetters = new Set(Object.keys(groups))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#e5e5e5' }}>
        <Navbar />

        <main id="main-content" style={{ maxWidth: 800, margin: '0 auto', padding: '48px 16px 80px' }}>
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Guitar Glossary' }]} />
          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', marginBottom: 8 }}>
              Guitar Glossary
            </h1>
            <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: 1.6 }}>
              Every technique and term you will encounter in the course — defined in plain English.
            </p>
          </div>

          {/* Sticky alphabet bar */}
          <nav
            aria-label="Alphabet navigation"
            style={{
              position: 'sticky',
              top: 64,
              zIndex: 10,
              backgroundColor: 'rgba(10,10,10,0.95)',
              backdropFilter: 'blur(8px)',
              borderBottom: '1px solid #1f1f1f',
              padding: '10px 0 8px',
              marginBottom: 32,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            {ALPHABET.map((letter) => (
              <a
                key={letter}
                href={presentLetters.has(letter) ? `#letter-${letter}` : undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  color: presentLetters.has(letter) ? '#f59e0b' : '#3f3f3f',
                  cursor: presentLetters.has(letter) ? 'pointer' : 'default',
                  transition: 'background 0.15s',
                }}
              >
                {letter}
              </a>
            ))}
          </nav>

          {/* Term groups */}
          {Object.entries(groups).map(([letter, terms]) => (
            <section key={letter} id={`letter-${letter}`} style={{ marginBottom: 48 }}>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: '#f59e0b',
                  borderBottom: '1px solid #1f1f1f',
                  paddingBottom: 8,
                  marginBottom: 24,
                }}
              >
                {letter}
              </h2>
              <dl style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {terms.map((t) => (
                  <div
                    key={t.term}
                    style={{
                      backgroundColor: '#111111',
                      border: '1px solid #1f1f1f',
                      borderRadius: 8,
                      padding: '16px 20px',
                    }}
                  >
                    <dt
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 8,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                        {t.term}
                      </span>
                      {t.usedInDay !== undefined && (
                        <span
                          style={{
                            backgroundColor: 'rgba(245,158,11,0.15)',
                            border: '1px solid rgba(245,158,11,0.3)',
                            color: '#f59e0b',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 999,
                          }}
                        >
                          Used in Day {t.usedInDay}
                        </span>
                      )}
                    </dt>
                    <dd style={{ margin: 0, color: '#a3a3a3', fontSize: '0.875rem', lineHeight: 1.7 }}>
                      {t.definition}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </main>
      </div>
    </>
  )
}
