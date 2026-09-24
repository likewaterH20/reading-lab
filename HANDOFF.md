# READING LAB: handoff

Paste this into a new chat. Current as of 2026-09-24.
Also read `CLAUDE.md` (rules, loaded automatically in this folder) and
`RESEARCH.md` (evidence, graded honestly).

## Start of every chat (5 minutes)

1. Recreate the two servers in the NEW session's scratchpad (it is wiped):
   ```bash
   SP="<this session's scratchpad>"
   mkdir -p "$SP/site" "$SP/test/site"
   # serve.py: SimpleHTTPRequestHandler on 127.0.0.1:4400, Cache-Control no-store,
   # directory = $SP/site. test/serve.py: same on 4401, directory = $SP/test/site.
   rsync -a --delete --exclude _v4 --exclude build --exclude .git \
     "/Users/waterbox/Documents/(claude code) apps/reading-lab/" "$SP/site/"
   ```
   Run each `python3 serve.py` as a **background Bash process**. Update the
   `reading-lab` entry in the apps folder's `.claude/launch.json`.
2. Rebuild the build venv if you will touch content:
   `python3 -m venv $SP/wf && $SP/wf/bin/pip install wordfreq pronouncing edge-tts`
3. In the Browser pane, open `http://localhost:4401/?mute=1` and run:
   ```js
   for (const f of ['tools/mock-sr.js','tools/sweep.js']) (0,eval)(await (await fetch(f)).text());
   (0,eval)(await (await fetch('tools/content-check.js')).text())
   ```
   Then poll `({done: __done, log: __log})`. Baseline on handoff: 4 profiles x
   70 screens, `errors 0`; content check 0 missing, 0 misaligned.

Rafael plays on **4400**. Build and test on **4401**. Release with rsync to the
4400 mirror only after a clean sweep, then tell him to refresh.

## What the app is now

An adult reading and pronunciation coach for Spanish-English bilinguals and
for adults who cannot read English yet. Neural voices (Andrew EN, Dalia ES).

**Home (minimal, 2026-09-24):** Daily session card (one line, one button),
then the Daily Read card, then one level card (current level, browse back
only). Stats live in Progress. The 60-second challenge was REMOVED at his word.

**His rules from 2026-09-24, verbatim:** "This app needs to be user-friendly
super extremely minimal but effective." "We need built-in automation like move
onto the next thing once ... it's solved." "once the user is struggling is when
you activate and really start helping". Lyrics must be ORIGINAL (no copyrighted
lyrics, ever). The new look ("ink and paper", index.html at HEAD) is on 4401
only until he says "go"; the 4400 mirror carries the OLD stylesheet
(`git show 506f70f:index.html`) plus two rules (`.passage.lyrics`,
`.sentence .blank`) appended.

- **Daily**: FSRS reviews + new items from opened levels, interleaved; coach
  focus items for weak spots; speed practice first when owed; the reading test
  at your level once a day; ends on the easiest review.
- **Reading test**: listen with highlighting, read aloud (words right a minute
  vs the level's oral target; matcher understands numbers, re-anchors after a
  skipped line, needs 90%), 3 of 5 questions at random with shuffled answers.
  Silent timed read only without a mic. Pass opens the next level; far above
  target with 3/3 skips one.
- **Speed practice**: a failed-on-speed passage comes back (listen, reread)
  until you clear the target. Stumbled words become practice items.
- **Daily Read**: one of 10 short texts per day, reread as often as you like,
  speed line through the day. Together the 10 cover all top-100 words.
- **Coach** (coach.js): classifies misspellings (double, silent, vowels,
  endings, consonants), tracks stumbled words, scores 6 skills, picks the two
  weakest, feeds them into the daily and the game.
- **Placement** (onboarding, readers only): adaptive maze, 8 sentences with a
  missing word and 3 choices, right +2 levels / wrong -1, starts at level 3;
  placed = highest level read right with no lower level read wrong. ~30 s.
- **Play opens levels**: `openByPractice()` at the end of every session; own
  75% of your level's words (s >= 7) and the next level opens.
- **The coach steps in**: `runStruggle(r)` on the end screen; two misses in a
  session sharing a spelling pattern offer "Work on it now" = a fix run
  (`intro: 'fix'` card with the pattern letters marked, then those words).
- **Auto-advance**: `autoNext` bar after every solved step (write, build,
  choices, say phase with all words heard, oral read result, verdict, intro
  cards, speed practice). Next stays for the impatient; decision screens wait.
- **Lyrics**: 6 original songs (d11-d16, `kind: "lyrics"`) in the Daily Read
  rotation, line breaks kept (`wordSpans` keeps real whitespace,
  `.passage.lyrics` is pre-line). Card shows "Lyrics · Title".
- **EAR** (core.js): a persistent always-listening recogniser built for the
  game. Now UNUSED; keep or wire into the say phase, do not delete blindly.
- **Weekly report**: this week vs last, what got better, focus in plain words,
  stumbled words. Home once per new week; always in Progress.
- **Use it** (output step, his "best approach" ask 9/24): two of the day's
  new words end with a sentence of your own (5+ words, must contain the
  word), then the model sentence for comparison. LOG kind `use`; weekly row.
