/* READING LAB v5 — the app: onboarding, one daily session, words, progress.
   Loaded after content.js, srs.js, core.js. */

/* ============================ STATE ============================ */
let P = store.get('profile', null);          // {lang, level, inds, when}
let CARDS = store.get('cards', {});          // id -> FSRS card
let LOG = store.get('log', []);              // graded events
let DAYS = store.get('days', {});            // yyyy-mm-dd -> snapshot
let SEEN = store.get('seen', {});            // intro cards already shown
let TAB = 'today';
let RUN = null;
let OB = null;
const APP = () => $('#app');
function save() {
  store.set('profile', P); store.set('cards', CARDS); store.set('log', LOG.slice(-6000));
  store.set('days', DAYS); store.set('seen', SEEN);
}

/* ============================ MEASURES ============================ */
const OWNED_S = 7; // a word is owned when you would still recall it after a week
function ownedIds() {
  return Object.keys(CARDS).filter(id => ITEMS[id] && ITEMS[id].kind !== 'sent' && CARDS[id].s >= OWNED_S);
}
function coverage(ids = ownedIds()) {
  const seen = new Set(); let sum = 0;
  for (const id of ids) {
    const it = ITEMS[id]; const k = it.en.toLowerCase();
    if (seen.has(k)) continue; seen.add(k); sum += it.freq || 0;
  }
  return sum;
}
const pct = (x, d = 1) => (x * 100).toFixed(d).replace(/\.0$/, '');
function snapshot(extra) {
  const d = today(), cur = DAYS[d] || { n: 0, first: 0, graded: 0, mel: [] };
  if (extra) {
    cur.n += extra.n || 0; cur.first += extra.first || 0; cur.graded += extra.graded || 0;
    if (extra.mel != null) cur.mel.push(extra.mel);
  }
  cur.cov = coverage(); cur.owned = ownedIds().length;
  if (P) cur.grade = P.grade;
  DAYS[d] = cur;
}
/* when the next review is due, in words: later today, tomorrow, in N days */
function whenNext() {
  const nextDue = Object.values(CARDS).reduce((m, c) => Math.min(m, c.due), Infinity);
  if (!isFinite(nextDue)) return t('tomorrow');
  const d0 = new Date(); d0.setHours(0, 0, 0, 0);
  const days = Math.floor((nextDue - d0.getTime()) / FSRS.DAY);
  return days <= 0 ? t('later') : days === 1 ? t('tomorrow') : t('in_days', { n: days });
}
const dayNumber = () => Math.max(1, Object.keys(DAYS).filter(k => DAYS[k].n > 0).length);

/* ============================ SHELL ============================ */
function render() {
  stopVoice();
  const nav = $('#nav');
  const inRun = !!RUN;
  document.body.classList.toggle('running', inRun || !P);
  mount(nav, P && !inRun ? [
    ['today', 'tab_today'], ['words', 'tab_words'], ['progress', 'tab_progress']
  ].map(([id, key]) => h('button', { class: 'tab' + (TAB === id ? ' on' : ''), onclick: () => { TAB = id; render(); } }, t(key))) : null);
  mount($('#meta'), P && !inRun ? [
    h('span', { class: 'day' }, t('day') + ' ' + dayNumber() + ' · ' + gradeName(P.grade)),
    h('button', { class: 'ghost small pf', onclick: openProfile, 'aria-label': t('profile') },
      s('svg', { viewBox: '0 0 24 24', width: 18, height: 18, 'aria-hidden': 'true' },
        s('circle', { cx: 12, cy: 8, r: 4, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8 }),
        s('path', { d: 'M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round' })),
      h('span', { class: 'pf-label' }, t('profile')))
  ] : null);
  document.documentElement.lang = (P && P.lang) || (OB && OB.lang) || 'en';
  if (!P) return onboarding();
  if (RUN) return runScreen();
  if (TAB === 'words') return wordsScreen();
  if (TAB === 'progress') return progressScreen();
  return todayScreen();
}
function screen(...kids) { return mount(APP(), h('section', { class: 'screen' }, kids)); }
function btn(label, onclick, cls = '') { return h('button', { class: 'btn ' + cls, onclick }, label); }
function primary(label, onclick) { return h('button', { class: 'btn primary', 'data-primary': '1', onclick }, label); }
function chip(label) { return h('span', { class: 'chip' }, label); }
function autoNext(host, fn, ms = 1300) {
  const bar = h('div', { class: 'autobar' }, h('i'));
  host.appendChild(bar);
  const my = RUN && RUN.screen;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    bar.firstChild.style.transition = `width ${ms}ms linear`; bar.firstChild.style.width = '100%';
  }));
  setTimeout(() => { if (!RUN || RUN.screen === my) fn(); }, ms);
}
/* Enter presses the screen's main button */
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || e.shiftKey) return;
  if (e.target && e.target.tagName === 'INPUT' && e.target.dataset.enter) return; // input handles itself
  const b = document.querySelector('[data-primary]:not([disabled])');
  if (b) { e.preventDefault(); b.click(); }
});
function input(onEnter, placeholder = '') {
  const el = h('input', {
    class: 'answer', type: 'text', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off',
    spellcheck: 'false', placeholder, 'data-enter': '1', lang: 'en', translate: 'no'
  });
  el.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); onEnter(el.value); } });
  return el;
}
const speakerIcon = () => s('svg', { viewBox: '0 0 24 24', width: 22, height: 22, 'aria-hidden': 'true' },
  s('path', { d: 'M4 9h4l5-4v14l-5-4H4z', fill: 'currentColor' }),
  s('path', { d: 'M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12', stroke: 'currentColor', 'stroke-width': 1.8, fill: 'none', 'stroke-linecap': 'round' }));

/** Respelling with the stressed syllable in the accent colour. */
function sayLike(it) {
  if (!it.say) return null;
  return h('div', { class: 'saylike' },
    h('span', { class: 'lbl' }, t('say_like')),
    h('span', { class: 'rs', translate: 'no' }, it.say.split(/([ -])/).map(p =>
      /[A-ZÆɅ]/.test(p) && it.say.includes('-') ? h('b', null, p.toLowerCase()) : p)));
}
/* for starter words: light up the letters that make this group's sound */
const SOUND_RX = { ae: /a/, ih: /i/, aa: /o/, uh: /u/, eh: /e/, sh: /sh/, ch: /ch/, th: /th/, ee: /ee/,
                   ae_e: /a(?=.e$)|e$/g, h: /^h/, v: /^v/, j: /^[jy]/ };
function patternWord(it) {
  const rx = it.sound && SOUND_RX[it.sound];
  if (!rx) return it.en;
  const hits = [...it.en.matchAll(new RegExp(rx.source, 'g'))].slice(0, rx.global ? 9 : 1);
  const out = []; let last = 0;
  for (const m of hits) { out.push(it.en.slice(last, m.index), h('span', { class: 'hl' }, m[0])); last = m.index + m[0].length; }
  out.push(it.en.slice(last));
  return out;
}
function glossOf(it) { return P.lang === 'es' && it.es ? h('div', { class: 'gloss' }, it.es) : null; }

/* ============================ ONBOARDING ============================ */
function onboarding() {
  OB = OB || { step: 'lang', inds: [] };
  const choose = (label, sub, fn, on) => h('button', { class: 'choice' + (on ? ' on' : ''), onclick: fn },
    h('b', null, label), sub ? h('small', null, sub) : null);
  const go = step => { OB.step = step; onboarding(); };
  const P0 = () => ({ lang: OB.lang || 'en' });

  if (OB.step === 'lang') {
    return screen(h('div', { class: 'eyebrow' }, 'Reading Lab'),
      h('h1', null, 'What language do you speak?'), h('p', { class: 'sub' }, '¿Qué idioma hablas?'),
      h('div', { class: 'choices' },
        choose('Español', null, () => { OB.lang = 'es'; go('read'); }),
        choose('English / other', null, () => { OB.lang = 'en'; go('read'); })));
  }
  /* strings follow the chosen language from here on */
  P = null; const tl = id => (UI[id][OB.lang] || UI[id].en);
  if (OB.step === 'read') {
    say(OB.lang, tl('read_q'));
    return screen(h('h1', null, tl('read_q')), h('div', { class: 'choices' },
      choose(tl('read_no'), null, () => { OB.level = 'beginner'; go('ind'); }),
      choose(tl('read_yes'), null, () => { OB.level = 'reader'; go('ind'); })));
  }
  if (OB.step === 'ind') {
    if (OB.level === 'beginner') say(OB.lang, tl('ind_q'));
    const toggle = id => {
      const i = OB.inds.indexOf(id);
      if (i >= 0) OB.inds.splice(i, 1); else { OB.inds.push(id); if (OB.inds.length > 2) OB.inds.shift(); }
      onboarding();
    };
    return screen(h('h1', null, tl('ind_q')),
      h('div', { class: 'choices grid' },
        CONTENT.industries.map(ind => choose(ind[OB.lang] || ind.en, null, () => toggle(ind.id), OB.inds.includes(ind.id))),
        choose(tl('ind_none'), null, () => { OB.inds = []; go('when'); }, false)),
      h('div', { class: 'actions' }, primary(tl('start') === 'Start' ? 'Next' : 'Siguiente', () => go('when'))));
  }
  if (OB.step === 'when') {
    if (OB.level === 'beginner') say(OB.lang, tl('when_q'));
    const pick = w => { OB.when = w; go(OB.level === 'beginner' ? 'primer' : 'place'); };
    return screen(h('h1', null, tl('when_q')), h('div', { class: 'choices' },
      ['when_morning', 'when_commute', 'when_lunch', 'when_night'].map(k => choose(tl(k), null, () => pick(k)))));
  }
  if (OB.step === 'primer') {
    OB.pi = OB.pi || 0;
    const key = ['primer1', 'primer2', 'primer3'][OB.pi];
    say(OB.lang, tl(key));
    return screen(h('div', { class: 'eyebrow' }, (OB.pi + 1) + ' / 3'), h('p', { class: 'lead' }, tl(key)),
      h('div', { class: 'actions' },
        btn(tl('replay'), () => say(OB.lang, tl(key))),
        primary(OB.pi < 2 ? tl('next') : tl('start'), () => { if (OB.pi < 2) { OB.pi++; onboarding(); } else finishOnboarding(); })));
  }
  if (OB.step === 'place') return placement(tl);
}
function finishOnboarding() {
  P = { lang: OB.lang, level: OB.level, inds: OB.inds, when: OB.when, created: Date.now(), grade: OB.startGrade || 1, passed: {} };
  OB = null; TAB = 'today'; snapshot(); save(); render();
}

