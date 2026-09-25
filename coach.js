/* READING LAB — the coach.
   Watches every answer, finds what this learner is weakest at, steers the
   daily and the games toward it, and writes a weekly report.
   Loaded after app.js. */

/* ============================ SPELLING MISTAKE PATTERNS ============================
   When a word is misspelled, name what kind of mistake it was, so practice can
   target the pattern, not just the word. */
const PATTERNS = ['double', 'silent', 'vowels', 'endings', 'consonants'];
const SILENT_RX = /^kn|^wr|^ps|mb$|mn$|gh|pt|bt|lk|lm|stle|sten|^ho(n|u)/;
const ENDING_RX = /(tion|sion|ous|ence|ance|able|ible|ment|ed|ly|ure|ture)$/;
function spellPatterns(target, typed) {
  const tg = target.toLowerCase().replace(/[^a-z]/g, ''), ty = norm(typed).replace(/[^a-z]/g, '');
  if (!tg || tg === ty) return [];
  const got = lcsMarks([...tg], [...ty]);
  const out = new Set();
  for (let i = 0; i < tg.length; i++) {
    if (got[i]) continue;
    const c = tg[i];
    if (tg[i + 1] === c || tg[i - 1] === c) out.add('double');
    else if (SILENT_RX.test(tg) && /[kwpbghlt]/.test(c)) out.add('silent');
    else if (i === tg.length - 1 && c === 'e') out.add('silent');
    else if (i >= tg.length - 4 && ENDING_RX.test(tg)) out.add('endings');
    else if (/[aeiouy]/.test(c)) out.add('vowels');
    else out.add('consonants');
  }
  /* letters typed that are not in the word: a doubled letter where there is none, or a wrong vowel */
  if (ty.length > tg.length && !out.size) out.add(/(.)\1/.test(ty) ? 'double' : 'vowels');
  return [...out];
}
const patternOf = (w, p) => {
  const x = w.toLowerCase();
  if (p === 'double') return /([a-z])\1/.test(x);
  if (p === 'silent') return SILENT_RX.test(x) || /[^aeiou]e$/.test(x);
  if (p === 'endings') return ENDING_RX.test(x);
  if (p === 'vowels') return /(ea|ee|ie|ei|ou|oo|ai|au|oa)/.test(x);
  return /(th|ch|sh|ph|ck|qu)/.test(x);
};

/* ============================ SKILLS ============================
   One number per area, 0..1, from the last N days of what the learner did.
   An area needs enough evidence before it can be called weak. */
const DAY = 864e5;
function skills(from = Date.now() - 14 * DAY, to = Date.now()) {
  const L = LOG.filter(x => x.t >= from && x.t < to);
  const avg = a => a.length ? a.reduce((p, q) => p + q, 0) / a.length : null;
  const writes = L.filter(x => x.w);
  const meaning = L.filter(x => x.id && ITEMS[x.id] && ['trap', 'fact'].includes(ITEMS[x.id].kind));
  /* speed practice is a timed reading too: it moves the speed skill, so the
     coach can see a learner getting faster before the next test */
  const reads = L.filter(x => (x.kind === 'read' || x.kind === 'practice') && x.speed != null);
  /* every out-loud reading is evidence for pronunciation: tests, practice, daily reads */
  const aloud = L.filter(x => ['read', 'practice', 'dailyread'].includes(x.kind) && x.acc != null);
  const says = L.filter(x => x.kind === 'say');
  const pat = {};
  for (const x of writes) for (const p of (x.pat || [])) pat[p] = (pat[p] || 0) + 1;
  const stumbles = {};
  for (const x of aloud) for (const w of (x.missed || [])) stumbles[w] = (stumbles[w] || 0) + 1;
  for (const x of says) for (const w of (x.missed || [])) stumbles[w] = (stumbles[w] || 0) + 1;
  const s = {
    spelling: { v: writes.length >= 5 ? avg(writes.map(x => x.g >= 3 ? 1 : 0)) : null, n: writes.length },
    meaning: { v: meaning.length >= 4 ? avg(meaning.map(x => x.g >= 3 ? 1 : 0)) : null, n: meaning.length },
    pronunciation: { v: (says.length + aloud.length) >= 3
      ? avg([...says.map(x => x.share), ...aloud.map(x => x.acc / 100)]) : null, n: says.length + aloud.length },
    melody: { v: avg(L.filter(x => x.mel != null).map(x => x.mel / 100)), n: L.filter(x => x.mel != null).length },
    speed: { v: reads.length ? avg(reads.map(x => Math.min(1.2, x.speed / (x.target || 100)))) / 1.2 : null, n: reads.length },
    comprehension: (() => { const tests = reads.filter(x => x.c != null); return { v: tests.length ? avg(tests.map(x => x.c / 3)) : null, n: tests.length }; })(),
  };
  if (s.melody.n < 3) s.melody.v = null;
  return { s, patterns: pat, stumbles };
}
/* the weakest areas with enough evidence, lowest first */
function weakest(k = 2) {
  const { s } = skills();
  return Object.entries(s).filter(([, x]) => x.v != null && x.v < 0.85).sort((a, b) => a[1].v - b[1].v).slice(0, k).map(([name]) => name);
}
function topPattern() {
  const { patterns } = skills();
  const e = Object.entries(patterns).sort((a, b) => b[1] - a[1])[0];
  return e && e[1] >= 2 ? e[0] : null;
}
function topStumbles(n = 5) {
  const { stumbles } = skills(Date.now() - 21 * DAY);
  return Object.entries(stumbles).sort((a, b) => b[1] - a[1]).map(([w]) => w)
    .map(w => ITEMS['w:' + w] || ITEMS['p:' + w]).filter(Boolean).slice(0, n);
}

