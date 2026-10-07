import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

interface Challenge {
  id: number
  title: string
  description: string
  technique: string
  xp: number
}

const CHALLENGES: Challenge[] = [
  { id: 1, title: 'Clean Open Chords', description: 'Play Am, Em, D cleanly 10 times each without buzzing', technique: 'chord', xp: 25 },
  { id: 2, title: 'Spider Exercise', description: 'Do the 1-2-3-4 spider exercise for 5 minutes straight', technique: 'technique', xp: 30 },
  { id: 3, title: 'Hammer-On Run', description: 'Play the pentatonic scale using only hammer-ons up and down twice', technique: 'hammer-on', xp: 35 },
  { id: 4, title: 'Pull-Off Practice', description: 'Execute clean pull-offs on every string 15 times each', technique: 'pull-off', xp: 35 },
  { id: 5, title: 'Vibrato Control', description: 'Hold a note with smooth vibrato for 30 seconds without losing pitch', technique: 'vibrato', xp: 40 },
  { id: 6, title: 'Whole-Step Bend', description: 'Bend the B string up a whole step 20 times cleanly in tune', technique: 'bend', xp: 40 },
  { id: 7, title: 'Pentatonic Slide', description: 'Play the minor pentatonic using slides between every note pair', technique: 'slide', xp: 30 },
  { id: 8, title: 'Alternate Picking Speed', description: 'Play 16th notes on one string at 80 BPM for 2 minutes', technique: 'picking', xp: 35 },
  { id: 9, title: 'String Skipping', description: 'Play arpeggios skipping strings on all open chord shapes', technique: 'technique', xp: 45 },
  { id: 10, title: 'Rhythm Strumming', description: 'Strum a D-A-Em-G progression with a locked 8th-note groove for 3 minutes', technique: 'rhythm', xp: 25 },
  { id: 11, title: 'Half-Step Bends', description: 'Execute precise half-step bends on the G string 20 times each', technique: 'bend', xp: 35 },
  { id: 12, title: 'Trill Workout', description: 'Trill hammer-ons and pull-offs between frets 5 and 7 for 3 minutes', technique: 'trill', xp: 40 },
  { id: 13, title: 'Scale in Position', description: 'Play the A minor pentatonic scale in all 5 positions slowly', technique: 'scales', xp: 30 },
  { id: 14, title: 'Muting Mastery', description: 'Play a riff using palm muting with precise on/off control', technique: 'technique', xp: 25 },
  { id: 15, title: 'Chord Transitions', description: 'Switch between G, C, D, Em with no pause 50 times', technique: 'chord', xp: 25 },
  { id: 16, title: 'Bending in Tune', description: 'Record yourself bending and play it back — are you in tune?', technique: 'bend', xp: 50 },
  { id: 17, title: 'Legato Run', description: 'Play the pentatonic scale using only hammer-ons and pull-offs, no picks', technique: 'legato', xp: 45 },
  { id: 18, title: 'Power Chord Riff', description: 'Create a 4-bar power chord riff and play it 5 times through', technique: 'chord', xp: 30 },
  { id: 19, title: 'Slow Vibrato', description: 'Play vibrato at the slowest speed you can while keeping it even', technique: 'vibrato', xp: 35 },
  { id: 20, title: 'Slide Control', description: 'Slide from fret 5 to fret 12 on the G string and land in tune', technique: 'slide', xp: 35 },
  { id: 21, title: 'Economy Picking', description: 'Play a 3-note-per-string scale using economy picking', technique: 'picking', xp: 40 },
  { id: 22, title: 'Minor Scale Harmony', description: 'Play the natural minor scale starting from every note of Am pentatonic', technique: 'scales', xp: 30 },
  { id: 23, title: 'Pre-bend and Release', description: 'Bend before picking, then release — 15 times clean on the B string', technique: 'bend', xp: 45 },
  { id: 24, title: 'Chord Melody', description: 'Play the melody of Happy Birthday over chord shapes', technique: 'chord', xp: 50 },
  { id: 25, title: 'Fast Hammer-Ons', description: 'Do rapid hammer-ons at 100 BPM 16th notes for 1 minute', technique: 'hammer-on', xp: 45 },
  { id: 26, title: 'Hybrid Picking', description: 'Play a country-style lick using pick and middle finger together', technique: 'picking', xp: 40 },
  { id: 27, title: 'Double-Stop Bends', description: 'Play classic double-stop bends on the B and G strings 10 times', technique: 'bend', xp: 40 },
  { id: 28, title: 'Finger Independence', description: 'Play the Carcassi independence exercise for 5 minutes', technique: 'technique', xp: 35 },
  { id: 29, title: 'Call & Response', description: 'Improvise a 4-bar phrase, then answer it with another 4-bar phrase', technique: 'improvisation', xp: 50 },
  { id: 30, title: 'Full Solo Run-Through', description: "Play through the complete solo for today's lesson start to finish, 3 times", technique: 'performance', xp: 60 },
]

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000)
  const challengeIndex = dayOfYear % CHALLENGES.length
  const challenge = CHALLENGES[challengeIndex]

  return NextResponse.json({ challenge })
}