/* Readers prove what they already own, so nobody drills "the" for a week.
   Four words from each hundred of the core list; the highest hundred with
   three of four right gets seeded as known and spot-checked later. */
function placement(tl) {
  if (!OB.place) {
    const bands = [[1, 100, 4], [101, 200, 5], [201, 300, 5]];
    const pick = [];
    bands.forEach(([a, b, min], bi) => {
      const pool = CONTENT.core.map(id => ITEMS[id]).filter(it => it.rank >= a && it.rank <= b && it.en.length >= min);
      for (let k = 0; k < 4; k++) pick.push({ id: pool[Math.floor((k + 0.5) * pool.length / 4)].id, band: bi });
    });
    OB.place = { pick, i: 0, right: [0, 0, 0] };
  }
  const st = OB.place;
  if (st.i >= st.pick.length) {
    let top = -1;
    st.right.forEach((r, bi) => { if (r >= 3) top = bi; });
    const upto = [0, 100, 200, 300][top + 1];
    let n = 0;
    CONTENT.core.forEach(id => { if (ITEMS[id].rank <= upto) { CARDS[id] = { ...FSRS.seed(), seeded: true }; n++; } });
    OB.startGrade = [1, 2, 3, 4][top + 1];
    st.seeded = n;
    return screen(h('h1', null, tl('place_title')),
      h('p', { class: 'lead' }, (UI.place_done[OB.lang] || UI.place_done.en).replace('{n}', n)),
      h('div', { class: 'actions' }, primary(tl('start'), finishOnboarding)));
  }
  const it = ITEMS[st.pick[st.i].id];
  const next = ok => { if (ok) st.right[st.pick[st.i].band]++; st.i++; onboarding(); };
  const inp = input(v => next(norm(v) === norm(it.en)));
  say('en', it.en);
  screen(h('div', { class: 'eyebrow' }, tl('place_title') + ' · ' + (st.i + 1) + ' / ' + st.pick.length),
    h('h2', null, tl('place_q')),
    h('div', { class: 'listen' }, h('button', { class: 'play', onclick: () => say('en', it.en), 'aria-label': tl('replay') }, speakerIcon())),
    inp,
    h('div', { class: 'actions' }, btn(tl('skip'), () => next(false)), primary(tl('check'), () => next(norm(inp.value) === norm(it.en)))));
  inp.focus();
}

/* ============================ LEVELS ============================
   Everything you can learn sits in one fixed order, cut into 13 levels that
   match the 13 reading grades. Passing a grade's reading test opens the next
   level: its words start arriving in your dailies, and you can play it. */
const NLEV = 13;
const rr = lists => { // round robin: one from each list in turn
  const ls = lists.map(l => [...l]), out = [];
  while (ls.some(l => l.length)) for (const l of ls) if (l.length) out.push(l.shift());
  return out;
};
const orderKey = () => ['v3', CONTENT.items.length, P.level, P.lang, ...(P.inds || [])].join('|');
function learnOrder() {
  if (P.order && P.orderKey === orderKey()) return P.order;
  const ind = rr(P.inds.map(id => CONTENT.industries.find(x => x.id === id).words));
  const core = CONTENT.core.filter(id => !(CARDS[id] && CARDS[id].seeded));
  /* life facts, one topic at a time in turn: money, work, health, safety... */
  const facts = rr(CONTENT.topics.map(tp => CONTENT.facts.filter(id => ITEMS[id].topic === tp.id)));
  let order;
  if (P.level === 'beginner') order = [...CONTENT.starter.flatMap(g => g.words), ...rr([core.filter((_, i) => i % 2 === 0), ind, core.filter((_, i) => i % 2), facts])];
  else if (P.lang === 'es') order = rr([ind, CONTENT.shortcuts.flatMap(r => r.items), facts, rr([CONTENT.sentences, CONTENT.traps, core])]);
  else order = rr([ind, facts, rr([CONTENT.sentences, core])]);
  P.order = [...new Set(order)].filter(id => ITEMS[id]); P.orderKey = orderKey(); save();
  return P.order;
}
const STARTER_IDS = new Set(CONTENT.starter.flatMap(g => g.words));
function levelOf(id) {
  const o = learnOrder();
  if (P.level === 'beginner') {
    /* beginners: every starter sound is level 1, so level 1 can be finished */
    if (STARTER_IDS.has(id)) return 1;
    const rest = o.filter(x => !STARTER_IDS.has(x)), j = rest.indexOf(id);
    return j < 0 ? 1 : Math.floor(j * NLEV / rest.length) + 1;
  }
  const i = o.indexOf(id);
  return i < 0 ? 1 : Math.floor(i * NLEV / o.length) + 1;
}
const levelItems = g => learnOrder().filter(id => levelOf(id) === g);
/* levels, not school grades: an adult sees what they can read, not a child's year */
const gradeName = g => t('grade') + ' ' + g;
const levelLabel = g => t('lv_' + g);
const starterDone = () => CONTENT.starter.every(gr => gr.words.every(started));
const canRead = () => P.level === 'reader' || starterDone();
const readToday = () => LOG.some(x => x.kind === 'read' && today(new Date(x.t)) === today());

/* ============================ SESSION BUILDER ============================ */
const started = id => !!CARDS[id];
function buildSession() {
  const now = Date.now();
  const due = Object.keys(CARDS).filter(id => ITEMS[id] && CARDS[id].due <= now)
    .filter(id => P.level === 'reader' || ['word', 'fact'].includes(ITEMS[id].kind))
    .sort((a, b) => FSRS.retrievability(CARDS[a], now) - FSRS.retrievability(CARDS[b], now)).slice(0, 15);

  /* new words come only from levels you have unlocked, in the fixed order */
  const fresh = [];
  const nWant = P.level === 'beginner' ? 4 : 8;
  for (const id of learnOrder()) {
    if (fresh.length >= nWant || levelOf(id) > P.grade) break;
    if (!started(id)) fresh.push(id);
  }
  /* reviews come first in priority: a heavy review day halves the new words */
  const nNew = due.length > 12 ? Math.ceil(fresh.length / 2) : fresh.length;
  /* mix the kinds (interleaved practice): job word, shortcut, job word, false friend... */
  const buckets = [];
  for (const id of fresh.slice(0, nNew)) {
    const key = ITEMS[id].kind + (ITEMS[id].src ? ITEMS[id].src[0] : '');
    let b = buckets.find(x => x.key === key);
    if (!b) buckets.push(b = { key, ids: [] });
    b.ids.push(id);
  }
  const news = [];
  while (buckets.some(b => b.ids.length)) for (const b of buckets) if (b.ids.length) news.push(b.ids.shift());

  /* interleave: one new, two reviews */
  const q = [], dq = [...due], nq = [...news];
  let easiest = null;
  if (dq.length > 1) { // end on a likely win
    easiest = dq.reduce((a, b) => FSRS.retrievability(CARDS[a], now) > FSRS.retrievability(CARDS[b], now) ? a : b);
    dq.splice(dq.indexOf(easiest), 1);
  }
  while (dq.length || nq.length) {
    if (nq.length) q.push({ id: nq.shift(), mode: 'new' });
    for (let k = 0; k < 2 && dq.length; k++) q.push({ id: dq.shift(), mode: 'review' });
  }
  /* the coach: extra practice where this learner is weakest */
  const taken = new Set(q.map(e => e.id));
  coachFocus(taken).forEach((e, k) => q.splice(Math.min(q.length, 1 + k * 3), 0, e));
  if (P.practice && canRead() && !LOG.some(x => x.kind === 'practice' && today(new Date(x.t)) === today())) q.unshift({ practice: true });
  /* the reading test at your grade sits before the last, easiest review */
  if (canRead() && !readToday() && !P.practice) q.push({ read: P.grade });
  if (easiest) q.push({ id: easiest, mode: 'review' });
  return decorate(q);
}
/* teaching cards go right before the first item they explain */
function decorate(q) {
  const out = [], shown = new Set();
  for (const e of q) {
    if (e.read || e.practice) { out.push(e); continue; }
    const it = ITEMS[e.id];
    if (e.mode === 'new') {
      if (it.kind === 'cog' && !SEEN['rule:' + it.rule] && !shown.has('rule:' + it.rule)) { out.push({ intro: 'rule', key: it.rule }); shown.add('rule:' + it.rule); }
      if (it.kind === 'trap') out.push({ intro: 'trap', key: it.id });
      if (it.kind === 'fact') out.push({ intro: 'fact', key: it.id });
      if (it.kind === 'sent' && !SEEN.melody && !shown.has('melody')) { out.push({ intro: 'melody' }); shown.add('melody'); }
      if (it.sound && P.level === 'beginner' && !shown.has('sound:' + it.sound)) { out.push({ intro: 'sound', key: it.sound }); shown.add('sound:' + it.sound); }
    }
    out.push(e);
  }
  /* a false friend is asked three items after its card, so it is recalled, not read off the screen */
  for (let i = out.length - 1; i >= 0; i--) {
    const e = out[i];
    if (!e.intro && !e.read && e.mode === 'new' && ['trap', 'fact'].includes(ITEMS[e.id].kind)) {
      out.splice(i, 1);
      let j = Math.min(out.length, i + 3);
      while (j < out.length && out[j - 1] && out[j - 1].intro) j++;
      out.splice(j, 0, e);
    }
  }
  return out;
}
function sessionPreview() {
  const q = buildSession();
  return { due: q.filter(e => e.mode === 'review').length, fresh: q.filter(e => e.mode === 'new').length, q };
}

