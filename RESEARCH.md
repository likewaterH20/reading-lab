# Why each part of v5 exists

Every mechanic below maps to a finding. Where the app computes a number, the
number comes from code, not from this file.

## Memory

**Testing beats rereading.** Retrieval practice produces more long-term
retention than restudy. Every item ends in a recall task: write it, build it,
choose its meaning. Roediger & Karpicke 2006, *Psychological Science*.

**Guess first.** Attempting an answer before being taught improves later
recall, even when the guess is wrong. New words for readers open with
"write what you hear". Kornell, Hays & Bjork 2009, *JEP: LMC*; Richland,
Kornell & Kao 2009, *JEP: Applied*.

**Produce, don't recognise.** Generated items are remembered better than read
ones. Shortcuts ask you to produce the English word from the Spanish.
Slamecka & Graf 1978, *JEP: HLM*.

**Space it, and schedule by the learner.** Spaced practice beats massed
practice across hundreds of studies. The app uses FSRS-5, an open model fitted
on millions of real reviews, targeting 90% recall. Cepeda et al. 2006,
*Psychological Bulletin*; Ye, Su & Cao 2022, *KDD*; open-spaced-repetition/fsrs4anki.

**Mix the kinds.** Interleaved practice beats blocked practice for later
discrimination. New items rotate job word, shortcut, false friend, sentence.
Rohrer & Taylor 2007, *Instructional Science*; Kornell & Bjork 2008, *Psych Science*.

**No self-grading.** The grade comes from what you did: first try, slow replay,
miss. People misjudge their own learning. Bjork, Dunlosky & Kornell 2013,
*Annual Review of Psychology*.

## Reading and writing

**Spelling builds reading.** Words become sight words when their spelling is
bonded to their sound. Dictation from sound alone is the core writing drill.
Ehri 2014, *Scientific Studies of Reading*.

**Coverage decides comprehension.** Readers need about 98% of running words
known to read unassisted. The app reports the share of everyday English text
you own, measured with the wordfreq corpus: the top 100 words are 46% of all
text, the top 1,000 are 69%. Nation 2006, *Canadian Modern Language Review*;
Speer, wordfreq 3.x.

**Cognates are a head start.** Spanish-English bilinguals who are taught to
use cognates read better in English. Nagy, García, Durgunoğlu & Hancin-Bhatt
1993, *Journal of Reading Behavior*; August et al. 2005, *Learning
Disabilities Research & Practice*. False friends get their own cards so the
shortcut does not overreach.

**Beginners build, they do not fail.** For people who cannot read yet, a wrong
tile does not land, so a wrong spelling is never on screen. Errorless learning,
Baddeley & Wilson 1994, *Neuropsychologia*. Instructions are spoken in the
first language.

**Start from sounds you already make.** L2 sounds close to an L1 sound are
learned by contrast with it. Each starter sound is described from Spanish.
Flege 1995, Speech Learning Model.

## Sounding American

**Melody matters more than single sounds.** Instruction on stress, rhythm and
intonation improved comprehensibility more than instruction on individual
sounds. Derwing, Munro & Wiebe 1998, *Language Learning*; Derwing & Munro 2005,
*TESOL Quarterly*.

**Seeing pitch helps.** Visual pitch displays improved learners' prosody and
transferred to new sentences. Hardison 2004, *Language Learning & Technology*.
The app draws the model's pitch and yours on one chart, normalised to each
speaker's own range and aligned in time, so a deeper voice or a slower pace is
not scored as wrong melody.

**Stress shifts in cognates.** Spanish stresses late (naCIÓN), English earlier
(NAtion). Every word shows a respelling from the CMU Pronouncing Dictionary with
the stressed syllable marked.

## Motivation

**Plan the when.** Naming when and where you will act roughly doubles follow
through in many studies. Onboarding asks for your moment. Gollwitzer 1999,
*American Psychologist*.

**Feedback on the task, not the person.** "Right", the red letters, the
melody score. No praise, points or badges. Hattie & Timperley 2007, *Review of
Educational Research*.

**End high.** People remember an experience by its peak and its end. Each
session ends on its easiest review and a best-moment card, and the end screen
shows gains only. Kahneman et al. 1993, *Psychological Science*.

## Checked in this build

- Melody scorer on known clips: a clip against itself 100, against its slow
  version 89, a rising question against a falling statement 14.
- Not yet checked: scores on a live human voice.

## How strong is the evidence? (audit, 2026-09-24)

"Proven" here means shown in controlled studies or meta-analyses. Most studies
use children or university students, not this app. Nothing is proven for this
app until its own users' data shows it.

**Strong** (several meta-analyses, effects replicate)
- Retrieval practice beats rereading. Rowland 2014, *Psychological Bulletin*; Adesope et al. 2017, *Review of Educational Research*.
- Spacing beats cramming. Cepeda et al. 2006, *Psychological Bulletin*.
- Producing an answer beats reading it (generation). Bertsch et al. 2007, *Memory & Cognition*.
- Spelling practice improves reading. Graham & Santangelo 2014, *Reading and Writing* (mostly children).
- Pronunciation instruction works, with large effects. Lee, Jang & Plonsky 2015, *Applied Linguistics*.
- Readers need about 98% of words known to read on their own. Hu & Nation 2000; Laufer & Ravenhorst-Kalovski 2010.
- Planning when you will practise raises follow-through. Gollwitzer & Sheeran 2006 meta-analysis.

**Moderate** (good studies, narrower populations)
- Guessing before being taught (pretesting). Pan & Carpenter 2023 review.
- Repeated reading builds fluency. Therrien 2004 meta-analysis (mostly children who struggle to read).
- Reading while listening helps second-language readers. Chang & Millett 2014-2015.
- Reading a lot of easy material builds reading ability. Jeon & Day 2016 meta-analysis. **The app has only 26 passages: this is its biggest gap.**
- Cognate awareness helps Spanish-English bilinguals. Nagy et al. 1993 (children).
- Keyword mnemonics help recall, mainly short term. Atkinson & Raugh 1975; Wang & Thomas 1995 found faster forgetting later.
- Prosody training improves how easy you are to understand. Derwing, Munro & Wiebe 1998 (one key study).

**Weak or unproven** (design choices, not evidence)
- Mixing new items by type: interleaving helps with similar-looking categories, but a 2019 meta-analysis found it did not help, and could hurt, for learning words. Brunmair & Richter 2019, *Psychological Bulletin*. Kept only to stop sessions feeling repetitive.
- Visual pitch feedback: small studies only. Hardison 2004.
- The melody score, the 90% read-aloud rule, the level-skip threshold, and the owned-after-a-week rule are my own choices. None is validated.
- Ending on an easy item (peak-end) is about how an experience is remembered, not how much is learned.
- Speed targets above Grade 6 are extrapolated. The Grade 1-6 targets are children's norms, not adult ones.
- FSRS predicts recall well on real review logs, but no trial shows it makes people learn faster than a simple schedule.

**Not in the app, and not supported:** speed-reading techniques. Rayner et al. 2016, *Psychological Science in the Public Interest*: going faster than normal reading costs comprehension.
