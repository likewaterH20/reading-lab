#!/usr/bin/env python3
"""Build content.js + build/clips.json from content_src.py and strings_src.py.

Run with the scratch venv that has wordfreq + pronouncing:
    <venv>/bin/python build/make_content.py
Every number the app shows about English (coverage, frequency) comes from
wordfreq here. Nothing is typed by hand.
"""
import json, os, re, sys
from wordfreq import top_n_list, word_frequency
import pronouncing

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import content_src as C
import strings_src as U

fails = []
def check(cond, msg):
    if not cond: fails.append(msg)

# ---------------- say-it-like respelling from the CMU dictionary ----------------
VOW = {"AA": "a", "AE": "æ", "AO": "o", "AW": "au", "AY": "ai", "EH": "e", "ER": "er",
       "EY": "ei", "IH": "i", "IY": "ii", "OW": "ou", "OY": "oi", "UH": "u", "UW": "uu"}
CON = {"B": "b", "CH": "ch", "D": "d", "DH": "dh", "F": "f", "G": "g", "HH": "j", "JH": "dj",
       "K": "k", "L": "l", "M": "m", "N": "n", "NG": "ng", "P": "p", "R": "r", "S": "s",
       "SH": "sh", "T": "t", "TH": "th", "V": "v", "W": "w", "Y": "y", "Z": "z", "ZH": "zh"}

def respell_word(w):
    ph = pronouncing.phones_for_word(w.lower())
    if not ph: return None, None
    ps = ph[min(C.PRON_PICK.get(w.lower(), 0), len(ph) - 1)].split()
    vi = [i for i, p in enumerate(ps) if p[-1].isdigit()]
    if not vi: return None, None
    # syllable boundaries: one consonant between vowels goes right, a cluster splits after the first
    cuts = []
    for a, b in zip(vi, vi[1:]):
        n = b - a - 1
        cuts.append(a + 1 if n <= 1 else a + 2)
        if n == 1: cuts[-1] = a + 1
    bounds = [0] + cuts + [len(ps)]
    syl, stressed = [], None
    for k in range(len(bounds) - 1):
        chunk, s, st = ps[bounds[k]:bounds[k + 1]], "", False
        for p in chunk:
            if p[-1].isdigit():
                base, d = p[:-1], p[-1]
                if d == "1": st = True
                if base == "AH": s += "ʌ" if d == "1" else "ə"
                elif base == "ER" and d == "0": s += "ər"
                else: s += VOW[base]
            else:
                s += CON[p]
        if st: stressed = k
        syl.append(s.upper() if st and len(vi) > 1 else s)
    return "-".join(syl), stressed

def respell(text):
    if text.lower() in C.RESPELL: return C.RESPELL[text.lower()]
    parts = [respell_word(w) for w in re.findall(r"[A-Za-z']+", text)]
    if any(p[0] is None for p in parts): return None
    return " ".join(p[0] for p in parts)

def freq(text): return word_frequency(text.lower(), "en")

# ---------------- word items ----------------
items, by_en = [], {}
def add_word(en, es, src, sentence=None, extra=None):
    key = en.lower()
    if key in by_en:
        it = by_en[key]
        it["src"].append(src)
        if sentence and not it.get("sentence"): it["sentence"] = sentence
        return it
    it = {"id": "w:" + key, "kind": "word", "en": en, "es": es, "src": [src],
          "freq": round(freq(en), 8), "say": respell(en)}
    if sentence: it["sentence"] = sentence
    if extra: it.update(extra)
    items.append(it); by_en[key] = it
    return it

starter = []
for g in C.STARTER:
    check(len(g["words"]) == 4, "starter %s needs 4 words" % g["id"])
    for en, es in g["words"]: add_word(en, es, "starter:" + g["id"], extra={"sound": g["id"]})
    starter.append({"id": g["id"], "letters": g["letters"], "es": g["es"], "en": g["en"],
                    "words": ["w:" + w[0] for w in g["words"]]})

industries = []
check(len(C.INDUSTRIES) == 24, "want 24 industries, have %d" % len(C.INDUSTRIES))
for ind in C.INDUSTRIES:
    check(len(ind["terms"]) == 20, "%s has %d terms, want 20" % (ind["id"], len(ind["terms"])))
    ids = []
    for en, es, sent in ind["terms"]:
        check(en.lower() in sent.lower(), "%s: sentence lacks the term: %s" % (en, sent))
        check(sent[-1] in ".?!", "sentence needs end punctuation: " + sent)
        check(("w:" + en.lower()) not in ids, "dup term in %s: %s" % (ind["id"], en))
        it = add_word(en, es, "ind:" + ind["id"], sentence=sent)
        ids.append(it["id"])
    industries.append({"id": ind["id"], "en": ind["en"], "es": ind["es"], "words": ids})
all_terms = [t[0].lower() for ind in C.INDUSTRIES for t in ind["terms"]]
dups = {t for t in all_terms if all_terms.count(t) > 1}
check(not dups, "terms shared across industries: %s" % dups)