/* ============================ FOCUS ============================
   What the daily adds for this learner's weak spots. Called by buildSession. */
function coachFocus(taken) {
  const out = [], now = Date.now();
  const notToday = id => !CARDS[id] || today(new Date(CARDS[id].last)) !== today();
  const add = (id, mode) => { if (!taken.has(id) && out.length < 4) { out.push({ id, mode, focus: true }); taken.add(id); } };
  const weak = weakest(3);
  /* words stumbled on out loud: learn them properly, sound and spelling */
  if (weak.includes('pronunciation') || weak.includes('speed'))
    for (const it of topStumbles(3)) if (notToday(it.id)) add(it.id, CARDS[it.id] ? 'review' : 'new');
  /* the spelling pattern they miss most: review words that have it */
  const pat = weak.includes('spelling') && topPattern();
  if (pat) {
    Object.keys(CARDS).filter(id => ITEMS[id] && ITEMS[id].kind === 'word' && !CARDS[id].seeded && notToday(id) && patternOf(ITEMS[id].en, pat))
      .sort((a, b) => FSRS.retrievability(CARDS[a], now) - FSRS.retrievability(CARDS[b], now)).slice(0, 2).forEach(id => add(id, 'review'));
  }
  /* melody: one more sentence to shadow */
  if (weak.includes('melody')) {
    const s = CONTENT.sentences.find(id => notToday(id) && !taken.has(id));
    if (s) add(s, CARDS[s] ? 'review' : 'new');
  }
  return out;
}

/* ============================ SPEED PRACTICE ============================
   Missed a reading test on speed: the passage comes back as practice (listen,
   then read it out loud again) until the practice speed clears the target. */
