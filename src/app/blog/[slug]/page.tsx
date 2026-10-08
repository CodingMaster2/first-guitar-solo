import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { POSTS, type BlogPost } from '@/lib/blog-posts'
import Breadcrumb from '@/components/Breadcrumb'

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

  'guitar-practice-tips-for-beginners': {
    intro:
      "If you practice guitar the wrong way, you can put in thousands of hours and barely improve. The difference between players who advance quickly and those who plateau for years isn't talent — it's how they practice. Here are seven evidence-based strategies that professional guitarists use to make every minute of practice count.",
    sections: [
      {
        heading: 'The Problem With Mindless Repetition',
        body: "Most beginners sit down with their guitar and run through what they already know. It feels comfortable, it feels productive, and it produces almost no improvement. This is called blocked practice — repeating a skill you already have. Research on motor learning consistently shows that blocked practice creates the illusion of progress without the reality. Real improvement comes from a different kind of practice: deliberate practice, where you work specifically on what you can't yet do, make mistakes, correct them, and repeat. This is uncomfortable by design. If practice always feels easy, you're probably not actually learning.",
      },
      {
        heading: 'Tip 1: Practice Slow to Learn Fast',
        body: "Speed is a byproduct of accuracy, not the other way around. When you practice something slowly and correctly, your nervous system encodes the correct movement pattern. When you practice something fast and sloppily, you encode the sloppy version — and that's what comes out under pressure. The rule of thumb: practice at whatever tempo lets you play accurately 95% of the time. If you're making more than one mistake per four bars, slow down. Use a metronome, start at 60% of your target tempo, and only increase by five BPM when you can play cleanly at the current speed three times in a row. This is slower than feels instinctive, but it is dramatically more effective.",
      },
      {
        heading: 'Tip 2: Use a Metronome From Day One',
        body: "Rhythm is half of music. A guitarist with perfect technique but poor timing sounds worse than one with rough technique and rock-solid rhythm. Most beginners avoid metronomes because they feel like a constraint. They're actually the opposite — a metronome gives you a foundation to play against, which frees you to focus on your fretting and picking. Start every technique exercise with a metronome. Set it to a tempo where you feel comfortable, play along with it, and gradually increase the speed over days and weeks. Free apps like GuitarTuna or Metronome Beats work perfectly. A physical metronome is even better because you can hear it over the guitar.",
      },
      {
        heading: 'Tip 3: Break Songs Into Tiny Sections',
        body: "When most beginners try to learn a song or solo, they start from the beginning, play until they make a mistake, start over, play until they make a mistake, start over. This is the least efficient possible learning method. It means you always over-practice the beginning and under-practice the hard parts. Instead, identify the exact bar or passage where your playing breaks down. Isolate just that two-bar section. Practice only that section, slowly, with a metronome, until it's clean. Then practice the two bars before it and the two bars after it. Then stitch them together. This targeted approach, called part practice followed by whole practice, is how professional musicians learn complex pieces.",
      },
      {
        heading: 'Tip 4: Record Yourself Playing',
        body: "Your brain lies to you. When you play, you hear what you intended to play, not necessarily what you actually played. Recording yourself removes this filter. Even a basic phone recording reveals problems — rushing the beat, bends that are slightly off pitch, transitions that hiccup — that you completely missed while playing. Record yourself once a week on the same passage. Watch the recordings back-to-back monthly. The improvement will sometimes shock you, which is powerful motivation. The problems the recordings reveal are your practice agenda for the next week.",
      },
      {
        heading: 'Tip 5: The 80/20 Rule for Guitar',
        body: "The 80/20 principle applies to guitar: roughly 20% of techniques and concepts are responsible for 80% of the impact on your playing. For lead guitar, that 20% is: the minor pentatonic scale (Box 1), whole-step string bends, vibrato, alternate picking, and legato (hammer-ons and pull-offs). If you master these five skills, you can play convincingly in almost any rock or blues context. Don't scatter your practice time across 30 different things. Identify your highest-leverage skills and spend the majority of your time on them until they're solid. Then, and only then, expand your vocabulary.",
      },
      {
        heading: 'Tip 6: Practice at the Edge of Your Ability',
        body: "Psychologist Anders Ericsson spent decades studying expert performers across fields. His central finding: experts don't practice what they can do — they practice what they almost can't do. This principle, called deliberate practice, applies directly to guitar. If you can play a passage cleanly at 100 BPM, set the metronome to 105 BPM and work there. If you can bend a whole step accurately, practice bends that stretch a step and a half. The edge of your ability is where learning happens. Playing in your comfort zone builds confidence but not skill. This is uncomfortable, and it should be — discomfort is the feeling of your brain restructuring itself.",
      },
      {
        heading: 'Tip 7: Track Your Progress Systematically',
        body: "What gets measured gets improved. Keep a simple practice log — even a notes app on your phone works. Write down what you practiced, the tempo you worked at, and what specifically felt difficult. Review it weekly. This does three things: it forces you to articulate what your actual weaknesses are, it shows you concrete progress over time (which is motivating), and it reveals patterns — techniques that keep appearing in your problem areas week after week. Those repeated problems are where you need to invest more time. Most guitarists who plateau are practicing the wrong things without realizing it. A practice log makes the right things obvious.",
      },
    ],
    takeaway:
      "The difference between guitarists who improve quickly and those who stall comes down to practice quality, not practice quantity. Slow down, use a metronome, isolate your weaknesses, record yourself, and track your progress. These seven habits are what deliberate practice looks like in real life.",
  },

  'pentatonic-scale-guitar-beginners-guide': {
    intro:
      "If you want to understand why the pentatonic scale is so fundamental, consider this: virtually every iconic rock guitar solo you've ever heard — Hendrix, Clapton, Page, Slash, Angus Young, David Gilmour — uses it as the primary vocabulary. The minor pentatonic isn't a stepping stone to real guitar. It is real guitar. Here's everything you need to know to start using it in your own playing.",
    sections: [
      {
        heading: 'What Is the Pentatonic Scale?',
        body: "The minor pentatonic scale is a five-note scale derived from the natural minor scale by removing the second and sixth degrees. In A minor, the full natural minor scale is: A, B, C, D, E, F, G. Remove the B and F, and you get the A minor pentatonic: A, C, D, E, G. Those five notes, and only those five, are the raw material of most rock and blues lead guitar. The reason they work so well together is that the two removed notes are the ones most likely to clash with chord tones in a blues or rock progression. By eliminating them, the pentatonic scale becomes almost mistake-proof — nearly any combination of these five notes sounds musical.",
      },
      {
        heading: 'Why Every Guitarist Learns It First',
        body: "The pentatonic scale is taught first for a simple reason: it works immediately. Within a week of learning the first position, a beginner can improvise over a backing track and sound genuinely musical. This early success is crucial for motivation — it shows you that playing real music is within reach. The scale also transfers across styles. Blues, rock, country, R&B, pop — all of them use the pentatonic as a foundation. Learning it doesn't limit you to one genre; it gives you access to many. And because the scale pattern stays the same shape in every key (you just move it to a different starting fret), knowing one position means knowing it in all 12 keys.",
      },
      {
        heading: 'The 5 Box Positions',
        body: "The minor pentatonic scale has five standard positions (called 'boxes') that cover the entire neck. Each box connects to the next, and together they form a complete map of the scale across the fretboard. Box 1 starts at the root note on the low E string. Box 2 starts a minor third up. Box 3 starts a perfect fourth up. Box 4 starts a perfect fifth up. Box 5 starts a minor seventh up. Most guitarists spend their entire career primarily in Boxes 1 and 4, occasionally venturing into 2, 3, and 5. You don't need to know all five to start playing good solos — Box 1 alone contains more music than most players ever fully explore.",
      },
      {
        heading: 'Starting With Box 1',
        body: "Box 1 in A minor (the most common key for blues and rock) starts at the fifth fret. Here is the pattern: low E string (5th fret, 8th fret), A string (5th fret, 7th fret), D string (5th fret, 7th fret), G string (5th fret, 7th fret), B string (5th fret, 8th fret), high E string (5th fret, 8th fret). The root notes are on the low E string at the 5th fret (A), the D string at the 7th fret (A), and the high E string at the 5th fret (A). Start by running this pattern up and down with alternate picking until you can do it smoothly at 80 BPM. Then start experimenting — try ascending just three notes, descending four, starting from the middle of the scale. That's where improvisation begins.",
      },
      {
        heading: 'Adding Bends to Bring It to Life',
        body: "A scale is just raw material. What makes it music is expression, and the primary expressive tool in rock lead guitar is the string bend. The most useful bend in Box 1 of A minor pentatonic is on the G string at the 7th fret — a whole step bend up to A. This single bend, played with vibrato on top, is one of the most recognizable sounds in all of rock music. B.B. King built an entire career on variations of this one move. To practice it: fret the G string at the 7th fret with your ring finger (backed up by your middle and index fingers), pick the note, and push the string upward toward the ceiling until you hear it pitch up by one whole step. It should land on the same pitch as the 9th fret (A). Accuracy matters more than speed here.",
      },
      {
        heading: 'Connecting the Boxes',
        body: "Once Box 1 is solid, you can begin connecting it to Box 4 (which starts at the 12th fret in A minor). The simplest connection is a position shift: play Box 1 up to the high E string, then slide your index finger up to the 12th fret and continue in Box 4. This doubles your range on the neck and opens up new melodic territory. You can also move horizontally across a single string — playing pentatonic notes across all six strings on one fret area before shifting up. Professional guitarists think of the neck as a continuous pentatonic landscape rather than isolated boxes. The boxes are just training wheels that help you learn the geography.",
      },
      {
        heading: 'Famous Solos That Use Only Pentatonic',
        body: "Here are classic solos that stay almost entirely within the minor pentatonic scale: the first solo in 'Comfortably Numb' by Pink Floyd (David Gilmour, Box 1 and 4 in B minor), the 'Pride and Joy' opening lick by Stevie Ray Vaughan (A minor pentatonic), 'Sunshine of Your Love' by Cream (A minor pentatonic riff), and the 'Knockin' on Heaven's Door' solo by Slash (G minor pentatonic). These aren't simplifications or beginner-friendly adaptations — these are some of the most celebrated guitar moments in rock history, all built from the same five notes you're learning right now.",
      },
      {
        heading: 'Your Next Steps',
        body: "After mastering Box 1 in A minor, your development path is: (1) Add the blues note — the flattened fifth, which sits between the fourth and fifth of the scale and gives blues its characteristic tension. In Box 1 of A minor, that's the 6th fret on the G string. (2) Learn Box 4 at the 12th fret and practice connecting it to Box 1. (3) Start learning to target chord tones — notes in the scale that land on beats one and three in a way that emphasizes the underlying harmony. (4) Study the phrasing of one great guitarist closely. Slow down their solos and notice how they breathe, where they leave space, and how they use rhythmic variation within the same five notes.",
      },
    ],
    takeaway:
      "The pentatonic scale isn't a beginner compromise. It's the actual foundation of lead guitar. Box 1 in A minor, with even one good bend, contains more musical possibility than most players explore in years. Learn the shape, add bends, play over a backing track, and let the scale teach you what music sounds like.",
  },

  'electric-vs-acoustic-guitar-for-beginners': {
    intro:
      "When someone decides to learn guitar, the first question is almost always: electric or acoustic? It seems like a straightforward question. It isn't. The right answer depends entirely on what you want to play, and both instruments have real advantages for certain goals. Here's the honest breakdown — and a clear recommendation for players whose goal is learning to play solos.",
    sections: [
      {
        heading: 'The Case for Acoustic',
        body: "Acoustic guitar has some genuine advantages for beginners. It requires no amplifier, which means less setup, less cost, and more portability. You can pick it up from anywhere in your home and play without plugging anything in. Acoustic guitar also builds finger strength faster — the higher string action (the distance between strings and fretboard) and heavier strings require more force to press down cleanly. Many experienced players believe this translates to better technique over time. The acoustic is also more forgiving in some ways: the absence of distortion or effects means mistakes are obvious, which forces honest self-assessment. And there's something about the acoustic sound — warm, unplugged, immediate — that many players find emotionally compelling from day one.",
      },
      {
        heading: 'The Case for Electric',
        body: "Electric guitar has fundamentally different physical properties that make specific techniques easier to learn. String bends — the core expressive technique of rock and blues soloing — are significantly easier on electric because of lighter string gauges (typically 0.009 or 0.010 inch) and lower action. A whole-step bend on an acoustic with medium strings requires considerably more finger strength than the same bend on an electric. Vibrato is similarly more accessible on electric. For players learning rock or blues techniques, electric guitar is simply the right tool for the job. Additionally, the lower string action on electric makes hammer-ons, pull-offs, and legato playing more achievable for beginners, which allows faster progress on lead techniques in the early months.",
      },
      {
        heading: 'What About Classical?',
        body: "Classical guitar (nylon string) deserves mention because some beginners are drawn to its softer feel. Nylon strings are indeed gentler on fingertips than steel strings, and classical technique is beautiful and demanding in its own right. However, if your goal is rock, blues, or contemporary lead playing, classical guitar is the wrong starting point. The technique is completely different (almost exclusively fingerstyle, with strict right-hand form requirements), and the skills don't transfer directly to rock lead playing. Choose classical only if you genuinely want to learn classical music — it's a separate instrument in practice, even if it looks similar.",
      },
      {
        heading: 'Physical Differences That Matter',
        body: "Several physical differences between acoustic and electric guitars have real consequences for beginners. String gauge: electric strings are typically lighter, making bending and fretting easier. Action (string height): electric guitars are usually set up with lower action, reducing the force needed to fret notes cleanly. Neck profile: acoustic necks are often wider, which can make chord shapes harder for players with smaller hands. Body weight: acoustics are generally lighter, which matters for longer practice sessions while standing. Scale length: most acoustics and electrics have similar scale lengths, but some student electrics (like 3/4 scale guitars) have shorter scales, which can be helpful for younger players or those with smaller hands.",
      },
      {
        heading: 'Cost Considerations',
        body: "The commonly cited advantage of acoustic — that it's cheaper because you don't need an amp — is partially true but often overstated. A decent beginner acoustic runs $150-300. A decent beginner electric (like a Squier Stratocaster or Epiphone Les Paul Standard) runs $200-350, and a small practice amp adds another $50-100. The all-in cost of a solid beginner electric setup is typically $250-450. If budget is a strict constraint, acoustic wins on total cost. But the price difference is not so large that it should override your actual musical goals. Buying the wrong instrument for your goals, then losing motivation and quitting, is far more expensive than the difference between a $200 acoustic and a $300 electric.",
      },
      {
        heading: 'The Goal-Based Decision',
        body: "The simplest framework: match the instrument to the music you want to play. If you want to play singer-songwriter material, folk, or acoustic country — buy an acoustic. If you want to play rock, blues, metal, or contemporary pop lead guitar — buy an electric. If you're genuinely unsure, ask yourself which ten songs you most want to eventually play. If most of them are primarily acoustic songs (Wonderwall, Wish You Were Here, Fast Car), buy an acoustic. If most of them feature electric lead guitar prominently (virtually any Hendrix, Clapton, or Santana track), buy an electric. Your future self will thank you for choosing the right tool.",
      },
      {
        heading: 'Our Recommendation for Solo Players',
        body: "If you're reading this on a program specifically designed to teach you how to play a guitar solo, the answer is electric. String bending, vibrato, and the legato techniques taught in this program are all techniques developed on and optimized for electric guitar. An electric also lets you plug into an amplifier and hear the effects that complement the techniques — light overdrive makes bends sound like they should sound. A budget electric like the Squier Classic Vibe Stratocaster ($450), the Squier Affinity Stratocaster ($230), or the Epiphone Les Paul Standard ($300) will serve you well through this program and far beyond. All of these are used by working musicians, not just beginners.",
      },
      {
        heading: 'Getting Started on Either',
        body: "Whichever instrument you choose, a few universal recommendations apply. Buy from a music store where you can try the instrument, or buy from a retailer with a good return policy. Get a setup (professional adjustment of action and intonation) if the guitar is new — many factory setups are mediocre. Learn to tune by ear using a reference pitch, not just by plugging into a tuner every time. And start with a structured program or a clear goal rather than random YouTube tutorials. The instrument matters less than the consistency and structure of your practice.",
      },
    ],
    takeaway:
      "For lead guitar specifically — bending, vibrato, pentatonic soloing — electric guitar is the right instrument. The physical properties match the techniques. If your goal is rock or blues soloing, buy an electric, invest in a small amp, and start playing. The acoustic vs. electric debate is easy once you know what you want to play.",
  },

  'guitar-bending-technique-guide': {
    intro:
      "A string bend, done well, is the most expressive sound the guitar makes. It mimics the human voice — the pitch moves continuously rather than jumping between fixed notes. A bend done badly is immediately obvious: it's flat, it strains, or it sounds mechanical. The technique itself is not complicated, but it has several specific components that most instructional material fails to address completely. This guide covers all of them.",
    sections: [
      {
        heading: 'Why Bends Are Essential for Solos',
        body: "The guitar is fundamentally a percussive instrument — when you pick a note, its volume decays immediately. Bends counteract this: they sustain attention by moving through pitch continuously, like a voice sliding between syllables. They're also the primary way a guitarist injects emotion into a single note. A slow, searching bend communicates longing. A fast, aggressive bend communicates anger or excitement. B.B. King famously said he didn't need chords because his single bent notes contained complete emotional statements. You can't play expressive blues or rock lead guitar without bends. Everything else is technique; bending is music.",
      },
      {
        heading: 'The Anatomy of a Bend',
        body: "A bend has five distinct elements: (1) Setup — where on the string you fret, how many fingers support the bend, and your thumb position. (2) The attack — the moment you pick the string before or during the bend. (3) The push — the motion that raises the pitch, which should come from rotating your wrist and forearm, not just curling your finger. (4) The target pitch — the exact note you're bending toward, which requires ear training to land accurately. (5) The release — returning the string to its original pitch, either silently or as a deliberate musical gesture. Most beginners focus only on the push and ignore the other four elements. All five contribute to whether a bend sounds professional or amateurish.",
      },
      {
        heading: 'Whole Step vs Half Step Bends',
        body: "The two most common bend types are half-step bends (raising the pitch by one semitone, equivalent to moving up one fret) and whole-step bends (raising the pitch by two semitones, equivalent to moving up two frets). In the A minor pentatonic scale, the most important whole-step bends are: G string at the 7th fret (bending up to A), B string at the 8th fret (bending up to A), and B string at the 5th fret (bending up to G). Half-step bends appear frequently in blues playing and give a characteristic 'blue note' sound. When learning, start with whole-step bends on the G string — they're the most common and have the most physical leverage.",
      },
      {
        heading: 'Building Finger Strength for Bends',
        body: "Bending requires muscles that chord playing doesn't develop. Specifically, the muscles that rotate the wrist and forearm — not just the fingertip muscles. Beginners often find their first bends feel physically difficult, especially on higher strings or higher up the neck where the string is tighter. The fastest way to build bend strength is a daily drill: set a timer for five minutes and practice only slow, controlled whole-step bends on the G string at the 7th fret. Use your ring finger backed by your middle and index fingers, rotate your wrist away from you (counterclockwise if the headstock is to your left), and bend up toward the ceiling. Release slowly and repeat. Do this every day for two weeks. The strength gain is noticeable within days.",
      },
      {
        heading: 'Common Bending Mistakes',
        body: "The four most common bending mistakes: (1) Bending with one finger — always support your bending finger with the fingers behind it on the same string. One-finger bends are weak and imprecise. (2) Bending with the finger curl instead of wrist rotation — your wrist does the work, your finger just maintains contact. (3) Not listening to the target pitch — practice by fretting the note two frets above your bend, memorizing its pitch, then bending to match it. (4) Letting the bend go flat under vibrato — many beginners add vibrato to a bend but lose the pitch center in the process. Stay locked on pitch first, add vibrato only when the pitch is stable.",
      },
      {
        heading: 'Bend and Release',
        body: "The bend-and-release is arguably the most expressive technique in blues guitar. You pick a note, bend it up to target pitch, then slowly release it back to the original note — all in one continuous motion. The result sounds like a voice sliding up to a note and back down. It's the sound that defines slow blues playing. To practice it: pick the string, bend up to your whole-step target, hold it for a moment, then release slowly and evenly. The release should be as controlled as the bend — not a snap back to original position. The sound of a controlled release is what separates blues players from rock players who can only go up.",
      },
      {
        heading: 'Pre-Bends',
        body: "A pre-bend is the opposite sequence of a regular bend: you bend silently before picking, then pick as you release back to pitch. The note starts high and falls. Pre-bends are often used to create the sound of a note 'arriving' from above — a dramatic, slightly disorienting effect when used at the right moment. They're harder to execute cleanly because you're bending without any pitch feedback until you pick. To practice: bend up silently to what you estimate is a whole step, then pick while slowly releasing. Listen critically — if it sounds like you're starting from the right pitch, you're hitting the target. If not, adjust how far you pre-bent.",
      },
      {
        heading: 'Vibrato After a Bend',
        body: "Adding vibrato to the top of a bend is one of the signature sounds of classic rock guitar. The sequence: bend up to target pitch, stabilize at that pitch for a half-beat, then add vibrato by rocking the pitch slightly above and back to the bend target repeatedly. The vibrato should be centered on the bent pitch, not the original pitch. A common mistake is letting the vibrato drag the note flat — it should oscillate above and around the target, not below it. B.B. King's vibrato, one of the most recognizable in history, is a narrow, fast vibrato at the very top of a bend. Start with a wider, slower vibrato and narrow it as your control improves.",
      },
      {
        heading: 'Practicing Bends With a Tuner',
        body: "A chromatic tuner is the most effective tool for developing accurate bends. Set it to display cents (hundredths of a semitone). Pick your pre-bend reference pitch, watch the tuner, then bend and watch where you land. A whole-step bend starting on G at the 7th fret should land on A — that's exactly 200 cents above G. Most beginners land 10-30 cents flat initially. Drill the same bend repeatedly while watching the tuner until you consistently land within 10 cents of pitch. Once you can do this on the G string, repeat the drill on the B string. Tuner-based bend training feels tedious but dramatically accelerates pitch accuracy.",
      },
      {
        heading: 'Building Bends Into Your Solos',
        body: "Bends are most effective when they're used purposefully rather than reflexively. A few principles: (1) Target strong beats — bends that land on beat one or beat three feel more resolved than bends that land on weak beats. (2) Use rests before bends — a bend preceded by a moment of silence has more impact than one that follows immediately from another note. (3) Vary your bend depth — not every bend needs to be a full whole step. Half-step bends, one-and-a-half-step bends, and quarter-tone bends each have different emotional textures. (4) Connect bends to other techniques — a bend followed by a pull-off, or a bend-and-release followed by a slide, creates melodic phrases that feel composed rather than random.",
      },
    ],
    takeaway:
      "Bending is where technique becomes music. The physical mechanics — three-finger support, wrist rotation, ear training, and daily strength building — are learnable in weeks. But the expressive dimension of bending — knowing when to bend, how far, how fast, and what comes after — takes years to develop fully. Start with the mechanics, then listen to great guitarists and study their bends. That's how the technique becomes a voice.",
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
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: post.title },
          ]}
        />

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