core_list = [w for w in top_n_list("en", 1200)
             if re.fullmatch(r"[a-z]+", w) and (len(w) > 1 or w in ("a", "i")) and w not in C.CORE_BLOCK][:C.CORE_N]
core_ids = []
for rank, w in enumerate(core_list, 1):
    check(w in C.CORE_GLOSS, "core word lacks a gloss: " + w)
    it = add_word("I" if w == "i" else w, C.CORE_GLOSS.get(w, ""), "core")
    it["rank"] = rank
    core_ids.append(it["id"])

# ---------------- shortcut (cognate) items ----------------
shortcuts, cog_seen = [], set()
for r in C.SHORTCUTS:
    check(len(r["pairs"]) == 5, "shortcut %s needs 5 pairs" % r["id"])
    ids = []
    for es, en in r["pairs"]:
        check(en not in cog_seen, "cognate reused: " + en); cog_seen.add(en)
        it = {"id": "c:" + en, "kind": "cog", "en": en, "es": es, "rule": r["id"],
              "freq": round(freq(en), 8), "say": respell(en)}
        check(it["say"] is not None, "no respelling for cognate " + en)
        items.append(it); ids.append(it["id"])
    shortcuts.append({"id": r["id"], "es_end": r["es_end"], "en_end": r["en_end"], "note": r["note"],
                      "note_es": r.get("note_es", ""), "same_stress": r.get("same_stress", False), "items": ids})
    check(not r["note"] or r.get("note_es"), "rule note needs Spanish: " + r["id"])

traps = []
for es, looks, looks_means, real in C.TRAPS:
    it = {"id": "t:" + es, "kind": "trap", "es": es, "en": looks, "means": looks_means,
          "real": real, "freq": round(freq(looks), 8), "say": respell(looks)}
    items.append(it); traps.append(it["id"])

sentences = []
for s, pat in C.MELODY_SENTENCES:
    check(pat in ("fall", "rise"), "bad pattern " + pat)
    it = {"id": "s:" + s, "kind": "sent", "en": s, "pattern": pat}
    items.append(it); sentences.append(it["id"])

# ---------------- life facts ----------------
topic_ids = [tp[0] for tp in C.LIFE_TOPICS]
facts, fact_seen = [], set()
for k, (topic, en, es, q, opts) in enumerate(C.FACTS):
    check(topic in topic_ids, "unknown fact topic " + topic)
    check(len(opts) == 4 and len(set(opts)) == 4, "fact needs 4 distinct options: " + en[:40])
    check(en[-1] in ".?!" and es[-1] in ".?!", "fact needs end punctuation: " + en[:40])
    check(en not in fact_seen, "duplicate fact: " + en[:40]); fact_seen.add(en)
    fid = "f:%s-%d" % (topic, sum(1 for f in facts if f["topic"] == topic))
    items.append({"id": fid, "kind": "fact", "topic": topic, "en": en, "es": es, "q": q, "a": opts, "correct": 0})
    facts.append({"id": fid, "topic": topic})
for tp in topic_ids:
    check(sum(1 for f in facts if f["topic"] == tp) == 8, "topic %s needs 8 facts" % tp)

# ---------------- the grade ladder: 13 levels, Flesch-Kincaid gated ----------------
import readability as RD
import extra_questions as XQ
levels = []
for lv in RD.load_levels(os.path.join(HERE, "levels_en.js"), "LEVELS_EN"):
    ps = []
    for k, p in enumerate(lv["passages"]):
        fk = RD.fk_grade(p["text"])
        check(abs(fk - lv["grade"]) <= RD.TOL or lv["grade"] == 13 and fk >= 12.1,
              "G%d '%s' reads at FK %.1f" % (lv["grade"], p["title"], fk))
        check(len(p["questions"]) == 3 and all(0 <= q["correct"] < len(q["a"]) for q in p["questions"]),
              "G%d '%s' needs 3 valid questions" % (lv["grade"], p["title"]))
        pid = "g%d-%d" % (lv["grade"], k)
        # a pool of five questions per passage; the app asks three at random
        qs = p["questions"] + [{"q": q, "a": opts, "correct": 0} for q, opts in XQ.EXTRA.get(pid, [])]
        check(len(qs) == 5, "%s needs 5 questions, has %d" % (pid, len(qs)))
        check(all(len(set(q["a"])) == len(q["a"]) for q in qs), pid + " has duplicate answer options")
        check(len({q["q"] for q in qs}) == len(qs), pid + " repeats a question")
        ps.append({"id": pid, "title": p["title"], "text": p["text"],
                   "words": len(p["text"].split()), "fk": round(fk, 1), "questions": qs})
    levels.append({"grade": lv["grade"], "name": lv["name"], "oral": lv["oral"], "silent": lv["silent"], "passages": ps})
check(len(levels) == 13, "want 13 grades")