/* ============================ TODAY ============================ */
/* Home: two ways in. The daily (reviews + new words + your reading test) or
   play any level you have opened. */
function todayScreen() {
  const pv = sessionPreview();
  const cov = coverage(), owned = ownedIds().length;
  const doneToday = (DAYS[today()] || {}).n > 0;
  const inds = P.inds.map(id => CONTENT.industries.find(x => x.id === id)[P.lang] || id);
  const nothing = !pv.q.length;
  const lv = CONTENT.levels[P.grade - 1];
  /* a new week: the report comes first, once, then it lives in Progress */
  const ws = weekStart();
  const newWeek = P.weekSeen !== ws && LOG.some(x => x.t < ws);
  const weekCard = newWeek ? weeklyReport() : null;
  if (weekCard) weekCard.appendChild(h('div', { class: 'actions' }, primary(t('wk_ok'), () => { P.weekSeen = ws; save(); render(); })));
  screen(
    weekCard,
    canRead() ? dailyReadCard() : null,
    h('div', { class: 'hero' },
      h('div', { class: 'stat big' }, h('b', null, gradeName(P.grade)), h('span', null, levelLabel(P.grade))),
      h('div', { class: 'stat big' }, h('b', null, String(owned)), h('span', null, t('owned'))),
      h('div', { class: 'stat big' }, h('b', null, pct(cov) + '%'), h('span', null, t('cov_label')))),
    h('div', { class: 'card plan' },
      h('div', { class: 'row between' }, h('h2', null, t('daily')), h('span', { class: 'note' }, t('daily_len'))),
      h('div', { class: 'row' }, chip(t('due_n', { n: pv.due })), chip(t('new_n', { n: pv.fresh })),
        canRead() ? chip(t('rd_title') + ' · ' + gradeName(P.grade)) : null, inds.map(chip)),
      P.when ? h('p', { class: 'when' }, t('your_time', { t: t(P.when).toLowerCase() })) : null,
      nothing
        ? h('p', { class: 'lead' }, t('done_today', { w: whenNext() }))
        : h('div', { class: 'actions' }, primary(doneToday ? t('go_more') : t('go'), () => startRun(pv.q)))),
    h('div', { class: 'card' },
      h('div', { class: 'row between' }, h('h2', null, t('play')), h('span', { class: 'note' }, t('play_sub'))),
      h('div', { class: 'levels' }, CONTENT.levels.map(L => levelTile(L)))),
    gamesCard());
}
function levelTile(L) {
  const g = L.grade, open = g <= P.grade;
  const passed = L.passages.some(p => P.passed[p.id]);
  const ids = open ? levelItems(g) : [];
  const own = ids.filter(id => CARDS[id] && CARDS[id].s >= OWNED_S).length;
  const state = !open ? 'locked' : g === P.grade ? 'current' : 'done';
  return h('button', { class: 'level ' + state, disabled: !open, onclick: () => startLevel(g), 'aria-label': gradeName(g) },
    h('b', null, String(g)),
    h('span', { class: 'lname' }, levelLabel(g)),
    open ? h('span', { class: 'lbar' }, h('i', { style: `width:${ids.length ? Math.round(100 * own / ids.length) : 0}%` })) : h('span', { class: 'lock' }, '·'),
    passed ? h('span', { class: 'tick' }, '✓') : null);
}
/* play a level: its words (new first, then the weakest), then its reading test */
function startLevel(g) {
  const now = Date.now();
  const ids = levelItems(g).filter(id => canRead() || ['word', 'fact'].includes(ITEMS[id].kind));
  const fresh = ids.filter(id => !started(id)).slice(0, 6);
  /* words already reviewed today are left out, so replaying cannot farm 'owned' */
  const weak = ids.filter(id => started(id) && today(new Date(CARDS[id].last)) !== today()).sort((a, b) => FSRS.retrievability(CARDS[a], now) - FSRS.retrievability(CARDS[b], now)).slice(0, 8 - fresh.length);
  const q = rr([fresh.map(id => ({ id, mode: 'new' })), weak.map(id => ({ id, mode: 'review' }))]);
  if (canRead()) q.push({ read: g });
  startRun(decorate(q));
}

/* ============================ THE RUN ============================ */
function startRun(q) {
  RUN = { q, i: 0, screen: 0, t0: Date.now(), streak: 0, bestStreak: 0, results: [], retried: new Set(),
          spoken: {}, mels: [], covBefore: coverage(), ownedBefore: ownedIds().length };
  render();
}
function endRun() {
  const r = RUN; RUN = null;
  /* leaving a session must never leave the microphone listening */
  if (r.reader) try { r.reader.stop(); } catch {}
  releaseMic();
  snapshot(); save();
  endScreen(r);
}
function runScreen() {
  const r = RUN;
  r.screen++;
  if (r.i >= r.q.length) return endRun();
  const e = r.q[r.i];
  const host = h('div', { class: 'stage' });
  mount(APP(), h('section', { class: 'screen run' },
    h('div', { class: 'runbar' },
      h('div', { class: 'track' }, h('i', { style: `width:${(100 * r.i / r.q.length).toFixed(1)}%` })),
      r.streak >= 3 ? h('span', { class: 'streak' }, t('best_run', { n: r.streak })) : null,
      h('button', { class: 'ghost small', onclick: () => { stopVoice(); endRun(); } }, t('close_x'))),
    host));
  if (e.intro) return introCard(host, e);
  if (e.read) return readFlow(host, e.read);
  if (e.practice) return practiceFlow(host, e);
  if (e.dread) return dailyReadFlow(host);
  itemFlow(host, e);
}
const alive = my => RUN && RUN.screen === my;
function nextEntry() { RUN.i++; render(); }
async function speakPhase(id) {
  if (P.level !== 'beginner') return;
  RUN.spoken[id] = (RUN.spoken[id] || 0) + 1;
  if (RUN.spoken[id] <= 3) await say(P.lang, t(id));
}

/* each item walks through its phases; the last phase grades it */
/* a hard word is one you have missed: before or since this session */
const isHard = (it, card) => (card.lapses || 0) > 0 || (RUN && RUN.retried.has(it.id));
const hasTrick = it => !!((P.lang === 'es' && it.trick) || it.pic);
function phasesFor(it, mode, card) {
  const list = basePhases(it, mode, card);
  return mode === 'review' && isHard(it, card) && hasTrick(it) ? ['trick', ...list] : list;
}
function basePhases(it, mode, card) {
  const beg = P.level === 'beginner';
  if (it.kind === 'cog') return ['cog'];
  if (it.kind === 'trap') return ['trapq'];
  if (it.kind === 'fact') return ['factq'];
  if (it.kind === 'sent') return mode === 'new' ? ['learn', 'say'] : (card.reps % 2 ? ['say'] : ['sentence']);
  if (mode === 'new') return beg ? ['learn', 'say', 'build'] : ['pre', 'learn', 'say', 'write'];
  if (beg) return card.reps < 3 ? ['build'] : ['write'];
  return it.sentence && card.reps >= 2 && card.reps % 2 === 0 ? ['sentence'] : ['write'];
}
function itemFlow(host, e) {
  const it = ITEMS[e.id];
  const ctx = { it, e, phases: phasesFor(it, e.mode, CARDS[e.id] || { reps: 0 }), pi: 0, data: {} };
  ctx.next = () => { ctx.pi++; runPhase(); };
  ctx.grade = (g, extra = {}) => gradeItem(ctx, g, extra);
  const runPhase = () => {
    RUN.screen++;
    host.replaceChildren();
    const ph = ctx.phases[ctx.pi];
    PHASES[ph](host, ctx, RUN.screen);
  };
  runPhase();
}
function gradeItem(ctx, g, extra) {
  const { it, e } = ctx, now = Date.now();
  CARDS[it.id] = FSRS.rate(CARDS[it.id], g, now);
  const firstTry = g >= 3;
  LOG.push({ t: now, id: it.id, g, ph: ctx.phases[ctx.pi], mode: e.mode, ...extra });
  RUN.results.push({ id: it.id, g, mode: e.mode, ...extra });
  RUN.streak = firstTry ? RUN.streak + 1 : 0;
  RUN.bestStreak = Math.max(RUN.bestStreak, RUN.streak);
  if (g === 1 && !RUN.retried.has(it.id)) { RUN.retried.add(it.id); RUN.q.push({ id: it.id, mode: 'review' }); }
  snapshot({ n: 1, first: firstTry ? 1 : 0, graded: 1, mel: extra.mel });
  save();
}
function finishItem(host, my, ms = 1100) {
  autoNext(host, () => { if (alive(my)) nextEntry(); }, ms);
}