function notePracticeNeed(ps, g, speed, tgt, pass, missed) {
  if (pass) { if (P.practice && P.practice.pid === ps.id) P.practice = null; return; }
  if (speed < tgt) P.practice = { pid: ps.id, grade: g, target: tgt, best: speed, missed: missed || [] };
}
async function practiceFlow(host, e) {
  const my = RUN.screen;
  const pr = P.practice; if (!pr) return nextEntry();
  const L = CONTENT.levels[pr.grade - 1], ps = L.passages.find(p => p.id === pr.pid);
  if (!ps) { P.practice = null; return nextEntry(); }
  const para = passageEl(ps);
  const note = h('p', { class: 'note' }, t('pr_intro', { t: pr.target, b: pr.best }));
  const res = h('div', { class: 'result' });
  const go = primary(t('rd_aloud_go'), () => start());
  mount(host, h('div', { class: 'eyebrow' }, t('pr_title') + ' · ' + gradeName(pr.grade)), h('h2', null, ps.title), note, para, res,
    h('div', { class: 'actions' }, btn(t('rd_model'), () => sayAlong(ps.text, para), 'ghost'), btn(t('skip'), () => { stopVoice(); nextEntry(); }, 'ghost'), go));
  let reader = null, t0 = 0; // declared before any await: the button can be tapped during the model
  /* no microphone: practise silently on the clock, against the silent target */
  const silent = !SR || MIC.denied || MIC.srOff;
  const target = silent ? L.silent : pr.target;
  if (silent) { go.textContent = t('rd_start'); note.textContent = t('pr_intro', { t: target, b: pr.best }); }
  /* the model first: listening while reading is the repeated-reading step */
  await sayAlong(ps.text, para); if (!alive(my)) return;
  function start() {
    if (t0) return finish();
    stopVoice(); t0 = performance.now();
    if (!silent) { reader = liveRead(para, () => { MIC.srOff = true; }); RUN.reader = reader; }
    go.textContent = t('rd_done');
  }
  function finish() {
    if (!alive(my)) return;
    let wcpm, acc = null, missed = [];
    if (reader) {
      const pk = reader.peek();
      if (pk.reached < pk.all * 0.9) { note.textContent = t('rd_read_all'); note.classList.add('warn'); return; }
      const r = reader.stop(); reader = null; RUN.reader = null;
      wcpm = Math.round(r.right / ((performance.now() - t0) / 60000));
      acc = Math.round(100 * r.right / r.total);
      missed = [...para.querySelectorAll('.w.miss')].map(x => norm(x.textContent).split(' ')[0]);
    } else {
      wcpm = Math.round(ps.words / ((performance.now() - t0) / 60000));
      if (wcpm > WPM_CEILING) { note.textContent = t('rd_too_soon'); note.classList.add('warn'); return; }
    }
    LOG.push({ t: Date.now(), kind: 'practice', pid: ps.id, speed: wcpm, acc, missed, mode: silent ? 'silent' : 'oral' });
    const cleared = wcpm >= target;
    const before = pr.best;
    pr.best = Math.max(pr.best, wcpm);
    if (cleared) P.practice = null;
    save();
    mount(res, 
      h('div', { class: 'scores' },
        h('div', { class: 'stat big' }, h('b', null, String(wcpm)), h('span', null, t(silent ? 'rd_wpm' : 'rd_wcpm'))),
        h('div', { class: 'stat big' }, h('b', null, String(target)), h('span', null, t('pr_target')))),
      h('p', { class: 'lead' + (cleared ? ' opened' : '') }, cleared ? t('pr_cleared') : t('pr_progress', { a: before, b: wcpm })));
    go.textContent = t('next'); go.onclick = () => nextEntry();
    autoNext(host, () => alive(my) && nextEntry(), 3000);
  }
}

/* ============================ PLAY OPENS LEVELS ============================
   Own three quarters of your level's words, and the next level opens at the
   end of the session without waiting for the reading test. */
function openByPractice() {
  if (P.grade >= NLEV) return null;
  const ids = levelItems(P.grade); if (ids.length < 5) return null;
  const own = ids.filter(id => CARDS[id] && CARDS[id].s >= OWNED_S).length;
  if (own < Math.ceil(ids.length * 0.75)) return null;
  const g = P.grade + 1;
  P.grade = g;
  LOG.push({ t: Date.now(), kind: 'open', g, by: 'play', own, of: ids.length });
  return { g, own, of: ids.length };
}

/* ============================ THE COACH STEPS IN ============================
   Misses in one session that share a spelling pattern, or just enough misses,
   become a two-minute fix offered on the end screen, while it is fresh. */
function runStruggle(r) {
  if (r.fix) return null;
  const L = r.results.filter(x => !x.read && x.g < 3 && ITEMS[x.id]);
  if (L.length < 2) return null;
  const pat = {};
  for (const x of L) for (const p of (x.pat || [])) pat[p] = (pat[p] || 0) + 1;
  const top = Object.entries(pat).sort((a, b) => b[1] - a[1])[0];
  const missed = [...new Set(L.map(x => x.id))];
  if (top && top[1] >= 2) {
    const p = top[0];
    const same = missed.filter(id => patternOf(ITEMS[id].en, p));
    const more = Object.keys(CARDS).filter(id => ITEMS[id] && ITEMS[id].kind === 'word' && !missed.includes(id) && patternOf(ITEMS[id].en, p))
      .sort(() => Math.random() - 0.5).slice(0, Math.max(0, 5 - same.length));
    return { pat: p, n: top[1], ids: [...same, ...more] };
  }
  return { pat: null, n: missed.length, ids: missed.slice(0, 5) };
}
function startFix(f) {
  startRun([{ intro: 'fix', key: f.pat || '', ids: f.ids }, ...f.ids.map(id => ({ id, mode: 'review', focus: true }))]);
  RUN.fix = true; // a fix never offers another fix
}
/* the letters of a word that carry a spelling pattern, for marking */
function patternRx(p) {
  if (p === 'double') return /([a-z])\1/g;
  if (p === 'silent') return /^kn|^wr|^ps|mb$|mn$|gh|pt|bt|lk|lm|stle|sten|^ho(n|u)|[^aeiou]e$/g;
  if (p === 'endings') return /(tion|sion|ous|ence|ance|able|ible|ment|ed|ly|ure|ture)$/g;
  if (p === 'vowels') return /(ea|ee|ie|ei|ou|oo|ai|au|oa)/g;
  if (p === 'consonants') return /(th|ch|sh|ph|ck|qu)/g;
  return null;
}
function markPattern(word, p) {
  const rx = patternRx(p); if (!rx) return [word];
  const out = []; let last = 0; const x = word.toLowerCase();
  for (const m of x.matchAll(rx)) { if (m.index > last) out.push(word.slice(last, m.index)); out.push(h('b', { class: 'hl' }, word.slice(m.index, m.index + m[0].length))); last = m.index + m[0].length; }
  if (last < word.length) out.push(word.slice(last));
  return out;
}

