# READING LAB — handoff

Paste this into a new chat to continue. Current as of 2026-09-23 (v5).
Read `README.md` for how it runs and `RESEARCH.md` for why.

## What it is

One seven-minute daily session to read, say and write American English.
Two audiences: Spanish-speaking bilinguals who want to sound American (Rafael),
and adults who cannot read English yet. Industry vocabulary is picked at
onboarding. Free, local, no accounts, neural voices (Andrew EN, Dalia ES).

- Folder: `~/Documents/(claude code) apps/reading-lab/`
- Runs on **http://localhost:4400** from a scratchpad mirror (see README)
- v4 grade ladder archived in `_v4/` and `../reading-lab-v4-archive/`

## Start the server (first thing, every new chat)

Recreate `serve.py` in the new session's scratchpad (same script as before:
SimpleHTTPRequestHandler on 127.0.0.1:4400, `Cache-Control: no-store`,
serving `<scratchpad>/site`), rsync with `--exclude _v4 --exclude build`, run it
as a **Bash background process** (preview_start servers die at turn end), and
update the `reading-lab` entry in the apps folder's `.claude/launch.json`.

Test silently at `/?mute=1`. The pane blocks the microphone; to test the
scoring screen, stub `recordTake` in the console with a decoded voice clip.
Typing tests need real `Return` key presses; a newline inside typed text is dropped.

## What is built and verified in the pane

- **Bug sweep, 3 rounds (2026-09-23).** Two code reviews (17 + 15 findings, all
  fixed and re-verified), a scripted sweep of 368 screens (4 user types) with 0
  errors, a bot that played 9 full sessions start to finish with no stuck
  screens, and content checks: 0 missing clips (4,538), 0 misaligned read-alongs
  (622). Commits d53d4ae and 16965d7.
- **Reading test = read aloud** (words right a minute vs the grade's oral
  target), silent timed read only without a mic. Matcher understands numbers
  and re-finds its place after a skipped line. Done needs 90% of the passage;
  a second Done accepts 60% or more, less falls back to the timed read.
- **24 industries, 96 Life facts** (voiced questions and answers), one simple
  font everywhere (Atkinson Hyperlegible), respelling uses "dj" for the j sound.

- **Home = Daily + Play.** 13 levels (Grade 1 to College) on a map. Each level
  is a word round plus that grade's reading test (26 v4 passages, FK-gated in
  `build/make_content.py`). Pass = speed target AND 2 of 3; well above target
  with 3/3 skips a level. New daily words come only from opened levels.
  Verified: 149 vs 150 target did not pass; 278 wpm 3/3 at G4 opened G6.
- **Memory tricks** for all 160 job words (Spanish, keyword method), shown
  before any word you missed. **Pictures** are wired but NOT generated yet:
  201 prompts in `build/pic_jobs.json`, waiting on his go (about $2.61).

- Onboarding: language, reads English or not, up to two of 8 industries, when.
  Readers: 12-word dictation placement seeds known core words. Beginners:
  three spoken cards on how reading works.
- Session: FSRS-5 reviews plus new items, interleaved by type, misses re-asked
  once, ends on the easiest review. Grades come from behaviour, never buttons.
- Reader word: write first (pretest), lesson with "suena como" respelling and
  stress, say it, write it. Reviews alternate word and sentence dictation.
- Beginner word: sound card from a Spanish anchor, lesson, say it, build from
  shuffled tiles (wrong tiles never land). Letters of the sound highlighted.
- 18 shortcut rules (-ción to -tion...), 12 false friends, 20 melody sentences.
- Melody: YIN pitch tracker, per-speaker semitones, DTW alignment. Chart of
  model vs you. Scores: self 100, slow self 89, rise vs fall 14.
- Words tab with strength bars, Progress with coverage, owned words, writing
  first vs now, melody first vs best, 30-day forecast.
- Phone width checked at 375 px, no horizontal scroll.

## Not verified / not built

- Melody score and speech recognition on a real voice (needs his Chrome + mic).
- Pictures and keyword mnemonics for hard words. Paste-your-own-text.
- Arabic and Korean UI (v4 had them; dropped in v5).

## Rules that still apply

- Adult app: no hearts, XP, points, ranks, emoji, fanfares. He asked for "the
  best game ever"; that was read as challenge, flow and visible gains.
- No `innerHTML`; build with `h()`. The security hook also flags the regex
  method named like the shell call; use `matchAll` instead.
- Content changes go in `build/content_src.py`, then rerun both build scripts.
- Keep replies short. No em dashes.
