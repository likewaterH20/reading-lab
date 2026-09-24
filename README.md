# Reading Lab v5

Read, say and write American English in one seven-minute daily session.
Built for Spanish-speaking bilinguals who want to sound American, and for
adults who cannot read English yet. Free, local, no accounts.

v4 (the grade ladder) is archived in `_v4/` and in `../reading-lab-v4-archive/`.

## Run it

```bash
SP="/private/tmp/claude-501/-Users-waterbox-Documents--claude-code--apps/<SESSION>/scratchpad"
rsync -a --delete --exclude _v4 --exclude build "/Users/waterbox/Documents/(claude code) apps/reading-lab/" "$SP/site/"
python3 "$SP/serve.py"      # serves $SP/site on http://localhost:4400
```

macOS blocks serving straight from `~/Documents`, hence the mirror. Rsync after
every edit. Open `/?mute=1` to test silently, `/?unmute=1` to undo, `/?reset=1`
to wipe progress. The microphone works in real Chrome, not in the Claude pane.

## Two ways in: Daily and Play

Home shows your grade, words owned and coverage, then two cards.

- **Daily** (about 7 minutes): reviews that are due, new words, then the
  reading test at your grade, ending on an easy review.
- **Play**: a map of 13 levels, Grade 1 to College. Each level is a word round
  plus that grade's reading test. Passing your current grade's test opens the
  next level. Well above the speed target with 3 of 3 right skips one level.

All learnable items sit in one fixed order cut into 13 levels, so new words in
the daily only come from levels you have opened. Readers start at Grade 1 to 4
depending on the placement check. The 26 passages come from v4 and are
Flesch-Kincaid checked on every build.

Reading test: pass = the grade's words-per-minute target AND 2 of 3 right.
Silent targets for readers, oral targets for beginners. Over 500 words a minute
does not count. Tap any word in a passage to hear it.

## The session

Onboarding asks language, whether you read English, your industry (up to two),
and when you will practise. Readers take a 12-word dictation check that seeds
the words they already own. Beginners hear three spoken cards on how reading works.

Each day builds one queue: reviews that are due, plus new items, mixed by type.

| Item | New | Review |
|---|---|---|
| Job or core word, reader | write it first, lesson, say it, write it | write it, or write its sentence |
| Word, beginner | lesson, say it, build it from tiles | tiles, then typing |
| Shortcut (ES only) | rule card, then Spanish word to English | same, without the hint |
| False friend (ES only) | card, question three items later | question |
| Melody sentence | read-along, shadow with pitch score | shadow or dictation |

A miss comes back once at the end of the session. The session ends on the
easiest review and a best-moment card.

## Files

- `content.js` generated content (612 items). Never edit by hand.
- `srs.js` FSRS-5 scheduler.
- `core.js` DOM helper, storage, voice, microphone, pitch tracker, text diff.
- `app.js` onboarding, session, words, progress, profile.
- `index.html` shell and all CSS.
- `build/content_src.py` hand-written content. `build/strings_src.py` UI strings.
- `build/make_content.py` builds `content.js`, adds frequencies and respellings, asserts.
- `build/tts.py` renders voices and sentence timings into `audio/`.

## Rebuild content

Needs a venv with `wordfreq`, `pronouncing`, `edge-tts`:

```bash
python3 -m venv /tmp/rlvenv && /tmp/rlvenv/bin/pip install wordfreq pronouncing edge-tts
/tmp/rlvenv/bin/python build/make_content.py
/tmp/rlvenv/bin/python build/tts.py
```

`make_content.py` refuses to write if any check fails: 20 terms per industry,
every term inside its sentence, every core word glossed, respellings present.
`tts.py` only renders clips that are missing.

## Known limits

- Melody scoring was validated on voice clips, not on a live human voice yet.
- Word check uses browser speech recognition, so it runs in Chrome only.
- English and Spanish only. Arabic and Korean from v4 are not carried over.
- No pictures or keyword mnemonics yet.
- Coverage counts only words proven in the app. A fluent reader knows far more.
