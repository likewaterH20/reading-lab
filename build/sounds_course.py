# THE SOUNDS OF ENGLISH: EnglishAnyone's 12 phonics lessons (2011), watched in
# order inside the app with a learning layer on top (his 10/12 ask: "the
# pronunciation is the intro of reading... use the video how we made the
# learning arabic webapp"). The videos stay on YouTube (embedded, controls
# hidden); nothing is downloaded or re-hosted. Blocks carry the second the
# teacher says each thing; lesson 1 was authored from the official captions,
# letter times inside a run are spread evenly (approximate). Each lesson names
# the spelling pattern it teaches; after the video the app drills real words
# from the library that carry that pattern, so the drill is the lesson.
CHANNEL = "EnglishAnyone"
CHANNEL_URL = "https://www.youtube.com/@EnglishAnyone"
CONSONANTS = "bcdfghjklmnpqrstvwxyz"
# words that look like a pattern but do not sound like it: never used as examples of a rule
EXCEPT = set("""was her his for but says said give live love come some done one gone none have aisle were where there their
great break steak been pretty busy women friend does goes shoe blood flood door floor poor your four our hour bread head dead
heavy weather sweater ready already instead health wealth death breath meant dealt heaven measure pleasure treasure feather
leather sure pure who whom whose two too through though thought tough rough cough enough laugh move prove lose whole only
most both gold cold hold told sold post host ghost father water warm war want wash watch what wand swan quality sugar put
push pull full bull bush could would should area idea again against any many body copy very every eye bye dye lie tie pie
die key they obey grey prey hey eight weight neigh sleigh people police machine unique improve approve remove anyone everyone someone none above glove dove shove come become""".split())

def spread(letters, t0, t1):
    n = len(letters); step = (t1 - t0) / n
    return [{"t": round(t0 + i * step, 1), "x": ch} for i, ch in enumerate(letters)]