/* ---------- shared pieces of a phase ---------- */
function listenRow(play, playSlow) {
  return h('div', { class: 'listen' },
    h('button', { class: 'play', onclick: play, 'aria-label': t('replay') }, speakerIcon()),
    playSlow ? btn(t('slow'), playSlow, 'ghost') : null);
}
/* a picture pairs the word with its meaning (dual coding) */
const picOf = (it, cls = 'pic') => it.pic ? h('img', { class: cls, src: it.pic, alt: '', loading: 'eager', decoding: 'async' }) : null;
function wordBlock(it, big = true, gloss = true) {
  return h('div', { class: 'word-block' },
    h('div', { class: big ? 'word' : 'word mid', translate: 'no', lang: 'en' }, P.level === 'beginner' ? patternWord(it) : it.en),
    sayLike(it), gloss ? glossOf(it) : null);
}
function sentenceBlock(text, term) {
  const spans = wordSpans(text);
  if (term) {
    /* underline the term, including a plural or -ed/-ing on it */
    const tw = norm(term).split(' ');
    spans.forEach(sp => {
      if (typeof sp === 'string') return;
      const w = norm(sp.textContent).split(' ')[0];
      if (tw.some(x => w === x || (w.startsWith(x) && w.length - x.length <= 3))) sp.classList.add('term');
    });
  }
  return h('p', { class: 'sentence', translate: 'no', lang: 'en' }, spans);
}
const isRight = (typed, want) => norm(typed) === norm(want) || norm(typed).replace(/ /g, '') === norm(want).replace(/ /g, '');

