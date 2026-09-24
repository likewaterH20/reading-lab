#!/usr/bin/env python3
"""Flesch-Kincaid grade level for every passage in data.js, checked against
the grade it claims. Run it after editing passages; it exits non-zero if any
passage is more than 0.9 grades off target, so a mislabelled level cannot
ship.

    python3 readability.py           # report
    python3 readability.py --strict  # exit 1 on any miss
"""
import re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


TOL = 0.9

def syllables(word):
    w = re.sub(r"[^a-z]", "", word.lower())
    if not w:
        return 0
    if len(w) <= 3:
        return 1
    w = re.sub(r"(?:[^laeiouy]es|ed|[^laeiouy]e)$", "", w)
    w = re.sub(r"^y", "", w)
    groups = re.findall(r"[aeiouy]+", w)
    return max(1, len(groups))

def fk_grade(text):
    sentences = [s for s in re.split(r"[.!?]+", text) if s.strip()]
    words = re.findall(r"[A-Za-z][A-Za-z'\-]*", text)
    if not sentences or not words:
        return 0.0
    syl = sum(syllables(w) for w in words)
    return 0.39 * (len(words) / len(sentences)) + 11.8 * (syl / len(words)) - 15.59

HERE = os.path.dirname(os.path.abspath(__file__))
LEVEL_FILES = {"en": os.path.join(HERE, "levels_en.js")}

def load_levels(path, const_name):
    """Parse a `const NAME = [ ... ];` literal the same way tts.py parses LANGS."""
    import json
    src = open(path, encoding="utf-8").read()
    src = re.sub(r"/\*.*?\*/", "", src, flags=re.S)
    src = re.sub(r"(?m)^\s*//.*$", "", src)
    start = src.index("[", src.index("const " + const_name))
    depth, end, in_str, esc = 0, None, False, False
    for i in range(start, len(src)):
        c = src[i]
        if in_str:
            if esc: esc = False
            elif c == "\\": esc = True
            elif c == '"': in_str = False
            continue
        if c == '"': in_str = True
        elif c == "[": depth += 1
        elif c == "]":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    body = src[start:end]
    body = re.sub(r'(?m)([{,]\s*)([A-Za-z_]\w*)\s*:', r'\1"\2":', body)
    body = re.sub(r",(\s*[}\]])", r"\1", body)
    return json.loads(body)

def main():
    strict = "--strict" in sys.argv
    bad = 0
    for lang, path in LEVEL_FILES.items():
        if not os.path.exists(path):
            continue
        levels = load_levels(path, "LEVELS_" + lang.upper())
        print("\n== %s ==" % lang)
        for lv in levels:
            target = lv["grade"]
            for p in lv.get("passages", []):
                g = fk_grade(p["text"])
                words = len(re.findall(r"[A-Za-z][A-Za-z'\-]*", p["text"]))
                off = g - target
                # the top rung is open-ended: anything at or above college counts
                miss = (g < target - TOL) if target >= 13 else (abs(off) > TOL + 1e-9)
                flag = "  <-- OFF by %+.1f" % off if miss else ""
                if flag:
                    bad += 1
                print("  G%-2s  FK %5.1f  %3d words  %s%s" % (target, g, words, p["title"], flag))
    print("\n%d passage(s) off target" % bad)
    if strict and bad:
        sys.exit(1)

if __name__ == "__main__":
    main()
