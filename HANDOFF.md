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

**Home:** Daily Read card, then level and stats, then Daily (7 min), then one
level card (current level, browse back only), then the 60-second challenge.

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
- **60-second challenge**: rounds mix type-it, pick-the-spelling, say-it;
  personal record and a ghost of your best run.
- **Weekly report**: this week vs last, what got better, focus in plain words,
  stumbled words. Home once per new week; always in Progress.
- **Content**: 13 levels (Nivel 1-13 with plain labels) x 2 passages; 24
  industries x 20 terms with sentences and Spanish glosses; 200+ memory tricks;
  18 Spanish-English shortcut rules; 12 false friends; 20 melody sentences;
  96 Life facts (money, work, health, safety, home, rights, civics, food,
  online safety, driving, science, manners); 13 beginner sound groups; every
  passage word as a pronunciation item. 6,195 clips, 632 timed texts.

## Files

| File | What it holds |
|---|---|
| `index.html` | shell, all CSS, script order: content, srs, core, app, coach |
| `content.js` | generated, never edit by hand |
| `srs.js` | FSRS-5 scheduler |
| `core.js` | `h()`/`mount()`, storage, voice `say`/`sayAlong` (stall watchdog), mic, `liveRead` (read-aloud matcher), pitch + melody score, `norm` (numbers to words), diffs |
| `app.js` | onboarding, placement, learnOrder/levels, buildSession/decorate, item phases, readFlow, intro cards, end screen, Words, Progress, Profile, level card |
| `coach.js` | spelling patterns, skills, focus, speed practice, games, weekly report, Daily Read |
| `build/content_src.py` | hand content: glosses, starter, shortcuts, traps, industries, tricks, pics, facts, respell overrides |
| `build/strings_src.py` | every UI string, en + es |
| `build/levels_en.js`, `extra_questions.py`, `daily_reads.py` | reading content |
| `build/make_content.py` | generator with asserts; `build/tts.py` renders audio |
| `tools/` | mock-sr, sweep, content-check |

State lives in localStorage `rl5.*`: `profile` (P: lang, level, inds, grade,
passed, order, practice, games, weekSeen), `cards`, `log`, `days`, `seen`.
LOG kinds: graded items (`id,g,w,pat,mel`), `read`, `practice`, `dailyread`,
`say`, `game`.

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