/* ============================ PHASES ============================ */
const PHASES = {
  /* a word you missed before gets its memory trick first: picture, sound
     hook, meaning. Then the normal recall follows. */
  async trick(host, ctx, my) {
    const { it } = ctx;
    const sentEl = it.sentence ? sentenceBlock(it.sentence, it.en) : null;
    mount(host, h('div', { class: 'eyebrow' }, t('trick_title')),
      picOf(it), wordBlock(it),
      P.lang === 'es' && it.trick ? h('p', { class: 'lead trick' }, it.trick) : null,
      sentEl,
      h('div', { class: 'actions' }, btn(t('replay'), () => say('en', it.en)), primary(t('next'), () => ctx.next())));
    await say('en', it.en, true); if (!alive(my)) return;
    await wait(300); if (!alive(my)) return; await say('en', it.en); if (!alive(my)) return;
    if (sentEl) { await wait(400); if (!alive(my)) return; await sayAlong(it.sentence, sentEl); }
  },

  /* guess first: try to write it before being taught. A miss here still helps
     the word stick (pretesting effect), and a hit skips the lesson. */
  pre(host, ctx, my) {
    const { it } = ctx; let slow = false;
    const play = () => say('en', it.en), playSlow = () => { slow = true; say('en', it.en, true); };
    const check = v => {
      if (!v.trim()) return;
      if (isRight(v, it.en)) {
        mount(host, h('div', { class: 'eyebrow ok' }, t('right')), wordBlock(it));
        ctx.grade(slow ? 3 : 4, { ok: true });
        finishItem(host, my, 1400);
      } else {
        mount(host, h('div', { class: 'eyebrow' }, t('ph_pre')), letterDiff(it.en, v));
        autoNext(host, () => alive(my) && ctx.next(), 1400);
      }
    };
    const inp = input(check);
    mount(host, h('div', { class: 'eyebrow' }, t('ph_pre')), listenRow(play, playSlow), inp,
      h('div', { class: 'actions' }, btn(t('dont_know'), () => ctx.next(), 'ghost'), primary(t('check'), () => check(inp.value))));
    inp.focus();
    speakPhase('ph_pre').then(() => alive(my) && play());
  },

  /* the lesson: slow, normal, meaning, then the word inside a sentence */
  async learn(host, ctx, my) {
    const { it } = ctx;
    const isSent = it.kind === 'sent';
    const sentText = isSent ? it.en : it.sentence;
    const sentEl = sentText ? sentenceBlock(sentText, isSent ? null : it.en) : null;
    const play = async () => {
      if (isSent) { await sayAlong(it.en, sentEl, true); if (!alive(my)) return; await wait(300); if (!alive(my)) return; await sayAlong(it.en, sentEl); return; }
      await say('en', it.en, true); if (!alive(my)) return; await wait(350); if (!alive(my)) return;
      await say('en', it.en); if (!alive(my)) return;
      if (P.level === 'beginner' && P.lang === 'es' && it.es) { await wait(250); if (!alive(my)) return; await say('es', it.es); if (!alive(my)) return; }
      if (sentEl) { await wait(400); if (!alive(my)) return; await sayAlong(sentText, sentEl); }
    };
    /* explain only the symbols this word actually uses */
    const rs = (it.say || '').toLowerCase().replace(/ʌ/g, 'ʌ');
    /* 'j' alone is the soft breath; inside 'dj' it is the DJ sound */
    const has = k => k === 'j' ? /(^|[^d])j/.test(rs) : rs.includes(k);
    const keys = t('legend').split(' · ').filter(e => has(e.split(' ')[0]));
    const legend = keys.length ? h('p', { class: 'legend', translate: 'no' }, keys.join(' · ')) : null;
    mount(host, h('div', { class: 'eyebrow' }, t('ph_learn')),
      isSent ? null : [picOf(it), wordBlock(it)], legend, sentEl,
      h('div', { class: 'actions' }, btn(t('replay'), play), primary(t('next'), () => ctx.next())));
    await speakPhase('ph_learn');
    if (!alive(my)) return;
    await play();
    if (alive(my)) autoNext(host, () => alive(my) && ctx.next(), 900);
  },

  /* call and response: the model, then you, scored on words heard and on melody */
  async say(host, ctx, my) {
    const { it } = ctx;
    const isSent = it.kind === 'sent';
    const target = isSent ? it.en : (P.level === 'reader' && it.sentence) || it.en;
    const sentence = target.includes(' ') && /[.?!]$/.test(target);
    const shown = sentence ? sentenceBlock(target, isSent ? null : it.en) : wordBlock(it, true);
    const res = h('div', { class: 'result' });
    const meter = h('div', { class: 'meter' }, h('i'));
    const recBtn = primary(t('record'), () => take());
    const actions = h('div', { class: 'actions' }, btn(t('model'), () => playModel()), recBtn,
      btn(t('next'), () => done(), 'ghost'));
    mount(host, h('div', { class: 'eyebrow' }, t(isSent ? 'ph_shadow' : 'ph_say')), shown, meter, res, actions);
    const playModel = () => sentence ? sayAlong(target, shown) : say('en', target);
    let graded = false;
    const done = () => {
      if (graded) return; graded = true;
      if (isSent) {
        const m = ctx.data.mel;
        ctx.grade(m == null ? 2 : m >= 70 ? 3 : 2, m != null ? { mel: m } : {});
        finishItem(host, my, 300);
      } else ctx.next();
    };
    const nextIsMain = () => { const nb = actions.lastChild; nb.classList.remove('ghost'); nb.classList.add('primary'); nb.setAttribute('data-primary', '1'); };
    if (!micPossible() || MIC.denied) { res.append(h('p', { class: 'note' }, t(MIC.denied ? 'mic_denied' : 'no_mic'))); recBtn.remove(); nextIsMain(); }
    let stopper = {}, recording = false;
    async function take() {
      if (recording) return; // one take at a time
      recording = true;
      stopVoice();
      recBtn.disabled = true; recBtn.textContent = t('stop');
      recBtn.removeAttribute('data-primary');
      recBtn.onclick = () => stopper.stop && stopper.stop();
      recBtn.disabled = false;
      res.replaceChildren(h('p', { class: 'cue' }, t('your_turn')));
      try {
        const got = await recordTake({ maxMs: sentence ? 9000 : 4000, stopper,
          onLevel: v => { meter.firstChild.style.width = (v * 100).toFixed(0) + '%'; } });
        if (!alive(my)) return;
        meter.firstChild.style.width = '0%';
        const match = heardMatch(target, got.heard);
        if (got.heard.length) LOG.push({ t: Date.now(), kind: 'say', share: match.share, missed: norm(target).split(' ').filter((w, i) => !match.hits[i]) });
        const rows = [];
        if (got.heard.length) rows.push(h('div', { class: 'heard' }, norm(target).split(' ').map((w, i) =>
          h('span', { class: match.hits[i] ? 'ok' : 'miss' }, w + ' '))));
        let mel = null;
        if (sentence) {
          const m = await modelContour(target);
          const u = contour(pitchTrack(got.pcm, got.rate));
          const sc = melodyScore(m, u);
          if (sc) {
            mel = sc.melody; ctx.data.mel = Math.max(ctx.data.mel || 0, mel);
            RUN.mels.push({ s: target, m: mel });
            rows.push(h('div', { class: 'scores' },
              h('div', { class: 'stat' }, h('b', null, sc.melody + '%'), h('span', null, t('melody'))),
              h('div', { class: 'stat' }, h('b', null, sc.pace + '%'), h('span', null, t('pace'))),
              got.heard.length ? h('div', { class: 'stat' }, h('b', null, Math.round(match.share * 100) + '%'), h('span', null, t('words_right'))) : null),
              contourChart(m, u), h('p', { class: 'legend' }, t('mel_how')));
          }
        }
        const mine = new Audio(got.url);
        rows.push(h('div', { class: 'row' }, btn(t('mine'), () => { stopVoice(); mine.muted = MUTED(); mine.play(); }, 'ghost')));
        res.replaceChildren(...rows);
        recBtn.textContent = t('record'); recBtn.onclick = () => take();
        recBtn.classList.remove('primary');
        nextIsMain();
      } catch (err) {
        /* only a refused permission turns the mic off; a bad take just asks again */
        const refused = err && ['NotAllowedError', 'SecurityError', 'NotFoundError'].includes(err.name);
        if (refused) { MIC.denied = true; res.replaceChildren(h('p', { class: 'note' }, t('mic_denied'))); recBtn.remove(); }
        else { res.replaceChildren(h('p', { class: 'note' }, t('try_again'))); recBtn.textContent = t('record'); recBtn.onclick = () => take(); }
        nextIsMain();
      } finally { recording = false; }
    }
    await speakPhase(isSent ? 'ph_shadow' : 'ph_say');
    if (!alive(my)) return;
    await playModel();
    /* once the microphone is allowed, the take starts right after the model */
    if (alive(my) && (MIC.stream || MIC.warm) && !MIC.denied) take();
  },

  /* dictation from sound alone: the writing drill */
  write(host, ctx, my) {
    const { it } = ctx; let slow = false, missed = false;
    const play = () => say('en', it.en), playSlow = () => { slow = true; say('en', it.en, true); };
    const fb = h('div', { class: 'fb' });
    const check = v => {
      if (!v.trim()) return;
      if (isRight(v, it.en)) {
        const g = missed ? 1 : slow ? 2 : 3;
        mount(host, h('div', { class: 'eyebrow ok' }, t('right')), wordBlock(it));
        ctx.grade(g, { ok: !missed, w: 1, pat: ctx.data.pat });
        say('en', it.en);
        return finishItem(host, my, 1200);
      }
      if (!missed) ctx.data.pat = spellPatterns(it.en, v);
      missed = true;
      fb.replaceChildren(letterDiff(it.en, v), h('p', { class: 'note' }, t('copy')));
      inp.value = ''; inp.focus();
      say('en', it.en, true);
    };
    const inp = input(check);
    mount(host, h('div', { class: 'eyebrow' }, t('ph_write')), listenRow(play, playSlow), inp, fb,
      picOf(it, 'pic small'), glossOf(it), h('div', { class: 'actions' }, primary(t('check'), () => check(inp.value))));
    inp.focus();
    speakPhase('ph_write').then(() => alive(my) && play());
  },

  /* for people who cannot type English yet: build it from letter tiles.
     A wrong tile does not land, so the wrong spelling is never on screen. */
  build(host, ctx, my) {
    const { it } = ctx; const word = it.en.toLowerCase();
    let pos = 0, errors = 0;
    const need = [...word];
    const slots = need.map(c => h('span', { class: c === ' ' ? 'slot gap' : 'slot' }, c === ' ' ? ' ' : ''));
    const pool = need.filter(c => c !== ' ');
    const extra = 'aeioustnrl'.split('').filter(c => !pool.includes(c)).slice(0, 2);
    const tiles = [...pool, ...extra].map(c => ({ c, k: Math.random() })).sort((a, b) => a.k - b.k);
    const skipGaps = () => { while (need[pos] === ' ') pos++; };
    skipGaps();
    const tileEls = tiles.map(tl => {
      const b = h('button', { class: 'tile', translate: 'no' }, tl.c);
      b.onclick = () => {
        if (b.disabled) return;
        if (tl.c === need[pos]) {
          slots[pos].textContent = tl.c; slots[pos].classList.add('filled'); b.disabled = true; pos++; skipGaps();
          if (pos >= need.length) {
            const g = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
            ctx.grade(g, { ok: errors === 0, w: 1 });
            mount(host, h('div', { class: 'eyebrow ok' }, t('right')), wordBlock(it));
            say('en', it.en);
            finishItem(host, my, 1400);
          }
        } else {
          errors++; b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
          if (errors % 2 === 0) say('en', it.en, true);
        }
      };
      return b;
    });
    const play = () => say('en', it.en);
    mount(host, h('div', { class: 'eyebrow' }, t('ph_build')), listenRow(play, () => say('en', it.en, true)),
      h('div', { class: 'slots', translate: 'no', style: `grid-template-columns:repeat(${need.length}, minmax(0, 48px))` }, slots), h('div', { class: 'tiles' }, tileEls), picOf(it, 'pic small'), glossOf(it));
    speakPhase('ph_build').then(() => alive(my) && play());
  },

  /* whole-sentence dictation: reading, listening and spelling at once */
  sentence(host, ctx, my) {
    const { it } = ctx; const text = it.kind === 'sent' ? it.en : it.sentence;
    let slow = false;
    const play = () => say('en', text), playSlow = () => { slow = true; say('en', text, true); };
    const area = h('textarea', { class: 'answer long', rows: 3, autocomplete: 'off', autocapitalize: 'sentences', spellcheck: 'false', lang: 'en', translate: 'no' });
    area.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); check(); } });
    const check = () => {
      if (!area.value.trim()) return;
      const d = wordDiff(text, area.value);
      const g = d.share === 1 ? (slow ? 2 : 3) : d.share >= 0.8 ? 2 : 1;
      ctx.grade(g, { ok: g === 3, w: 1, share: d.share });
      const sentEl = sentenceBlock(text, it.kind === 'sent' ? null : it.en);
      mount(host, h('div', { class: 'eyebrow' + (g === 3 ? ' ok' : '') }, g === 3 ? t('right') : t('ph_sentence')), d.el, sentEl);
      sayAlong(text, sentEl).then(() => finishItem(host, my, g === 3 ? 800 : 1600));
    };
    mount(host, h('div', { class: 'eyebrow' }, t('ph_sentence')), listenRow(play, playSlow), area,
      h('div', { class: 'actions' }, primary(t('check'), check)));
    area.focus();
    play();
  },

  /* shortcut: see the Spanish word, produce the English one by the rule */
  cog(host, ctx, my) {
    const { it } = ctx; const rule = CONTENT.shortcuts.find(r => r.id === it.rule);
    let missed = false;
    const fb = h('div', { class: 'fb' });
    const check = v => {
      if (!v.trim()) return;
      if (isRight(v, it.en)) {
        ctx.grade(missed ? 1 : 3, { ok: !missed, w: 1, pat: ctx.data.pat });
        mount(host, h('div', { class: 'eyebrow ok' }, t('right')),
          h('div', { class: 'pair' }, h('span', { class: 'es' }, it.es), h('span', { class: 'arrow' }, '→')),
          wordBlock(it, true, false), rule.same_stress ? null : h('p', { class: 'note' }, t('sc_stress')));
        say('en', it.en).then(() => alive(my) && finishItem(host, my, 900));
        return;
      }
      if (!missed) ctx.data.pat = spellPatterns(it.en, v);
      missed = true;
      fb.replaceChildren(letterDiff(it.en, v), h('p', { class: 'note' }, t('copy')));
      inp.value = ''; inp.focus(); say('en', it.en);
    };
    const inp = input(check);
    mount(host, h('div', { class: 'eyebrow' }, t('ph_cog')),
      h('div', { class: 'word es', translate: 'no', lang: 'es' }, it.es),
      /* the rule is a hint while new; on review you recall it yourself */
      ctx.e.mode === 'new' ? h('div', { class: 'row' }, chip(rule.es_end + '  →  ' + rule.en_end)) : null,
      inp, fb, h('div', { class: 'actions' }, primary(t('check'), () => check(inp.value))));
    inp.focus();
    say('es', it.es);
  },

  /* a life fact comes back as a question: retrieval, not rereading */
  factq(host, ctx, my) {
    const { it } = ctx;
    const tp = CONTENT.topics.find(x => x.id === it.topic);
    const opts = it.a.map((a, i) => ({ a, ok: i === it.correct })).sort(() => Math.random() - 0.5);
    let done = false;
    const pick = (o, el) => {
      if (done) return; done = true;
      el.classList.add(o.ok ? 'right' : 'wrong');
      if (!o.ok) [...host.querySelectorAll('.choice')][opts.findIndex(x => x.ok)].classList.add('right');
      ctx.grade(o.ok ? 3 : 1, { ok: o.ok });
      const sentEl = sentenceBlock(it.en);
      setTimeout(() => {
        if (!alive(my)) return;
        mount(host, h('div', { class: 'eyebrow' + (o.ok ? ' ok' : '') }, o.ok ? t('right') : t('life') + ' · ' + (tp[P.lang] || tp.en)),
          h('div', { class: 'fact' }, sentEl), P.lang === 'es' ? h('p', { class: 'gloss' }, it.es) : null);
        sayAlong(it.en, sentEl).then(() => alive(my) && finishItem(host, my, o.ok ? 600 : 1400));
      }, o.ok ? 500 : 1200);
    };
    const btns = opts.map(o => h('button', { class: 'choice', onclick: ev => pick(o, ev.currentTarget) }, h('b', null, o.a)));
    mount(host, h('div', { class: 'eyebrow' }, t('life') + ' · ' + (tp[P.lang] || tp.en)),
      h('h2', { class: 'q' }, it.q),
      h('div', { class: 'choices' }, btns));
    /* the question is read out; people still learning to read also hear every answer */
    (async () => {
      await say('en', it.q); if (!alive(my) || done) return;
      if (P.level !== 'beginner') return;
      for (let i = 0; i < opts.length; i++) {
        await wait(250); if (!alive(my) || done) return;
        btns[i].classList.add('lit'); await say('en', opts[i].a); btns[i].classList.remove('lit');
        if (!alive(my) || done) return;
      }
    })();
  },

  /* false friend: does the look-alike mean what Spanish says it means? */
  trapq(host, ctx, my) {
    const { it } = ctx;
    const opts = Math.random() < 0.5 ? [it.means, it.es] : [it.es, it.means];
    const pickFn = o => {
      const ok = o === it.means;
      ctx.grade(ok ? 3 : 1, { ok });
      mount(host, h('div', { class: 'eyebrow' + (ok ? ' ok' : '') }, ok ? t('right') : t('trap_title')),
        h('div', { class: 'word mid', translate: 'no' }, it.en),
        h('p', { class: 'lead' }, t('trap_body', { en: it.en, es: it.es, means: it.means })),
        h('p', { class: 'lead' }, t('trap_real', { es: it.es, real: it.real })));
      say('en', it.real).then(() => alive(my) && finishItem(host, my, ok ? 900 : 1800));
    };
    mount(host, h('div', { class: 'eyebrow' }, t('ph_trap')),
      h('div', { class: 'word', translate: 'no', lang: 'en' }, it.en), sayLike(it),
      h('div', { class: 'choices' }, opts.map(o => h('button', { class: 'choice', onclick: () => pickFn(o) }, h('b', null, o)))));
    say('en', it.en);
  },
};

