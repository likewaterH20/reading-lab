/* SIMULATED LEARNER. "Mateo", 38, Spanish speaker, literate, reads English at
   about level 4. Plays the REAL app through the real screens, one day at a
   time, for SIM.days days, and reports what worked and where he got stuck.
   Load mock-sr.js first (error capture), then this file, on the muted test
   copy (4401/?mute=1). Poll `({done: __simDone, report: __simReport})`.

   What is simulated: word knowledge by frequency, learning from exposure,
   spelling weak on double and silent letters, reading speed that grows,
   comprehension that drops above his level. The clock is shifted so a day
   passes per loop. The microphone cannot be simulated in the pane, so the
   say-it phase and out-loud reading take the no-mic path.

   Knobs: window.SIM = { days, fast, ability, wpm, seed } before loading. */
window.__simDone = false; window.__simReport = null;
(async () => {
  const S = Object.assign({ days: 14, fast: true, ability: 4, wpm: 110, seed: 7, lang: 'es', inds: ['carsales', 'music'] }, window.SIM || {});
  /* deterministic randomness */
  let rs = S.seed; const rnd = () => { rs = (rs * 1103515245 + 12345) & 0x7fffffff; return rs / 0x7fffffff; };
  const chance = p => rnd() < p;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const R = { days: [], issues: [], errs: [] };
  const issue = (day, what, where) => { R.issues.push({ day, what, where: (where || '').slice(0, 160) }); };

  /* ---- time travel: the app reads Date and performance.now ---- */
  const RealDate = Date; let SHIFT = 0; let PSHIFT = 0;
  window.Date = class extends RealDate {
    constructor(...a) { if (a.length) super(...a); else super(RealDate.now() + SHIFT); }
    static now() { return RealDate.now() + SHIFT; }
  };
  const realPerf = performance.now.bind(performance);
  performance.now = () => realPerf() + PSHIFT;

  /* ---- speed: silence the voice and shorten the auto-advance bar ---- */
  if (S.fast) {
    window.say = async () => {}; window.sayAlong = async () => {}; window.speakPhase = async () => {};
    const realAuto = window.autoNext;
    window.autoNext = (host, fn) => realAuto(host, fn, 25);
    window.wait = ms => sleep(Math.min(ms, 10));
  }

  /* ---- Mateo's head ---- */
  const known = {};            // id -> 0..1 how well he knows the word
  const rankOf = it => it.rank || (it.freq ? Math.round(1 / (it.freq * 60)) : 4000);
  const knows = it => {
    if (known[it.id] == null) known[it.id] = rankOf(it) <= 400 ? 0.92 : rankOf(it) <= 1500 ? 0.7 : rankOf(it) <= 3000 ? 0.4 : 0.15;
    return known[it.id];
  };
  const learn = (it, ok) => { known[it.id] = Math.min(0.98, knows(it) + (ok ? 0.12 : 0.22)); };
  const weakPattern = w => /([a-z])\1/.test(w) ? 0.35 : /^kn|^wr|mb$|gh|[^aeiou]e$/.test(w) ? 0.25 : /(ea|ee|ou|ie|ei)/.test(w) ? 0.15 : 0.05;
  const misspell = w => {
    if (/([a-z])\1/.test(w)) return w.replace(/([a-z])\1/, '$1');
    if (/[^aeiou]e$/.test(w)) return w.slice(0, -1);
    if (/(ea|ee|ou|ie|ei)/.test(w)) return w.replace(/ea|ee|ou|ie|ei/, m => ({ ea: 'ee', ee: 'ea', ou: 'ow', ie: 'ei', ei: 'ie' })[m]);
    return w.slice(0, -1) + (w.endsWith('s') ? 'z' : 's');
  };
  const spellRight = it => chance(knows(it) * (1 - weakPattern(it.en.toLowerCase())));
  const mcRight = level => chance(level <= S.ability ? 0.88 : level <= S.ability + 2 ? 0.6 : 0.4);
  let wpm = S.wpm;

  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const btnBy = rx => $$('main button').find(b => rx.test(b.textContent.trim()));
  const text = () => ($('main') || document.body).innerText.replace(/\s+/g, ' ').slice(0, 200);
  const typeInto = (el, v) => { el.value = v; el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); };

  /* ---- one screen: look, decide, act. Returns a label for the log ---- */
  const passageByTitle = title => CONTENT.levels.flatMap(L => L.passages).find(p => p.title === title) || CONTENT.daily.find(d => d.title === title);
  async function act(day) {
    const e = RUN && RUN.q[RUN.i];
    const it = e && e.id ? ITEMS[e.id] : null;
    const inp = $('input.answer'), area = $('textarea.answer'), tiles = $$('.tile:not(:disabled)'), choices = $$('.choice');
    if (inp && it) {
      const target = it.en;
      const ok = spellRight(it); learn(it, ok);
      typeInto(inp, ok ? target : misspell(target.toLowerCase()));
      if (!ok) { await sleep(40); const again = $('input.answer'); if (again) typeInto(again, target); }
      return 'type ' + (ok ? 'ok' : 'miss');
    }
    if (area && it) {
      const target = it.kind === 'sent' ? it.en : it.sentence;
      const ok = chance(0.65 * knows(it) + 0.2);
      area.value = ok ? target : target.split(' ').filter((w, i) => i !== 3).join(' ');
      area.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      return 'sentence ' + (ok ? 'ok' : 'miss');
    }
    if (tiles.length && it) {
      const filled = $$('.slot.filled').length + $$('.slot.gap').filter((g, i) => i < filled).length;
      const need = it.en.toLowerCase().replace(/ /g, '');
      const pos = $$('.slot.filled').length;
      const want = need[pos];
      const right = tiles.find(t => t.textContent === want);
      if (!right) return 'build stuck';
      if (chance(0.15)) { const wrong = tiles.find(t => t.textContent !== want); if (wrong) { wrong.click(); await sleep(10); } }
      right.click();
      return 'tile';
    }
    if (choices.length) {
      /* what is the right answer? fact and false friend from the item, a reading question from the passage */
      let correct = null, level = P.grade;
      const h2 = $('main h2') && $('main h2').textContent;
      if (it && it.kind === 'fact') correct = it.a[it.correct];
      else if (it && it.kind === 'trap') correct = it.means;
      else {
        const eb = $('main .eyebrow') && $('main .eyebrow').textContent;
        const title = eb && eb.split(' · ')[0];
        const ps = title && passageByTitle(title);
        const q = ps && ps.questions && ps.questions.find(q => q.q === h2);
        if (q) { correct = q.a[q.correct]; level = CONTENT.levels.find(L => L.passages.includes(ps)).grade; }
      }
      const right = correct && choices.find(c => c.textContent.trim() === correct);
      const ok = right ? mcRight(level) : false;
      (ok ? right : choices.find(c => c !== right) || choices[0]).click();
      if (it) learn(it, ok);
      return 'choice ' + (ok ? 'ok' : right ? 'miss' : 'unknown');
    }
    /* silent timed reading: Mateo reads at his speed, the clock moves, then Done */
    const done = btnBy(/^(Done|Terminé)$/);
    if (done && $('.passage')) {
      const title = $('main h2') && $('main h2').textContent;
      const ps = passageByTitle(title);
      const words = ps ? ps.words || ps.text.split(/\s+/).length : $$('.passage .w').length;
      PSHIFT += words / wpm * 60000;
      done.click();
      return 'read ' + words + 'w @' + wpm;
    }
    const start = btnBy(/^(Start reading|Start reading out loud|Empezar a leer|Leer en voz alta)$/);
    if (start) { start.click(); return 'start read'; }
    const drDone = btnBy(/^(Done|Listo)$/);
    if (drDone) { drDone.click(); return 'daily read done'; }
    const fix = btnBy(/^(Work on it now|Trabajarlo ahora)$/);
    if (fix && chance(0.7)) { fix.click(); return 'takes the fix'; }
    const skipListen = btnBy(/^(Skip|Saltar)$/);
    if (skipListen && $('.steps')) { skipListen.click(); return 'skip listen'; }
    const primary = $('main [data-primary]:not(:disabled)');
    if (primary) { primary.click(); return 'primary: ' + primary.textContent.trim(); }
    const next = btnBy(/^(Next|Siguiente|Got it|Entendido)$/);
    if (next) { next.click(); return 'next'; }
    return null;
  }

  async function drive(day, label, maxSteps = 400) {
    let last = '', same = 0, steps = 0;
    while (RUN && steps < maxSteps) {
      await sleep(S.fast ? 30 : 400);
      const before = text();
      const what = await act(day);
      steps++;
      /* a wrong answer keeps its screen up to 1.8 s on purpose; only 4 s of no change is a stall */
      if (before === last) { same++; if (same >= 130) { issue(day, 'STUCK in ' + label + ' (' + what + ')', before); RUN = null; render(); break; } }
      else same = 0;
      last = before;
    }
    if (steps >= maxSteps) issue(day, 'RUNAWAY ' + label + ' (' + maxSteps + ' steps)', text());
    return steps;
  }

  /* ---- a fresh Mateo: through the real onboarding and the placement, at his reading speed ---- */
  store.wipe(); CARDS = {}; LOG = []; DAYS = {}; SEEN = {}; RUN = null; LVIEW = null; P = null; OB = null;
  render(); await sleep(30);
  const clickText = rx => { const b = btnBy(rx); if (b) b.click(); return !!b; };
  clickText(S.lang === 'es' ? /^Español$/ : /^English/); await sleep(30);
  clickText(/^(Sí|Yes)/); await sleep(30);
  for (const ind of S.inds) { const c = CONTENT.industries.find(x => x.id === ind); const b = btnBy(new RegExp('^' + (c[S.lang] || c.en) + '$')); if (b) b.click(); await sleep(20); }
  clickText(/^(Next|Siguiente)$/); await sleep(30);
  const when = $('main .choice'); if (when) when.click(); await sleep(50);
  const placeLog = [];
  for (let i = 0; i < 12 && OB && OB.place && !OB.startGrade; i++) {
    const level = OB.place.pos;
    const sentence = $('.sentence') ? $('.sentence').textContent : '';
    const words = sentence.split(/\s+/).filter(Boolean).length;
    SHIFT += words / wpm * 60000 + 1500;            // he reads the sentence, then picks
    const choices = $$('.choice'); if (!choices.length) break;
    const blank = OB.place.used && [...OB.place.used].pop();
    const right = choices.find(c => blank && new RegExp('(^|\\W)' + c.textContent.trim() + '(\\W|$)').test(blank));
    const ok = right ? mcRight(level) : false;
    (ok ? right : choices.find(c => c !== right) || choices[0]).click();
    placeLog.push('L' + level + (ok ? '+' : '-'));
    await sleep(350);
  }
  R.placement = { items: placeLog.join(' '), placed: OB && OB.startGrade, wpmEst: OB && OB.place && OB.place.wpmEst };
  clickText(/^(Start|Empezar)$/); await sleep(50);
  if (!P) { issue(0, 'onboarding did not finish', text()); P = { lang: S.lang, level: 'reader', inds: S.inds, when: 'when_night', created: Date.now(), grade: S.ability, passed: {} }; save(); }
  SHIFT = 0; TAB = 'today';

  const errsAt = () => (window.__errs || []).length;
  for (let day = 1; day <= S.days; day++) {
    SHIFT = (day - 1) * 864e5; PSHIFT = 0;
    const e0 = errsAt();
    render(); await sleep(50);
    /* a new week: the report card comes first; he reads it and taps Got it */
    const ok = btnBy(/^(Got it|Entendido)$/); if (ok) { ok.click(); await sleep(30); }
    const gradeBefore = P.grade, ownedBefore = ownedIds().length;
    const go = btnBy(/^(Start today's session|Empezar la sesión de hoy|One more round|Una ronda más)$/);
    let steps = 0, sessions = 0;
    if (go) { go.click(); sessions++; steps += await drive(day, 'daily'); }
    else issue(day, 'no session button on home', text());
    /* the end screen may offer the fix; drive() handled it if he took it. Then the daily read, once. */
    render(); await sleep(30);
    const dr = btnBy(/^(Read|Leer)$/);
    if (dr) { dr.click(); await sleep(30); steps += await drive(day, 'daily read', 60); }
    else issue(day, 'no daily read button', text());
    render(); await sleep(30);
    const d = DAYS[today()] || {};
    const sk = skills().s;
    R.days.push({ day, level: P.grade, opened: P.grade > gradeBefore ? P.grade : '', owned: ownedIds().length, gained: ownedIds().length - ownedBefore,
      items: d.graded || 0, firstTry: d.graded ? Math.round(100 * (d.first || 0) / d.graded) : null,
      speed: sk.speed.v != null ? Math.round(100 * sk.speed.v) : null, spelling: sk.spelling.v != null ? Math.round(100 * sk.spelling.v) : null,
      focus: weakest(2).join('+') || '', pattern: topPattern() || '', practice: P.practice ? 'yes' : '',
      steps, minutes: Math.round(PSHIFT / 60000 * 10) / 10, errors: errsAt() - e0 });
    wpm = Math.round(wpm + 2 + rnd() * 2);   // he gets a little faster every day he reads
  }
  R.final = { level: P.grade, owned: ownedIds().length, coverage: Math.round(coverage() * 1000) / 10, log: LOG.length,
    opens: LOG.filter(x => x.kind === 'open').length, reads: LOG.filter(x => x.kind === 'read').length, passes: LOG.filter(x => x.kind === 'read' && x.pass).length,
    weekly: (() => { try { return weeklyReport().innerText.replace(/\s+/g, ' ').slice(0, 300); } catch (e) { return 'THROW ' + e.message; } })() };
  R.errs = (window.__errs || []).slice();
  window.Date = RealDate; performance.now = realPerf;
  window.__simReport = R; window.__simDone = true;
})();
