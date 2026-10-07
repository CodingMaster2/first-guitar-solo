import type { Lesson } from '@/types'

export const LESSONS: Lesson[] = [
  // ===== WEEK 1: LEAD GUITAR FOUNDATIONS =====
  {
    day: 1,
    week: 1,
    title: 'Welcome to Lead Guitar',
    subtitle: 'Start thinking like a lead guitarist',
    why: 'Lead guitar is about single notes played with intention. Rhythm guitar fills space — lead guitar says something. Today you shift your mindset from strumming chords to speaking with individual notes. Every great solo starts here.',
    duration: 15,
    warmup: 'Pick up your guitar and play each string open, one at a time, from the thickest (low E) to the thinnest (high e). Let each string ring until it stops naturally. This is your first ear training: learn what a clean, open string sounds like.',
    mainContent: `<h3>Physical Setup — Do This First</h3>
<p>Before playing a single note, get your body right. Poor posture makes everything harder and can cause pain that ends your practice sessions early.</p>
<p><strong>Sitting position:</strong> Sit upright on the front half of a chair. Rest the guitar's waist (the indent in the body) on your right thigh. The guitar neck tilts slightly upward — not horizontal, not pointing at the floor.</p>
<p><strong>Fretting hand:</strong> Your thumb sits behind the neck, roughly opposite your middle finger. Don't wrap your thumb over the top of the neck. Your wrist stays low — the palm of your hand should not press against the bottom of the neck.</p>
<p><strong>Picking hand:</strong> Rest your forearm lightly on the top edge of the guitar body. Your wrist hangs near the strings. Relax your shoulder completely — no hunching.</p>

<h3>How to Hold the Pick</h3>
<p>Pinch the pick between your index finger and thumb. The pointed tip should stick out about 5–8mm past your finger. Hold it at roughly a 15–20 degree angle to the string — not perfectly flat, slightly tilted toward the headstock. This reduces string resistance and improves tone.</p>
<p>Grip it firmly enough that it won't fly out of your hand, but not so tight that your hand cramps. If your hand gets tired holding the pick, you're gripping too hard.</p>

<h3>Thinking Like a Lead Guitarist</h3>
<p>Rhythm guitarists think in shapes — chord shapes, strum patterns, progressions. Lead guitarists think in notes — individual pitches, the spaces between them, the feeling of each one.</p>
<p>When you play lead, every note is a decision. You decide:</p>
<ul>
  <li>Which note to play</li>
  <li>How long to hold it</li>
  <li>How hard to attack it</li>
  <li>Whether to bend it, slide into it, or let it ring clean</li>
</ul>
<p>This 30-day program will build these decisions into your muscle memory. By Day 30, you won't be thinking — you'll be playing.</p>

<h3>The Chromatic Exercise</h3>
<p>Today's exercise uses the low E string and four consecutive frets. This is the foundation exercise for lead guitar technique — it builds finger independence, strength, and clean articulation.</p>
<p>One finger per fret, starting at fret 5:</p>
<pre>e |-----------------|
B |-----------------|
G |-----------------|
D |-----------------|
A |-----------------|
E |--5--6--7--8-----|</pre>
<p>Index finger on fret 5, middle finger on fret 6, ring finger on fret 7, pinky on fret 8. Every note on its own beat. Every note clean.</p>
<p>Press each string directly behind the fret wire — not on top of it, not far from it. Use just enough pressure to get a clean note. Pressing harder than necessary causes hand fatigue.</p>`,
    exercise: 'Play the chromatic exercise on the low E string: frets 5-6-7-8, one finger per fret, down-pick each note. Set a metronome to 50 BPM if you have one — one note per click. Do 10 full repetitions. Then try it on the A string (same frets, same fingering). Rest 60 seconds, then do 10 more on the low E. Total practice time: 10 minutes. Stop immediately if you feel sharp pain — mild finger soreness is normal, but sharp joint pain is a signal to stop.',
    selfCheck: 'Each note should ring clearly for its full duration before the next note. If you hear any buzzing, adjust your finger placement — press right behind the fret, not on top of it. After 10 repetitions you should notice your finger placement becoming more automatic. You are ready to move on when you can play the chromatic exercise on both the E and A strings with clean notes at least 8 out of 10 times.',
    techniques: ['single-note picking', 'finger placement', 'chromatic exercise'],
    xpReward: 50,
    prerequisites: ['A guitar and a pick — that is all you need today.'],
    quiz: [
      { question: 'Which finger goes on fret 5 in the chromatic exercise?', options: ['Index', 'Middle', 'Ring', 'Pinky'], correct: 0 },
      { question: 'What is the primary goal of clean technique?', options: ['Speed', 'String buzzing', 'Each note rings clearly', 'Playing quietly'], correct: 2 },
      { question: 'How should you press the string relative to the fret wire?', options: ['On top of the fret', 'Right behind the fret', 'Far from the fret', "It doesn't matter"], correct: 1 },
    ],
    commonMistakes: [
      'Placing the finger on top of the fret wire instead of just behind it — this causes buzzing.',
      'Using the fingertip pad instead of the very tip of the finger — this muffles adjacent strings.',
      'Pressing too hard and tensing the whole hand — use just enough pressure to get a clean note.',
      'Finger soreness and pain: your fingertips WILL hurt on the first few days. This is completely normal — you are building calluses. The soreness typically peaks around Day 3-4 and fades by the end of Week 1. Practice for 15 minutes, take a break. Do not push through sharp pain. Do not soak your fingers in water (this softens the skin and delays callus formation). The discomfort is temporary and leads to permanent toughened fingertips.',
    ],
    bonusChallenge: 'Play the chromatic exercise on all 6 strings both ascending and descending without stopping.',
    listenTo: 'Comfortably Numb — Pink Floyd (Gilmour\'s solo shows deliberate, one-note-at-a-time phrasing — the exact mindset for today)',
    warmupTip: 'Fan your fingers wide apart, hold 5 seconds, release — repeat 10 times on each hand before touching the guitar.',
    bonusContent: 'Try the same chromatic exercise on every string, not just the low E. The physical pattern is the same, but each string has a different tension. The high e string is the most challenging — start it last once your fingers are warmed up.',
    successCriteria: 'You are ready for Day 2 when you can play the chromatic exercise on the low E and A strings (frets 5-6-7-8) with every note ringing cleanly, at a steady pace, for 10 consecutive repetitions. Buzzing is expected in your first session — by the end of this session, you should be getting at least 7 clean notes out of 8.',
  },
  {
    day: 2,
    week: 1,
    title: 'Reading Tabs + Timing',
    subtitle: 'The language of guitar music',
    why: 'Guitar tabs let you read and write music without knowing traditional notation. Every guitarist uses them. You need to be fluent. Today you learn to read tabs and — critically — you learn to play them in time.',
    duration: 20,
    warmup: 'Chromatic exercise from Day 1 on the low E string at 50 BPM, 5 repetitions. Try to keep each note equally loud. Then do 5 repetitions on the A string. Note: finger soreness from Day 1 is normal — work through it.',
    mainContent: `<h3>How to Read Guitar Tabs</h3>
<p>A guitar tab has 6 lines. Each line represents a string:</p>
<pre>e |-------|  ← thinnest string (highest pitch)
B |-------|
G |-------|
D |-------|
A |-------|
E |-------|  ← thickest string (lowest pitch)</pre>
<p>Numbers on the lines represent fret positions. <strong>0</strong> means open string (no fret pressed). <strong>5</strong> means press the 5th fret.</p>

<h3>Reading Notes in Sequence</h3>
<p>Notes stacked vertically = played simultaneously (a chord). Notes spread horizontally = played in sequence (a melody or riff). Since we're learning lead guitar, most of what you'll read is horizontal — notes one at a time.</p>

<h3>Today's Tab Exercise</h3>
<p>Here's a simple 8-note figure on the B and G strings:</p>
<pre>e |------------------------|
B |--5--7--5--8--7--5--8--|
G |------------------------|
D |------------------------|
A |------------------------|
E |------------------------|</pre>
<p>Read it left to right. Pick each note with a downstroke. Don't rush — play it slowly and accurately first.</p>

<h3>Timing and the Metronome</h3>
<p>Timing is the difference between a guitarist who sounds musical and one who sounds like they're still learning. A metronome is your best practice tool. Set it to 60 BPM — one click per beat. Each note in the exercise gets one click.</p>`,
    exercise: 'Set a metronome to 60 BPM. Play the 8-note tab figure above, one note per click. Do 5 repetitions without stopping. If you miss a note, keep going — don\'t stop the time. Stopping to fix a mistake is worse than playing through it. After 5 runs, try raising the tempo to 70 BPM.',
    selfCheck: 'Are you landing on the beat, or slightly after it? The goal is to be exactly with the click — not rushing ahead, not dragging behind. It will feel slightly uncomfortable at first. That discomfort is growth.',
    techniques: ['tab reading', 'timing', 'metronome practice'],
    xpReward: 50,
    prerequisites: ['Day 1 chromatic exercise — you should be comfortable fretting single notes cleanly.'],
    crossRefs: [{ day: 1, description: 'Chromatic fretting technique applies to every tab figure you will ever read.' }],
    quiz: [
      { question: 'In guitar tab, what does the number 0 on a string mean?', options: ['Play fret 0 (does not exist)', 'Open string — no fret pressed', 'Mute the string', 'Skip the string'], correct: 1 },
      { question: 'Notes stacked vertically in a tab are played...', options: ['One at a time, ascending', 'Simultaneously', 'In any order you like', 'Only on one string'], correct: 1 },
      { question: 'What is the main purpose of a metronome while practicing?', options: ['Make it sound louder', 'Keep consistent timing', 'Teach you new scales', 'Replace a backing track'], correct: 1 },
    ],
    commonMistakes: [
      'Stopping and restarting when you miss a note — push through mistakes to train performance instincts.',
      'Reading tab without internalising the timing — tab shows which notes, not how long to hold them.',
      'Jumping to 120 BPM before you can play cleanly at 60 BPM.',
    ],
    bonusChallenge: 'Write your own 8-note tab figure and play it back accurately at 70 BPM.',
    listenTo: 'Sunshine of Your Love — Cream (Clapton\'s solo is entirely tab-readable and demonstrates strong rhythmic phrasing)',
    warmupTip: 'Before picking up the guitar, tap eighth notes on your thigh with your picking hand for 60 seconds at 60 BPM to internalize the pulse.',
    bonusContent: 'Once you can read a single-line tab, try writing one yourself. Pick five notes you like, write them out in tab format, then play what you wrote. This reinforces both reading and writing simultaneously.',
    successCriteria: 'You are ready for Day 3 when you can play the 8-note tab figure at 60 BPM, landing on the beat (not after it), for 5 consecutive repetitions without stopping. Missing one note is fine — stopping the time is not.',
  },
  {
    day: 3,
    week: 1,
    title: 'Alternate Picking',
    subtitle: 'The engine of every fast, clean guitar phrase',
    why: 'Alternate picking — down, up, down, up — is the most efficient way to move your pick through strings. It\'s the foundation of speed, and more importantly, it creates even, consistent tone. Without it, you have a ceiling. With it, you have no ceiling.',
    duration: 20,
    warmup: 'Chromatic exercise (Day 1) on low E and A strings at 55 BPM, 5 repetitions each string, all downstrokes. Then play the 8-note figure from Day 2, all downstrokes, at 60 BPM, 3 repetitions. Notice how much energy it takes to reset your pick after every note.',
    mainContent: `<h3>Why Alternate Picking?</h3>
<p>All-downstrokes work fine at slow tempos. But as speed increases, constantly lifting the pick back up for another downstroke becomes inefficient and tiring. Alternate picking (down-up-down-up) is twice as efficient because you're using the motion in both directions.</p>
<p>More importantly: alternate picking forces your upstrokes to be as clean as your downstrokes. Most guitarists have weak, sloppy upstrokes. Fixing that makes every phrase cleaner immediately.</p>

<h3>The Motion — Three Critical Details</h3>
<p>Your pick should move from the wrist, not the elbow. Small, controlled motion. The pick travels through the string and rests slightly past it — then comes back up through the string on the upstroke.</p>
<p><strong>1. Pick depth:</strong> The tip of the pick should travel through the string by about 3–5mm. Any deeper and the pick "digs in" and creates drag. Too shallow and you get thin, weak tone. Imagine barely grazing the string rather than plowing through it.</p>
<p><strong>2. Pick angle:</strong> Tilt the pick 15–20 degrees so the downstroke edge leads slightly. This lets the pick glide off the string cleanly instead of catching it. Dead straight (90 degrees to the string) causes a "thwack" sound and slows down your speed.</p>
<p><strong>3. Wrist anchor:</strong> Lightly rest the heel of your picking hand (the pinky-side edge) on the bridge saddles. This gives your wrist a pivot point. Do not anchor your elbow or forearm — only the heel of the hand, gently.</p>
<p>Direction indicator:</p>
<ul>
  <li>↓ = downstroke (pick moves toward the floor)</li>
  <li>↑ = upstroke (pick moves toward the ceiling)</li>
</ul>

<h3>Applied to the Chromatic Exercise</h3>
<pre>e |---------------------------|
B |---------------------------|
G |---------------------------|
D |---------------------------|
A |---------------------------|
E |---5---6---7---8-----------|
    ↓   ↑   ↓   ↑</pre>
<p>Fret 5 = downstroke. Fret 6 = upstroke. Fret 7 = downstroke. Fret 8 = upstroke.</p>`,
    exercise: 'Take the chromatic exercise from Day 1 (low E string, frets 5-6-7-8). Apply alternate picking: D-U-D-U. Start at 55 BPM — one note per click. Do 20 repetitions, pausing for 30 seconds after every 5. Focus on making the upstrokes sound exactly as clear and loud as the downstrokes. Then try the 8-note figure from Day 2 with alternate picking: 20 repetitions at 60 BPM. Finally, try the chromatic exercise on the A string with alternate picking: 10 repetitions.',
    selfCheck: 'Record yourself playing 30 seconds of this exercise (voice memo on your phone is fine). Listen back. Can you hear a difference between your downstrokes and upstrokes? If yes, keep working on evening them out. If no, you\'re in great shape.',
    techniques: ['alternate picking', 'pick motion', 'downstroke', 'upstroke'],
    xpReward: 50,
    prerequisites: ['Day 1: clean single-note fretting', 'Day 2: basic tab reading at 60 BPM'],
    crossRefs: [
      { day: 1, description: 'The chromatic exercise is the base pattern for alternate picking practice.' },
      { day: 2, description: "Apply alternate picking to the 8-note tab figure from Day 2's exercise." },
    ],
    quiz: [
      { question: 'What is the pick-stroke direction for alternate picking on the 3rd note?', options: ['Down', 'Up', 'Either — it does not matter', 'You do not pick it'], correct: 1 },
      { question: 'Where should the picking motion originate?', options: ['The elbow', 'The shoulder', 'The wrist', 'The whole arm'], correct: 2 },
      { question: 'Why is alternate picking more efficient than all-downstrokes at high speed?', options: ['It uses lighter strings', 'The pick travels in both directions', 'You skip some strings', 'It requires less finger pressure'], correct: 1 },
    ],
    commonMistakes: [
      'Picking from the elbow — this wastes motion and causes fatigue. Keep it in the wrist.',
      'Upstrokes that are quieter or thinner-sounding than downstrokes — they must be equal.',
      'Accidentally anchoring the pick too deep into the string, causing it to catch on the wind-up.',
    ],
    bonusChallenge: 'Play the chromatic exercise at 80 BPM with alternate picking — focus on making upstrokes as loud and clean as downstrokes.',
    listenTo: 'Eruption — Van Halen (the intro demonstrates alternate picking pushed to its absolute limit)',
    warmupTip: 'Hold the pick loosely and shake your wrist like flicking water off your fingertips for 30 seconds — this releases picking-hand tension before the exercise.',
    bonusContent: 'Try "economy picking" as a mental contrast: only use downstrokes when crossing to a lower (thicker) string, and upstrokes when crossing to a higher string. You do not need to use this yet — but understanding that alternate picking is a choice will make you a more intentional player.',
    successCriteria: 'You are ready for Day 4 when your alternate-picked chromatic exercise on the low E string sounds even — no obvious volume difference between downstrokes and upstrokes — at 60 BPM for 10 consecutive repetitions.',
    bpmTarget: 60,
  },
  {
    day: 4,
    week: 1,
    title: 'Hammer-ons',
    subtitle: 'Two notes, one pick stroke',
    why: 'A hammer-on lets you sound a note without picking it — you\'re literally hammering your fretting finger down onto the string to produce sound. This creates a smoother, more fluid sound than picking every note. It\'s how blues and rock phrases get that liquid feel.',
    duration: 20,
    warmup: 'Chromatic exercise with alternate picking, 3 repetitions at 60 BPM. Try to keep the tempo perfectly even.',
    mainContent: `<h3>What Is a Hammer-on?</h3>
<p>You pick a note on one fret, then — without picking again — you quickly bring a second finger down hard onto a higher fret on the same string. The force of the impact creates the sound of the second note.</p>
<p>In tab, hammer-ons are shown with an "h" between the two fret numbers:</p>
<pre>e |-------------|
B |---5h7-------|
G |-------------|</pre>
<p>This means: pick fret 5, then hammer onto fret 7 without picking.</p>

<h3>The Technique</h3>
<p>Your hammering finger needs to come down hard and fast — not slowly pressed. Think of a hammer hitting a nail. The motion should be quick and deliberate. Your finger should land right behind the fret wire, just like normal fretting.</p>

<h3>Extended Hammer-on Phrase</h3>
<pre>e |------------------------|
B |---5h7h8h10------------|
G |------------------------|</pre>
<p>Pick fret 5. Hammer 7. Hammer 8. Hammer 10. Four notes, one pick stroke.</p>`,
    exercise: 'On the B string: pick fret 5, hammer onto fret 7 without picking again. Listen — is the hammered note as loud as the picked note? Repeat 25 times, resting 30 seconds after every 10. Then try the 4-note hammer-on phrase (5h7h8h10) — 20 repetitions. Finally, alternate the phrases: pick fret 5-hammer 7 (2 notes), then pick fret 5-hammer 7-hammer 8-hammer 10 (4 notes). Do 10 cycles of alternating. Total practice: 10-12 minutes on hammer-ons only. Finger tip soreness is expected and normal this week.',
    selfCheck: 'The hammered note should be close to the same volume as the picked note. If it\'s much quieter, hammer harder. If it\'s buzzing, adjust your finger placement. The transition between picked note and hammered note should sound smooth — not like two separate events.',
    techniques: ['hammer-on', 'legato', 'fret-hand technique'],
    xpReward: 50,
    prerequisites: ['Day 3: alternate picking — hammer-ons start with a picked note, so picking must be clean.'],
    crossRefs: [
      { day: 5, description: 'Hammer-ons pair directly with pull-offs on Day 5 to form the full legato vocabulary.' },
      { day: 11, description: 'Used extensively in the legato phrasing lesson.' },
    ],
    quiz: [
      { question: 'How do you create the sound of a hammer-on note?', options: ['Pick it harder', 'Slide into it', 'Bring a finger down hard onto the fret', 'Tap the guitar body'], correct: 2 },
      { question: 'In tab, how is a hammer-on written between frets 5 and 7?', options: ['5s7', '5h7', '5/7', '5~7'], correct: 1 },
      { question: 'How many pick strokes does a 4-note hammer-on phrase (5h7h8h10) require?', options: ['4', '3', '2', '1'], correct: 3 },
    ],
    commonMistakes: [
      'Hammering too slowly — the motion must be quick and deliberate, like a nail hammer, not a slow press.',
      'Landing the finger flat on the fret instead of right behind it, causing a dull thud instead of a note.',
      'Losing the volume of the hammered notes — they should be nearly as loud as a picked note.',
      'Week 1 callus checkpoint: if your finger tips are sore but not painful (a dull ache, tender to the touch), this is normal and means you are building calluses. If you feel sharp pain in the joints of your fingers or wrist, stop and rest for the day. Callus soreness resolves within 7-10 days of consistent practice.',
    ],
    bonusChallenge: 'Execute the 4-note hammer chain (5h7h8h10) on every string from low E to high e in order.',
    listenTo: 'Eruption — Van Halen (the tapping section is built entirely on the hammer-on motion; hear how loud and clear each struck note is)',
    warmupTip: 'Tap each finger independently on a hard surface 20 times — index, middle, ring, pinky — to warm up finger independence before hammer-on practice.',
    bonusContent: 'Hammer-ons are the core of tapping technique used by players like Eddie Van Halen. Once you have a reliable hammer-on, two-hand tapping becomes accessible. For now, practice the motion with your fretting hand only until it is second nature.',
    successCriteria: 'You are ready for Day 5 when you can execute 10 consecutive 2-note hammer-ons (fret 5 to fret 7 on the B string) where the hammered note is clearly audible and roughly equal in volume to the picked note.',
  },
  {
    day: 5,
    week: 1,
    title: 'Pull-offs',
    subtitle: 'The other half of legato playing',
    why: 'Pull-offs are the reverse of hammer-ons. Where hammer-ons go up in pitch, pull-offs come down. Together they create the rolling, connected phrases that define blues-rock lead playing. Master both and your phrasing will sound fundamentally more musical.',
    duration: 20,
    warmup: 'Play the Day 4 hammer-on phrase (5h7h8h10 on B string) 5 times. Focus on volume consistency across all notes.',
    mainContent: `<h3>What Is a Pull-off?</h3>
<p>A pull-off is the reverse of a hammer-on. You have two fingers fretted on the same string. You pick the higher fret, then pull your finger off — but you don't just lift it straight up. You pull it slightly downward (toward the floor), which plucks the string and sounds the lower note.</p>
<p>In tab, pull-offs are shown with a "p":</p>
<pre>e |-------------|
B |---7p5-------|
G |-------------|</pre>
<p>This means: place fingers on frets 5 and 7. Pick fret 7, then pull off to sound fret 5.</p>

<h3>The Technique</h3>
<p>The pulling motion is key. Don't just lift your finger — pull it toward the floor slightly as you remove it. This motion creates the sound of the lower note. Without the pull, the lower note will be too quiet or silent.</p>
<p>Your lower finger (fret 5) must be in place <em>before</em> you pick. You can't place it after — the pull-off needs something to pull off to.</p>

<h3>Combining Hammer-ons and Pull-offs</h3>
<pre>e |------------------------|
B |---5h7p5h7p5h7p5-------|
G |------------------------|</pre>
<p>This is a classic blues-rock trill pattern. Once you have it, it becomes automatic.</p>`,
    exercise: 'Step 1: Place index finger on B string fret 5, ring finger on fret 7. Pick fret 7, pull off to fret 5. Repeat 25 times, resting 30 seconds after every 10. Step 2: Combine with hammer-on: from fret 5, hammer to 7, pull back to 5. This is one complete cycle. Repeat 25 times. Step 3: Try doing this continuously — 5h7p5h7p5 — as a flowing motion for 60 seconds straight. Rest, then do another 60 seconds. This continuous motion builds the muscle memory that matters for Week 2 legato phrases.',
    selfCheck: 'The pulled-off note should be clearly audible, not barely a whisper. All three notes in the h/p combination (5, 7, 5) should be roughly equal volume. If the pull-off is weak, practice the pulling motion alone until the note rings clearly.',
    techniques: ['pull-off', 'legato', 'hammer-on/pull-off combination', 'trill'],
    xpReward: 50,
    prerequisites: ['Day 4: hammer-ons — pull-offs are the reverse motion and rely on the same finger positioning.'],
    crossRefs: [
      { day: 4, description: 'Hammer-ons and pull-offs form mirror techniques — combine them for the trill in this lesson.' },
      { day: 11, description: 'Pull-offs are central to the legato phrasing lesson in Week 2.' },
    ],
    quiz: [
      { question: 'What is the key motion that creates the sound on a pull-off?', options: ['Lifting the finger straight up', 'Pulling the finger slightly downward as it leaves the string', 'Pressing harder on the lower fret', 'Picking the string again'], correct: 1 },
      { question: 'Before you pick the upper fret for a pull-off, where must your lower finger be?', options: ['Lifted off the string', 'Already placed on the lower fret', 'On an adjacent string', 'Wherever feels comfortable'], correct: 1 },
      { question: 'What does "h/p" notation like 5h7p5 describe?', options: ['Half-step then pull', 'Hammer onto 7 then pull back to 5', 'High note then pause', 'Hold position 7 for 5 beats'], correct: 1 },
    ],
    commonMistakes: [
      'Lifting the finger straight up instead of pulling it — you will get silence instead of a note.',
      'Not having the lower finger pre-placed before the pull, so there is nothing to pull off to.',
      'Doing the pull-off motion too softly — commit to the pull to get full volume.',
    ],
    bonusChallenge: 'Perform the 5h7p5 trill continuously for 60 seconds on each of the 3 thinnest strings (G, B, e).',
    listenTo: 'Pride and Joy — Stevie Ray Vaughan (the intro riff uses continuous hammer/pull motion at the tempo you are building toward)',
    warmupTip: 'With index and ring fingers pre-placed on the string, practice the pull-off motion without picking — just pull repeatedly to build the "pluck" reflex. 20 reps before picking anything.',
    bonusContent: 'The hammer-on/pull-off trill (5h7p5h7p5...) is used in countless blues-rock solos. Try gradually speeding it up over 10-second intervals: start slow, increase tempo every 10 seconds, rest, repeat. This trains speed and endurance simultaneously.',
    successCriteria: 'You are ready for Day 6 when the three notes of a hammer-on/pull-off cycle (fret 5, hammer to 7, pull to 5) are all roughly the same volume and you can sustain the cycle for 30 seconds without stopping.',
  },
  {
    day: 6,
    week: 1,
    title: 'Slides',
    subtitle: 'Make your guitar talk',
    why: 'Slides connect notes in a way that no other technique can replicate. Where a hammer-on is instant, a slide is continuous — you hear the pitch moving from one note to another. It\'s the most vocal thing you can do on guitar. Slides are everywhere in blues-rock.',
    duration: 20,
    warmup: 'Day 5 exercise: 5h7p5 trill on B string, 30 seconds. Then chromatic exercise with alternate picking, 2 repetitions.',
    mainContent: `<h3>What Is a Slide?</h3>
<p>A slide means you pick a note, then move your finger along the string to a new fret — while maintaining string pressure the whole time. The sound slides smoothly between the two pitches.</p>
<p>In tab, slides are shown with "/" (slide up) or "\" (slide down):</p>
<pre>e |-------------|
G |---5/7-------|  ← slide up from 5 to 7
G |---7\\5-------|  ← slide down from 7 to 5
</pre>

<h3>Two Types of Slides</h3>
<p><strong>Legato slide:</strong> You pick the starting note, slide to the destination, and the destination note is not re-picked. The sliding motion carries the sound.</p>
<p><strong>Shift slide:</strong> You pick both notes — pick, slide, pick again at the destination. This is louder and more defined.</p>
<p>We'll focus on legato slides. They're more musical in lead contexts.</p>

<h3>The Technique</h3>
<p>Maintain firm pressure on the string throughout the slide. If you let up for even a moment, you'll hear the string go dead. Move at a medium speed — not so slow it sounds labored, not so fast it sounds like a jump.</p>

<h3>Slide Phrase on G String</h3>
<pre>e |------------------------|
B |------------------------|
G |---5/7---7\\5---5/9-----|
D |------------------------|</pre>`,
    exercise: 'Part 1: On the G string, pick fret 5, slide up to fret 7. Hold fret 7 for a beat. Then slide back down to fret 5. Repeat 10 times. Part 2: Try ascending then descending quickly: 5/7/9\\7\\5. One continuous phrase. Part 3: Play the 3-note slide phrase from the tab above. Focus on making the arriving note ring clearly at the correct pitch.',
    selfCheck: 'The note at your destination should sound in tune and clear. If the slide "dies" before you reach the destination, you\'re releasing pressure. If it sounds off-pitch, you may be landing on the wrong fret. Count the frets as you slide — feel the bumps of the frets under your finger.',
    techniques: ['slide', 'legato slide', 'ascending slide', 'descending slide'],
    xpReward: 50,
    prerequisites: ['Days 4-5: hammer-ons and pull-offs — slides complete your legato toolkit.'],
    crossRefs: [
      { day: 11, description: 'Slides are used to approach pentatonic scale notes in the legato phrasing lesson.' },
      { day: 16, description: 'The solo opening statement uses a B-string slide as its primary gesture.' },
    ],
    quiz: [
      { question: 'What must you maintain throughout the entire slide to keep the note sounding?', options: ['Pick pressure', 'String pressure with your fretting finger', 'Wrist rotation', 'Finger angle'], correct: 1 },
      { question: 'In tab, what symbol indicates a slide up?', options: ['b', 'h', '/', '\\\\'], correct: 2 },
      { question: 'What is the difference between a legato slide and a shift slide?', options: ['Legato is faster', 'In a shift slide you pick both the start and end note; in legato only the start', 'Legato slides go down; shift slides go up', 'There is no difference'], correct: 1 },
    ],
    commonMistakes: [
      'Releasing string pressure mid-slide — the string goes silent. Keep firm contact the whole way.',
      'Sliding too fast so it sounds like a jump rather than a smooth glide.',
      'Landing on the wrong fret — count the frets consciously until muscle memory takes over.',
    ],
    bonusChallenge: 'Create a 4-note phrase using only slides after the first pick stroke — no additional picks.',
    listenTo: 'The Thrill Is Gone — B.B. King (King\'s approach notes are almost always slides; listen to how he "enters" each phrase)',
    warmupTip: 'Slowly press and slide a single finger up one fret at a time across the whole neck while maintaining pressure — builds the feel of fret bumps under the finger before adding speed.',
    bonusContent: 'Slides can also be used as "pre-bends" where you slide into a note from far below without picking the starting pitch — just the arrival. Try sliding from fret 2 up to fret 7 in one smooth motion. The listener hears only the destination, not where you started.',
    successCriteria: 'You are ready for Day 7 when you can slide from fret 5 to fret 7 on the G string (and back) with the destination note ringing clearly and in tune — no dead spots mid-slide — for 10 consecutive repetitions.',
  },
  {
    day: 7,
    week: 1,
    title: 'Week 1 Review + Skill Check',
    subtitle: 'Consolidate everything before moving forward',
    why: 'You\'ve learned five techniques in six days. Before you move to Week 2, you need to make sure each technique is actually working — not just theoretically understood, but physically playable. This review session locks in Week 1.',
    duration: 30,
    warmup: 'Chromatic exercise on low E and A strings (frets 5-8), alternate picking, 60 BPM — 5 repetitions per string. Then the Day 5 h/p trill (5h7p5 on B string) for 30 seconds. Then one legato slide phrase from Day 6 (5/7, hold, 7\\5 on G string) — 5 repetitions.',
    mainContent: `<h3>The Week 1 Five-Technique Challenge</h3>
<p>Today you\'ll run through all five techniques in a structured sequence. For each technique, play it cleanly 10 times before moving on. "Cleanly" means every note rings clearly, at consistent volume, with no buzzing or dead strings.</p>
<p>This session takes about 25 minutes. Work through each technique completely before moving to the next.</p>

<h3>The Sequence</h3>
<p><strong>1. Alternate Picking — 10 minutes</strong><br/>
Chromatic exercise on low E, frets 5-6-7-8, alternate picking, 60 BPM. 10 repetitions. Then on the A string, 10 repetitions. Focus: are your upstrokes equal to your downstrokes?</p>

<p><strong>2. Hammer-ons — 5 minutes</strong><br/>
B string: 5h7. 15 repetitions. Then 5h7h8h10. 10 repetitions. The hammered notes should be nearly as loud as the picked note.</p>

<p><strong>3. Pull-offs — 5 minutes</strong><br/>
B string: 7p5. 15 repetitions. Remember: pre-place the lower finger before pulling. Then 10p8p7p5 (reverse of the hammer phrase). 10 repetitions.</p>

<p><strong>4. Slides — 5 minutes</strong><br/>
G string: 5/7, hold, 7\\5. 10 repetitions. Maintain string pressure the entire way.</p>

<p><strong>5. Combination Phrase — 5 minutes</strong><br/>
This combines multiple techniques:</p>
<pre>e |----------------------------------|
B |---5h7p5---5h7--------------------|
G |----------5/7\\5-----------------|
D |----------------------------------|</pre>
<p>This is a mini-lick. Learn it note by note first, then play it as one connected phrase. Aim for 10 clean repetitions.</p>

<h3>Spaced Retrieval Moment</h3>
<p>Before rating yourself, try this: close your eyes and play the chromatic exercise from memory (Day 1). Then play the h/p trill from memory (Day 5). Retrieval from memory reinforces the neural pathway more powerfully than just repeating while reading.</p>

<h3>Self-Assessment</h3>
<p>Rate yourself on each technique: 1 (needs work) / 2 (developing) / 3 (solid). Be honest. The AI Coach can help you target weak areas in Week 2.</p>`,
    exercise: 'Complete the full five-technique challenge sequence above with the specified rep counts. After finishing, answer: Which technique felt weakest? Spend an extra 5 minutes on that one technique. If all felt equally strong, spend the extra time on the combination phrase — play it 15 more times until it flows as one phrase, not 5 separate moves.',
    selfCheck: 'By the end of Week 1, you should be able to play each technique cleanly at 60 BPM and combine them in a short phrase. If you\'re not there on any technique, note it in your self-assessment — the curriculum will reinforce it in Week 2.',
    techniques: ['alternate picking', 'hammer-on', 'pull-off', 'slide', 'combination phrases'],
    xpReward: 100,
    prerequisites: ['All of Days 1-6 — this is the consolidation lesson for the full Week 1 technique set.'],
    crossRefs: [
      { day: 1, description: 'Alternate picking chromatic exercise — revisited as warm-up.' },
      { day: 4, description: 'Hammer-ons — tested in the five-technique sequence.' },
      { day: 5, description: 'Pull-offs — tested in the five-technique sequence.' },
      { day: 6, description: 'Slides — tested in the five-technique sequence.' },
    ],
    quiz: [
      { question: 'In the five-technique challenge, which technique is performed first?', options: ['Hammer-ons', 'Alternate picking', 'Slides', 'Pull-offs'], correct: 1 },
      { question: 'How many clean repetitions should you do at each technique before moving on?', options: ['1', '3', '5', '10'], correct: 2 },
      { question: 'What should you do if you rate yourself 1 out of 3 on a technique?', options: ['Skip it and move forward', 'Spend extra time on that technique and flag it for the AI Coach', 'Practice a different technique instead', 'Restart the week from Day 1'], correct: 1 },
    ],
    commonMistakes: [
      'Rushing through techniques you are comfortable with and skipping the hard ones — rate honestly.',
      'Not recording yourself — audio playback reveals problems you cannot hear in real time.',
      'Treating the review as a test rather than a diagnostic — the goal is information, not a grade.',
    ],
    bonusChallenge: 'Record yourself playing the five-technique sequence and identify one technique that sounds weakest — spend 5 extra minutes on it.',
    listenTo: 'Texas Flood — Stevie Ray Vaughan (showcases all five Week 1 techniques in a real-song context at blues-rock tempo)',
    warmupTip: 'Full diagnostic warm-up: open strings one by one, then finger stretches, then chromatic at 40 BPM — go deliberately slow since this is a review session, not a speed session.',
    bonusContent: 'The combination phrase at the end of this lesson is a micro-lick — a short, reusable musical idea. Great guitarists have dozens of micro-licks in their vocabulary. Save this one: it will appear in the solo later and will feel familiar when it does.',
    successCriteria: 'You are ready for Week 2 when: (1) alternate picking chromatic exercise is clean at 60 BPM on both E and A strings, (2) hammer-ons and pull-offs produce clearly audible notes, (3) slides arrive at the target fret with string ringing, (4) you can play the combination phrase as a single connected phrase at least once without stopping.',
  },

  // ===== WEEK 2: SOUNDING LIKE A LEAD GUITARIST =====
  {
    day: 8,
    week: 2,
    title: 'The Minor Pentatonic Scale',
    subtitle: 'The language of blues and rock',
    why: 'The minor pentatonic scale is used in more great rock solos than any other scale. It\'s 5 notes — but those 5 notes contain everything you need to play blues, rock, and lead guitar. Understanding this scale is the single biggest musical leap you\'ll make this month.',
    duration: 25,
    warmup: 'Alternate picking chromatic exercise, 3 reps. Then play the Day 7 combination phrase 3 times.',
    mainContent: `<h3>What Is the Pentatonic Scale?</h3>
<p>A pentatonic scale has 5 notes ("penta" = 5). The minor pentatonic scale specifically has a sound that\'s bluesy, expressive, and immediately recognizable — it\'s what you\'re hearing when you listen to virtually any rock or blues solo.</p>

<h3>Why It Works</h3>
<p>The minor pentatonic works because it contains no "avoid notes" — no tones that clash with the underlying chord. This means almost any note from this scale will sound good over the matching chord. It\'s the guitarist\'s safety net and expressive tool at the same time.</p>

<h3>The 5 Intervals</h3>
<p>The A minor pentatonic scale (rooted at A) contains these notes: A, C, D, E, G. Five notes, played across the entire fretboard.</p>

<h3>The Box Pattern Concept</h3>
<p>Guitarists organize the pentatonic scale into "box patterns" — compact shapes that fit in a small area of the fretboard. Today you\'re introduced to the concept. Tomorrow you learn the full shape.</p>
<p>The key idea: in any position on the neck, you can find a complete minor pentatonic scale using a specific finger pattern. Learn the pattern, and you know the scale in any key just by moving up or down the neck.</p>

<h3>Preview of Box 1</h3>
<pre>e |--5--8--|
B |--5--8--|
G |--5--7--|
D |--5--7--|
A |--5--7--|
E |--5--8--|</pre>
<p>Tomorrow you\'ll learn this in detail. Today, just absorb the concept and listen to it. Play through this pattern slowly, top to bottom, to hear the sound of the minor pentatonic.</p>`,
    exercise: 'Step 1: Slowly trace through the Box 1 preview tab above with your finger on the page — find each fret position before playing. This is "mental mapping." Step 2: Play through the pattern from low E to high e, very slowly, one note at a time. Listen only — do not try to memorize it yet. Step 3: Pick any two notes on adjacent strings from the pattern and play them back and forth 25 times. Step 4: Pick three notes from the same pair of strings and play them as a mini-loop for 2 minutes. Even with three notes, the pentatonic sound is unmistakable.',
    selfCheck: 'You should be able to hear the "bluesy" quality of the minor pentatonic. If you\'ve heard classic rock solos before, this should sound familiar. That familiarity means you\'re hearing it correctly.',
    techniques: ['pentatonic scale', 'scale theory', 'box patterns'],
    xpReward: 60,
    prerequisites: ['Week 1 techniques (Days 1-7) — you will apply those techniques within the scale from Day 9 onward.'],
    crossRefs: [
      { day: 9, description: 'Full Box 1 pentatonic pattern is taught in detail the next day.' },
      { day: 10, description: 'Box 1 becomes the source material for phrase creation.' },
    ],
    quiz: [
      { question: 'How many notes does a pentatonic scale contain?', options: ['3', '4', '5', '7'], correct: 2 },
      { question: 'What makes the minor pentatonic scale so useful over blues/rock chords?', options: ['It has no sharps', 'It contains no "avoid notes" — every note sounds good', 'It only uses open strings', 'It is easier to memorise than major scales'], correct: 1 },
      { question: 'What is a "box pattern" in the context of guitar scales?', options: ['A chord shape', 'A compact fretboard shape that contains a complete scale in a small area', 'A rhythmic strumming box', 'A capo position'], correct: 1 },
    ],
    commonMistakes: [
      'Trying to memorize the note names (A, C, D, E, G) before learning the shape — start with the shape, theory comes later.',
      'Playing box patterns up and down robotically without adding rhythm or feel.',
      'Assuming one box covers the whole neck — the five pentatonic positions connect across the entire fretboard.',
    ],
    bonusChallenge: 'Find the root note A of the minor pentatonic in 3 different octave positions across the fretboard.',
    listenTo: 'Whole Lotta Love — Led Zeppelin (Page\'s solo is Box 1 pentatonic almost exclusively — you\'ll recognize every note once you know the scale)',
    warmupTip: 'Before scale work, do 5 slow chromatic runs on each string — primes your fretting fingers for the wider pentatonic stretches to come.',
    bonusContent: 'The minor pentatonic scale is used in more recorded guitar solos than any other scale. Listen to "Comfortably Numb" by Pink Floyd, "Whole Lotta Love" by Led Zeppelin, or "Pride and Joy" by Stevie Ray Vaughan — all are rooted in this five-note scale.',
  },
  {
    day: 9,
    week: 2,
    title: 'Pentatonic Box 1 — A Minor',
    subtitle: 'Your first complete scale shape',
    why: 'Box 1 of the A minor pentatonic scale is the most-used scale pattern in rock guitar history. Hendrix, Clapton, Page, SRV — they all started here. Learning it completely changes how you relate to the fretboard.',
    duration: 25,
    warmup: 'Day 7 combination phrase, 10 times. Then alternate picking chromatic exercise on the A string at 60 BPM, 5 reps (spaced retrieval from Day 3 — locking in the motion before it is overshadowed by scale work).',
    mainContent: `<h3>The Complete Box 1 Pattern</h3>
<p>Here is the full A minor pentatonic Box 1, rooted at the 5th fret:</p>
<pre>e |--5--8--|
B |--5--8--|
G |--5--7--|
D |--5--7--|
A |--5--7--|
E |--5--8--|</pre>
<p>Two notes per string. Six strings. Twelve notes total.</p>

<h3>Fingering</h3>
<p>On strings E, A, D, G: use index finger for fret 5, ring finger for fret 7.<br/>
On strings B, e (and low E): use index finger for fret 5, pinky for fret 8.</p>
<p>This fingering is standard and efficient. Don\'t use index-middle — always index-ring or index-pinky.</p>

<h3>Playing It Ascending and Descending</h3>
<p>Start from the low E string, play both notes, move to A string, and so on to the high e. That\'s ascending. Then reverse: high e back down to low E. This is descending.</p>

<h3>Changing Keys</h3>
<p>The same shape moved to a different position plays a different key. Box 1 at fret 5 = A minor. At fret 7 = B minor. At fret 3 = G minor. The shape is the same — only the position changes.</p>`,
    exercise: 'Step 1: Play Box 1 ascending (low E to high e) without a metronome — just get the notes right. 5 runs. Step 2: Add a metronome at 50 BPM. 5 ascending runs, 5 descending runs. Step 3: Increase to 60 BPM. 10 complete ascending-and-descending runs. Step 4: Play only the top two strings (B and e) back and forth at 70 BPM. This upper portion of Box 1 is where most blues-rock phrases live and deserves extra attention.',
    selfCheck: 'You should be able to play the full ascending and descending scale without pausing to think about the next note. It should feel like a connected shape, not 12 individual notes. If you\'re still looking at your hands for every note, keep going — repetition builds the map.',
    techniques: ['pentatonic box 1', 'scale fingering', 'ascending/descending'],
    xpReward: 60,
    prerequisites: ['Day 8: pentatonic scale concept — you need to understand what a box pattern is before drilling it.'],
    crossRefs: [
      { day: 8, description: 'Box 1 was previewed conceptually — today you commit the full shape to memory.' },
      { day: 10, description: 'Box 1 is the building block for all phrase creation in the next lesson.' },
      { day: 12, description: 'Box 1 positions are the targets for string bending.' },
    ],
    quiz: [
      { question: 'On the E, A, D, and G strings of Box 1, which fingers cover frets 5 and 7?', options: ['Index and middle', 'Index and ring', 'Middle and pinky', 'Index and pinky'], correct: 1 },
      { question: 'If Box 1 at fret 5 is A minor, what key is it in at fret 7?', options: ['A minor', 'G minor', 'B minor', 'C minor'], correct: 2 },
      { question: 'How many notes are in the full Box 1 pattern (6 strings × 2 notes)?', options: ['10', '11', '12', '14'], correct: 2 },
    ],
    commonMistakes: [
      'Using index-middle instead of index-ring on E, A, D, G strings — the stretch is necessary for correct position.',
      'Looking at your fretting hand instead of trusting feel — practice with eyes closed to build the internal map.',
      'Only practicing ascending — descending (high e back down) is equally important and often neglected.',
    ],
    bonusChallenge: 'Move Box 1 to fret 3 (G minor) and fret 7 (B minor) and play ascending/descending in each key — same shape, new positions.',
    listenTo: 'Pride and Joy — Stevie Ray Vaughan (the intro solo lives entirely in Box 1 of the A minor pentatonic)',
    warmupTip: 'Index finger barres: press your index finger flat across all 6 strings at fret 5, hold 3 seconds, release — repeat 10 times to warm up the index for its heavy role in Box 1.',
    bonusContent: 'Once Box 1 is solid at fret 5 (A minor), move it to fret 3 (G minor) and fret 7 (B minor). The shape is identical — only the key changes. This is the power of the box pattern system: one shape, every key.',
    successCriteria: 'You are ready for Day 10 when you can play Box 1 ascending and descending at 60 BPM without pausing between strings or looking at the tab. If you are still stopping to think about the next note, spend another session at 50 BPM until the shape is automatic.',
    bpmTarget: 60,
  },
  {
    day: 10,
    week: 2,
    title: 'Creating Simple Phrases',
    subtitle: 'Running a scale is not music',
    why: 'Running up and down the pentatonic scale is an exercise, not a solo. The difference between exercise and music is phrasing — grouping notes into short, meaningful ideas with space between them. Today you learn how to take 3-4 notes and make them say something.',
    duration: 25,
    warmup: 'Box 1 pentatonic, full ascending and descending, 5 repetitions at 60 BPM. Then play only the top two strings (B and e) back and forth at 70 BPM for 2 minutes — this is your phrase territory.',
    mainContent: `<h3>What Makes a Phrase?</h3>
<p>A musical phrase has a beginning, some kind of motion, and an end. Think about how you speak: you don\'t talk in one endless stream — you say something, pause, say something else. Guitar phrases work the same way.</p>
<p>Running Box 1 up and down is an exercise. A phrase is 2-5 notes with intentional rhythm and space around it. The difference between exercise and music is entirely in the rhythm and the silence.</p>

<h3>Start by Borrowing — 5 Proven Phrases</h3>
<p>Before creating your own phrases, play these five. Each is a complete, musical idea taken from Box 1. Play each one 10 times before moving to the next.</p>

<p><strong>Phrase 1 — The Basic Call (most common blues move):</strong></p>
<pre>e |---5---8-------8---5---|
B |-------------------|
   short short  rest  short short</pre>

<p><strong>Phrase 2 — The Descent (resolved, landing feeling):</strong></p>
<pre>e |---8---5---|
B |---5-------|
   long  short short</pre>

<p><strong>Phrase 3 — The Rock Turnaround:</strong></p>
<pre>B |---8---5---7---5---|
G |-------------------|
   equal beats, no rush</pre>

<p><strong>Phrase 4 — The Low Statement:</strong></p>
<pre>D |---7---5---|
A |---7-------|
   low register, punchy</pre>

<p><strong>Phrase 5 — The Question (ascending, leaves tension unresolved):</strong></p>
<pre>G |---5---7---|
B |---5---8---|
   builds energy upward</pre>

<h3>The Space Between Phrases</h3>
<p>After you play any phrase: stop. Count 2 full beats of silence. Then play it again. That space makes the phrase sound intentional — like a statement, not just running. Beginners instinctively fill every silence with more notes. Resist this. Space is music.</p>

<h3>Rhythm Is the Key Variable</h3>
<p>The same 3 notes played with different rhythm become completely different phrases. Try Phrase 1 with these rhythms:</p>
<ul>
  <li>Long — short — short (blues shuffle feel)</li>
  <li>Short — short — long (building toward resolution)</li>
  <li>Short — long — short (accent on the middle note)</li>
</ul>`,
    exercise: 'Step 1: Play each of the 5 proven phrases above, 10 times each. Step 2: Take Phrase 1 and play it in all 3 rhythmic versions (long-short-short, short-short-long, short-long-short), 5 times each. Step 3: Now create your own phrase. Pick 3 notes from Box 1 — any 3. Give them a rhythm. Play it 10 times with a 2-beat silence between each repetition. Step 4: Modify your phrase (change one note, or change the rhythm). Play the modified version 10 times. Goal: end the session with one self-created phrase you can play from memory.',
    selfCheck: 'Does your phrase feel like something you said, rather than something you ran through? If you played it to a friend, would they recognize it as a recurring idea? If yes, you\'re making music. Keep refining it.',
    techniques: ['phrasing', 'motif creation', 'rhythm', 'musical space'],
    xpReward: 60,
    prerequisites: ['Day 9: Box 1 pentatonic shape — phrases are built from scale notes, so the shape must be memorised.'],
    crossRefs: [
      { day: 9, description: 'Box 1 provides all the notes you will use when creating phrases.' },
      { day: 11, description: 'The phrases created today are enhanced with legato techniques in the next lesson.' },
      { day: 15, description: 'Phrase creation skills are the foundation of improvising over the solo backing track.' },
    ],
    quiz: [
      { question: 'What is the defining feature of a musical phrase compared to running a scale?', options: ['A phrase always uses more notes', 'A phrase has intentional rhythm, grouping, and space around it', 'A phrase is always 8 notes long', 'A phrase must include a bend'], correct: 1 },
      { question: 'Which rhythmic shape is most common in blues phrasing?', options: ['Long — short — short', 'Short — short — long', 'Short — long — short', 'Equal duration on all notes'], correct: 1 },
      { question: 'Why is space (silence) important in a phrase?', options: ['It gives your fingers a rest', 'It makes the phrase sound intentional, like a statement', 'It makes the solo easier to play', 'It hides mistakes'], correct: 1 },
    ],
    commonMistakes: [
      'Playing every note at the same volume and duration — dynamics and rhythm are what make a phrase a phrase.',
      'Not resting between repetitions of your motif — the space is half the music.',
      'Choosing too many notes — great phrases are often just 2 or 3 notes with strong rhythm.',
    ],
    bonusChallenge: 'Record three different 3-note phrases from Box 1, then create one call-and-response pair where the second phrase answers the first.',
    listenTo: 'Red House — Jimi Hendrix (Hendrix\'s phrasing is the blueprint — listen specifically to his spaces and how he repeats phrases with variation)',
    warmupTip: 'Hum a short 3–4 note melody before picking up the guitar, then find those exact pitches in Box 1. Trains your ear before your fingers start.',
    bonusContent: 'The call-and-response structure in blues comes from one phrase "asking" a question and a second phrase "answering" it. Try playing your 3-note motif, pausing, then playing a slightly different version as a response. This conversational approach is the heart of blues improvisation.',
    successCriteria: 'You are ready for Day 11 when you can play any of the 5 proven phrases above from memory with consistent rhythm, and you have created at least one original phrase you can play 10 times in a row. "Consistent rhythm" means the timing does not speed up or slow down between repetitions.',
  },
  {
    day: 11,
    week: 2,
    title: 'Connecting Notes with Legato',
    subtitle: 'From scale to actual blues-rock sound',
    why: 'Legato means "connected" — smooth, flowing phrases where notes blend into each other rather than being individually attacked. Adding hammer-ons, pull-offs, and slides to your pentatonic phrases transforms them from exercises into real blues-rock licks.',
    duration: 25,
    warmup: 'Play your favorite phrase from Day 10, 10 times with 2-beat rests between each. Then alternate picking chromatic exercise on the D string at 60 BPM, 5 reps (spaced retrieval from Week 1 — keeping the picking technique sharp while scale work dominates this week).',
    mainContent: `<h3>Adding Hammer-ons to Box 1 Phrases</h3>
<p>Take any pair of notes on the same string within Box 1 and connect them with a hammer-on instead of picking both:</p>
<pre>Before: e |--5---8--|  (two pick strokes)
After:  e |--5h8----|  (one pick stroke, hammer the second)</pre>
<p>Immediately sounds more fluid. Less attack, more flow.</p>

<h3>Adding Pull-offs</h3>
<pre>Before: e |--8---5--|  (two pick strokes)
After:  e |--8p5----|  (pick 8, pull off to 5)</pre>

<h3>Adding Slides into Box Positions</h3>
<p>Slide into the first note of your phrase from 2 frets below:</p>
<pre>G |---3/5---7---|  (slide into the scale from below)</pre>
<p>This is a classic blues move — approaching a scale note from below via slide. It adds approach and tension.</p>

<h3>A Complete Legato Phrase</h3>
<p>Here\'s a phrase that combines all three techniques:</p>
<pre>e |---5h8-----------8p5----|
B |---5/7---7p5------5-----|
G |------------------------|</pre>
<p>Read it left to right: slide into B string 7, pull off to 5, then hammer on e string to 8, pull back to 5. This is a real blues-rock lick.</p>`,
    exercise: 'Take the phrase you created on Day 10. Add ONE legato technique to it — either a hammer-on, pull-off, or slide. Play the new version 10 times until it feels natural. Then add a SECOND legato technique. Notice how each addition changes the character of the phrase. Final goal: play the complete legato phrase from the tab above 5 times cleanly.',
    selfCheck: 'The legato elements should be adding smoothness, not introducing stumbles. If the phrase feels harder with legato than without, slow down and isolate the legato element alone (just the h or p or slide) before putting it back in context.',
    techniques: ['legato phrasing', 'hammer-on in context', 'pull-off in context', 'slide approach'],
    xpReward: 60,
    commonMistakes: [
      'Adding legato techniques before the base phrase is memorized — learn the notes first, then add h/p/slides.',
      'Rushing the slide approach note — it should sound connected, not bolted on as an afterthought.',
      'Only practicing the legato version, forgetting the picked version — know both so you can choose.',
    ],
    bonusChallenge: 'Take the complete legato phrase and play it 3 times consecutively with no pause between repetitions.',
    listenTo: 'Little Wing — Jimi Hendrix (the intro is almost entirely legato — hammer-ons and slides woven into a single flowing statement)',
    warmupTip: 'Run the Day 5 h/p trill (5h7p5) for 60 seconds to warm up the hammer-on and pull-off muscles before integrating them into phrases.',
    successCriteria: 'You are ready for Day 12 when you can play the complete legato phrase (with h, p, and slide) from the tab above 5 consecutive times without stumbling on the technique transitions. Stumbling means hesitating or stopping — missing one note while continuing counts as passing.',
  },
  {
    day: 12,
    week: 2,
    title: 'String Bending',
    subtitle: 'The most expressive thing you can do on guitar',
    why: 'Bending is where guitar stops sounding like a plucked instrument and starts sounding like a voice. A good bend is the most emotionally charged moment in any solo. Without bends, lead guitar sounds mechanical. With bends, it sings.',
    duration: 25,
    warmup: 'Box 1 pentatonic ascending/descending 3 times. Then the legato phrase from Day 11, 5 times.',
    mainContent: `<h3>What Is a Bend?</h3>
<p>A bend means you push or pull the string sideways across the fretboard, raising its pitch smoothly without moving your finger to a new fret. It\'s a continuous pitch change — one note sliding up into another.</p>

<h3>The Mechanics</h3>
<p>Bends require multiple fingers for support. The most common approach:</p>
<ul>
  <li>Fret the note with your ring finger (fret 7 on G string is our target)</li>
  <li>Place your middle finger on fret 6 and index finger on fret 5 — all three fingers reinforce the push</li>
  <li>Push the string toward the ceiling (upward, away from the floor)</li>
  <li>The pitch rises as you push</li>
</ul>
<p>Never bend with one finger alone — you\'ll hurt yourself and the bend won\'t be in tune.</p>

<h3>Bend Direction by String</h3>
<p>The direction you bend depends on which string you are on:</p>
<ul>
  <li><strong>G, B, high e strings:</strong> Push upward (toward the ceiling). These strings have room to move up without falling off the fretboard edge.</li>
  <li><strong>Low E, A, D strings:</strong> Pull downward (toward the floor). Pushing these thick strings upward is awkward and risks slipping. Pull them down toward you instead.</li>
</ul>
<p>Today we focus on G string bends (push upward). B string bends also push upward. This is the most common bend in rock solos.</p>

<h3>How Far to Bend</h3>
<p>A <strong>half-step bend</strong> raises the pitch by one fret\'s worth. A <strong>whole step bend</strong> raises it by two frets. In tab:</p>
<pre>G |---7b9---|  ← bend fret 7 up to match the pitch of fret 9 (whole step)
G |---7b8---|  ← bend fret 7 up to match the pitch of fret 8 (half step)</pre>

<h3>Checking Your Bend</h3>
<p>To verify a whole step bend on G string fret 7: pick fret 9 and memorize that pitch. Then bend fret 7 — when it reaches fret 9\'s pitch, stop. This is the target.</p>`,
    exercise: 'Part 1: Fret G string at fret 7 (ring finger, backed up by middle on 6 and index on 5). Pick it. Then slowly push toward the ceiling. Hear the pitch rise. Try to stop at the fret 9 pitch. Do this 20 times — the goal is to land the same pitch each time. Part 2: Try holding the bent note for 2 full beats before releasing back down. Part 3: Play a simple phrase ending with the bend: G string 5, 7, then bend 7 up to 9 and hold.',
    selfCheck: 'Your bend should arrive at a pitch that sounds "resolved" — like it landed somewhere intentional, not somewhere random. If it sounds like it stops in an uncertain place, you\'re not bending far enough (or too far). The pitch of fret 9 is your target.',
    techniques: ['string bending', 'whole step bend', 'half step bend', 'bending technique'],
    xpReward: 70,
    commonMistakes: [
      'Bending downward on the G string — always push upward (toward the ceiling) on G, B, and high e.',
      'Using only one finger to bend — always back up the bending finger with all fingers behind it on the same string.',
      'Not checking pitch against the target fret — a bend that doesn\'t land in tune sounds worse than no bend.',
    ],
    bonusChallenge: 'Bend to pitch by ear: without looking at fret 9, bend fret 7 until it sounds "resolved" — then check your pitch against fret 9.',
    listenTo: 'Texas Flood — Stevie Ray Vaughan (Vaughan\'s bends are the benchmark for pitch accuracy and emotional commitment)',
    warmupTip: 'Slow-motion bends: take 4 full seconds to push the string from resting pitch to target pitch — builds wrist strength and control before speed work.',
    successCriteria: 'You are ready for Day 13 when you can bend G string fret 7 to the pitch of fret 9 and land within a semi-tone of the target at least 15 out of 20 attempts. Use fret 9 as your pitch reference each time — pick it, memorize it, then bend fret 7 to match it.',
    bpmTarget: 60,
  },
  {
    day: 13,
    week: 2,
    title: 'Vibrato',
    subtitle: 'The sound that makes a note feel alive',
    why: 'If bending is the most expressive technique, vibrato is the most personal. It\'s how a guitarist makes a note breathe, oscillate, and sing. The best guitarists are identifiable by their vibrato alone. It takes time to develop — start today.',
    duration: 20,
    warmup: 'Day 12 bending exercise: 20 bends on G string fret 7 to fret 9 pitch. Focus on landing the bend in tune each time.',
    mainContent: `<h3>What Is Vibrato?</h3>
<p>Vibrato is a rapid, controlled oscillation of pitch — the note moves slightly sharp and flat in a rhythmic, even way. Think of a singer holding a long note — their voice naturally wobbles slightly. That wobble is vibrato. It makes the note feel human.</p>

<h3>Guitar Vibrato vs. Vocal Vibrato</h3>
<p>On guitar, vibrato is created by repeatedly bending the string up (and releasing) in a quick, even rhythm. You\'re essentially doing a small, fast, repeated bend while holding the note.</p>
<p>The motion comes from the wrist rotating, not the fingers wiggling. Imagine turning a doorknob — your wrist rotates, and that rotation pushes the string up and releases it.</p>

<h3>Width and Speed</h3>
<p><strong>Width:</strong> How much you bend. Narrow vibrato = subtle, gentle. Wide vibrato = dramatic, expressive. Blues uses wide vibrato. Classical uses narrow. Blues-rock uses both at different moments.</p>
<p><strong>Speed:</strong> How fast you oscillate. Slow vibrato feels melancholy. Fast vibrato feels urgent. Great guitarists vary both width and speed within a single note.</p>

<h3>Starting Slow — With a Target</h3>
<p>When learning vibrato, go slower than feels natural. Fast, uncontrolled vibrato sounds shaky and nervous. Slow, controlled vibrato sounds authoritative. Start at a speed you can control, then gradually increase.</p>
<p><strong>Target oscillation rate:</strong> Aim for 2-3 oscillations per second — about the pace of saying "one-and-two-and" aloud, where each "and" is one oscillation. Slower than this sounds like a slow wobble; faster becomes an uncontrolled tremor. 2-3 per second is the range of every great blues-rock guitarist.</p>
<p><strong>A note on progress:</strong> Vibrato is a skill that improves dramatically overnight. Your brain and muscles consolidate motor skills during sleep — so if your vibrato session feels difficult today, do your best, sleep on it, and return tomorrow. The improvement between Day 13 and Day 14 will be measurable.</p>`,
    exercise: 'Fret any note — G string fret 7 is good. Pick it. After the note sounds, start the vibrato motion: bend the string slightly toward the ceiling, then release back to pitch. Repeat that motion evenly — like a clock ticking. Do this for 30 seconds without stopping. Then try the same on B string fret 8. Then B string fret 5. Finally: play a simple 3-note phrase and end the last note with vibrato, holding it for 4 full beats.',
    selfCheck: 'Vibrato should be even — each oscillation the same width and speed as the last. If it sounds random or shaky, slow down the oscillation until you can control it. Vibrato is a physical skill that takes weeks to develop fully — what you\'re building today is the foundation.',
    techniques: ['vibrato', 'wrist technique', 'note sustain'],
    xpReward: 70,
    commonMistakes: [
      'Wiggling fingers side-to-side instead of rotating the wrist — vibrato is a wrist rotation, not a finger wiggle.',
      'Going too fast before establishing control — uncontrolled fast vibrato sounds shaky and nervous.',
      'Releasing the bend during vibrato — the vibrato should oscillate around the bent pitch, not return to the un-bent pitch.',
    ],
    bonusChallenge: 'Add vibrato to every held note across a 60-second free improvisation — no note gets to ring without it.',
    listenTo: 'Comfortably Numb solo 2 — Pink Floyd (Gilmour\'s vibrato on the opening bend is the gold standard for controlled, wide, expressive vibrato)',
    warmupTip: 'Doorknob drill: hold a pen or marker and rotate your wrist back and forth 30 times — this is the exact motion used for guitar vibrato, practiced away from the guitar.',
    successCriteria: 'You are ready for Day 14 when you can hold a note for 4 beats and produce even vibrato at roughly 2-3 oscillations per second for the full duration without the pitch wandering sharply or the motion stopping. Even if it sounds a little uneven, attempt it with full commitment — do not omit the motion.',
  },
  {
    day: 14,
    week: 2,
    title: 'Week 2 Review + Personalized Path',
    subtitle: 'Assess your skills before the solo begins',
    why: 'Week 3 is where you start learning the actual solo. But the solo requires confident use of everything you\'ve learned in Weeks 1 and 2. Today you do an honest self-assessment, reinforce your weakest areas, and get ready for the most exciting part of the program.',
    duration: 30,
    warmup: 'Box 1 pentatonic ascending/descending, 5 times starting at 55 BPM, each rep 5 BPM faster. Then play the Day 10 combination phrase (h/p + slide) from memory, 5 times — spaced retrieval from 4 days ago.',
    mainContent: `<h3>Week 2 Review Sequence</h3>
<p>Work through each skill below. Rate yourself 1-3 honestly (1=struggling, 2=developing, 3=solid). The benchmarks below are achievable with 13 days of practice at 15-20 minutes/day. If you are below a benchmark, that is useful information — not a failure.</p>

<p><strong>1. Box 1 Pentatonic</strong><br/>
Play it ascending and descending at 70 BPM. Can you do it without stopping to think? Rating: __</p>

<p><strong>2. Creating Phrases</strong><br/>
Without thinking about it, improvise a 4-note phrase from Box 1. Does it feel natural? Rating: __</p>

<p><strong>3. Legato Phrases</strong><br/>
Play the Day 11 combined phrase (with hammer-on, pull-off, and slide). Clean? Rating: __</p>

<p><strong>4. Bends</strong><br/>
5 bends on G string fret 7 to fret 9. Do at least 4 of them land in tune? Rating: __</p>

<p><strong>5. Vibrato</strong><br/>
Hold a note for 4 beats with controlled vibrato. Even? Not shaky? Rating: __</p>

<h3>Your Personalized Path</h3>
<p>After completing the self-assessment, talk to the AI Coach. Tell it your ratings for each skill. The coach will give you specific exercises to reinforce your weakest technique before Week 3 begins.</p>

<h3>A Note on Progress</h3>
<p>If you rated yourself low on bends or vibrato, that\'s completely normal. These are the hardest techniques and take the most time. The solo uses them — but we\'ll build up to the hard parts slowly in Weeks 3 and 4.</p>`,
    exercise: 'Complete the full Week 2 review sequence above. Write down your ratings for each technique. Then create a complete 8-bar improvisation using Box 1 — record it on your phone. Listen back. What sounds good? What sounds weak? Spend the last 10 minutes specifically on your weakest technique.',
    selfCheck: 'By the end of Week 2, you should feel like Box 1 is a comfortable place to play — a home base you can always return to. Bends and vibrato will still feel new. That\'s expected. The solo section will develop them further.',
    techniques: ['pentatonic', 'phrasing', 'legato', 'bends', 'vibrato', 'self-assessment'],
    xpReward: 100,
    commonMistakes: [
      'Being too easy on yourself in the self-assessment — a dishonest 3-rating means unaddressed weaknesses enter Week 3.',
      'Only running through each technique once instead of the specified rep count — this is diagnostic practice, not a casual run.',
      'Skipping the AI Coach consultation after rating — it can give you targeted exercises for your specific weak areas.',
    ],
    bonusChallenge: 'Improvise for 2 minutes over Box 1 using only phrases with 2-beat rests between them — no running scales.',
    listenTo: 'Crossroads live — Cream (Clapton\'s solo demonstrates every Week 2 technique working together at performance tempo)',
    warmupTip: 'Extended warm-up for review day: 5 slow bends (3 seconds each), 5 vibrato notes (4 beats each), Box 1 ascending/descending twice — mirrors all techniques in today\'s assessment.',
    successCriteria: 'You are ready for Week 3 when: (1) Box 1 is playable at 70 BPM without pauses, (2) you can improvise a 4-note phrase from memory, (3) bends land in the right pitch range 12/20 attempts, (4) vibrato lasts 4 beats with at least some control. Bends and vibrato will continue developing in Week 3 — they do not need to be perfect today.',
    bpmTarget: 70,
  },

  // ===== WEEK 3: LEARN THE SOLO =====
  {
    day: 15,
    week: 3,
    title: 'Meet the Solo',
    subtitle: 'This is what all the work has been for',
    why: 'You\'ve spent two weeks building technique. Today you encounter the music you\'re going to play. Don\'t pick up your guitar yet — just listen. Getting the sound of the solo into your ear before you play a single note will make every subsequent lesson faster and more musical.',
    duration: 20,
    warmup: 'Day 7 combination phrase (hammer-on + pull-off + slide) 10 times. Then a 3-minute free improvisation over Box 1 — no goals, just play and listen. Then 10 bends on G string fret 7 checking each against fret 9.',
    mainContent: `<h3>About This Solo</h3>
<p>The "First Guitar Solo" is an original blues-rock piece in A minor. It uses the A minor pentatonic scale throughout — the scale you already know. The solo is designed to be challenging but achievable within 30 days of structured practice.</p>
<p>It has 4 sections:</p>
<ol>
  <li><strong>Section 1 — The Opening Statement:</strong> Melodic, unhurried. Clean picking and slides establish the theme. (Days 16-18)</li>
  <li><strong>Section 2 — The Build:</strong> Hammer-ons and pull-offs. Energy picks up. (Days 19-21)</li>
  <li><strong>Section 3 — The Emotional Peak:</strong> One big, expressive bend with vibrato. The heart of the solo. (Days 22-23)</li>
  <li><strong>Section 4 — The Resolution:</strong> Vibrato-heavy landing. Brings the solo home. (Days 25-26)</li>
</ol>

<h3>The Full Solo Tab — Overview</h3>
<pre>SECTION 1 (bars 1-4):
e |------------------------------12-10--|
B |--10/12---12---10---12h10-----------|
G |-------------------------------------|

SECTION 2 (bars 5-8):
e |------------------------------------------|
B |--10---12h10h12---10h12p10---12----------|
G |--9/10---10p9---10h12p10-----------------|

SECTION 3 (bars 9-12):
e |------------------------------------------|
B |--12b14~~---12---10h12---10--------------|
G |------------------------------------------|

SECTION 4 (bars 13-16):
e |--12---10---12~~----------------------|
B |--10---12---10---12p10---10~~---------|
G |--------------------------------------|</pre>
<p>Don\'t play this yet. Just look at it. Trace through it with your eye. Notice the structure — where the bends are (b), where the vibrato is (~~), where the legato is.</p>

<h3>How to Listen</h3>
<p>If an audio recording is available above, listen to the full solo at least 3 times. First listen: just take it in. Second listen: follow the tab while listening. Third listen: hum along with the melody. This ear-to-hand connection is essential.</p>`,
    exercise: 'Listen to the solo recording at least 3 times (use the audio player if available). Then, WITHOUT your guitar, trace through the tab with your finger — "air guitar" the solo while reading the notation. Can you feel where the phrases are? Where it breathes? Spend 10 minutes with the tab before picking up your guitar.',
    selfCheck: 'After this lesson, you should be able to hum the main theme of the solo. If you can\'t hum any part of it, you haven\'t listened enough. The goal is to know this music before you play it.',
    techniques: ['ear training', 'tab reading', 'musical analysis'],
    xpReward: 60,
    commonMistakes: [
      'Picking up the guitar before listening at least 3 times — playing before internalizing the melody means building incorrect habits.',
      'Only reading the tab without following the audio — tab shows positions, not phrasing or feel.',
      'Trying to play through the solo immediately — today is entirely ear and eye, not fingers.',
    ],
    bonusChallenge: 'Without your guitar, hum the entire solo from memory after 3 listens — record yourself doing it.',
    listenTo: 'Comfortably Numb — Pink Floyd (the second solo is a masterclass in building emotional arc across sections — exactly the structure you are about to learn)',
    warmupTip: 'Before any guitar work, spend 5 minutes air-guitaring the solo while following the tab — builds the mental map before finger work begins.',
    soloSection: undefined,
    successCriteria: 'You are ready for Day 16 when you can hum or sing the main melody of Section 1 from memory (the opening slide motif). You should also be able to point to, in the tab, where each section begins and ends.',
  },
  {
    day: 16,
    week: 3,
    title: 'Section 1 — The Opening Statement',
    subtitle: 'Melodic and unhurried',
    why: 'Section 1 is the most important part of the solo because it\'s the listener\'s first impression. It uses slides and clean picking to state the theme clearly. Getting it right means playing it slowly, intentionally, with no hurry.',
    duration: 25,
    warmup: 'Box 1 pentatonic on just the top 3 strings (G, B, e), ascending and descending, 5 times. This warms up the exact strings you\'ll use today.',
    mainContent: `<h3>Section 1 Tab</h3>
<pre>e |---------------------------12---10--|
B |--10/12---12---10---12h10-----------|
G |-------------------------------------|
D |-------------------------------------|
A |-------------------------------------|
E |-------------------------------------|
     1   +   2   +   3   +   4   +</pre>

<h3>Breaking It Down — Note by Note</h3>
<p><strong>Beat 1:</strong> B string — slide from fret 10 up to fret 12. Maintain string pressure throughout. Hold the arrived note for a full beat.</p>
<p><strong>Beat 2:</strong> B string fret 12 — pick cleanly. Then pick B string fret 10 cleanly. Two separate, picked notes.</p>
<p><strong>Beat 3:</strong> B string fret 12 — pick. Then pull off down to fret 10 (12p10). Your index finger should already be on fret 10 when you pick fret 12. The pull motion sounds the lower note without picking again.</p>
<p><strong>Beat 4:</strong> High e string fret 12 — pick cleanly. Then high e fret 10 — pick and let it ring for the full beat.</p>
<p>Practice this tab one beat at a time before attempting to connect them:</p>
<ol>
  <li>Beat 1 alone: just the slide (10/12). 10 repetitions.</li>
  <li>Beats 1-2: slide plus the two picked notes. 10 repetitions.</li>
  <li>Beats 1-3: add the pull-off. 10 repetitions.</li>
  <li>Complete bar: all four beats. 10 repetitions.</li>
</ol>

<h3>The Character</h3>
<p>Section 1 is a question — it states a melodic idea and leaves it open. Play it with space. Do not rush. Each note has room to breathe. The overall feeling should be calm and intentional, like the opening line of a sentence.</p>`,
    exercise: 'Use the 4-step progressive build described above. Spend at minimum 5 repetitions at each step before combining. Once you can play the complete bar, run it 15 times at a slow, comfortable tempo (approximately 50-55 BPM). Focus exclusively on clean note production — every note must ring for its full beat.',
    selfCheck: 'Each note in Section 1 should ring for its full value. The slide should arrive at fret 12 clearly in tune. The pull-off (12p10) should be clearly audible — not a whisper. The final high-e notes should sustain cleanly without touching adjacent strings. If anything is unclear, isolate that beat and do 20 reps of that beat alone.',
    techniques: ['slide', 'pull-off', 'clean picking', 'phrasing'],
    xpReward: 70,
    commonMistakes: [
      'Rushing the slide (10/12) — it should be a smooth continuous motion, not a snapped jump.',
      'Forgetting to pre-place the index finger on fret 10 before picking fret 12 for the pull-off — this causes a dead note.',
      'Treating all four beats equally — the phrase has a shape; the opening slide should feel like a longer, more deliberate gesture.',
    ],
    bonusChallenge: 'Play Section 1 at 55 BPM with eyes closed after you have learned the notes.',
    listenTo: 'Comfortably Numb — Pink Floyd (Gilmour\'s calm, melodic opening phrasing is the direct model for Section 1)',
    warmupTip: 'Warm up specifically on the B string: play each fret from 5 to 15 and back, letting each ring — Section 1 lives primarily on the B string.',
    soloSection: 1,
    successCriteria: 'You are ready for Day 17 when you can play the complete Section 1 bar at 50 BPM with every note ringing cleanly — slide arrives in pitch, pull-off is audible, final high-e notes sustain. Aim for 12 out of 15 repetitions meeting this standard.',
    bpmTarget: 50,
  },
  {
    day: 17,
    week: 3,
    title: 'Section 1 — Deep Practice',
    subtitle: 'Slow is fast',
    why: 'The only way to really learn a piece is to practice it slowly enough that every note is correct. Speed is a byproduct of clean slow practice. If you practice mistakes at speed, you\'re memorizing the mistakes. Practice it right, slow.',
    duration: 25,
    warmup: 'Section 1 from Day 16, played very slowly 3 times. Then Box 1 pentatonic 2 times.',
    mainContent: `<h3>The Science of Slow Practice</h3>
<p>When you practice slowly and correctly, your nervous system is building a physical memory of the correct movement. Each repetition reinforces the pathway. Speed comes naturally once the pathway is solid — you can\'t rush it.</p>
<p>50% tempo means: if the performance tempo is 120 BPM, practice at 60 BPM.</p>

<h3>The Specific Tempo Protocol for Today</h3>
<p>Deep practice is not the same as slow practice. Deep practice means working at the exact tempo where you are successful most (but not all) of the time — roughly 70-80% success rate. Too easy (100% success) and you are not building new capacity. Too hard (under 50% success) and you are reinforcing mistakes.</p>
<p>Here is today\'s protocol with specific BPM targets. Adjust up or down by 5 BPM if needed:</p>
<ol>
  <li><strong>50 BPM:</strong> Section 1, 5 reps. This should feel almost too slow. Good — you are building the motor program precisely.</li>
  <li><strong>55 BPM:</strong> 5 reps. Slightly harder. Notice if the slide starts to feel rushed.</li>
  <li><strong>55 BPM, isolation:</strong> Just the pull-off (12p10), 20 reps. Ensure it stays audible at this tempo before building further.</li>
  <li><strong>60 BPM:</strong> 5 complete Section 1 reps. This is today\'s target tempo.</li>
  <li><strong>Back to 50 BPM:</strong> 5 more reps to cement the pattern. Ending on a slower tempo after a harder one reinforces accuracy.</li>
</ol>
<p>Total: 25 reps across the tempo range plus 20 isolation reps. This is a complete deep-practice session.</p>

<h3>Focus Areas</h3>
<ol>
  <li><strong>The slide (10/12):</strong> Does it arrive at fret 12 in tune? Maintain pressure throughout — no dead spots.</li>
  <li><strong>The pull-off (12p10):</strong> Is the pulled note clearly audible? Pre-place your index finger on fret 10 before picking fret 12.</li>
  <li><strong>The high-e notes (12, 10):</strong> Are they ringing clean? Check that your fretting fingers are not accidentally touching the B string below.</li>
  <li><strong>The overall shape:</strong> Does the phrase flow as one connected idea, or does it feel like 4 separate notes?</li>
</ol>`,
    exercise: 'Execute the full tempo protocol described above: 50 BPM (5 reps) → 55 BPM (5 reps) → 55 BPM isolation pull-offs (20 reps) → 60 BPM (5 reps) → back to 50 BPM (5 reps). Record yourself at 60 BPM if possible. Do not skip the final return to 50 BPM — this is not regression, it is consolidation.',
    selfCheck: 'After the full protocol, you should notice the phrase feels more automatic than when you started the session. If it still feels effortful and uncertain at 60 BPM, that is fine — motor skills consolidate overnight. Return tomorrow expecting it to feel easier. That is not wishful thinking — it is how the brain works.',
    techniques: ['slow practice', 'isolation technique', 'memory building', 'tempo protocol'],
    xpReward: 70,
    commonMistakes: [
      'Skipping the final return to 50 BPM at the end of the protocol — this consolidation step is not optional.',
      'Practicing at 100% clean success rate tempo — you need to work at the edge of your ability, not in your comfort zone.',
      'Using the eyes to navigate rather than building internal feel — practice with eyes closed during the slow reps.',
    ],
    bonusChallenge: 'Record Section 1 at 60 BPM and identify one note that sounds slightly off — fix it in isolation with 20 reps.',
    listenTo: 'Since I\'ve Been Loving You — Led Zeppelin (Page\'s deliberate, unhurried approach to phrase building is the model for slow, intentional practice)',
    warmupTip: 'Isolation warm-up: practice the pull-off (12p10 on B string) 20 times before starting the tempo protocol — it is the hardest single element today.',
    soloSection: 1,
    successCriteria: 'You are ready for Day 18 when Section 1 at 60 BPM produces clean notes at least 4 out of 5 repetitions. If you are at 3/5, spend one more session on the tempo protocol before advancing.',
    bpmTarget: 60,
  },
  {
    day: 18,
    week: 3,
    title: 'Section 1 — Building Tempo',
    subtitle: 'From slow to musical',
    why: 'Slow practice builds the foundation. Tempo building is where the music comes alive. Today you bring Section 1 from slow and careful to musical and flowing. The target is 70% of performance tempo — not full speed yet, but enough that it has shape and momentum.',
    duration: 25,
    warmup: 'Section 1, slow, 3 times. Confirm every note is clean before building tempo today.',
    mainContent: `<h3>The Tempo Ladder</h3>
<p>Tempo building works best in increments. For each tempo level, play 5 clean repetitions before going up. If you miss notes at a new tempo, go back to the previous level for 5 more reps, then try again.</p>
<p>Today\'s ladder (adjust based on your current comfortable tempo):</p>
<ul>
  <li>Level 1: Current slow tempo — 5 reps</li>
  <li>Level 2: 10 BPM faster — 5 reps</li>
  <li>Level 3: 10 BPM more — 5 reps</li>
  <li>Level 4: 10 BPM more — 5 reps</li>
</ul>

<h3>What Changes at Faster Tempos</h3>
<p>As tempo increases, you have less time between notes. This forces your hands to be more economical — less unnecessary motion. You\'ll naturally find better technique as you speed up, because inefficiency becomes impossible at speed.</p>
<p>Key things to monitor:</p>
<ul>
  <li>The slide: Is it still landing in tune? Slides get harder to control at speed.</li>
  <li>The pull-off: Is it still clearly audible? Pull-offs tend to get weaker at higher tempos if your technique isn\'t locked in.</li>
  <li>The overall phrase: Does it still have musical shape, or does it become mechanical?</li>
</ul>

<h3>Backing Track Practice</h3>
<p>If a backing track is available for today\'s session, practice Section 1 with it at 70% tempo. Playing with a backing track changes how the phrase sounds — suddenly it has context, harmony, and feel.</p>`,
    exercise: 'Work through the tempo ladder above, spending 5 clean reps at each level. When you reach your 70% tempo, play Section 1 with the backing track (if available) or with a metronome, 10 times. Focus on how the phrase feels with time underneath it — does it swing? Does it breathe? Make sure the landing note (high-e fret 10) feels like an arrival, not just an ending.',
    selfCheck: 'At 70% tempo, Section 1 should feel almost automatic. You shouldn\'t be thinking about individual notes anymore — you should be thinking about the phrase as a whole. If you\'re still counting individual notes, you need more slow reps.',
    techniques: ['tempo building', 'speed development', 'backing track practice'],
    xpReward: 70,
    commonMistakes: [
      'Jumping to the target tempo without working up the ladder — skipping steps locks in sloppy timing.',
      'Staying at a comfortable tempo when it stops being challenging — you need to be at the edge, not in the comfort zone.',
      'Ignoring the musical quality at higher tempos — if it stops sounding like a phrase and starts sounding mechanical, slow back down.',
    ],
    bonusChallenge: 'Play Section 1 at 80 BPM — even if it feels fast. Record it. Notice precisely where it breaks down.',
    listenTo: 'Shine On You Crazy Diamond — Pink Floyd (Gilmour\'s patient tempo and tonal development is exactly what today\'s ladder-climbing approach emulates)',
    warmupTip: 'Tempo contrast drill: play Section 1 at your slowest clean tempo, immediately at your fastest (sloppy is OK), then back slow — the contrast sharpens both ends of your range.',
    soloSection: 1,
    successCriteria: 'You are ready for Day 19 when Section 1 plays cleanly at 70 BPM (5 consecutive clean reps) and the phrase feels musical — not just technically executed, but flowing like a statement. If it sounds mechanical at 70 BPM, spend more time at 65 BPM before pushing further.',
    bpmTarget: 70,
  },
  {
    day: 19,
    week: 3,
    title: 'Section 2 — The Build',
    subtitle: 'More energy, more legato',
    why: 'Section 2 is where the solo gains momentum. It uses hammer-ons and pull-offs almost exclusively — the legato techniques you\'ve been building since Week 1. The energy increases, the phrases get busier, and the emotional tension builds toward Section 3.',
    duration: 25,
    warmup: 'Section 1 at 70% tempo, 5 times. This is now your warm-up — keep it in your fingers.',
    mainContent: `<h3>Section 2 Tab</h3>
<pre>e |------------------------------------------------|
B |--10---12h10h12---10h12p10---12p10------------|
G |--9/10---10p9---10h12p10----------------------|
D |------------------------------------------------|
     1    +    2    +    3    +    4    +</pre>

<h3>Breaking It Down — Note by Note</h3>
<p><strong>G string run (beats 1-2):</strong></p>
<ul>
  <li>Slide from fret 9 up to fret 10 (9/10) — one smooth motion</li>
  <li>Pull off from fret 10 back to fret 9 (10p9) — pre-place index finger on 9 before sliding</li>
  <li>Hammer from fret 10 to fret 12 (10h12), then immediately pull back to fret 10 (12p10)</li>
</ul>

<p><strong>B string run (beats 2-4):</strong></p>
<ul>
  <li>Pick fret 10 cleanly</li>
  <li>Pick fret 12, then pull off to fret 10, then hammer back to fret 12 — this is a 3-note ornament (12p10h12). Your ring finger picks fret 12, index pre-placed on 10, pull off, then ring finger hammers back. One fluid motion.</li>
  <li>Pick fret 10, hammer to fret 12, pull back to fret 10 (10h12p10) — another ornament, this time starting from below</li>
  <li>Pick fret 12, pull off to fret 10, let it ring (12p10)</li>
</ul>

<p><strong>The 3-note ornament in detail:</strong> The hardest element of Section 2 is the 12p10h12 pattern. Here is how to practice it: place ring finger on fret 12, index on fret 10. Pick the ring finger note (12). Immediately pull off toward the floor to sound fret 10. Immediately hammer the ring finger back down to fret 12. That three-note cycle should sound like one fluid gesture. Practice it alone: 30 repetitions, slowly.</p>

<h3>The Character</h3>
<p>Section 2 is busier than Section 1. More notes, faster motion, legato everywhere. It should feel like energy building — like something big is coming. The contrast with Section 1\'s spaciousness is intentional.</p>`,
    exercise: 'Learn Section 2 in two halves. First half: just the G string phrase (9/10, 10p9, 10h12p10). Practice this 15 times until it flows. Second half: the B string phrase. Practice this 15 times. Then put both halves together, slowly. Goal: play the complete Section 2 5 times at a slow, comfortable tempo where every note is clear.',
    selfCheck: 'The G string runs and B string runs should sound like connected sentences, not stumbled note sequences. The legato should make it feel liquid. If it\'s choppy, slow down and practice the individual legato elements (h and p) in isolation.',
    techniques: ['legato runs', 'hammer-on', 'pull-off', 'slide', 'fast phrases'],
    xpReward: 70,
    commonMistakes: [
      'Learning the B string phrase before the G string phrase is solid — the G string run is the setup; it must come first.',
      'Rushing the 9/10 slide at the start of the G string phrase — it needs string pressure maintained throughout.',
      'Not pre-placing the index finger on fret 10 before the slide into the G string — leads to a dead 10p9 pull-off.',
    ],
    bonusChallenge: 'Play Section 2 with only the ring and index fingers — no middle finger. Forces clean, deliberate positioning.',
    listenTo: 'Crossroads — Cream live at Royal Albert Hall (Clapton\'s legato-driven runs in the verse solo are the blueprint for Section 2\'s energy)',
    warmupTip: 'Three-note ornament drill: before touching Section 2, do 30 reps of 12p10h12 on the B string in isolation — this is Section 2\'s hardest single move.',
    soloSection: 2,
    successCriteria: 'You are ready for Day 20 when the G string run and B string run each play cleanly 5 times in isolation, and you can attempt (with some stumbles) the complete Section 2 from beginning to end without stopping. Perfection is not the goal today — completion is.',
  },
  {
    day: 20,
    week: 3,
    title: 'Section 2 — Deep Practice',
    subtitle: 'Locking in the legato runs',
    why: 'Section 2 is technically the hardest part of the solo because it has the most consecutive legato notes. Deep practice on this section now prevents stumbling later when you connect all four sections.',
    duration: 25,
    warmup: 'Alternate picking chromatic exercise on low E and A strings at 65 BPM, 5 reps each (technique maintenance). Then Section 1, 5 times. Then G string phrase from Section 2, 5 times.',
    mainContent: `<h3>The Challenge of Fast Legato</h3>
<p>When you string together multiple hammer-ons and pull-offs, each one depends on the previous one being in the right position. If fret 10 isn\'t cleanly fretted when you hammer from 10 to 12, the hammer-on note will buzz or die.</p>
<p>This requires <strong>anticipatory fretting</strong> — your fingers need to be in position slightly before each note, not at the same time.</p>

<h3>The 3-Note Ornament</h3>
<p>The B string phrase contains: 12p10h12 (or similar 3-note ornament).</p>
<p>Practice this alone: place ring finger on 12, index on 10. Pick ring finger (12). Pull off to index finger (10). Immediately hammer ring finger back to 12. That\'s one cycle. Do 20 cycles without stopping.</p>

<h3>The G String Run</h3>
<p>G|--9/10---10p9---10h12p10</p>
<p>This is three separate legato moves. Practice each pair individually:</p>
<ol>
  <li>9/10 (slide) alone, 10 times</li>
  <li>10p9 (pull-off) alone, 10 times</li>
  <li>10h12p10 (hammer then pull) alone, 10 times</li>
  <li>All three together: 15 times</li>
</ol>`,
    exercise: 'Spend the first 10 minutes on isolation practice of Section 2\'s hardest element (whichever it is — probably the G string run or the 3-note ornament). Then spend 10 minutes playing complete Section 2 at slow-to-medium tempo. Final 5 minutes: Section 2 with metronome, working up the tempo ladder. Goal: 5 clean reps at a noticeably faster tempo than yesterday\'s starting point.',
    selfCheck: 'The legato runs should sound smooth and connected, not like individual picked notes. If you can hear discrete attacks on each note of a hammer-on sequence, you\'re not hammering hard enough, or you\'re pausing between each one. The motion should be one fluid gesture.',
    techniques: ['anticipatory fretting', 'legato runs', '3-note ornaments', 'deep practice'],
    xpReward: 70,
    commonMistakes: [
      'Pausing between the pull-off and the re-hammer in the 3-note ornament — it must be one continuous motion.',
      'Practicing the G string run at full speed before each component is clean — break it into 3 pairs and nail each one first.',
      'Not doing the anticipatory fretting consciously — each finger should arrive slightly before its note is needed.',
    ],
    bonusChallenge: 'String the G string run and B string run together 10 times consecutively without stopping or slowing at the join.',
    listenTo: 'Voodoo Child (Slight Return) — Jimi Hendrix (the verse solo\'s legato density matches Section 2\'s; hear how Hendrix makes it sound effortless)',
    warmupTip: 'Anticipatory fretting drill: while holding one note, practice placing the next finger silently before the note change — do this for 2 minutes on any string.',
    soloSection: 2,
    successCriteria: 'You are ready for Day 21 when the 3-note ornament (12p10h12) can be played 20 consecutive times without stopping and the G string run plays cleanly at 65 BPM. Section 2 as a whole does not need to be clean yet — that comes in Day 21.',
    bpmTarget: 65,
  },
  {
    day: 21,
    week: 3,
    title: 'Connect Sections 1 + 2',
    subtitle: 'The hardest part is the transition',
    why: 'You can play Section 1 well. You can play Section 2 well. But playing them one into the other without stopping is a completely different challenge. The transition between sections is where most guitarists stumble. Today you make it seamless.',
    duration: 30,
    warmup: '10 bends on G string fret 7 checking pitch against fret 9 (technique maintenance — bends need daily repetition to improve). Then Section 1, 5 times. Then Section 2, 5 times. Rest 30 seconds.',
    mainContent: `<h3>Why Transitions Are Hard</h3>
<p>Each section lives in its own mental space. When you finish Section 1, your brain wants to pause and reset. But music doesn\'t pause — it flows. The moment you mentally "switch sections," there will be a micro-hesitation that the listener hears as a stumble.</p>
<p>The solution: don\'t think of them as two sections. Think of them as one longer phrase with two parts.</p>

<h3>The Transition Point</h3>
<p>Section 1 ends on: high-e fret 10 (let ring)<br/>
Section 2 begins on: G string fret 9/10 (slide up) while B string fret 10 is also played</p>
<p>This is a position shift — you\'re moving from high-e fret 10 down to G string fret 9/10. Practice just this handoff specifically:</p>
<pre>e |--10---| → |------------------------|
B |-------| → |--10---12p10h12---------|
G |-------| → |--9/10---10p9-----------|</pre>
<p>The arrow is the transition. Play just the end of S1 into the start of S2 — 20 times.</p>

<h3>Loop Practice</h3>
<p>Once the transition is clean, play S1+S2 as a loop: play through both, go back to the beginning of S1, play through again. Don\'t pause between loops. This forces you to experience the ending of S2 as an ongoing musical event, not a stopping point.</p>`,
    exercise: 'Part 1: Isolate and practice the transition point (end of S1 into start of S2) 20 times. Part 2: Play the complete S1+S2 loop 10 times without stopping. Part 3: Play S1+S2 with a metronome or backing track. Note where the transition feels weak and spend extra time there. Goal: by the end of this session, you should be able to play Sections 1 and 2 as one continuous musical statement.',
    selfCheck: 'The transition between sections should be invisible to a listener. If there\'s a hesitation, a gap, or a fumble at the transition point, it\'s not ready yet. Keep working the specific transition moment until it disappears into the flow of the music.',
    techniques: ['section transitions', 'musical continuity', 'loop practice'],
    xpReward: 80,
    commonMistakes: [
      'Stopping mentally between sections even when the fingers don\'t — the hesitation starts in the head, not the hand.',
      'Not practicing the transition point in isolation (20 dedicated reps) before attempting the full two-section run.',
      'Only ever looping S1 to S2 forward — also practice S2 back to S1 start to build the loop reflex.',
    ],
    bonusChallenge: 'Play the transition point (end of S1 into start of S2) 30 times in a row at performance tempo.',
    listenTo: 'Have You Ever Loved a Woman — Derek and the Dominos (Clapton connects his solo sections invisibly — listen to how the energy flows without any gap)',
    warmupTip: 'Transition-specific warm-up: play only the last 2 notes of S1 followed by the first 2 notes of S2, looping this micro-phrase 15 times before attempting the full sections.',
    soloSection: 2,
    successCriteria: 'You are ready for Day 22 when you can play S1+S2 as a continuous musical statement without stopping at the transition point, at a tempo where every note in both sections rings clearly. The transition should be invisible — no hesitation, no gap.',
  },

  // ===== WEEK 4: PERFORMANCE =====
  {
    day: 22,
    week: 4,
    title: 'Section 3 — The Emotional Peak',
    subtitle: 'One note, played with conviction',
    why: 'Section 3 is the climax of the solo. It\'s built around a single, big bend — one note held with vibrato. This is where everything comes down to feeling. Technical accuracy matters less here than emotional conviction. The bend needs to mean something.',
    duration: 25,
    warmup: 'Alternate picking chromatic on all 4 inner strings (A, D, G, B) at 65 BPM, 3 reps each (maintaining Week 1 fundamentals). Then S1+S2 connected, 3 times. Then bending warm-up: 10 bends on G string fret 7 (to fret 9 pitch). Then 10 bends on B string fret 12 (to fret 14 pitch) — this is the main bend of Section 3.',
    mainContent: `<h3>Section 3 Tab</h3>
<pre>e |--------------------------------------------------|
B |--12b14~~---12---10h12---10----------------------|
G |--------------------------------------------------|
D |--------------------------------------------------|
     1    +    2    +    3    +    4    +</pre>

<h3>The Main Bend</h3>
<p><strong>12b14~~</strong> = B string, fret 12, bend up a whole step to fret 14 pitch, hold with vibrato (~~)</p>
<p>This is the most exposed, most important moment in the solo. The bend itself is the easy part — you\'ve practiced this. The hard part is what you do with the note after you reach the top of the bend: you hold it, and you add vibrato.</p>

<h3>Bend + Vibrato Combined</h3>
<p>This is the most advanced technique combination you\'ve attempted. Here\'s the sequence:</p>
<ol>
  <li>Pick B string fret 12</li>
  <li>Bend it up to the pitch of fret 14 (a whole step) — you should feel this in your wrist and arm</li>
  <li>Hold the bend at the top — don\'t release it</li>
  <li>While holding the bend, begin vibrato: oscillate slightly above and below the fret 14 pitch</li>
</ol>
<p>The vibrato happens at the top of the bend — you\'re not releasing it back to fret 12. You\'re oscillating around fret 14.</p>

<h3>The Resolution Phrase</h3>
<p>After the big bend: 12 — 10h12 — 10 (pick fret 12, pick fret 10, hammer to 12, pull back to 10). This is the resolution — the emotional tension of the bend releases into a descending phrase.</p>`,
    exercise: 'Today is entirely about the main bend. Step 1: Practice bending B string fret 12 to fret 14 pitch — do this 20 times. Each time, check against fret 14 to verify you\'re in tune. Step 2: After landing the bend, hold it and add vibrato for 4 beats. Practice this 10 times. Step 3: Play the complete Section 3 phrase slowly: bend, hold with vibrato, release into resolution phrase. 5 times.',
    selfCheck: 'The bend should land exactly on the pitch of fret 14 — not slightly flat, not slightly sharp. If you\'re consistently flat, you\'re not bending far enough. If you\'re sharp, too far. The vibrato at the top should be controlled and even — not shaky from the physical effort of holding the bend.',
    techniques: ['wide bend', 'bend + vibrato', 'climax phrasing', 'whole step bend'],
    xpReward: 80,
    commonMistakes: [
      'Starting vibrato before the bend has fully arrived at the target pitch — reach fret 14 pitch first, then begin the vibrato.',
      'Releasing the bend during vibrato — the oscillation should be above and below fret 14 pitch, not returning to fret 12.',
      'Using only the ring finger to execute the full step bend without index and middle fingers reinforcing behind it.',
    ],
    bonusChallenge: 'Execute the bend+vibrato combination and hold it for 6 full beats — twice as long as required.',
    listenTo: 'Texas Flood live at Carnegie Hall — Stevie Ray Vaughan (Vaughan holds bends for impossible durations with complete conviction — that commitment is what Section 3 demands)',
    warmupTip: 'B string bend warm-up: 10 bends on fret 12 to fret 14 pitch, each held for 4 beats — this is the exact moment Section 3 is built around.',
    soloSection: 3,
    successCriteria: 'You are ready for Day 23 when the B string fret 12 bend reaches the fret 14 pitch at least 12 out of 20 attempts, and you can hold the bent note with vibrato for 2 full beats without releasing or losing pitch. The combination of bend + vibrato is the hardest moment in the solo — do not rush past it.',
  },
  {
    day: 23,
    week: 4,
    title: 'Section 3 — Deep Practice',
    subtitle: 'The bend has to be right every time',
    why: 'An out-of-tune bend is worse than no bend at all. It\'s the musical equivalent of singing sharp — everyone hears it. Today is dedicated to making this bend reliable. It needs to land in tune on command, every single time.',
    duration: 25,
    warmup: 'H/p trill from Day 5 (5h7p5) on B string for 60 seconds (spaced retrieval — this motion is in the solo\'s Section 2 ornaments). Then S1+S2, 3 complete runs. Then 10 bends on B string fret 12 — checking each one against fret 14.',
    mainContent: `<h3>Building Bend Consistency</h3>
<p>A reliable bend requires two things: muscle memory for how far to push, and ear training to recognize when you\'ve arrived.</p>
<p>You need both. Muscle memory alone can drift. Ear training alone is too slow. Together, they create a bend that lands correctly automatically.</p>

<h3>The 20-Bend Drill</h3>
<p>This is the most important drill you\'ll do today:</p>
<ol>
  <li>Pick B string fret 14 — memorize this pitch</li>
  <li>Move to fret 12. Bend up until you match fret 14.</li>
  <li>Hold it. Does it match? Good.</li>
  <li>Release back to fret 12.</li>
  <li>Repeat 19 more times.</li>
</ol>
<p>After each bend, briefly pause and ask: was that in tune? Over 20 reps, your body learns exactly how far "far enough" is.</p>

<h3>Adding Context</h3>
<p>Once the bend is consistent in isolation, put it back into Section 3. Play the bend in context (after Section 2, before the resolution phrase) 5 times. Context changes how the bend feels — the musical energy you\'ve been building gives the bend more urgency.</p>

<h3>The Mental Game</h3>
<p>On performance day, this is the moment you need to commit to. Hesitant bends are always wrong. Make the decision before you pick the note, and then follow through completely. Conviction is half the technique.</p>`,
    exercise: 'Complete the 20-bend drill (as described above). Then play Section 3 alone, start to finish, 10 times. Then play S1+S2+S3 as a connected sequence for the first time. Notice how Section 3 feels different — more powerful — when it comes after S1 and S2 have built toward it.',
    selfCheck: 'After 20 dedicated bend reps, you should notice your pitch consistency improving. Aim for 16 out of 20 bends landing in tune before moving on. If you\'re below that, spend another day on this drill — it\'s worth it.',
    techniques: ['bend precision', 'pitch accuracy', 'muscle memory', 'ear training'],
    xpReward: 80,
    commonMistakes: [
      'Doing the 20-bend drill at speed without pausing to assess pitch after each one — the assessment is the point, not the quantity.',
      'Consistently landing flat (not bending far enough) but not adjusting push distance between reps.',
      'Skipping the pitch-reference step (playing fret 14 first) — without a target in your ear, you cannot self-correct.',
    ],
    bonusChallenge: 'Do the 20-bend drill twice in a row (40 total) and tally exactly how many land in tune.',
    listenTo: 'Layla (unplugged) — Eric Clapton (acoustic tone makes every bend pitch transparent — no electric compression to hide errors; the honesty of it is instructive)',
    warmupTip: 'Ear training warm-up: play fret 14 on the B string 10 times, letting it ring each time, until you can internally hear that pitch before picking it. Then start the bend drill.',
    soloSection: 3,
    successCriteria: 'You are ready for Day 24 when 16 out of 20 bends land within a semi-tone of the fret 14 pitch and you can play S1+S2+S3 as a connected performance (with some technical imperfections) without stopping.',
  },
  {
    day: 24,
    week: 4,
    title: 'Sections 1, 2, 3 Together',
    subtitle: 'The arc is taking shape',
    why: 'For the first time, you\'re playing three-quarters of the solo from beginning to end. This is a significant milestone. Today is about finding the emotional arc — feeling how Sections 1, 2, and 3 tell a complete musical story even without the resolution.',
    duration: 30,
    warmup: '10 bends on B string fret 12 checking pitch against fret 14. Then vibrato exercise: hold any note for 4 beats with 2-3 oscillations per second, 5 repetitions. Then each section individually, once: Section 1, pause. Section 2, pause. Section 3, pause.',
    mainContent: `<h3>The Three-Section Arc</h3>
<p>Musical phrases have arcs — they go somewhere, they build tension, they reach a peak. The first three sections of this solo form an arc:</p>
<ul>
  <li><strong>S1:</strong> Statement. Calm, melodic, inviting.</li>
  <li><strong>S2:</strong> Development. More movement, more energy, tension building.</li>
  <li><strong>S3:</strong> Peak. The big bend is the emotional apex — the moment of maximum tension.</li>
</ul>
<p>Playing these three sections should feel like you\'re telling a story with a beginning, middle, and almost-ending. Section 4 (tomorrow) provides the resolution.</p>

<h3>Transitions Review</h3>
<p>You\'ve already worked on S1→S2. Today, also work on S2→S3:</p>
<p>S2 ends with: B string fret 12p10, let ring<br/>
S3 begins with: B string fret 12 (pick), bend to 14</p>
<p>The transition is smooth — same string, close positions. But the change in character is dramatic: from a fast legato run to a slow, held bend. Practice this specific moment 10 times.</p>

<h3>Playing for Feel</h3>
<p>When running all three sections, don\'t think about the notes. You know the notes. Focus on the feel — the emotional quality of each section, and how they connect. Where is the energy low? Where does it rise? Play it like you mean it.</p>`,
    exercise: 'Part 1: Work the S2→S3 transition specifically, 10 times. Part 2: Run S1+S2+S3 without stopping, 10 times total. After each run, pause and mentally note: what felt connected and musical? What felt mechanical? Part 3: One final run with backing track (if available), committing to the emotional arc.',
    selfCheck: 'S1+S2+S3 should now feel like a real musical performance, not a practice exercise. If it still feels like you\'re just running through notes, you\'re not connecting with the music yet. Try closing your eyes and focusing entirely on the sound you\'re making. The technical work is done — now it\'s about feeling.',
    techniques: ['musical arc', 'performance mindset', 'transition practice', 'emotional phrasing'],
    xpReward: 80,
    commonMistakes: [
      'Treating the S2→S3 transition as a gear-shift — it should be a natural progression, not a sudden stop-and-restart.',
      'Playing all three sections at the same dynamic level — S1 softer, S2 building, S3 at full commitment.',
      'Not working the S2→S3 transition in isolation (10 dedicated reps) before the full three-section run.',
    ],
    bonusChallenge: 'Play S1+S2+S3 with eyes closed once you have done 5 clean runs with eyes open.',
    listenTo: 'All Along the Watchtower — Jimi Hendrix (Hendrix builds his three solo sections through exactly this kind of progressive emotional arc — listen to how each one escalates)',
    warmupTip: 'Arc-building warm-up: play S1 alone with soft dynamics, S2 alone with medium dynamics, S3 alone with maximum dynamics — prime each section\'s character before connecting them.',
    soloSection: 3,
    successCriteria: 'You are ready for Day 25 when S1+S2+S3 plays continuously from beginning to end — bend landing somewhere near the target pitch, vibrato present even if imperfect — and the S2→S3 transition feels smooth rather than like a gear-shift.',
  },
  {
    day: 25,
    week: 4,
    title: 'Section 4 — The Resolution',
    subtitle: 'Bringing the solo home',
    why: 'Every story needs an ending, and every solo needs a resolution. Section 4 brings the musical tension built across Sections 1-3 to a peaceful landing. It\'s vibrato-heavy and final-feeling. The last note should sound like something has been completed.',
    duration: 25,
    warmup: 'Alternate picking on high e string at 70 BPM, 5 reps (the e string is used heavily in Section 4 — warm it up specifically). Then 10 bends on B string fret 12. Then S1+S2+S3, two complete runs.',
    mainContent: `<h3>Section 4 Tab</h3>
<pre>e |--12---10---12~~-----------------------------|
B |--10---12---10---12p10---10~~---------------|
G |---------------------------------------------|
D |---------------------------------------------|
     1    +    2    +    3    +    4    +</pre>

<h3>Breaking It Down</h3>
<p><strong>Opening (beat 1):</strong> High-e fret 12, high-e fret 10. Clean picking. Descending from the S3 peak.</p>
<p><strong>Beat 2-3:</strong> e string fret 12 with vibrato (~~ for 2 beats). B string fret 10, fret 12.</p>
<p><strong>Beat 3-4:</strong> B string 10, 12p10 (pull-off), then fret 10 held with long vibrato.</p>
<p><strong>Final note:</strong> B string fret 10, held with full vibrato for 4+ beats. This is the last sound of the solo. It needs to feel like the last word of a sentence.</p>

<h3>The Final Vibrato</h3>
<p>The ~~~ at the end means extended vibrato. Hold the final note as long as you want. Let it fade naturally. This is your moment of arrival. Don\'t rush out of it.</p>

<h3>The Character</h3>
<p>Section 4 feels like exhaling after a long, held breath. The tension of the big bend has released. You\'re landing somewhere safe. Play it with a sense of resolution — slower, more sustained notes than S2, more controlled than S3.</p>`,
    exercise: 'Learn Section 4 phrase by phrase. First: just the e-string opening (12, 10, 12~~). 10 times. Then: the B-string phrase with pull-off (10, 12, 10, 12p10, 10). 10 times. Then: complete Section 4 with the long final vibrato. 5 times. Hold that last note differently each time — experiment with vibrato width and speed.',
    selfCheck: 'The final note\'s vibrato should sound controlled and intentional — not like your hand is tired. It should feel like an artistic choice, not a physical necessity. If it sounds shaky or weak, it\'s not ready. Practice the final note\'s vibrato alone until it feels strong.',
    techniques: ['resolution phrases', 'sustained notes', 'vibrato on final notes', 'musical endings'],
    xpReward: 80,
    commonMistakes: [
      'Releasing the final note too quickly — the last note should ring until it naturally fades, not be cut short.',
      'Using the same vibrato speed and width on the e-string midpoint vibrato as the final note — they should be different characters.',
      'Rushing the pull-off (12p10) before the final note — it is the last active phrase; it deserves clean execution.',
    ],
    bonusChallenge: 'Create your own resolution phrase using Box 1 notes — substitute it for the written Section 4 and notice whether it still feels finished.',
    listenTo: 'Time — Pink Floyd (Gilmour\'s solo ends on a long, vibrato-heavy final note that rings into silence — exactly what Section 4 is designed to do)',
    warmupTip: 'Vibrato endurance warm-up: hold B string fret 10 with vibrato for 8 consecutive beats — builds the sustained vibrato needed for Section 4\'s long final note.',
    soloSection: 4,
    successCriteria: 'You are ready for Day 26 when you can play Section 4 with the final note sustained for at least 4 beats with controlled vibrato — even if the vibrato is still developing, it must be present and intentional, not omitted.',
  },
  {
    day: 26,
    week: 4,
    title: 'Section 4 — Deep Practice',
    subtitle: 'The ending has to feel like an ending',
    why: 'A weak ending undercuts everything that came before it. The last note of the solo is the last thing your listener hears. It needs to be held with confidence, in tune, with a vibrato that says "this is where the story ends."',
    duration: 25,
    warmup: 'Vibrato exercise: hold B string fret 10 for 8 beats with steady vibrato, 5 repetitions (the final note of the solo — make it perfect). Then Section 4 alone, 5 times.',
    mainContent: `<h3>Section 4 Refinement Points</h3>
<p><strong>1. The opening descent (e string 12-10):</strong><br/>
These notes are the continuation from S3\'s peak. They should feel like coming down from a great height — still musical, not just technically executing notes. Lean into the descending movement.</p>

<p><strong>2. The e string vibrato (12~~):</strong><br/>
This is a shorter vibrato moment before the final one. Different character: quicker, less wide than the final vibrato. It punctuates the descending phrase.</p>

<p><strong>3. The pull-off phrase (12p10):</strong><br/>
One last technical moment before the final landing. Make sure it\'s clean. This is the last complex phrase — execute it well so the final note sounds intentional, not like you\'re relieved to be done.</p>

<p><strong>4. The final note (B string 10~~):</strong><br/>
This is where everything lands. Hold it. Feel it. Add your best vibrato. Let it ring until the note naturally dies away. This is not a place to rush.</p>

<h3>The Full Section 4 Arc</h3>
<p>Section 4 has its own smaller arc within the larger solo arc: it descends (resolves), has one brief moment of expression (the e-string vibrato), has one final active phrase (the pull-off), and then comes to rest on the last note. Play it with this shape in mind.</p>`,
    exercise: 'Part 1: Section 4 alone, 10 times. Perfect the final note each time — vibrato for 4 full beats. Part 2: S3 into S4 (the last half of the solo), 5 times. Feel the transition from tension to resolution. Part 3: Final 5 minutes — play Section 4 with closed eyes, focusing entirely on feel. Make the ending sound finished.',
    selfCheck: 'After today, Section 4 should be as solid as Section 1. The final note\'s vibrato should feel like your own signature — something you own. If it still feels uncertain, that\'s OK — tomorrow you play the full solo for the first time, and that context will lock it in.',
    techniques: ['phrasing refinement', 'sustained vibrato', 'musical endings', 'performance feel'],
    xpReward: 80,
    commonMistakes: [
      'Playing the final note\'s vibrato as an afterthought once the "hard" part is done — the final vibrato is the musical destination, not a footnote.',
      'Not distinguishing between the e-string midpoint vibrato and the final note\'s vibrato — vary the character deliberately.',
      'Rushing out of the final note because practicing the ending feels awkward — sit with the last sound until it fades completely.',
    ],
    bonusChallenge: 'Play the final note (B string fret 10) with vibrato for 10 beats — experiment with width and speed across the duration.',
    listenTo: 'Wish You Were Here — Pink Floyd (Gilmour\'s final note in that solo is the template for ending with dignity and intention)',
    warmupTip: 'Section 4 ending sequence warm-up: practice only the last 3 notes (12p10 then long final vibrato) 10 times — perfect the landing before attempting the full section approach.',
    soloSection: 4,
    successCriteria: 'You are ready for Day 27 when you can play the complete solo (S1+S2+S3+S4) from beginning to end without stopping, even if slowly and even if imperfect. Completion matters more than perfection at this stage.',
  },
  {
    day: 27,
    week: 4,
    title: 'Full Solo — Slow Run-Through',
    subtitle: 'Beginning to end for the first time',
    why: 'This is a significant moment. You\'ve been working section by section for 11 days. Today you play the complete solo from bar 1 to the final note, without stopping. It won\'t be perfect. That\'s fine. The first complete run-through is about experiencing the whole thing as a musical event.',
    duration: 30,
    warmup: 'Each section individually, once through, at a comfortable slow tempo. S1, S2, S3, S4. Think of it as a pre-flight check.',
    mainContent: `<h3>Rules for Today</h3>
<p><strong>Rule 1: Don\'t stop.</strong><br/>
Even if you miss a note. Even if a transition stumbles. Keep going. You\'re training yourself to perform, and performances don\'t stop. If you stop every time something goes wrong, you\'ll always stop when something goes wrong.</p>

<p><strong>Rule 2: Play slowly enough to play the whole thing cleanly.</strong><br/>
Set a tempo where you can execute every section without stumbling. This may be significantly slower than your best individual section tempo. That\'s fine. The whole is what matters today.</p>

<p><strong>Rule 3: Focus on the music, not the notes.</strong><br/>
By this point, the notes are in your muscle memory. Trust them. Your job today is to play with feeling and intention — to sound like you mean it.</p>

<h3>What to Expect</h3>
<p>The transitions will probably be the weak spots. Specifically S2→S3 (the move from fast legato into the big bend) will likely feel like the hardest moment. Give it extra time in your head before you reach it — prepare for it mentally as you play through S2.</p>

<h3>After the Run-Through</h3>
<p>Play it once, then reflect: What felt musical? What felt mechanical? What transition needs more work? Make notes — there are two days of targeted refinement ahead before the performance.</p>`,
    exercise: 'Play the complete solo 3 times through. First time: very slow, every note intentional. Second time: slightly faster, focus on sections 3 and 4. Third time: play it with a backing track if available, or just with a metronome. After the third run: identify the single weakest moment and spend the last 10 minutes on exactly that moment.',
    selfCheck: 'You should be able to play the complete solo from beginning to end without stopping. If you can\'t get through it without stopping, the issue is one of two things: either the tempo is too fast, or one specific technical element needs more isolation work. Identify which it is and address it before tomorrow.',
    techniques: ['full performance', 'musical continuity', 'performance mindset'],
    xpReward: 100,
    commonMistakes: [
      'Stopping when you make a mistake — every stop reinforces the habit of stopping; push through and keep playing.',
      'Playing faster than your current clean tempo — choose a tempo where you can execute the full solo without stumbling.',
      'Not identifying and drilling the one weakest moment after the run-throughs — that is the most valuable part of today.',
    ],
    bonusChallenge: 'After your 3 full runs, play the solo again but give 2 extra beats of sustain to every note that has a vibrato marking.',
    listenTo: 'Comfortably Numb Live in Gdansk — Pink Floyd (Gilmour\'s full-performance pacing and discipline is the model for today\'s first complete run-through)',
    warmupTip: 'Pre-flight warm-up: play each section once at 40 BPM — not to practice, just to feel the notes in your fingers. This is mental mapping, not building.',
    soloSection: undefined,
    successCriteria: 'You are ready for Day 28 when you have completed 3 full-solo run-throughs without stopping, identified your one weakest moment, and spent focused work on that specific moment.',
  },
  {
    day: 28,
    week: 4,
    title: 'Timing, Phrasing, and Dynamics',
    subtitle: 'How you play is as important as what you play',
    why: 'The notes are the content of the solo. How you play them is the expression. Today isn\'t about adding new notes — it\'s about finding the dynamics (loud and soft), the phrasing (where to breathe), and the timing (where to push and where to relax) that make this solo feel alive.',
    duration: 25,
    warmup: 'Complete solo, once through, slow. No pressure — just a warm-up.',
    mainContent: `<h3>Dynamics: Loud and Soft</h3>
<p>Not every note deserves the same volume. In the solo:</p>
<ul>
  <li>The bend in Section 3 should be the loudest moment — it\'s the climax. Drive it hard.</li>
  <li>The opening of Section 1 should be slightly softer — it\'s an invitation, not a declaration.</li>
  <li>The final note of Section 4 should start at medium volume and naturally fade.</li>
</ul>
<p>Try exaggerating the dynamics first: play S1 very soft, then build to S3 being very loud, then S4 settling back. Even if it feels too dramatic, it will sound more musical.</p>

<h3>Phrasing: Where to Breathe</h3>
<p>Phrases need space between them — a brief moment where the previous phrase settles before the next begins. In this solo, the natural breathing places are:</p>
<ul>
  <li>After the last note of S1 (before the slide in S2)</li>
  <li>After the S2 runs settle (before the S3 bend)</li>
  <li>The long vibrato notes in S4</li>
</ul>
<p>In these moments, resist the urge to move immediately to the next note. Let the phrase land.</p>

<h3>Timing: Push and Relax</h3>
<p>Great lead guitar players don\'t play metronomically — they push slightly ahead of the beat during exciting moments and relax slightly behind during emotional ones. This gives the music a human quality. During S2\'s fast legato runs, you can be right on the beat. During S3\'s bend, you can lag slightly, savoring the moment.</p>`,
    exercise: 'Play the complete solo 3 times, each time focusing on a different element. Run 1: dynamics (loud/soft contrast). Run 2: phrasing (breathing between phrases). Run 3: timing (pushing and relaxing). After all three, play it once more with all three elements in mind simultaneously.',
    selfCheck: 'If someone listened to your Run 3 performance, would they feel the emotional arc? Would the bend in S3 feel like a peak? Would the final note feel like an ending? These are the questions of performance, not technique.',
    techniques: ['dynamics', 'phrasing', 'timing', 'musical expression'],
    xpReward: 80,
    commonMistakes: [
      'Playing all three "run" passes identically — each run should focus on only one element (dynamics, phrasing, or timing) so you can isolate and develop each one.',
      'Assuming dynamics only means loud vs. soft — attack angle, pick depth, and sustain length also shape dynamics.',
      'Ignoring the timing suggestion to push and relax — metronomic playing at this stage sounds robotic, not musical.',
    ],
    bonusChallenge: 'Play the solo twice: once with dynamics maximally exaggerated (very soft to very loud), once with deliberately flat dynamics. Compare how they feel.',
    listenTo: 'Still Got the Blues — Gary Moore (Moore\'s dynamic shifts within a single phrase are the benchmark for expressive solo playing)',
    warmupTip: 'Dynamic control drill: practice playing the same single note at 5 different volumes — pianissimo through fortissimo — 3 times each. Calibrates your picking hand\'s dynamic range before the full run.',
    soloSection: undefined,
    successCriteria: 'You are ready for Day 29 when a listener (real or imagined) would be able to hear where the solo peaks (S3) and where it resolves (S4). If the whole solo sounds like one flat, even dynamic level, the expression work is not done yet.',
  },
  {
    day: 29,
    week: 4,
    title: 'Full Speed + Backing Track',
    subtitle: 'The final dress rehearsal',
    why: 'Tomorrow is performance day. Today you play the solo at performance tempo, with the backing track, as close to the final performance as possible. This isn\'t about finding mistakes — it\'s about building confidence and getting comfortable at full speed.',
    duration: 30,
    warmup: 'Warm your hands: chromatic exercise 3 reps, then each section of the solo individually at performance tempo. Then two full runs at medium tempo.',
    mainContent: `<h3>What Full Speed Means</h3>
<p>Performance tempo is the tempo at which the solo sounds musical — not rushed, not dragging. It should feel like the right tempo for the music. If you\'re forcing it, it\'s too fast. If it feels too easy, you might be going slow.</p>

<h3>Backing Track Practice</h3>
<p>Playing with a backing track is fundamentally different from playing to a metronome. The backing track gives you:</p>
<ul>
  <li><strong>Harmony:</strong> You can hear whether your notes are consonant or dissonant</li>
  <li><strong>Feel:</strong> The rhythm section creates a groove that informs how you phrase</li>
  <li><strong>Context:</strong> Your solo sounds like a solo, not an exercise</li>
</ul>
<p>Listen to the backing track first (if available) — feel its groove, tempo, and energy. Then play the solo on top of it.</p>

<h3>Recording Yourself</h3>
<p>If you can, record your practice today. It doesn\'t need to be high quality — a phone recording is fine. Listening back reveals things you can\'t hear while playing: wrong notes you thought sounded fine, timing issues, dynamic problems.</p>
<p>Don\'t be too critical when you listen. Notice what works. Notice what to improve. Keep the ratio 70% positive observation, 30% constructive improvement.</p>

<h3>The Mindset for Tomorrow</h3>
<p>Performance day is not about being perfect. It\'s about playing the solo as an expression — with intention, feeling, and commitment. Play it like you mean every note.</p>`,
    exercise: 'Part 1: Full solo at performance tempo with backing track, 5 times. Record yourself on run 3. Part 2: Listen to the recording. Note 2-3 specific things to improve tomorrow. Part 3: Two more full runs, incorporating what you heard. Part 4: Final run — play it like it\'s the real thing. Commit to every note.',
    selfCheck: 'After today, you should feel ready for tomorrow. Not "perfect," but ready. Confidence comes from repetition and preparation, and you\'ve put in both. Trust your work.',
    techniques: ['performance tempo', 'backing track', 'self-recording', 'performance preparation'],
    xpReward: 100,
    commonMistakes: [
      'Going straight to full performance tempo without the progression warm-up — cold hands at speed produce sloppy playing.',
      'Being excessively self-critical when listening back — notice 70% of what works, then identify 30% to improve.',
      'Not recording yourself — the recording is part of the lesson; skipping it means skipping the diagnostic.',
    ],
    bonusChallenge: 'Record the solo twice and compare both recordings — identify the single moment that improved between run 1 and run 2.',
    listenTo: 'Your own recording from today — listen as if you are the audience, not the player.',
    warmupTip: 'Performance warm-up ritual (use this same sequence on Day 30): chromatic exercise 3 reps, each section at 70% tempo, then one slow full run — only then go to performance tempo.',
    soloSection: undefined,
    successCriteria: 'You are ready for Day 30 when you have a recording you are willing to listen to — not perfect, but honest. If you cannot bring yourself to record yourself, that is a sign to do one more run with full commitment before the final day.',
  },
  {
    day: 30,
    week: 4,
    title: 'You Did It',
    subtitle: 'PERFORMANCE DAY',
    why: 'This is what you came here for. For 30 days, you\'ve been building toward this moment. Every chromatic exercise, every slow repetition, every bend practice, every frustrating transition run — all of it led here. Today you perform your first complete guitar solo.',
    duration: 30,
    warmup: 'Warm up as you would before any performance: chromatic exercise, each section once, then one full slow run-through. Get your hands warm and your head in the right place.',
    mainContent: `<h3>Before You Play</h3>
<p>Take a moment. Think about what you\'ve learned in the last 30 days:</p>
<ul>
  <li>You can alternate pick cleanly at speed</li>
  <li>You have hammer-ons and pull-offs that flow naturally</li>
  <li>You know the A minor pentatonic scale by feel</li>
  <li>You can execute a reliable, in-tune bend</li>
  <li>You have a vibrato</li>
  <li>You know a complete solo from memory</li>
</ul>
<p>None of that existed 30 days ago.</p>

<h3>The Performance</h3>
<p>Play the complete solo from beginning to end. Use the backing track if you have it. If not, a metronome, or just the internal rhythm you\'ve developed.</p>
<p>If you miss a note: don\'t stop. Keep playing. A missed note that you play through is always better than a stop. Real performances have imperfect moments — what makes them real is that they continue.</p>
<p>After you play it once: play it again. And again if you want. This is your solo now. You can play it whenever you want.</p>

<h3>What Comes Next</h3>
<p>Finishing this program means you can learn any solo. The skills you\'ve built are permanent and transferable. You know how to practice technique, how to learn new material section by section, how to build tempo, how to perform.</p>
<p>The next solo will be faster to learn. And the one after that even faster. You are a lead guitarist.</p>

<h3>Your Foundation — What You Actually Built</h3>
<ul>
  <li><strong>Alternate picking</strong> — the engine of all fast, clean phrases</li>
  <li><strong>Hammer-ons and pull-offs</strong> — the legato vocabulary every blues-rock player uses</li>
  <li><strong>Slides</strong> — the most vocal approach note in the language</li>
  <li><strong>A minor pentatonic Box 1</strong> — the scale behind thousands of classic solos</li>
  <li><strong>String bending</strong> — the technique that makes guitar sound like a voice</li>
  <li><strong>Vibrato</strong> — your personal signature on every held note</li>
  <li><strong>Phrasing and space</strong> — the understanding that silence is as important as notes</li>
</ul>

<h3>Where to Go From Here</h3>
<p><strong>Next solos to learn (in order of difficulty):</strong></p>
<ol>
  <li><em>Sunshine of Your Love</em> — Cream (Clapton). Pentatonic-based riff and solo. Directly applies everything you know.</li>
  <li><em>Comfortably Numb</em> solo 1 — Pink Floyd (Gilmour). Slow, expressive bends and vibrato. Perfect for your current level.</li>
  <li><em>Pride and Joy</em> intro — Stevie Ray Vaughan. Slightly harder — introduces double stops and more aggressive bends.</li>
</ol>
<p><strong>Next techniques to explore:</strong></p>
<ol>
  <li><strong>Box 2 of the pentatonic</strong> — extend your fretboard range. Same scale, new position.</li>
  <li><strong>Pre-bends</strong> — bend before picking so the listener hears only the bent pitch, not the approach.</li>
  <li><strong>Pentatonic Box 5</strong> — connects to Box 1 and gives you access to the full neck.</li>
  <li><strong>Double stops</strong> — playing two strings at once for a thicker sound.</li>
</ol>
<p><strong>Keep playing daily, even for 10 minutes.</strong> Motor skills built through guitar practice decay faster than other memories if not maintained. 10 minutes a day, 5 days a week preserves everything you built this month.</p>

<h3>Share It</h3>
<p>Record your performance. Share it if you want. But more importantly — remember this moment. The first time you played your first guitar solo all the way through. You earned this.</p>`,
    exercise: 'PERFORM THE COMPLETE SOLO. No stopping. Full commitment from the first note to the last vibrato. Record it. Play it again if you want — this is your music now.',
    selfCheck: 'How did it feel? The answer to that question is the only self-check that matters today.',
    techniques: ['full performance', 'all techniques combined', 'solo completion'],
    xpReward: 500,
    commonMistakes: [
      'Stopping after one performance — play it again. And again if you want. It is your solo now.',
      'Being too nervous to commit to the big bend in Section 3 — hesitant bends are always flat. Decide before you pick the note.',
      'Ending the final note too early because it feels awkward to let it ring — hold that last vibrato until the string naturally stops.',
    ],
    bonusChallenge: 'Learn the intro riff of Sunshine of Your Love by Cream — your first step into the next solo.',
    listenTo: 'Your own recording from today — listen with pride, not judgment.',
    warmupTip: 'Exactly the same ritual as Day 29: chromatic exercise, each section once, one slow full run. The same ritual every time you perform builds a mental trigger that signals performance mode.',
    soloSection: undefined,
  },
]