/* ============================ THE READING TEST ============================
   One passage at a grade. Pass = the grade's speed target AND 2 of 3 right.
   Passing your current grade opens the next level; well above target with
   all three right skips one. Beginners hear it first, then read it. */
const WPM_CEILING = 500; // faster than this nobody read it (Brysbaert 2019)
function pickPassage(L) {
  const tries = LOG.filter(x => x.kind === 'read' && x.grade === L.grade).length;
  const unpassed = L.passages.filter(p => !P.passed[p.id]);
  const pool = unpassed.length ? unpassed : L.passages;
  return pool[tries % pool.length];
}
function passageEl(ps) {
  /* tap any word to hear it */
  const spans = wordSpans(ps.text);
  spans.forEach(sp => {
    if (typeof sp === 'string') return;
    sp.addEventListener('click', () => {
      const w = norm(sp.textContent);
      if (clipUrl('en', w, false)) say('en', w); else if (clipUrl('en', w.charAt(0).toUpperCase() + w.slice(1), false)) say('en', w.charAt(0).toUpperCase() + w.slice(1));
    });
  });
  return h('p', { class: 'passage', translate: 'no', lang: 'en' }, spans);
}
async function readFlow(host, g) {
  const my = RUN.screen;
  const L = CONTENT.levels[g - 1], ps = pickPassage(L);
  const target = P.level === 'beginner' ? L.oral : L.silent;
  const head = () => [h('div', { class: 'eyebrow' }, t('rd_title') + ' · ' + gradeName(g)), h('h2', null, ps.title)];
  /* show the target that will actually be used: out loud if the mic can listen */
  const targetLine = h('p', { class: 'note' }, t('rd_target', { w: SR && !MIC.denied && !MIC.srOff ? L.oral : target }));

  const solo = () => {
    RUN.screen++; const me = RUN.screen;
    const para = passageEl(ps);
    const tooSoon = h('p', { class: 'note warn' });
    const t0 = performance.now();
    mount(host, ...head(), steps(3), h('p', { class: 'note' }, t('rd_solo')), para, tooSoon, h('div', { class: 'actions' }, primary(t('rd_done'), () => {
      if (!alive(me)) return;
      const wpm = Math.round(ps.words / ((performance.now() - t0) / 60000));
      /* faster than anyone reads: they did not read it yet, so keep the clock running */
      if (wpm > WPM_CEILING) { tooSoon.textContent = t('rd_too_soon'); return; }
      questions(wpm);
    })));
    speakPhase('rd_solo');
  };
  /* A retry is a different test: three of the five questions, the ones not
     asked last time first, in random order, with the answers shuffled. */
  const shuffle = arr => arr.map(x => [Math.random(), x]).sort((u, v) => u[0] - v[0]).map(x => x[1]);
  const lastAsked = (LOG.filter(x => x.kind === 'read' && x.pid === ps.id).pop() || {}).asked || [];
  const pool = ps.questions.map((_, i) => i);
  const asked = [...shuffle(pool.filter(i => !lastAsked.includes(i))), ...shuffle(pool.filter(i => lastAsked.includes(i)))].slice(0, 3);
  const QS = shuffle(asked).map(i => {
    const q = ps.questions[i];
    return { q: q.q, opts: shuffle(q.a.map((a, j) => ({ a, ok: j === q.correct }))) };
  });
  const questions = (wpm, qi = 0, c = 0) => {
    RUN.screen++; const me = RUN.screen;
    if (qi >= QS.length) return verdict(wpm, c);
    const q = QS[qi];
    mount(host, h('div', { class: 'eyebrow' }, ps.title + ' · ' + (qi + 1) + ' / ' + QS.length), h('h2', null, q.q),
      h('div', { class: 'choices' }, q.opts.map(o => h('button', { class: 'choice', onclick: ev => {
        if (!alive(me)) return;
        const ok = o.ok;
        ev.currentTarget.classList.add(ok ? 'right' : 'wrong');
        if (!ok) host.querySelectorAll('.choice')[q.opts.findIndex(x => x.ok)].classList.add('right');
        RUN.screen++;
        const run = RUN;
        setTimeout(() => RUN === run && questions(wpm, qi + 1, c + (ok ? 1 : 0)), ok ? 600 : 1300);
      } }, h('b', null, o.a)))));
  };
  /* The measure: if you read it out loud, words right a minute against the
     grade's oral target (the standard fluency measure). Otherwise the silent
     timed read against the silent target. */
  const verdict = (wpm, c) => {
    RUN.screen++; const me = RUN.screen;
    const mode = oral ? 'oral' : 'silent';
    const speed = oral ? oral.wcpm : wpm;
    const tgt = oral ? L.oral : target;
    const tooFast = speed > WPM_CEILING;
    const pass = !tooFast && speed >= tgt && c >= 2;
    let msg, opened = null;
    if (tooFast) msg = t('rd_too_fast', { w: speed });
    else if (pass && g === P.grade) {
      const jump = speed >= tgt * 1.3 && c === 3 && P.grade <= NLEV - 2 ? 2 : 1;
      if (P.grade >= NLEV) msg = t('rd_top');
      else { P.grade = Math.min(NLEV, P.grade + jump); opened = P.grade; msg = t(jump === 2 ? 'rd_jump' : 'rd_pass', { g: gradeName(P.grade) }); }
    } else if (pass) msg = t('right');
    else if (speed < tgt && c >= 2) msg = t('rd_slow', { w: speed, t: tgt });
    else if (speed < tgt) msg = t('rd_both', { w: speed, t: tgt, c });
    else msg = t('rd_missed', { c });
    /* the line going up: your last try on this same passage, same way of reading */
    const prev = LOG.filter(x => x.kind === 'read' && x.pid === ps.id && (x.mode || 'silent') === mode).pop();
    if (!tooFast) {
      if (pass) P.passed[ps.id] = Math.max(P.passed[ps.id] || 0, speed);
      LOG.push({ t: Date.now(), kind: 'read', pid: ps.id, grade: g, mode, speed, wpm: speed, target: tgt, c, pass, asked, ...(oral || {}) });
      notePracticeNeed(ps, g, speed, tgt, pass, oral && oral.missed);
      RUN.results.push({ id: ps.id, g: pass ? 3 : 2, read: true, wpm: speed });
      if (opened) RUN.opened = opened;
      snapshot(); save();
    }
    const para = passageEl(ps);
    mount(host, h('div', { class: 'eyebrow' + (pass ? ' ok' : '') }, t('rd_title') + ' · ' + gradeName(g)),
      h('div', { class: 'scores' },
        h('div', { class: 'stat big' }, h('b', null, String(speed)), h('span', null, t(oral ? 'rd_wcpm' : 'rd_wpm'))),
        h('div', { class: 'stat big' }, h('b', null, c + '/3'), h('span', null, t('rd_right'))),
        oral ? h('div', { class: 'stat big' }, h('b', null, oral.acc + '%'), h('span', null, t('rd_acc'))) : null),
      h('p', { class: 'note' }, t('rd_target', { w: tgt })),
      prev && !tooFast ? h('p', { class: 'note' }, t(oral ? 'rd_history_oral' : 'rd_history', { a: prev.speed || prev.wpm, b: speed })) : null,
      h('p', { class: 'lead' + (opened ? ' opened' : '') }, msg),
      h('div', { class: 'actions' }, btn(t('rd_model'), () => sayAlong(ps.text, para)), primary(t('next'), () => { stopVoice(); nextEntry(); })),
      para);
  };

  /* Practice before the test (repeated reading with a model):
     1 listen while the words light up, 2 read it out loud with the mic,
     3 the timed read that counts. */
  const steps = n => h('div', { class: 'steps' }, ['rd_step1', 'rd_step2', 'rd_step3'].map((k, i) =>
    h('span', { class: i + 1 === n ? 'on' : i + 1 < n ? 'past' : '' }, (i + 1) + ' ' + t(k))));
  const listen = async () => {
    RUN.screen++; const me = RUN.screen;
    const para = passageEl(ps);
    mount(host, ...head(), steps(1), targetLine, para,
      h('div', { class: 'actions' }, btn(t('skip'), () => { stopVoice(); aloud(); }, 'ghost'), primary(t('next'), () => { stopVoice(); aloud(); })));
    await speakPhase('rd_listen'); if (!alive(me)) return;
    await sayAlong(ps.text, para);
    if (alive(me)) autoNext(host, () => alive(me) && aloud(), 900);
  };
  const aloud = () => {
    RUN.screen++; const me = RUN.screen;
    if (!SR || MIC.denied || MIC.srOff) return solo();
    const para = passageEl(ps);
    const note = h('p', { class: 'note' }, t('rd_aloud_hint'));
    const res = h('div', { class: 'result' });
    let reader = null, t0 = 0, asked = false;
    const go = primary(t('rd_aloud_go'), () => {
      if (reader) return finish();
      stopVoice();
      t0 = performance.now();
      reader = liveRead(para, err => { if (err === 'not-allowed' || err === 'audio-capture') MIC.denied = true; else MIC.srOff = true; note.textContent = t('rd_aloud_off'); });
      RUN.reader = reader; // so Close can stop the microphone
      go.textContent = t('rd_done');
    });
    const finish = () => {
      if (!alive(me)) return;
      /* the test counts only a full reading: reaching 90% of the words */
      const pk = reader.peek();
      if (pk.failed) { reader.stop(); reader = null; RUN.reader = null; oral = null; return solo(); }
      if (pk.reached > 0 && pk.reached < pk.all * 0.9) {
        if (!asked) { asked = true; note.textContent = t('rd_read_all') + ' ' + t('rd_accept'); note.classList.add('warn'); return; }
        /* a second Done accepts it only past 60% of the passage; less is not a reading */
        if (pk.reached < pk.all * 0.6) { reader.stop(); reader = null; RUN.reader = null; oral = null; return solo(); }
      }
      const r = reader.stop(); reader = null; RUN.reader = null;
      if (r.failed || !r.right) { MIC.denied = MIC.denied || r.failed; return solo(); }
      const min = (performance.now() - t0) / 60000;
      oral = { wcpm: Math.round(r.right / min), acc: Math.round(100 * r.right / r.total), missed: [...para.querySelectorAll('.w.miss')].map(x => norm(x.textContent).split(' ')[0]).filter(Boolean) };
      note.textContent = t('rd_tap_missed');
      res.replaceChildren(h('div', { class: 'scores' },
        h('div', { class: 'stat big' }, h('b', null, String(oral.wcpm)), h('span', null, t('rd_wcpm'))),
        h('div', { class: 'stat big' }, h('b', null, oral.acc + '%'), h('span', null, t('rd_acc')))));
      /* reading it out loud was the test: go straight to the questions */
      go.textContent = t('next'); go.onclick = () => questions(null);
    };
    mount(host, ...head(), steps(2), note, para, res,
      h('div', { class: 'actions' }, btn(t('skip'), () => {
        /* skipping means the silent timed read is the test, not a half-done oral one */
        if (reader) { reader.stop(); reader = null; RUN.reader = null; }
        oral = null; solo();
      }, 'ghost'), go));
  };
  let oral = null;
  if (P.level === 'beginner' || !SEEN['read:' + ps.id]) { SEEN['read:' + ps.id] = true; save(); listen(); }
  else {
    /* seen it before: the listen step is optional */
    mount(host, ...head(), steps(1), targetLine,
      h('div', { class: 'actions' }, btn(t('rd_step1'), () => listen(), 'ghost'), primary(t('rd_step2'), () => aloud())));
  }
}