/* ============================ ARCADE ============================
   His 9/25 word: "some type of fun arcade style of word and reading game".
   Waves of eight rounds. Wave kinds cycle: hear it and pick the spelling,
   hear it and type it, read a sentence and pick the missing word. Every
   wave is a little faster. Combo grows with each right answer; three misses
   end the run. You race your own record and its ghost. Every answer is real
   retrieval, so it still feeds memory (once a day per word). Adult: points,
   waves and a record, nothing else. */
const ARC_BASE = { sound: 7000, spell: 9000, read: 14000 };
const ARC_ROUNDS = 8;
let ARC = null;
function arcadeStats() { P.arcade = P.arcade || { best: 0, ghost: [], plays: [] }; return P.arcade; }
/* four look-alikes: same length, one or two letters apart */
function lookAlikes(word) {
  const cands = CONTENT.items.filter(it => it.kind === 'word' && !it.en.includes(' ') && it.en !== word && Math.abs(it.en.length - word.length) <= 1);
  const near = cands.filter(it => lev(it.en.toLowerCase(), word.toLowerCase()) <= 2).map(it => it.en);
  const out = [...new Set(near)].sort(() => Math.random() - 0.5).slice(0, 3);
  while (out.length < 3 && cands.length) { const r = cands[Math.floor(Math.random() * cands.length)].en; if (!out.includes(r)) out.push(r); }
  return [word, ...out].sort(() => Math.random() - 0.5);
}
/* words for the run: stumbles and the weak pattern first, then your level's words, then what you have started */
function arcadePool() {
  const ok = it => it && it.kind === 'word' && !it.en.includes(' ') && it.en.length >= 3;
  const started = Object.keys(CARDS).map(k => ITEMS[k]).filter(ok);
  const pat = topPattern();
  const focus = [...topStumbles(6), ...(pat ? started.filter(it => patternOf(it.en, pat)) : [])].filter(ok);
  const lvl = levelItems(P.grade).map(id => ITEMS[id]).filter(it => ok(it) && !focus.includes(it)).sort(() => Math.random() - 0.5).slice(0, 12);
  const rest = started.filter(it => !focus.includes(it) && !lvl.includes(it)).sort(() => Math.random() - 0.5);
  let pool = [...focus.sort(() => Math.random() - 0.5), ...lvl, ...rest];
  if (pool.length < 24) pool = pool.concat(CONTENT.core.map(k => ITEMS[k]).filter(ok).sort(() => Math.random() - 0.5));
  return [...new Set(pool)].slice(0, 120);
}
function startArcade() {
  stopVoice();
  ARC = { score: 0, combo: 0, bestCombo: 0, misses: 0, wave: 1, n: 0, pool: arcadePool(), i: 0, token: 0, over: false,
          t0: 0, wall: 0, times: [], used: new Set(), missed: [] };
  arcadeScreen();
}
const arcKind = wave => ['sound', 'spell', 'read'][(wave - 1) % 3];
const arcMs = (wave, kind) => Math.round(ARC_BASE[kind] * Math.pow(0.88, Math.floor((wave - 1) / 3)));
function arcadeScreen() {
  const A = ARC, st = arcadeStats();
  document.body.classList.add('running');
  const host = h('div', { class: 'stage arcade' });
  const waveEl = h('span', { class: 'eyebrow' }, t('ar_wave', { n: 1 }));
  const timeBar = h('div', { class: 'track' }, h('i', { style: 'width:100%' }));
  const scoreEl = h('b', null, '0'), comboEl = h('b', null, '0'), missEl = h('b', null, '0');
  const ghostEl = h('span', { class: 'ghost' }, st.best ? t('g_ghost', { n: 0 }) : '');
  mount(APP(), h('section', { class: 'screen run' },
    h('div', { class: 'runbar' }, waveEl, timeBar, h('button', { class: 'ghost small', onclick: () => endArcade(true) }, t('close_x'))),
    h('div', { class: 'row between' },
      h('div', { class: 'stat' }, scoreEl, h('span', null, t('ar_score'))),
      h('div', { class: 'stat' }, comboEl, h('span', null, t('ar_combo'))),
      h('div', { class: 'stat' }, missEl, h('span', null, t('ar_misses') + ' / 3')),
      ghostEl),
    host));
  A.ui = { host, waveEl, timeBar, scoreEl, comboEl, missEl, ghostEl };
  mount(host, h('h2', null, t('ar_title')), h('p', { class: 'lead' }, t('ar_sub')),
    h('p', { class: 'note' }, st.best ? t('g_best') + ': ' + st.best : t('ar_new')),
    h('div', { class: 'actions' }, primary(t('ar_go'), () => { A.t0 = performance.now(); A.wall = Date.now(); arcadeRound(); })));
}
function arcRight(it, kind) {
  const A = ARC;
  A.combo++; A.bestCombo = Math.max(A.bestCombo, A.combo);
  A.score += 10 * A.wave + A.combo;
  A.times.push([performance.now() - A.t0, A.score]);
  A.ui.scoreEl.textContent = String(A.score); A.ui.comboEl.textContent = String(A.combo);
  arcGrade(it, 3, kind);
}
function arcMiss(it, kind, typed) {
  const A = ARC;
  A.combo = 0; A.misses++; if (it) A.missed.push(it.en);
  A.ui.comboEl.textContent = '0'; A.ui.missEl.textContent = String(A.misses);
  if (it) arcGrade(it, 1, kind, typed);
}
/* a round is real retrieval, so it updates memory, once a day per word */
function arcGrade(it, g, kind, typed) {
  if (!it || !it.id) return;
  const c = CARDS[it.id];
  const extra = { t: Date.now(), id: it.id, g, ph: 'arcade:' + kind, w: kind === 'spell' ? 1 : undefined };
  if (typed != null && kind === 'spell') extra.pat = spellPatterns(it.en, typed);
  LOG.push(extra);
  if (!c) CARDS[it.id] = FSRS.rate(null, g);
  else if (today(new Date(c.last)) !== today()) CARDS[it.id] = FSRS.rate(c, g);
}
function arcadeRound() {
  const A = ARC; if (!A || A.over) return;
  if (A.n >= ARC_ROUNDS) { A.n = 0; A.wave++; A.ui.waveEl.textContent = t('ar_wave', { n: A.wave }); }
  A.n++;
  const kind = arcKind(A.wave), ms = arcMs(A.wave, kind);
  const my = ++A.token, host = A.ui.host;
  let it = null, item = null;
  if (kind === 'read') { item = mazeItem(P.grade, A.used) || mazeItem(Math.max(1, P.grade - 1), A.used); if (!item) { A.n = ARC_ROUNDS; return arcadeRound(); } }
  else it = A.pool[A.i++ % A.pool.length];
  /* the clock for this round */
  const bar = A.ui.timeBar.firstChild; bar.style.transition = 'none'; bar.style.width = '100%';
  requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transition = `width ${ms}ms linear`; bar.style.width = '0%'; }));
  const after = (fn, delay) => setTimeout(() => { if (ARC === A && !A.over) fn(); }, delay);
  const timeout = setTimeout(() => {
    if (A.token !== my || A.over) return;
    A.token++; arcMiss(it, kind);
    mount(host, h('div', { class: 'eyebrow' }, t('ar_time')), it ? wordBlock(it, true, false) : h('p', { class: 'sentence' }, item.before + ' ' + item.word + item.after));
    if (A.misses >= 3) return after(() => endArcade(false), 900);
    after(arcadeRound, 900);
  }, ms);
  const settle = (ok, typed) => {
    if (A.token !== my || A.over) return;
    A.token++; clearTimeout(timeout);
    if (ok) { arcRight(it || { en: item.word }, kind); return after(arcadeRound, ok && kind === 'spell' ? 350 : 250); }
    arcMiss(it, kind, typed);
    if (A.misses >= 3) return after(() => endArcade(false), 1000);
    after(arcadeRound, 900);
  };
  const label = h('div', { class: 'eyebrow' }, t(kind === 'sound' ? 'g_k_sound' : kind === 'spell' ? 'g_k_spell' : 'place_q'));
  if (kind === 'spell') {
    const inp = input(v => {
      if (!v.trim()) return;
      if (isRight(v, it.en)) settle(true);
      else { mount(host, label, letterDiff(it.en, v)); settle(false, v); }
    });
    mount(host, label, listenRow(() => say('en', it.en), () => say('en', it.en, true)), inp);
    inp.focus(); say('en', it.en);
  } else if (kind === 'sound') {
    mount(host, label, listenRow(() => say('en', it.en), () => say('en', it.en, true)),
      h('div', { class: 'choices grid' }, lookAlikes(it.en).map(o => h('button', { class: 'choice', translate: 'no', onclick: ev => {
        if (A.token !== my) return; ev.currentTarget.classList.add(o === it.en ? 'right' : 'wrong'); settle(o === it.en);
      } }, h('b', null, o)))));
    say('en', it.en);
  } else {
    mount(host, label,
      h('p', { class: 'sentence', translate: 'no', lang: 'en' }, item.before + ' ', h('span', { class: 'blank' }, '______'), item.after),
      h('div', { class: 'choices grid' }, item.opts.map(o => h('button', { class: 'choice', translate: 'no', lang: 'en', onclick: ev => {
        if (A.token !== my) return; ev.currentTarget.classList.add(o === item.word ? 'right' : 'wrong'); settle(o === item.word);
      } }, h('b', null, o)))));
  }
  /* the ghost: where your record run was at this moment */
  const st = arcadeStats();
  if (st.ghost.length) {
    const el = performance.now() - A.t0;
    const g = st.ghost.filter(x => x[0] <= el).pop();
    A.ui.ghostEl.textContent = t('g_ghost', { n: g ? g[1] : 0 });
    A.ui.ghostEl.classList.toggle('ahead', A.score > (g ? g[1] : 0));
  }
}
function endArcade(quit) {
  const A = ARC; if (!A || A.over) return;
  A.over = true; A.token++; stopVoice();
  const st = arcadeStats();
  const record = !quit && A.score > st.best;
  if (!quit) {
    st.plays.push({ t: Date.now(), score: A.score, wave: A.wave });
    if (record) { st.best = A.score; st.ghost = A.times.slice(); }
    LOG.push({ t: Date.now(), kind: 'arcade', score: A.score, wave: A.wave, record });
  }
  snapshot(); save();
  ARC = null;
  if (quit) { document.body.classList.remove('running'); return render(); }
  const last = st.plays.slice(-8).map(p => p.score);
  screen(h('div', { class: 'eyebrow' + (record ? ' ok' : '') }, record ? t('g_record') : t('ar_over')),
    h('h2', null, t('ar_title')),
    h('div', { class: 'hero' },
      h('div', { class: 'stat big' }, h('b', null, String(A.score)), h('span', null, t('ar_score'))),
      h('div', { class: 'stat big' }, h('b', null, String(st.best)), h('span', null, t('g_best'))),
      h('div', { class: 'stat big' }, h('b', null, String(A.bestCombo)), h('span', null, t('ar_combo')))),
    h('p', { class: 'lead' }, t('ar_reached', { n: A.wave })),
    last.length > 1 ? lineChart(last, v => String(Math.round(v))) : null,
    A.missed.length ? h('p', { class: 'note' }, t('g_missed') + ' ' + [...new Set(A.missed)].slice(0, 8).join(', ')) : null,
    h('div', { class: 'actions' }, btn(t('g_again'), () => startArcade()), primary(t('next'), () => { document.body.classList.remove('running'); render(); })));
}
function arcadeCard() {
  const st = arcadeStats();
  return h('div', { class: 'card' },
    h('div', { class: 'row between' }, h('h2', null, t('ar_title')), h('span', { class: 'note' }, st.best ? t('g_best') + ': ' + st.best : t('ar_new'))),
    h('p', { class: 'note' }, t('ar_sub')),
    h('div', { class: 'actions' }, primary(t('ar_go'), () => startArcade())));
}