LESSONS = [
 {"n": 1, "id": "NzHVmX1pnc8", "duration": 369, "title": "The alphabet and letter sounds",
  "es": "El alfabeto y los sonidos de las letras",
  "pattern": "^[%s]{1,2}[aeiou](?![rwy])[%s]{1,2}$" % (CONSONANTS, CONSONANTS),
  "pattern_name": {"en": "short vowel words", "es": "palabras con vocal corta"},
  "blocks": [
   {"t": 0, "end": 118, "kind": "intro", "en": "Letters change their sound. The 26 letters make more than 40 sounds. This series teaches the rules, and the words that break them.",
    "es": "Las letras cambian de sonido. Las 26 letras hacen más de 40 sonidos. Esta serie enseña las reglas y las palabras que las rompen."},
   {"t": 118, "end": 130, "kind": "rule", "en": "Letter sounds change. Letter names do not.", "es": "Los sonidos de las letras cambian. Los nombres no."},
   {"t": 130, "end": 191, "kind": "say", "en": "The alphabet. Repeat after him.", "es": "El alfabeto. Repite después de él.",
    "marks": spread("abcdefghijklmnopqrstuvwxyz", 133, 191)},
   {"t": 191, "end": 221, "kind": "rule", "en": "The sounds of English are music. The vowels a, e, i, o, u (and sometimes y) are the melody.",
    "es": "Los sonidos del inglés son música. Las vocales a, e, i, o, u (y a veces y) son la melodía."},
   {"t": 221, "end": 237, "kind": "say", "en": "The five short vowel sounds. Repeat after him.", "es": "Los cinco sonidos cortos de las vocales. Repite.",
    "marks": spread("aeiou", 222, 237), "coach": "vowels"},
   {"t": 237, "end": 262, "kind": "rule", "en": "The consonants are the beat.", "es": "Las consonantes son el ritmo."},
   {"t": 262, "end": 305, "kind": "rule", "en": "c and g have two sounds. Before a, o, u they are hard (cat, go). Before e, i they are soft (city, gem).",
    "es": "c y g tienen dos sonidos. Antes de a, o, u son duras (cat, go). Antes de e, i son suaves (city, gem).", "coach": "cg"},
   {"t": 305, "end": 358, "kind": "say", "en": "The short consonant sounds. Repeat after him.", "es": "Los sonidos cortos de las consonantes. Repite.",
    "marks": spread("bdfghjklmnpqrstvwxyz", 308, 358)},
   {"t": 358, "end": 369, "kind": "intro", "en": "Lesson 2 builds words from these sounds.", "es": "La lección 2 arma palabras con estos sonidos."},
  ]},
 {"n": 2, "id": "-LVabbIvDcc", "duration": 155, "title": "Three-letter words (CVC)", "es": "Palabras de tres letras",
  "pattern": "^[%s][aeiou](?![rwy])[%s]$" % (CONSONANTS, CONSONANTS), "pattern_name": {"en": "three-letter words", "es": "palabras de tres letras"}},
 {"n": 3, "id": "sB2-mFb_O0E", "duration": 114, "title": "Consonant blends", "es": "Grupos de consonantes",
  "pattern": "^(bl|br|cl|cr|dr|fl|fr|gl|gr|pl|pr|sc|sk|sl|sm|sn|sp|st|sw|tr|tw)", "pattern_name": {"en": "words that start with a blend", "es": "palabras que empiezan con dos consonantes"}},
 {"n": 4, "id": "XUoRQiZqI6E", "duration": 155, "title": "Consonant digraphs", "es": "Dígrafos de consonantes",
  "pattern": "(ch|sh|th|wh|ph|ck|ng)", "pattern_name": {"en": "words with ch, sh, th, wh, ph, ck, ng", "es": "palabras con ch, sh, th, wh, ph, ck, ng"}},
 {"n": 5, "id": "qRVUULcS_xU", "duration": 176, "title": "Long vowel sounds", "es": "Vocales largas",
  "pattern": "(ai|ay|ee|ea|igh|oa|ue|ew|^[%s]{1,3}[aeiou][%s]e$)" % (CONSONANTS, CONSONANTS), "pattern_name": {"en": "long vowel words", "es": "palabras con vocal larga"}},
 {"n": 6, "id": "q6LSxjSiu3w", "duration": 214, "title": "R-controlled vowels and magic e", "es": "Vocales con r y la e mágica",
  "pattern": "([aeiou]r|^[%s]{1,3}[aeiou][%s]e$)" % (CONSONANTS, CONSONANTS), "pattern_name": {"en": "words with ar, er, ir, or, ur, or a silent e", "es": "palabras con ar, er, ir, or, ur o e muda"}},
 {"n": 7, "id": "iRuoRzU0MPE", "duration": 145, "title": "Long A", "es": "La A larga",
  "pattern": "(ai|ay|^[%s]{1,3}a[%s]e$)" % (CONSONANTS, CONSONANTS), "pattern_name": {"en": "long a words", "es": "palabras con a larga"}},
 {"n": 8, "id": "-zNRhmQ6AMw", "duration": 115, "title": "Long E", "es": "La E larga",
  "pattern": "(ee|ea|[%s]y$)" % CONSONANTS, "pattern_name": {"en": "long e words", "es": "palabras con e larga"}},
 {"n": 9, "id": "WBwwcBRM3Rc", "duration": 141, "title": "Long I", "es": "La I larga",
  "pattern": "(igh|^[%s]{1,3}i[%s]e$|^[%s]{1,3}y$)" % (CONSONANTS, CONSONANTS, CONSONANTS), "pattern_name": {"en": "long i words", "es": "palabras con i larga"}},
 {"n": 10, "id": "l2nH1KfOVXA", "duration": 141, "title": "Long O", "es": "La O larga",
  "pattern": "(oa|^[%s]{1,3}o[%s]e$|old$|olt$)" % (CONSONANTS, CONSONANTS), "pattern_name": {"en": "long o words", "es": "palabras con o larga"}},
 {"n": 11, "id": "J_s1eBCtaiI", "duration": 126, "title": "Long U", "es": "La U larga",
  "pattern": "(ue|ew|^[%s]{1,3}u[%s]e$)" % (CONSONANTS, CONSONANTS), "pattern_name": {"en": "long u words", "es": "palabras con u larga"}},
 {"n": 12, "id": "DBIUeqkbCgI", "duration": 210, "title": "Vowel digraphs and diphthongs", "es": "Dígrafos y diptongos",
  "pattern": "(oi|oy|ou|ow|au|aw|oo)", "pattern_name": {"en": "words with oi, oy, ou, ow, au, aw, oo", "es": "palabras con oi, oy, ou, ow, au, aw, oo"}},
]