/* ============================ TEACHING CARDS ============================ */
async function introCard(host, e) {
  const my = RUN.screen;
  const next = () => { SEEN[e.intro + ':' + (e.key || '')] = true; if (e.intro === 'rule') SEEN['rule:' + e.key] = true; if (e.intro === 'melody') SEEN.melody = true; save(); nextEntry(); };
  const nb = primary(t('next'), next);
  if (e.intro === 'rule') {
    const r = CONTENT.shortcuts.find(x => x.id === e.key);
    const pairs = r.items.map(id => ITEMS[id]);
    mount(host, h('div', { class: 'eyebrow' }, t('sc_title')),
      h('h1', { class: 'rule', translate: 'no' }, r.es_end, h('span', { class: 'arrow' }, ' → '), r.en_end),
      h('p', { class: 'lead' }, t('sc_body', { a: r.es_end, b: r.en_end })),
      h('div', { class: 'pairs', translate: 'no' }, pairs.map(p => h('button', { class: 'pairrow', onclick: () => say('en', p.en) },
        h('span', { class: 'es' }, p.es), h('span', { class: 'en' }, p.en), h('span', { class: 'rs' }, sayLike(p))))),
      r.note ? h('p', { class: 'note' }, P.lang === 'es' && r.note_es ? r.note_es : r.note) : null,
      r.same_stress ? null : h('p', { class: 'note' }, t('sc_stress')),
      h('div', { class: 'actions' }, nb));
    for (const p of pairs.slice(0, 3)) {
      if (!alive(my)) return; await say('es', p.es); if (!alive(my)) return; await wait(200); if (!alive(my)) return; await say('en', p.en); await wait(300); if (!alive(my)) return;
    }
  } else if (e.intro === 'trap') {
    const it = ITEMS[e.key];
    mount(host, h('div', { class: 'eyebrow' }, t('trap_title')),
      h('div', { class: 'traphead', translate: 'no' }, h('div', { class: 'word mid' }, it.en), h('div', { class: 'word mid es' }, it.es)),
      h('p', { class: 'lead' }, t('trap_body', { en: it.en, es: it.es, means: it.means })),
      h('p', { class: 'lead' }, t('trap_real', { es: it.es, real: it.real })),
      h('div', { class: 'actions' }, nb));
    await say('en', it.en); if (alive(my)) { await wait(300); if (!alive(my)) return; await say('en', it.real); }
  } else if (e.intro === 'fact') {
    /* a life fact: read it while it is spoken, meaning below for Spanish speakers */
    const it = ITEMS[e.key];
    const tp = CONTENT.topics.find(x => x.id === it.topic);
    const sentEl = sentenceBlock(it.en);
    mount(host, h('div', { class: 'eyebrow' }, t('life') + ' · ' + (tp[P.lang] || tp.en)),
      h('div', { class: 'fact' }, sentEl),
      P.lang === 'es' ? h('p', { class: 'gloss' }, it.es) : null,
      h('div', { class: 'actions' }, btn(t('replay'), () => sayAlong(it.en, sentEl)), nb));
    await sayAlong(it.en, sentEl);
    if (alive(my) && P.level === 'beginner' && P.lang === 'es') { await wait(300); if (!alive(my)) return; await say('es', it.es); }
  } else if (e.intro === 'melody') {
    const exF = CONTENT.sentences.map(id => ITEMS[id]).find(x => x.pattern === 'fall');
    const exR = CONTENT.sentences.map(id => ITEMS[id]).find(x => x.pattern === 'rise');
    /* the real pitch of each example, measured from the voice clip */
    const fall = h('div', { class: 'arrowline' }), rise = h('div', { class: 'arrowline' });
    modelContour(exF.en).then(m => m && fall.append(contourChart(m, null))).catch(() => {});
    modelContour(exR.en).then(m => m && rise.append(contourChart(m, null))).catch(() => {});
    mount(host, h('div', { class: 'eyebrow' }, t('mel_title')),
      h('div', { class: 'melrow' }, fall, h('div', null, h('p', { class: 'lead' }, t('mel_fall')),
        h('button', { class: 'linkish', onclick: () => say('en', exF.en) }, exF.en))),
      h('div', { class: 'melrow' }, rise, h('div', null, h('p', { class: 'lead' }, t('mel_rise')),
        h('button', { class: 'linkish', onclick: () => say('en', exR.en) }, exR.en))),
      h('div', { class: 'actions' }, nb));
    if (P.level === 'beginner') { await say(P.lang, t('mel_fall')); if (!alive(my)) return; }
    await say('en', exF.en); if (!alive(my)) return; await wait(300); if (!alive(my)) return;
    if (P.level === 'beginner') { await say(P.lang, t('mel_rise')); if (!alive(my)) return; }
    await say('en', exR.en);
  } else if (e.intro === 'sound') {
    const g = CONTENT.starter.find(x => x.id === e.key);
    const ws = g.words.map(id => ITEMS[id]);
    mount(host, h('div', { class: 'eyebrow' }, t('ph_learn')),
      h('div', { class: 'word hl-big', translate: 'no' }, g.letters.replace('_', ' … ')),
      h('p', { class: 'lead' }, g[P.lang] || g.en),
      h('div', { class: 'pairs', translate: 'no' }, ws.map(w => h('button', { class: 'pairrow', onclick: () => say('en', w.en) },
        h('span', { class: 'en' }, patternWord(w)), h('span', { class: 'es' }, P.lang === 'es' ? w.es : '')))),
      h('div', { class: 'actions' }, btn(t('replay'), () => say(P.lang, g[P.lang] || g.en)), nb));
    await say(P.lang, g[P.lang] || g.en);
    for (const w of ws) { if (!alive(my)) return; await wait(250); if (!alive(my)) return; await say('en', w.en); }
  }
}

/* ============================ END (peak-end) ============================ */
function endScreen(r) {
  const graded = r.results.length;
  const first = r.results.filter(x => x.g >= 3).length;
  const covD = coverage() - r.covBefore, ownD = ownedIds().length - r.ownedBefore;
  /* the best moment: highest melody, else the longest run, else the rarest word written from sound */
  let best = null;
  const topMel = r.mels.reduce((a, b) => (!a || b.m > a.m ? b : a), null);
  const topRead = r.results.filter(x => x.read && x.g >= 3).sort((a, b) => b.wpm - a.wpm)[0];
  if (r.opened) best = t('best_open', { g: gradeName(r.opened) });
  else if (topRead) best = t('best_read', { w: topRead.wpm, s: CONTENT.levels.flatMap(L => L.passages).find(p => p.id === topRead.id).title });
  else if (topMel && topMel.m >= 60) best = t('best_mel', { n: topMel.m, s: topMel.s });
  else if (r.bestStreak >= 4) best = t('best_run', { n: r.bestStreak });
  else {
    const hard = r.results.filter(x => x.g >= 3 && x.w).map(x => ITEMS[x.id]).sort((a, b) => (a.freq || 1) - (b.freq || 1))[0];
    if (hard) best = t('best_hard', { w: hard.en });
  }
  if (P.level === 'beginner') say(P.lang, t('end_title'));
  const nextDue = Object.values(CARDS).reduce((m, c) => Math.min(m, c.due), Infinity);
  const days = Math.ceil((nextDue - Date.now()) / FSRS.DAY);
  screen(h('div', { class: 'eyebrow' }, t('end_title')),
    best ? h('div', { class: 'card best' }, h('div', { class: 'eyebrow' }, t('end_best')), h('p', { class: 'lead' }, best)) : null,
    h('div', { class: 'hero' },
      h('div', { class: 'stat big' }, h('b', null, graded ? Math.round(100 * first / graded) + '%' : '·'), h('span', null, t('end_first'))),
      /* the last screen shows gains; a slip (a word dropping below a week) shows the total instead */
      h('div', { class: 'stat big' }, h('b', null, ownD > 0 ? '+' + ownD : String(ownedIds().length)), h('span', null, t('owned'))),
      covD >= 0.00005
        ? h('div', { class: 'stat big' }, h('b', null, '+' + pct(covD, 2) + '%'), h('span', null, t('end_cov')))
        : h('div', { class: 'stat big' }, h('b', null, String(graded)), h('span', null, t('end_items')))),
    h('p', { class: 'note' }, t('done_today', { w: whenNext() })),
    h('div', { class: 'actions' }, primary(t('next'), () => { TAB = 'today'; render(); })));
}

