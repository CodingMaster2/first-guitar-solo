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
    warmup: 'Pick up your guitar and play each string open, one at a time. Listen to how each string rings and sustains. Pay attention to the tone — is it clear? Buzzy? This is your ear training starting right now.',
    mainContent: `<h3>Thinking Like a Lead Guitarist</h3>
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
<p>Index finger on 5, middle on 6, ring on 7, pinky on 8. Every note on its own beat. Every note clean.</p>`,
    exercise: 'Play the chromatic exercise on the low E string: frets 5-6-7-8, one finger per fret, down-pick each note. Start at whatever tempo feels comfortable — there is no rush. Do 5 full repetitions. Then try it on the A string (same frets). Rest, then do 5 more on the low E. Total practice time: 5-10 minutes.',
    selfCheck: 'Each note should ring clearly for its full duration before the next note. If you hear any buzzing, adjust your finger placement — press right behind the fret, not on top of it. The goal is clarity, not speed.',
    techniques: ['single-note picking', 'finger placement', 'chromatic exercise'],
    xpReward: 50,
  },
  {
    day: 2,
    week: 1,
    title: 'Reading Tabs + Timing',
    subtitle: 'The language of guitar music',
    why: 'Guitar tabs let you read and write music without knowing traditional notation. Every guitarist uses them. You need to be fluent. Today you learn to read tabs and — critically — you learn to play them in time.',
    duration: 20,
    warmup: 'Chromatic exercise from Day 1 on the low E string, 3 repetitions. Try to keep each note equally loud.',
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
  },
  {
    day: 3,
    week: 1,
    title: 'Alternate Picking',
    subtitle: 'The engine of every fast, clean guitar phrase',
    why: 'Alternate picking — down, up, down, up — is the most efficient way to move your pick through strings. It\'s the foundation of speed, and more importantly, it creates even, consistent tone. Without it, you have a ceiling. With it, you have no ceiling.',
    duration: 20,
    warmup: 'Chromatic exercise (Day 1), 3 repetitions with all downstrokes. Notice the effort required to reset your pick after each note.',
    mainContent: `<h3>Why Alternate Picking?</h3>
<p>All-downstrokes work fine at slow tempos. But as speed increases, constantly lifting the pick back up for another downstroke becomes inefficient and tiring. Alternate picking (down-up-down-up) is twice as efficient because you're using the motion in both directions.</p>
<p>More importantly: alternate picking forces your upstrokes to be as clean as your downstrokes. Most guitarists have weak, sloppy upstrokes. Fixing that makes every phrase cleaner immediately.</p>

<h3>The Motion</h3>
<p>Your pick should move from the wrist, not the elbow. Small, controlled motion. The pick travels through the string and rests slightly past it — then comes back up through the string on the upstroke.</p>
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
    exercise: 'Take the chromatic exercise from Day 1 (low E string, frets 5-6-7-8). Apply alternate picking: D-U-D-U. Start at 60 BPM — one note per click. Do 10 repetitions. Focus on making the upstrokes sound exactly as clear and loud as the downstrokes. Then try the 8-note figure from Day 2 with alternate picking.',
    selfCheck: 'Record yourself playing 30 seconds of this exercise (voice memo on your phone is fine). Listen back. Can you hear a difference between your downstrokes and upstrokes? If yes, keep working on evening them out. If no, you\'re in great shape.',
    techniques: ['alternate picking', 'pick motion', 'downstroke', 'upstroke'],
    xpReward: 50,
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
    exercise: 'On the B string: pick fret 5, hammer onto fret 7 without picking again. Listen — is the hammered note as loud as the picked note? Repeat 10 times. Then try the 4-note hammer-on phrase (5h7h8h10). Finally, alternate the phrases: pick fret 5-hammer 7 (2 notes), then pick fret 5-hammer 7-hammer 8-hammer 10 (4 notes). Rest 30 seconds, repeat.',
    selfCheck: 'The hammered note should be close to the same volume as the picked note. If it\'s much quieter, hammer harder. If it\'s buzzing, adjust your finger placement. The transition between picked note and hammered note should sound smooth — not like two separate events.',
    techniques: ['hammer-on', 'legato', 'fret-hand technique'],
    xpReward: 50,
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
    exercise: 'Step 1: Place index finger on B string fret 5, ring finger on fret 7. Pick fret 7, pull off to fret 5. Repeat 10 times. Step 2: Combine with hammer-on: from fret 5, hammer to 7, pull back to 5. This is one complete cycle. Repeat 10 times. Step 3: Try doing this continuously — 5h7p5h7p5 — as a flowing motion for 30 seconds.',
    selfCheck: 'The pulled-off note should be clearly audible, not barely a whisper. All three notes in the h/p combination (5, 7, 5) should be roughly equal volume. If the pull-off is weak, practice the pulling motion alone until the note rings clearly.',
    techniques: ['pull-off', 'legato', 'hammer-on/pull-off combination', 'trill'],
    xpReward: 50,
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
G |---7\5-------|  ← slide down from 7 to 5
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
G |---5/7---7\5---5/9-----|
D |------------------------|</pre>`,
    exercise: 'Part 1: On the G string, pick fret 5, slide up to fret 7. Hold fret 7 for a beat. Then slide back down to fret 5. Repeat 10 times. Part 2: Try ascending then descending quickly: 5/7/9\\7\\5. One continuous phrase. Part 3: Play the 3-note slide phrase from the tab above. Focus on making the arriving note ring clearly at the correct pitch.',
    selfCheck: 'The note at your destination should sound in tune and clear. If the slide "dies" before you reach the destination, you\'re releasing pressure. If it sounds off-pitch, you may be landing on the wrong fret. Count the frets as you slide — feel the bumps of the frets under your finger.',
    techniques: ['slide', 'legato slide', 'ascending slide', 'descending slide'],
    xpReward: 50,
  },
  {
    day: 7,
    week: 1,
    title: 'Week 1 Review + Skill Check',
    subtitle: 'Consolidate everything before moving forward',
    why: 'You\'ve learned five techniques in six days. Before you move to Week 2, you need to make sure each technique is actually working — not just theoretically understood, but physically playable. This review session locks in Week 1.',
    duration: 30,
    warmup: 'Chromatic exercise on all 6 strings (frets 5-8), alternate picking, 60 BPM. One rep per string, top to bottom and back.',
    mainContent: `<h3>The Week 1 Five-Technique Challenge</h3>
<p>Today you\'ll run through all five techniques in a structured sequence. For each technique, play it cleanly 5 times before moving on. "Cleanly" means every note rings clearly, at consistent volume, with no buzzing.</p>

<h3>The Sequence</h3>
<p><strong>1. Alternate Picking</strong><br/>
Chromatic exercise on low E, frets 5-6-7-8, alternate picking, 60 BPM. 5 repetitions.</p>

<p><strong>2. Hammer-ons</strong><br/>
B string: 5h7h8h10. 5 repetitions. The hammered notes should be full volume.</p>

<p><strong>3. Pull-offs</strong><br/>
B string: 10p8p7p5. 5 repetitions. This is the reverse of #2 — pull off from 10 down to 5.</p>

<p><strong>4. Slides</strong><br/>
G string: 5/7, hold, 7\\5. 5 repetitions. Smooth, continuous motion.</p>

<p><strong>5. Combination Phrase</strong><br/>
This combines multiple techniques:</p>
<pre>e |----------------------------------|
B |---5h7p5---5h7--------------------|
G |----------5/7\\5-----------------|
D |----------------------------------|</pre>
<p>This is a mini-lick. Play it 5 times.</p>

<h3>Self-Assessment</h3>
<p>Rate yourself on each technique: 1 (needs work) / 2 (developing) / 3 (solid). Be honest. The AI Coach can help you target weak areas in Week 2.</p>`,
    exercise: 'Complete the full five-technique challenge sequence above. After finishing, answer: Which technique felt weakest? Spend an extra 5 minutes on that one technique before completing the lesson. If all felt equally strong, spend the extra time on the combination phrase — play it until it flows naturally.',
    selfCheck: 'By the end of Week 1, you should be able to play each technique cleanly at 60 BPM and combine them in a short phrase. If you\'re not there on any technique, note it in your self-assessment — the curriculum will reinforce it in Week 2.',
    techniques: ['alternate picking', 'hammer-on', 'pull-off', 'slide', 'combination phrases'],
    xpReward: 100,
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
    exercise: 'Slowly play through the Box 1 preview above, from low E to high e, then back down. Just listen to the sound — the minor pentatonic sound. Then pick any two adjacent notes from the pattern and play them back and forth 20 times. Notice how even two notes from this scale have musical character.',
    selfCheck: 'You should be able to hear the "bluesy" quality of the minor pentatonic. If you\'ve heard classic rock solos before, this should sound familiar. That familiarity means you\'re hearing it correctly.',
    techniques: ['pentatonic scale', 'scale theory', 'box patterns'],
    xpReward: 60,
  },
  {
    day: 9,
    week: 2,
    title: 'Pentatonic Box 1 — A Minor',
    subtitle: 'Your first complete scale shape',
    why: 'Box 1 of the A minor pentatonic scale is the most-used scale pattern in rock guitar history. Hendrix, Clapton, Page, SRV — they all started here. Learning it completely changes how you relate to the fretboard.',
    duration: 25,
    warmup: 'Day 7 combination phrase, 5 times. Focus on clean transitions between techniques.',
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
    exercise: 'Play Box 1 ascending (low E to high e) and descending (high e back to low E) with alternate picking at 60 BPM, 10 complete runs. Then: play it ascending-only 5 times at 70 BPM. Then: play only the top two strings (B and e) back and forth. This top portion of Box 1 is where most solos live.',
    selfCheck: 'You should be able to play the full ascending and descending scale without pausing to think about the next note. It should feel like a connected shape, not 12 individual notes. If you\'re still looking at your hands for every note, keep going — repetition builds the map.',
    techniques: ['pentatonic box 1', 'scale fingering', 'ascending/descending'],
    xpReward: 60,
  },
  {
    day: 10,
    week: 2,
    title: 'Creating Simple Phrases',
    subtitle: 'Running a scale is not music',
    why: 'Running up and down the pentatonic scale is an exercise, not a solo. The difference between exercise and music is phrasing — grouping notes into short, meaningful ideas with space between them. Today you learn how to take 3-4 notes and make them say something.',
    duration: 25,
    warmup: 'Box 1 pentatonic, full ascending and descending, 3 repetitions at 60 BPM. Focus on clean notes, not speed.',
    mainContent: `<h3>What Makes a Phrase?</h3>
<p>A musical phrase has a beginning, some kind of motion, and an end. Think about how you speak: you don\'t talk in one endless stream — you say something, pause, say something else. Guitar phrases work the same way.</p>

<h3>The 3-4 Note Motif</h3>
<p>Pick any 3 adjacent notes from Box 1. For example, from the top of the box:</p>
<pre>e |---5--8--|
B |---5-----|
G |---------|</pre>
<p>Three notes: B string fret 5, high e fret 5, high e fret 8. That\'s a phrase.</p>
<p>Now add rhythm. Don\'t play them all on equal beats — let some be longer, some shorter. Try:</p>
<ul>
  <li>Long — short — short</li>
  <li>Short — short — long (this is most common in blues)</li>
  <li>Short — long — short</li>
</ul>

<h3>Space Is Part of the Phrase</h3>
<p>After you play your 3-note motif, stop. Let it breathe. Count 2 beats of silence. Then play it again. That space makes the phrase sound intentional — like a statement, not just running.</p>

<h3>Example Phrases to Try</h3>
<pre>Phrase A: e|---5---8---|  (high notes, ascending)
           B|---5-------|

Phrase B:  B|---8---5---| (coming down)
           G|-------5---|

Phrase C:  G|---5---7---|  (mid register)
           D|---7-------|</pre>`,
    exercise: 'Pick your favorite 3 notes from Box 1 and create a short rhythmic motif. Play it. Then add a 2-beat rest. Play it again. Repeat this 5 times. Then modify the motif slightly — change the last note, or change the rhythm — and repeat. Goal: 10 minutes of creating small phrases from Box 1 notes. Focus entirely on rhythm and feel, not on technical execution.',
    selfCheck: 'Does your phrase feel like something you said, rather than something you ran through? If you played it to a friend, would they recognize it as a recurring idea? If yes, you\'re making music. Keep refining it.',
    techniques: ['phrasing', 'motif creation', 'rhythm', 'musical space'],
    xpReward: 60,
  },
  {
    day: 11,
    week: 2,
    title: 'Connecting Notes with Legato',
    subtitle: 'From scale to actual blues-rock sound',
    why: 'Legato means "connected" — smooth, flowing phrases where notes blend into each other rather than being individually attacked. Adding hammer-ons, pull-offs, and slides to your pentatonic phrases transforms them from exercises into real blues-rock licks.',
    duration: 25,
    warmup: 'Day 10: play your favorite phrase from yesterday 5 times. Then Box 1 ascending/descending 2 times at 60 BPM.',
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
  <li>Push the string toward the ceiling (if your guitar is positioned normally)</li>
  <li>The pitch rises as you push</li>
</ul>
<p>Never bend with one finger alone — you\'ll hurt yourself and the bend won\'t be in tune.</p>

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

<h3>Starting Slow</h3>
<p>When learning vibrato, go slower than feels natural. Fast, uncontrolled vibrato sounds shaky and nervous. Slow, controlled vibrato sounds authoritative. Start at a speed you can control, then gradually increase.</p>`,
    exercise: 'Fret any note — G string fret 7 is good. Pick it. After the note sounds, start the vibrato motion: bend the string slightly toward the ceiling, then release back to pitch. Repeat that motion evenly — like a clock ticking. Do this for 30 seconds without stopping. Then try the same on B string fret 8. Then B string fret 5. Finally: play a simple 3-note phrase and end the last note with vibrato, holding it for 4 full beats.',
    selfCheck: 'Vibrato should be even — each oscillation the same width and speed as the last. If it sounds random or shaky, slow down the oscillation until you can control it. Vibrato is a physical skill that takes weeks to develop fully — what you\'re building today is the foundation.',
    techniques: ['vibrato', 'wrist technique', 'note sustain'],
    xpReward: 70,
  },
  {
    day: 14,
    week: 2,
    title: 'Week 2 Review + Personalized Path',
    subtitle: 'Assess your skills before the solo begins',
    why: 'Week 3 is where you start learning the actual solo. But the solo requires confident use of everything you\'ve learned in Weeks 1 and 2. Today you do an honest self-assessment, reinforce your weakest areas, and get ready for the most exciting part of the program.',
    duration: 30,
    warmup: 'Full Box 1 pentatonic ascending/descending, 5 times. Each rep a little faster than the last.',
    mainContent: `<h3>Week 2 Review Sequence</h3>
<p>Work through each skill below. Rate yourself 1-3 honestly (1=struggling, 2=developing, 3=solid).</p>

<p><strong>1. Box 1 Pentatonic</strong><br/>
Play it ascending and descending at 80 BPM. Can you do it without stopping to think? Rating: __</p>

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
  },

  // ===== WEEK 3: LEARN THE SOLO =====
  {
    day: 15,
    week: 3,
    title: 'Meet the Solo',
    subtitle: 'This is what all the work has been for',
    why: 'You\'ve spent two weeks building technique. Today you encounter the music you\'re going to play. Don\'t pick up your guitar yet — just listen. Getting the sound of the solo into your ear before you play a single note will make every subsequent lesson faster and more musical.',
    duration: 20,
    warmup: 'Day 7 combination phrase (hammer-on + pull-off + slide) 5 times. Then a 3-minute improvisation over Box 1.',
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
    soloSection: undefined,
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

<h3>Breaking It Down</h3>
<p><strong>Beat 1:</strong> B string — slide from fret 10 up to fret 12. Hold the arrival note.</p>
<p><strong>Beat 2:</strong> B string fret 12 — pick cleanly. Then fret 10 — pick cleanly.</p>
<p><strong>Beat 3:</strong> B string fret 12 — pick. Hammer onto fret 10 (wait — that\'s a hammer DOWN, which means we need fret 10 fretted below fret 12... this is a pull-off: 12p10). Correction: pick 12, pull off to 10.</p>
<p><strong>Beat 4:</strong> High e string fret 12. Then high e fret 10 — let it ring.</p>

<h3>The Character</h3>
<p>Section 1 is a question — it states a melodic idea and leaves it open. Play it with space. Don\'t rush. Each note has room to breathe.</p>`,
    exercise: 'Learn just the first two beats of Section 1 (the slide up to 12 and the 12-10 on B string). Play them slowly — no tempo yet, just get the notes right. Once each note rings clearly, add beat 3 (pull-off 12p10 on B). Then add beat 4 (high e 12 and 10). Finally: play the complete Section 1 bar 5 times at a very slow tempo. Every note clean.',
    selfCheck: 'Each note in Section 1 should ring for its full value. The slide should arrive at fret 12 clearly in tune. The pull-off should be clearly audible. The final high-e notes should sustain cleanly. If anything is unclear, isolate that element and fix it before moving on.',
    techniques: ['slide', 'pull-off', 'clean picking', 'phrasing'],
    xpReward: 70,
    soloSection: 1,
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

<h3>Section 1 at 50% Tempo</h3>
<p>Focus areas for today:</p>
<ol>
  <li><strong>The slide:</strong> Does it arrive at fret 12 in tune? Hold pressure throughout.</li>
  <li><strong>The pull-off (12p10):</strong> Is the pulled note clearly audible? Same volume as the picked note?</li>
  <li><strong>The high-e notes (12, 10):</strong> Are they ringing clean? No accidental touching of adjacent strings?</li>
  <li><strong>The overall shape:</strong> Does the phrase flow, or does it feel like separate disconnected notes?</li>
</ol>

<h3>Isolation Technique</h3>
<p>If any part of Section 1 isn\'t working, isolate it:</p>
<ul>
  <li>Just the slide: 10/12, 20 reps</li>
  <li>Just the pull-off: 12p10, 20 reps</li>
  <li>Just the transition between slide and the following notes</li>
</ul>
<p>Isolation, then reintegration. Fix the part, then put it back in context.</p>`,
    exercise: 'Set a metronome to 60 BPM (or whatever feels comfortably slow for Section 1). Play Section 1 10 times at this tempo without stopping between reps. After each rep, mentally note what felt good and what didn\'t. If one element is consistently failing, stop and do 20 isolation reps of that element, then go back to the full section.',
    selfCheck: 'After 10 slow reps, every note should ring correctly every time. "Correctly" means: right pitch, right timing, right volume, no buzzing. If you\'re still hitting wrong notes occasionally, the tempo is too fast. Slow down more.',
    techniques: ['slow practice', 'isolation technique', 'memory building'],
    xpReward: 70,
    soloSection: 1,
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
    soloSection: 1,
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

<h3>Breaking It Down</h3>
<p><strong>G string (first half of bar):</strong> Slide from fret 9 to 10. Then pull off from 10 to 9. Then hammer-on from 10 to 12, pull off back to 10. This is a fast legato run on the G string.</p>
<p><strong>B string:</strong> Fret 10 (picked). Then 12h10h12 (pick 12, hammer 10, hammer 12 — wait, this goes down then up: it\'s 12h10 is wrong direction. Correction: the phrase is 10, then 12h10 (pick 10, pick 12, hammer back... no. Let\'s be precise):</p>
<p>Reading: B|--10---12h10h12--- means: pick 10, pick 12, hammer off 12 back to 10... that\'s a pull-off. The notation is: 12p10h12 = pick 12, pull to 10, hammer back to 12. This creates a 3-note ornament.</p>
<p>Then: 10h12p10 = pick 10, hammer to 12, pull back to 10.</p>
<p>Final: 12p10 = pick 12, pull to 10, let ring.</p>

<h3>The Character</h3>
<p>Section 2 is busier than Section 1. More notes, faster motion. It should feel like the energy is building — like something is coming.</p>`,
    exercise: 'Learn Section 2 in two halves. First half: just the G string phrase (9/10, 10p9, 10h12p10). Practice this 15 times until it flows. Second half: the B string phrase. Practice this 15 times. Then put both halves together, slowly. Goal: play the complete Section 2 5 times at a slow, comfortable tempo where every note is clear.',
    selfCheck: 'The G string runs and B string runs should sound like connected sentences, not stumbled note sequences. The legato should make it feel liquid. If it\'s choppy, slow down and practice the individual legato elements (h and p) in isolation.',
    techniques: ['legato runs', 'hammer-on', 'pull-off', 'slide', 'fast phrases'],
    xpReward: 70,
    soloSection: 2,
  },
  {
    day: 20,
    week: 3,
    title: 'Section 2 — Deep Practice',
    subtitle: 'Locking in the legato runs',
    why: 'Section 2 is technically the hardest part of the solo because it has the most consecutive legato notes. Deep practice on this section now prevents stumbling later when you connect all four sections.',
    duration: 25,
    warmup: 'Section 1 and beginning of Section 2 (G string phrase only), 5 times each.',
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
    soloSection: 2,
  },
  {
    day: 21,
    week: 3,
    title: 'Connect Sections 1 + 2',
    subtitle: 'The hardest part is the transition',
    why: 'You can play Section 1 well. You can play Section 2 well. But playing them one into the other without stopping is a completely different challenge. The transition between sections is where most guitarists stumble. Today you make it seamless.',
    duration: 30,
    warmup: 'Section 1 alone, 5 times. Section 2 alone, 5 times. Then rest 30 seconds.',
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
    soloSection: 2,
  },

  // ===== WEEK 4: PERFORMANCE =====
  {
    day: 22,
    week: 4,
    title: 'Section 3 — The Emotional Peak',
    subtitle: 'One note, played with conviction',
    why: 'Section 3 is the climax of the solo. It\'s built around a single, big bend — one note held with vibrato. This is where everything comes down to feeling. Technical accuracy matters less here than emotional conviction. The bend needs to mean something.',
    duration: 25,
    warmup: 'S1+S2 connected, 3 times. Bending warm-up: 10 bends on G string fret 7 (to fret 9 pitch). Then 10 bends on B string fret 12 (to fret 14 pitch).',
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
    soloSection: 3,
  },
  {
    day: 23,
    week: 4,
    title: 'Section 3 — Deep Practice',
    subtitle: 'The bend has to be right every time',
    why: 'An out-of-tune bend is worse than no bend at all. It\'s the musical equivalent of singing sharp — everyone hears it. Today is dedicated to making this bend reliable. It needs to land in tune on command, every single time.',
    duration: 25,
    warmup: 'S1+S2, 3 complete runs. Then 10 bends on B string fret 12 — checking each one against fret 14.',
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
    soloSection: 3,
  },
  {
    day: 24,
    week: 4,
    title: 'Sections 1, 2, 3 Together',
    subtitle: 'The arc is taking shape',
    why: 'For the first time, you\'re playing three-quarters of the solo from beginning to end. This is a significant milestone. Today is about finding the emotional arc — feeling how Sections 1, 2, and 3 tell a complete musical story even without the resolution.',
    duration: 30,
    warmup: 'Each section individually, once. Section 1, pause. Section 2, pause. Section 3, pause. Get all three fresh in your fingers.',
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
    soloSection: 3,
  },
  {
    day: 25,
    week: 4,
    title: 'Section 4 — The Resolution',
    subtitle: 'Bringing the solo home',
    why: 'Every story needs an ending, and every solo needs a resolution. Section 4 brings the musical tension built across Sections 1-3 to a peaceful landing. It\'s vibrato-heavy and final-feeling. The last note should sound like something has been completed.',
    duration: 25,
    warmup: 'S1+S2+S3, two complete runs. Section 3 bend drill: 10 bends on B string fret 12. Make sure they\'re all in tune.',
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
    soloSection: 4,
  },
  {
    day: 26,
    week: 4,
    title: 'Section 4 — Deep Practice',
    subtitle: 'The ending has to feel like an ending',
    why: 'A weak ending undercuts everything that came before it. The last note of the solo is the last thing your listener hears. It needs to be held with confidence, in tune, with a vibrato that says "this is where the story ends."',
    duration: 25,
    warmup: 'Section 4 alone, 5 times. Focus specifically on the final note\'s vibrato quality.',
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
    soloSection: 4,
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
    soloSection: undefined,
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
    soloSection: undefined,
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
    soloSection: undefined,
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

<h3>Share It</h3>
<p>Record your performance. Share it if you want. But more importantly — remember this moment. The first time you played your first guitar solo all the way through. You earned this.</p>`,
    exercise: 'PERFORM THE COMPLETE SOLO. No stopping. Full commitment from the first note to the last vibrato. Record it. Play it again if you want — this is your music now.',
    selfCheck: 'How did it feel? The answer to that question is the only self-check that matters today.',
    techniques: ['full performance', 'all techniques combined', 'solo completion'],
    xpReward: 500,
    soloSection: undefined,
  },
]