/* ============================ WEEKLY REPORT ============================ */
function weekStart(d = new Date()) { const x = new Date(d); x.setHours(0, 0, 0, 0); const k = (x.getDay() + 6) % 7; x.setDate(x.getDate() - k); return x.getTime(); }
function weekNumbers(from, to) {
  const L = LOG.filter(x => x.t >= from && x.t < to);
  const days = new Set(L.map(x => today(new Date(x.t)))).size;
  const graded = L.filter(x => x.g != null && !x.kind);
  const reads = L.filter(x => ['read', 'practice', 'dailyread'].includes(x.kind));
  const dayKeys = Object.keys(DAYS).filter(k => { const t = new Date(k + 'T12:00').getTime(); return t >= from && t < to; }).sort();
  const ownedEnd = dayKeys.length ? DAYS[dayKeys[dayKeys.length - 1]].owned : null;
  const sk = skills(from, to).s;
  return {
    days, items: graded.length,
    firstTry: graded.length ? Math.round(100 * graded.filter(x => x.g >= 3).length / graded.length) : null,
    speed: reads.length ? Math.max(...reads.map(x => x.speed || 0)) : null,
    readAcc: reads.filter(x => x.acc != null).length ? Math.round(reads.filter(x => x.acc != null).reduce((p, x) => p + x.acc, 0) / reads.filter(x => x.acc != null).length) : null,
    spelling: sk.spelling.v != null ? Math.round(100 * sk.spelling.v) : null,
    melody: sk.melody.v != null ? Math.round(100 * sk.melody.v) : null,
    dreads: L.filter(x => x.kind === 'dailyread').length,
    uses: L.filter(x => x.kind === 'use').length,
    owned: ownedEnd,
  };
}
function weeklyReport() {
  const ws = weekStart(), prev = ws - 7 * DAY;
  const now = weekNumbers(ws, Date.now()), before = weekNumbers(prev, ws);
  const rows = [
    ['wk_days', now.days, before.days, ''],
    ['wk_items', now.items, before.items, ''],
    ['wk_dreads', now.dreads, before.dreads, ''],
    ['wk_use', now.uses, before.uses, ''],
    ['wk_first', now.firstTry, before.firstTry, '%'],
    ['wk_spelling', now.spelling, before.spelling, '%'],
    ['wk_speed', now.speed, before.speed, ''],
    ['wk_read_acc', now.readAcc, before.readAcc, '%'],
    ['wk_melody', now.melody, before.melody, '%'],
    ['wk_owned', now.owned, before.owned, ''],
  ].filter(r => r[1] != null || r[2] != null);
  const better = rows.filter(r => r[1] != null && r[2] != null && r[1] > r[2]).map(r => t(r[0]));
  const weak = weakest(2);
  const pat = topPattern();
  const focusLines = weak.map(w => w === 'spelling' && pat ? t('fx_spelling_' + pat) : t('fx_' + w));
  const stumbles = topStumbles(5).map(it => it.en);
  return h('div', { class: 'card week' },
    h('div', { class: 'eyebrow' }, t('wk_title')),
    better.length ? h('p', { class: 'lead opened' }, t('wk_better') + ' ' + better.join(', ') + '.') : h('p', { class: 'lead' }, t('wk_start')),
    h('div', { class: 'wtable' }, h('span', { class: 'hd' }, ''), h('span', { class: 'hd' }, t('wk_this')), h('span', { class: 'hd' }, t('wk_last')),
      rows.map(([k, a, b, u]) => [h('span', null, t(k)),
        h('b', { class: a != null && b != null && a > b ? 'up' : '' }, a == null ? '·' : a + u),
        h('span', null, b == null ? '·' : b + u)])),
    focusLines.length ? [h('div', { class: 'eyebrow' }, t('wk_focus')), focusLines.map(l => h('p', { class: 'note focus' }, l))] : null,
    stumbles.length ? h('p', { class: 'note' }, t('wk_stumbles') + ' ' + stumbles.join(', ')) : null);
}