/* ============================ WORDS ============================ */
let WFILTER = 'all';
function wordsScreen() {
  const groups = [['all', t('w_filter_all')], ...P.inds.map(id => { const x = CONTENT.industries.find(i => i.id === id); return ['ind:' + id, x[P.lang] || x.en]; }),
    ...(P.lang === 'es' ? [['cog', t('sc_title')], ['trap', t('trap_title')]] : []), ['fact', t('life')], ['sent', t('melody')], ['core', t('w_top')]];
  const pass = it => WFILTER === 'all' ? true : WFILTER === 'fact' ? it.kind === 'fact' : WFILTER === 'cog' ? it.kind === 'cog' : WFILTER === 'trap' ? it.kind === 'trap'
    : WFILTER === 'sent' ? it.kind === 'sent' : WFILTER === 'core' ? !!it.rank : (it.src || []).includes(WFILTER);
  const now = Date.now();
  const rows = Object.keys(CARDS).map(id => ITEMS[id]).filter(Boolean).filter(pass)
    .sort((a, b) => CARDS[b.id].last - CARDS[a.id].last);
  screen(
    h('div', { class: 'row filters' }, groups.map(([k, l]) => h('button', { class: 'chip' + (WFILTER === k ? ' on' : ''), onclick: () => { WFILTER = k; render(); } }, l))),
    h('div', { class: 'list' }, rows.slice(0, 400).map(it => {
      const c = CARDS[it.id], r = FSRS.retrievability(c, now);
      const days = Math.max(0, Math.round((c.due - now) / FSRS.DAY));
      return h('button', { class: 'wrow', onclick: () => say('en', it.en) },
        h('span', { class: 'w', translate: 'no' }, it.en),
        h('span', { class: 'g' }, it.kind === 'trap' ? '≠ ' + it.es : P.lang === 'es' ? (it.es || '') : (it.say || '')),
        h('span', { class: 'sbar', title: t('w_strength') }, h('i', { style: `width:${Math.round(r * 100)}%` + (c.s >= OWNED_S ? '' : ';opacity:.55') })),
        h('span', { class: 'd' }, days === 0 ? '·' : days + 'd'));
    })));
}

/* ============================ PROGRESS ============================ */
function lineChart(vals, fmt, cls = '') {
  const Wd = 600, Ht = 160, pad = 18;
  if (vals.length < 2) vals = [vals[0] || 0, vals[0] || 0];
  const lo = Math.min(...vals), hi = Math.max(...vals, lo + 1e-9);
  const x = i => pad + i * (Wd - 2 * pad) / (vals.length - 1);
  const y = v => Ht - pad - (v - lo) / (hi - lo || 1) * (Ht - 2 * pad);
  const d = vals.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');
  return s('svg', { viewBox: `0 0 ${Wd} ${Ht}`, class: 'chart ' + cls },
    s('path', { d, class: 'line' }),
    s('circle', { cx: x(vals.length - 1), cy: y(vals[vals.length - 1]), r: 5, class: 'dot' }),
    s('text', { x: Wd - pad, y: 14, 'text-anchor': 'end', class: 'lab' }, fmt(vals[vals.length - 1])),
    s('text', { x: pad, y: Ht - 4, class: 'lab dim' }, fmt(vals[0])));
}
function progressScreen() {
  const keys = Object.keys(DAYS).sort().filter(k => DAYS[k].n > 0 || DAYS[k].owned);
  const covs = keys.map(k => DAYS[k].cov || 0), owns = keys.map(k => DAYS[k].owned || 0);
  const writes = LOG.filter(e => e.w);
  const firstHalf = writes.slice(0, 20), lastHalf = writes.slice(-20);
  const acc = a => a.length ? Math.round(100 * a.filter(e => e.g >= 3).length / a.length) : null;
  const mels = LOG.filter(e => e.mel != null).map(e => e.mel);
  /* forecast from the last 7 practice days */
  const recent = keys.slice(-7);
  const perDay = recent.length > 1 ? (DAYS[recent[recent.length - 1]].owned - DAYS[recent[0]].owned) / (recent.length - 1) : 0;
  const cv = CONTENT.coverage;
  screen(
    h('div', { class: 'card' },
      h('div', { class: 'eyebrow' }, t('p_cov')),
      h('div', { class: 'stat big' }, h('b', null, pct(coverage()) + '%'), h('span', null, t('cov_label'))),
      covs.length > 1 ? lineChart(covs, v => pct(v) + '%') : h('p', { class: 'note' }, t('p_empty')),
      h('p', { class: 'note' }, t('p_cov_sub', { a: pct(cv.top100, 0), b: pct(cv.top1000, 0) }))),
    h('div', { class: 'card' },
      h('div', { class: 'eyebrow' }, t('owned')),
      h('div', { class: 'stat big' }, h('b', null, String(ownedIds().length)), h('span', null, t('owned'))),
      owns.length > 1 ? lineChart(owns, v => String(Math.round(v))) : null,
      perDay > 0 ? h('p', { class: 'note' }, t('p_forecast', { n: Math.round(perDay * 30) })) : null),
    h('div', { class: 'card two' },
      h('div', null, h('div', { class: 'eyebrow' }, t('p_write')),
        writes.length ? h('div', { class: 'fromto' },
          h('div', { class: 'stat' }, h('b', null, acc(firstHalf) + '%'), h('span', null, t('p_first'))),
          h('div', { class: 'stat' }, h('b', null, acc(lastHalf) + '%'), h('span', null, t('p_now')))) : h('p', { class: 'note' }, t('p_empty'))),
      h('div', null, h('div', { class: 'eyebrow' }, t('p_melody')),
        mels.length ? h('div', { class: 'fromto' },
          h('div', { class: 'stat' }, h('b', null, mels[0] + '%'), h('span', null, t('p_first'))),
          h('div', { class: 'stat' }, h('b', null, Math.max(...mels.slice(-10)) + '%'), h('span', null, t('p_now')))) : h('p', { class: 'note' }, t('p_empty')))),
    weeklyReport(),
    readingCard(),
    h('p', { class: 'note' }, keys.length + ' ' + t('p_sessions')));
}
/* reading level and speed, one point per reading test */
function readingCard() {
  const all = LOG.filter(x => x.kind === 'read');
  const oralMode = all.some(x => x.mode === 'oral');
  const reads = all.filter(x => (x.mode || 'silent') === (oralMode ? 'oral' : 'silent'));
  return h('div', { class: 'card' },
    h('div', { class: 'eyebrow' }, t('p_grade')),
    h('div', { class: 'stat big' }, h('b', null, gradeName(P.grade)), h('span', null, t('p_grade'))),
    reads.length > 1 ? [h('div', { class: 'eyebrow' }, t('p_speed')), lineChart(reads.map(x => x.speed || x.wpm), v => Math.round(v) + ' ' + t(oralMode ? 'rd_wcpm' : 'rd_wpm'))]
      : h('p', { class: 'note' }, t('p_empty')));
}

/* ============================ PROFILE ============================ */
function openProfile() {
  const close = () => { dlg.remove(); render(); };
  const opt = (label, on, fn) => h('button', { class: 'chip' + (on ? ' on' : ''), onclick: () => { fn(); save(); dlg.remove(); openProfile(); } }, label);
  const soundOff = store.get('soundOff', false);
  const dlg = h('div', { class: 'overlay', onclick: e => { if (e.target === dlg) close(); } },
    h('div', { class: 'panel' },
      h('div', { class: 'row between' }, h('h2', null, t('profile')), btn(t('close_x'), close, 'ghost small')),
      h('div', { class: 'eyebrow' }, t('pf_lang')),
      h('div', { class: 'row' }, opt('Español', P.lang === 'es', () => P.lang = 'es'), opt('English', P.lang === 'en', () => P.lang = 'en')),
      h('div', { class: 'eyebrow' }, t('pf_level')),
      h('div', { class: 'row' }, opt(t('pf_reader'), P.level === 'reader', () => P.level = 'reader'),
        opt(t('pf_beginner'), P.level === 'beginner', () => P.level = 'beginner')),
      h('div', { class: 'eyebrow' }, t('pf_ind')),
      h('div', { class: 'row' }, CONTENT.industries.map(ind => opt(ind[P.lang] || ind.en, P.inds.includes(ind.id), () => {
        const i = P.inds.indexOf(ind.id);
        if (i >= 0) P.inds.splice(i, 1); else { P.inds.push(ind.id); if (P.inds.length > 2) P.inds.shift(); }
      }))),
      h('div', { class: 'eyebrow' }, t('pf_sound')),
      h('div', { class: 'row' }, opt(t('pf_on'), !soundOff, () => store.set('soundOff', false)), opt(t('pf_off'), soundOff, () => store.set('soundOff', true))),
      h('div', { class: 'row danger' }, btn(t('pf_reset'), () => {
        if (!confirm(t('pf_reset_q'))) return;
        store.wipe(); P = null; CARDS = {}; LOG = []; DAYS = {}; SEEN = {}; OB = null; dlg.remove(); render();
      }, 'ghost small'))));
  document.body.appendChild(dlg);
}

/* ============================ BOOT ============================ */
if (Q.has('reset')) { store.wipe(); P = null; CARDS = {}; LOG = []; DAYS = {}; SEEN = {}; }
if (P) {
  P.grade = P.grade || 1; P.passed = P.passed || {};
  P.inds = (P.inds || []).filter(id => CONTENT.industries.some(x => x.id === id));
}
voiceReady.then(render);
