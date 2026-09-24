#!/usr/bin/env python3
"""Render every clip in build/clips.json with edge-tts neural voices.

Same file naming as v4, so clips v4 already made are reused. Sentences marked
timed also get word timings for the read-along highlight.
    <venv>/bin/python build/tts.py
"""
import asyncio, hashlib, json, os, sys
import edge_tts

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "audio")
VOICES = {"en": "en-US-AndrewNeural", "es": "es-MX-DaliaNeural"}
SLOW = "-40%"
CONC = 8


def clip_id(lang, text, slow):
    return hashlib.sha1(("%s|%s|%s" % (lang, text, "slow" if slow else "norm")).encode()).hexdigest()[:16]


async def render(sem, lang, text, slow, clips, stats):
    rel = "%s/%s.mp3" % (lang, clip_id(lang, text, slow))
    path = os.path.join(OUT, rel)
    key = "%s|%s|%s" % (lang, text, "slow" if slow else "norm")
    if os.path.exists(path) and os.path.getsize(path) > 0:
        clips[key] = rel; stats["reuse"] += 1; return
    async with sem:
        for attempt in range(3):
            try:
                kw = {"rate": SLOW} if slow else {}
                tmp = path + ".part"
                await edge_tts.Communicate(text, VOICES[lang], **kw).save(tmp)
                if os.path.getsize(tmp) == 0: raise RuntimeError("empty")
                os.replace(tmp, path); clips[key] = rel; stats["made"] += 1
                if stats["made"] % 100 == 0: print("  %d rendered" % stats["made"], flush=True)
                return
            except Exception as e:
                if attempt == 2: stats["fail"].append("%s %s (%s)" % (lang, text[:40], e))
                else: await asyncio.sleep(2 * (attempt + 1))


async def timing(sem, lang, text, out):
    async with sem:
        for attempt in range(3):
            try:
                words = []
                c = edge_tts.Communicate(text, VOICES[lang], boundary="WordBoundary")
                async for ch in c.stream():
                    if ch["type"] == "WordBoundary":
                        words.append([ch["text"], round(ch["offset"] / 1e7, 3), round(ch["duration"] / 1e7, 3)])
                if words: out["%s|%s|norm" % (lang, text)] = words; return
            except Exception:
                await asyncio.sleep(2)


async def main():
    jobs = json.load(open(os.path.join(HERE, "clips.json"), encoding="utf-8"))
    for l in VOICES: os.makedirs(os.path.join(OUT, l), exist_ok=True)
    mpath = os.path.join(OUT, "manifest.json")
    old = {}
    if os.path.exists(mpath):
        try: old = json.load(open(mpath, encoding="utf-8")).get("timings", {})
        except Exception: pass
    clips, stats = {}, {"made": 0, "reuse": 0, "fail": []}
    sem = asyncio.Semaphore(CONC)
    print("%d clips wanted" % len(jobs), flush=True)
    await asyncio.gather(*[render(sem, l, t, s, clips, stats) for l, t, s, _ in jobs])
    timings = {k: v for k, v in old.items()}
    todo = [(l, t) for l, t, s, timed in jobs if timed and not s and "%s|%s|norm" % (l, t) not in timings]
    print("timing %d sentences" % len(todo), flush=True)
    await asyncio.gather(*[timing(sem, l, t, timings) for l, t in todo])
    wanted_t = {"%s|%s|norm" % (l, t) for l, t, s, timed in jobs if timed and not s}
    timings = {k: v for k, v in timings.items() if k in wanted_t}
    json.dump({"voices": VOICES, "slowRate": SLOW, "clips": clips, "timings": timings},
              open(mpath, "w", encoding="utf-8"), ensure_ascii=False)
    print("made %d, reused %d, failed %d, timed %d/%d" % (stats["made"], stats["reuse"], len(stats["fail"]),
          len(timings), len(wanted_t)), flush=True)
    for f in stats["fail"][:10]: print("  FAILED", f)
    sys.exit(1 if stats["fail"] else 0)


asyncio.run(main())