/* ============================ DAILY READ ============================
   One short text a day, read as many times as you like. Rereading with a voice
   model builds fluency, and the ten texts together use all of the 100 most
   common words, so they become automatic. */
function todaysRead() {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  const n = Math.floor(d.getTime() / DAY);
  return CONTENT.daily[((n % CONTENT.daily.length) + CONTENT.daily.length) % CONTENT.daily.length];
}
const readsToday = rid => LOG.filter(x => x.kind === 'dailyread' && x.rid === rid && today(new Date(x.t)) === today());
/* one line inside the Daily card: title, today's best, a small Read button */
function dailyReadRow() {
  const r = todaysRead(), done = readsToday(r.id);
  const best = done.length ? Math.max(...done.map(x => x.speed)) : null;
  const label = t('dr_title') + ' · ' + (r.kind === 'lyrics' ? t('dr_lyrics') + ' · ' : '') + r.title + (best ? ' · ' + t('dr_best', { w: best }) : '');
  return h('div', { class: 'row between dr-row' },
    h('span', { class: 'note' }, label),
    btn(done.length ? t('dr_again') : t('dr_read'), () => startRun([{ dread: true }]), 'ghost small'));
}
function dailyReadCard() {
  const r = todaysRead(), done = readsToday(r.id);
  const best = done.length ? Math.max(...done.map(x => x.speed)) : null;
  return h('div', { class: 'card dread' },
    h('div', { class: 'row between' }, h('h2', null, t('dr_title')), h('span', { class: 'note' }, t('dr_sub'))),
    h('p', { class: 'lead' }, (r.kind === 'lyrics' ? t('dr_lyrics') + ' · ' : '') + r.title),
    done.length ? h('p', { class: 'note' }, t('dr_attempt', { n: done.length }) + ' · ' + t('dr_best', { w: best })
      + (done.length > 1 ? ' · ' + done.map(x => x.speed).join(' → ') : '')) : null,
    h('div', { class: 'actions' }, primary(done.length ? t('dr_again') : t('dr_read'), () => startRun([{ dread: true }]))));
}
async function dailyReadFlow(host) {
  const r = todaysRead();
  const first = readsToday(r.id).length === 0;
  const canAloud = SR && !MIC.denied && !MIC.srOff;
  const round = () => {
    RUN.screen++; const me = RUN.screen;
    const para = passageEl(r);
    const n = readsToday(r.id).length + 1;
    const note = h('p', { class: 'note' }, t('dr_sub'));
    const res = h('div', { class: 'result' });
    let reader = null, t0 = 0;
    const go = primary(canAloud ? t('rd_aloud_go') : t('rd_start'), () => {
      if (t0) return finish();
      stopVoice(); t0 = performance.now();
      if (canAloud) { reader = liveRead(para, () => { MIC.srOff = true; }); RUN.reader = reader; }
      go.textContent = t('rd_done');
    });
    const finish = () => {
      if (!alive(me)) return;
      let speed, acc = null, missed = [], mode = 'silent';
      if (reader) {
        const pk = reader.peek();
        if (!pk.failed && pk.reached < pk.all * 0.9) { note.textContent = t('rd_read_all'); note.classList.add('warn'); return; }
        const min = (performance.now() - t0) / 60000;
        /* checked before stopping, so the reader can keep going */
        if (pk.reached / min > WPM_CEILING) { note.textContent = t('rd_too_soon'); note.classList.add('warn'); return; }
        const rr = reader.stop(); reader = null; RUN.reader = null;
        speed = Math.round(rr.right / min); acc = Math.round(100 * rr.right / Math.max(1, rr.total)); mode = 'oral';
        missed = [...para.querySelectorAll('.w.miss')].map(x => norm(x.textContent).split(' ')[0]).filter(Boolean);
      } else {
        speed = Math.round(r.words / ((performance.now() - t0) / 60000));
        if (speed > WPM_CEILING) { note.textContent = t('rd_too_soon'); note.classList.add('warn'); return; }
      }
      LOG.push({ t: Date.now(), kind: 'dailyread', rid: r.id, mode, speed, acc, missed });
      snapshot(); save();
      const all = readsToday(r.id).map(x => x.speed);
      const commonBtn = btn(t('dr_common'), () => {
        const set = new Set(r.top100);
        para.querySelectorAll('.w').forEach(sp => { if (set.has(norm(sp.textContent).split(' ')[0])) sp.classList.toggle('common'); });
      }, 'ghost');
      mount(res, 
        h('div', { class: 'scores' },
          h('div', { class: 'stat big' }, h('b', null, String(speed)), h('span', null, t(mode === 'oral' ? 'rd_wcpm' : 'rd_wpm'))),
          acc != null ? h('div', { class: 'stat big' }, h('b', null, acc + '%'), h('span', null, t('rd_acc'))) : null),
        all.length > 1 ? [h('p', { class: 'note' }, t('dr_today') + ': ' + all.join(' → ')), lineChart(all, v => String(Math.round(v)))] : null,
        missed.length ? h('p', { class: 'note' }, t('rd_tap_missed')) : null,
        h('p', { class: 'note' }, t('dr_common_n', { n: r.top100.length })));
      go.replaceWith(h('span', null, commonBtn, ' ', btn(t('dr_again'), () => round()), ' ', primary(t('dr_done'), () => leave())));
    };
    mount(host, h('div', { class: 'eyebrow' }, t('dr_title') + ' · ' + t('dr_attempt', { n })), h('h2', null, r.title), note, para, res,
      h('div', { class: 'actions' }, btn(t('dr_listen'), () => sayAlong(r.text, para), 'ghost'), go));
    /* the first read of the day starts with the voice: listen while the words light up */
    if (first && n === 1) sayAlong(r.text, para);
  };
  const leave = () => { stopVoice(); if (RUN && RUN.reader) RUN.reader.stop(); RUN = null; releaseMic(); render(); };
  round();
}
