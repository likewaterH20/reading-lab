# Reading Lab: rules for Claude

Read this first, then HANDOFF.md (state and roadmap), then RESEARCH.md (why).

## Who and what
Rafael (Art Director, music producer, Spanish-English bilingual). The app helps
adults read English better and sound more American: bilinguals first, and
people who cannot read English yet. Free, local, no accounts. He tests in real
Chrome at http://localhost:4400 and talks in quick voice-typed messages.

## His standing rules
- **Very intelligent** = it adapts to the learner: learns weak spots, focuses
  practice there, skips what is proven, reports weekly. Every feature answers
  "what does it learn about this person, and what does it change?"
- **Proven methods only**, graded honestly in RESEARCH.md (strong / moderate /
  unproven). Never claim more than the evidence. No speed-reading tricks.
- Adult tone: no XP, hearts, points, badges, emoji, fanfares. Competition is
  only against your own record (personal best + ghost).
- Simple, easy-to-read font everywhere (Atkinson Hyperlegible). One level card
  (current level, browse back only, future hidden). No games: the 60-second
  challenge was removed on 2026-09-24 at his word ("end the 60sec challenge").
- Play opens levels: own 75% of your level's words and the next opens at the
  end of the session (`openByPractice`). The coach steps in on the end screen
  when two misses in a session share a spelling pattern (`runStruggle`).
- Once an answer is right, the app moves on by itself (`autoNext` bar). Next
  stays for the impatient. Only decision screens wait.
- Keep replies short. No em dashes. Commit to one recommendation.
- LIVE at https://likewaterh20.github.io/reading-lab/ since 2026-09-25
  (Pages from `main`). Deploy = push main, after a clean sweep on 4401 and
  a Mateo run. Never push an unswept build. Pictures need his go
  (fal, gpt-image-2 quality low, ~$0.013 each; 201 prompts in build/pic_jobs.json).

## How to work here
- **Never edit what he is playing.** Serve his copy from the scratchpad mirror
  on 4400; build and test on a separate copy on **4401**; release with rsync
  only after a clean sweep. Tell him when to refresh.
- Serving from ~/Documents is blocked, so both servers run from the session
  scratchpad (`serve.py`, `test/serve.py`, Cache-Control no-store) as
  **background Bash processes** (preview_start servers die at turn end).
- `git commit` before and after each change (local repo, no remote yet).
- Content is generated: edit `build/*.py`, then
  `<venv>/bin/python build/make_content.py` (asserts, refuses to write on any
  failure) and `<venv>/bin/python build/tts.py` (only renders missing clips;
  run twice, the edge-tts service drops a few). Venv needs
  `wordfreq pronouncing edge-tts`.
- No `innerHTML`. Build DOM with `h()` and replace content with `mount()`,
  never the native `replaceChildren/append` with arrays or nulls (they print
  "[object ...]" or "null").
- In async screen functions, declare every variable a button uses BEFORE the
  first `await` (early taps during the voice crashed twice).
- Every `await wait()` is followed by `if (!alive(my)) return;`.
- The security hook blocks text containing the regex method that shares its
  name with the shell call, even in comments. Use `matchAll`.

## Testing (tools/)
- `tools/sim.js`: **Mateo, the simulated learner** (his ask: "a 38 year old
  man that's literate ... a Sim ... so I can know if it works or not"). Plays
  the real screens through onboarding + placement and N days (clock shifted a
  day per loop, voice silenced, auto-advance 25 ms). Load mock-sr.js first,
  set `window.SIM = { days, ability, wpm, seed }`, poll
  `({done: __simDone, report: __simReport})`. Report = per-day level, owned,
  first-try %, speed/spelling skills, coach focus, stalls, errors. Run it after
  any change to sessions, levels, placement or the coach, and compare days.
- `tools/mock-sr.js`: stand-in speech recognition (the pane blocks the mic)
  plus error capture. Paste first.
- `tools/sweep.js`: opens every screen type for 4 learner profiles; poll
  `({done: __done, log: __log})`. Must end with `errors 0` and no STRAY TEXT.
- `tools/content-check.js`: every clip present, every read-along aligned.
- Mute the pane with `/?mute=1`. `/?reset=1` wipes progress. Real voice and
  real mic can only be tested by Rafael in Chrome; say so plainly.