- **Content**: 13 levels (Nivel 1-13 with plain labels) x 4 passages (52;
  the extra 26 live in `build/levels_more.js`, 5 questions inline, merged by
  make_content); 26 industries x 20 terms (Car Sales + Educated English =
  Academic Word List, added 9/24) with sentences and Spanish glosses; 200+ memory tricks;
  18 Spanish-English shortcut rules; 12 false friends; 20 melody sentences;
  96 Life facts (money, work, health, safety, home, rights, civics, food,
  online safety, driving, science, manners); 13 beginner sound groups; every
  passage word as a pronunciation item. 7,646 clips, 684 timed texts.
- Onboarding: language, can-you-read, industries, then placement (readers)
  or primer (beginners). The "when will you practise" step is gone.

## Files

| File | What it holds |
|---|---|
| `index.html` | shell, all CSS, script order: content, srs, core, app, coach |
| `content.js` | generated, never edit by hand |
| `srs.js` | FSRS-5 scheduler |
| `core.js` | `h()`/`mount()`, storage, voice `say`/`sayAlong` (stall watchdog), mic, `liveRead` (read-aloud matcher), pitch + melody score, `norm` (numbers to words), diffs |
| `app.js` | onboarding, placement, learnOrder/levels, buildSession/decorate, item phases, readFlow, intro cards, end screen, Words, Progress, Profile, level card |
| `coach.js` | spelling patterns, skills, focus, speed practice, play-opens-levels, coach step-in (runStruggle/startFix/markPattern), weekly report, Daily Read |
| `build/content_src.py` | hand content: glosses, starter, shortcuts, traps, industries, tricks, pics, facts, respell overrides |
| `build/strings_src.py` | every UI string, en + es |
| `build/levels_en.js`, `extra_questions.py`, `daily_reads.py` | reading content |
| `build/make_content.py` | generator with asserts; `build/tts.py` renders audio |
| `tools/` | mock-sr, sweep, content-check, **sim (Mateo, the simulated learner: run after any change to sessions, levels, placement, coach)** |

State lives in localStorage `rl5.*`: `profile` (P: lang, level, inds, grade,
passed, order, practice, weekSeen; old profiles may still carry `games`),
`cards`, `log`, `days`, `seen`.
LOG kinds: graded items (`id,g,w,pat,mel`), `read`, `practice`, `dailyread`,
`say`, `open` (level opened by play). Old logs may carry `game`.

## What the simulator found (2026-09-24, 14 days of Mateo, 38, reads 110 wpm)

Before: placed at level 4, he stayed at level 4 for 14 days with ONE reading
test and zero passes, because speed practice (target 150 wpm) replaced the
test every day and practice did not feed the speed skill; new words came
from level 1 first, so owning level 4 was unreachable. Fixed: the test returns
every third day while practice is pending; practice counts toward the speed
skill; half the new words come from the current level; the placement caps the
level by reading speed (words shown over time taken, x1.5, vs silent targets).
After: placed at level 3 (maze said 5, speed said 3), level 4 opened on day
9, 6 tests, speed skill 71 -> 92, owned 201 -> 239, coach focus moved from
"vowels" to "double letters", 0 stalls, 0 errors. Run: `window.SIM = {days:
14, ability: 4, wpm: 110, seed: 7}` then load mock-sr.js + sim.js on 4401.
The say-it phase and out-loud reading cannot be simulated (no mic in the pane).

## Verified vs not

- Verified in the pane: every screen for 4 profiles, full sessions played by a
  bot, coach picks the right focus on a fake learner, all paths with and
  without a mic, content integrity.
- **Not verifiable here:** real speech. The pane blocks the mic. Rafael's
  Chrome works (he read Grade 6 aloud at 128 words right a minute). Treat his
  screenshots as the only real-voice data.

## Next, in priority order (with the reason)

1. **Bigger reading library.** Reading a lot of easy text is the best-supported
   route to "read anything" (Jeon & Day 2016); the app has 26 passages + 10
   daily reads. Add many short texts per level, FK-gated, adult topics, 5
   questions each. Ask him which topics he wants first.
2. **Calibrate on real use.** After a week of his LOG: check oral targets for
   adults, the 90% rule, melody thresholds. Export his LOG from the Chrome
   console and analyse it; do not guess.
3. **Sound American track.** Flap T (water), reductions (gonna), linking (pick
   it up), schwa, the three -ed endings, ship/sheep. Strong evidence for
   pronunciation instruction (Lee, Jang & Plonsky 2015).
4. **Phrase reading** for fluency: common chunks read as units.
5. **Pictures** (needs his go, ~$0.08 sample then ~$2.61).
6. **GitHub Pages** when he says it is ready (https also enables the mic on
   phones). Consider offline support.
7. Arabic and Korean UI; paste-your-own-text.

## Working with Rafael

Short replies, no em dashes, lead with the answer. He voice-types; read intent,
not grammar. When he sends a screenshot of a bug, fix the class of bug, not
just the instance. He says "go" to approve. He plays while you build, so
never touch 4400 mid-build.