# ---------------- memory tricks and pictures ----------------
industry_terms = {t[0].lower() for ind in C.INDUSTRIES for t in ind["terms"]}
first8 = {t[0].lower() for ind in C.INDUSTRIES[:8] for t in ind["terms"]}
check(first8 <= set(C.TRICKS), "first 8 industries need tricks: missing %s" % sorted(first8 - set(C.TRICKS)))
check(set(C.TRICKS) <= industry_terms, "tricks for words that are not terms: %s" % sorted(set(C.TRICKS) - industry_terms))
for en, trick in C.TRICKS.items():
    if en in by_en: by_en[en]["trick"] = trick

STYLE = ("Flat minimalist editorial illustration for an adult vocabulary flashcard. "
         "One clear centered subject: {subject}. Simple geometric shapes, soft paper grain, "
         "limited palette of deep teal, charcoal, warm cream and one muted coral accent, "
         "plain dark charcoal background, generous empty margin around the subject. "
         "Absolutely no text, no letters, no numbers, no labels, no logos, no brand marks anywhere in the image.")
slug = en_ = None
pic_jobs = []
IMG = os.path.join(ROOT, "img")
for en, subject in C.PICS.items():
    check(en in by_en, "picture for a word that is not an item: " + en)
    if en not in by_en: continue
    sl = re.sub(r"[^a-z0-9]+", "-", en.lower()).strip("-")
    pic_jobs.append({"slug": sl, "en": en, "prompt": STYLE.format(subject=subject)})
    if os.path.exists(os.path.join(IMG, sl + ".jpg")):
        by_en[en]["pic"] = "img/%s.jpg" % sl
with open(os.path.join(HERE, "pic_jobs.json"), "w", encoding="utf-8") as f:
    json.dump(pic_jobs, f, ensure_ascii=False, indent=1)

# ---------------- checks on respelling coverage ----------------
words = [i for i in items if i["kind"] == "word"]
missing = [i["en"] for i in words if not i["say"]]
check(len(missing) <= len(words) * 0.05, "too many words without respelling: %s" % missing)

# the whole-language mass the coverage figure is measured against
MASS_N = 3000
total_mass = sum(word_frequency(w, "en") for w in top_n_list("en", MASS_N))

# ---------------- audio jobs ----------------
jobs = set()
def want(lang, text, slow=False, timed=False):
    text = (text or "").strip()
    if text: jobs.add((lang, text, slow, timed))
for it in items:
    k = it["kind"]
    if k in ("word", "cog"):
        want("en", it["en"], False); want("en", it["en"], True)
        want("es", it["es"])
        if it.get("sentence"): want("en", it["sentence"], False, True); want("en", it["sentence"], True)
    if k == "trap":
        want("en", it["en"]); want("en", it["en"], True); want("es", it["es"]); want("en", it["real"])
        want("es", it["means"])
    if k == "sent":
        want("en", it["en"], False, True); want("en", it["en"], True)
    if k == "fact":
        want("en", it["en"], False, True); want("en", it["en"], True); want("es", it["es"])
        want("en", it["q"])
        for o in it["a"]: want("en", o)
for g in C.STARTER: want("es", g["es"]); want("en", g["en"])
for lv in levels:
    for ps in lv["passages"]:
        want("en", ps["text"], False, True)
for sid, row in U.UI.items():
    if sid in U.SPOKEN:
        for lang in ("en", "es"): want(lang, row[lang])

# ---------------- write ----------------
if fails:
    print("FAILED %d checks:" % len(fails)); [print("  -", f) for f in fails]; sys.exit(1)

content = {"items": items, "levels": levels, "facts": [f["id"] for f in facts],
           "topics": [{"id": t[0], "en": t[1], "es": t[2]} for t in C.LIFE_TOPICS], "starter": starter, "industries": industries, "core": core_ids,
           "shortcuts": shortcuts, "traps": traps, "sentences": sentences, "ui": U.UI,
           "spoken": sorted(U.SPOKEN),
           "coverage": {"mass": round(total_mass, 6), "massN": MASS_N,
                        "top100": round(sum(word_frequency(w, "en") for w in top_n_list("en", 100)), 4),
                        "top1000": round(sum(word_frequency(w, "en") for w in top_n_list("en", 1000)), 4)}}
with open(os.path.join(ROOT, "content.js"), "w", encoding="utf-8") as f:
    f.write("/* generated by build/make_content.py, do not edit */\nconst CONTENT = ")
    json.dump(content, f, ensure_ascii=False, separators=(",", ":"))
    f.write(";\n")
with open(os.path.join(HERE, "clips.json"), "w", encoding="utf-8") as f:
    json.dump(sorted(jobs), f, ensure_ascii=False)

kinds = {}
for i in items: kinds[i["kind"]] = kinds.get(i["kind"], 0) + 1
print("items", kinds, "| clips wanted", len(jobs), "| no respelling:", missing)
print("core mass %.3f of top-%d mass %.3f" % (sum(i["freq"] for i in words if i.get("rank")), MASS_N, total_mass))
for w in ["receipt", "information", "aisle", "colleague", "scaffold", "the", "nation"]:
    it = by_en.get(w) or next((i for i in items if i["en"] == w), None)
    print("  ", w, "->", it and it["say"])
