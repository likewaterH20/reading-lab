/* ============================ THE SOUNDS OF ENGLISH ============================
   EnglishAnyone's 12 phonics videos, watched in order inside the app, the way
   the Arabic app plays Asmae's course: the video stays on YouTube (embedded,
   chrome hidden behind a poster and a shield), a live card follows the
   timeline, the coach pauses after a "repeat after me" block so you produce
   before moving on, and after the video the app drills real words from the
   library that carry the lesson's pattern (the proven item flow, so it feeds
   memory). Progress: P.sounds = { done: [n...], pos: { n: seconds } }. */
function soundsState() {
  P.sounds = P.sounds || { done: [], pos: {}, score: {} };
  const st = P.sounds;
  st.score = st.score || {}; st.last = st.last || {}; st.reps = st.reps || {};
  st.watched = st.watched || []; st.prac = st.prac || {}; st.used = st.used || {};
  /* lessons finished before the practice existed count as practised */
  for (const n of st.done) { if (!st.watched.includes(n)) st.watched.push(n); if (st.prac[n] == null) st.prac[n] = PRACTICE_N; }
  return st;
}
const PRACTICE_N = 5, PRACTICE_ITEMS = 5, PRACTICE_PASS = 4;
const soundsDone = () => P && soundsState().done.length >= CONTENT.sounds.length;
const SOUND_PASS = 80;   // a lesson is mastered when this share of its words comes out right
const soundMastered = n => (soundsState().score[n] || 0) >= SOUND_PASS;
const canSay = () => !!(SR && !MIC.srOff && !MIC.denied);
/* spaced rewatches, the Arabic app's ladder: 3, 7, then 21 days after each watch of a finished lesson */
const SOUND_LADDER = [3, 7, 21];
function soundsDue() {
  const st = soundsState(), now = Date.now();
  return CONTENT.sounds.filter(L => st.done.includes(L.n) && st.last[L.n])
    .map(L => { const gap = SOUND_LADDER[Math.min(st.reps[L.n] || 0, SOUND_LADDER.length - 1)]; return { L, days: Math.round((st.last[L.n] + gap * 864e5 - now) / 864e5) }; })
    .sort((a, b) => a.days - b.days);
}
/* the next lesson: the first one not finished; a finished lesson whose words were not mastered is offered for review first */
function nextSoundLesson() {
  const st = soundsState();
  return CONTENT.sounds.find(L => !st.done.includes(L.n)) || CONTENT.sounds[0];
}
/* the main event of the app (his 10/31 word): watch the lesson, then five practice
   challenges; passing all five opens the next video */
function soundsCard() {
  const st = soundsState(), L = nextSoundLesson();
  const all = soundsDone();
  const rate = P.soundsRate || 1.25;
  const watched = st.watched.includes(L.n);
  const passed = st.prac[L.n] || 0;
  const due = soundsDue().filter(d => d.days <= 0 && d.L.n !== L.n)[0];
  const soon = !due && soundsDue().filter(d => d.days > 0)[0];
  const dots = h('div', { class: 'pdots', 'aria-label': passed + ' / ' + PRACTICE_N },
    Array.from({ length: PRACTICE_N }, (_, i) => h('span', { class: 'pd' + (i < passed ? ' on' : '') })));
  return h('div', { class: 'card main' },
    h('div', { class: 'row between' }, h('h2', null, t('so_title')), h('span', { class: 'note' }, all ? t('so_all_done') : st.done.length ? t('so_done_n', { a: st.done.length }) : t('so_start_here'))),
    h('p', { class: 'lead' }, t('so_lesson', { n: L.n }) + ' · ' + (P.lang === 'es' ? L.es : L.title)),
    /* step 1 watch, step 2 practise five times */
    all ? null : h('div', { class: 'steps2' },
      h('span', { class: watched ? 'past' : 'on' }, '1 ' + t('so_step_watch')),
      h('span', { class: watched ? 'on' : '' }, '2 ' + t('so_step_practice')), watched ? dots : null),
    h('div', { class: 'row between' },
      h('span', { class: 'note' }, watched && !all ? t('pr_left', { k: PRACTICE_N - passed }) : Math.round(L.duration / 60 / rate) + ' min · ' + rate + '×'),
      all ? primary(t('so_rewatch', { n: L.n }), () => startSoundLesson(L.n))
        : watched ? h('span', { class: 'row' }, btn(t('so_watch_again'), () => startSoundLesson(L.n), 'ghost'), primary(t('pr_n', { k: passed + 1 }), () => startPractice(L.n, passed)))
        : primary(t('so_watch', { n: L.n }), () => startSoundLesson(L.n))),
    /* the spaced rewatch: a finished lesson comes back on the ladder */
    due ? h('div', { class: 'row between dr-row' }, h('span', { class: 'note' }, t('so_due', { n: due.L.n })), btn(t('so_rewatch', { n: due.L.n }), () => startSoundLesson(due.L.n), 'ghost small'))
      : soon ? h('p', { class: 'note' }, t('so_next_in', { n: soon.L.n, d: soon.days })) : null,
    /* every lesson you have reached, tap to watch again, as often as you like (his 10/31 word:
       "they wont learn it watching it once"); later lessons stay locked */
    st.done.length ? h('div', { class: 'lessons' },
      h('span', { class: 'note' }, t('so_again_any')),
      h('div', { class: 'row' }, CONTENT.sounds.map(x => {
        const open = st.done.includes(x.n) || x.n === L.n;
        return h('button', { class: 'lnum' + (x.n === L.n ? ' next' : '') + (st.done.includes(x.n) ? ' done' : ''), disabled: !open,
          'aria-label': t('so_lesson', { n: x.n }), onclick: () => startSoundLesson(x.n) }, String(x.n));
      }))) : null);
}
/* words from the library that carry this lesson's pattern: the drill after the video */
const SOUND_EXCEPT = new Set(CONTENT.soundsExcept || []);
function soundLessonWords(L, n = 6) {
  const rx = new RegExp(L.pattern);
  const pool = CONTENT.items.filter(it => it.kind === 'word' && !it.en.includes(' ') && it.en === it.en.toLowerCase() && it.en.length <= 7 && rx.test(it.en) && !SOUND_EXCEPT.has(it.en));
  const started = pool.filter(it => CARDS[it.id]), fresh = pool.filter(it => !CARDS[it.id]);
  const pick = a => a.sort(() => Math.random() - 0.5);
  return [...pick(started).slice(0, Math.ceil(n / 2)), ...pick(fresh)].slice(0, n).map(it => it.id);
}
/* sample words for the coach pause: short vowels, or hard and soft c/g */
function coachWords(which) {
  const words = CONTENT.items.filter(it => it.kind === 'word' && !it.en.includes(' ') && it.en === it.en.toLowerCase() && clipUrl('en', it.en, false) && !SOUND_EXCEPT.has(it.en));
  const first = (rx, k) => words.filter(it => rx.test(it.en)).sort((a, b) => (a.rank || 9999) - (b.rank || 9999)).slice(0, k);
  if (which === 'vowels') {
    /* the beginner sound groups carry a clean short-vowel word each (map, sit, hot, bus...) */
    const fromStarter = ['a', 'e', 'i', 'o', 'u'].map(v => { const g = CONTENT.starter.find(x => x.letters === v); return g && ITEMS[g.words[0]]; }).filter(Boolean);
    if (fromStarter.length >= 4) return fromStarter;
    return ['a', 'e', 'i', 'o', 'u'].map(v => first(new RegExp('^[bcdfghjklmnpqrstvwxyz]' + v + '(?![rwy])[bcdfghjklmnpqrstvwxyz]$'), 1)[0]).filter(Boolean);
  }
  return [...first(/^c[aou]/, 2), ...first(/^c[ei]/, 2), ...first(/^g[aou]/, 2), ...first(/^g[ei]/, 2)];
}

let SOUND = null;
let ytApi = null;
function loadYT() {
  if (ytApi) return ytApi;
  ytApi = new Promise(res => {
    if (window.YT && YT.Player) return res();
    window.onYouTubeIframeAPIReady = () => res();
    document.head.appendChild(h('script', { src: 'https://www.youtube.com/iframe_api' }));
  });
  return ytApi;
}
const fmtTime = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
function startSoundLesson(n) {
  stopVoice();
  const L = CONTENT.sounds.find(x => x.n === n);
  SOUND = { L, yt: null, ready: false, timer: null, cur: null, coachFor: null, loop: null, coach: true, over: false };
  document.body.classList.add('running');
  soundLessonScreen();
}
function soundLessonScreen() {
  const S = SOUND, L = S.L, st = soundsState();
  const blocks = L.blocks || [];
  const box = h('div', { class: 'vbox' });
  const host = h('div', { class: 'yt' });
  const poster = h('div', { class: 'poster', style: `background-image:url(https://i.ytimg.com/vi/${L.id}/hqdefault.jpg)` });
  const shield = h('div', { class: 'shield', onclick: () => toggle() });
  mount(box, host, poster, shield);
  const fill = h('i'), track = h('div', { class: 'vtrack', onclick: e => { const r = track.getBoundingClientRect(); seek((e.clientX - r.left) / r.width * dur()); } }, fill,
    blocks.filter(b => b.kind === 'say').map(b => h('b', { style: `left:${100 * b.t / L.duration}%` })));
  const timeEl = h('span', { class: 'vtime' }, '0:00 / ' + fmtTime(L.duration));
  const playBtn = btn(t('so_play'), () => toggle(), 'ghost');
  const loopBtn = btn(t('so_loop'), () => toggleLoop(), 'ghost');
  const coachBtn = btn(t('so_coach_on'), () => { S.coach = !S.coach; coachBtn.classList.toggle('on', S.coach); }, 'ghost' + (S.coach ? ' on' : ''));
  /* two speeds, and the lesson starts at the faster-than-normal one (his word: "this video is a little slow") */
  const RATES = { normal: 1.25, fast: 1.5 };
  const setRate = r => { P.soundsRate = r; save(); if (S.ready) S.yt.setPlaybackRate(r); rateN.classList.toggle('on', r === RATES.normal); rateF.classList.toggle('on', r === RATES.fast); };
  const rateN = btn(t('so_speed_n'), () => setRate(RATES.normal), 'ghost small');
  const rateF = btn(t('so_speed_f'), () => setRate(RATES.fast), 'ghost small');
  const live = h('div', { class: 'card' });
  const coachEl = h('div', { class: 'coachbox', hidden: true });
  const finish = primary(t('so_finish'), () => finishSoundLesson());
  /* under the video, the learning layer (his word: "use the underneath area for more tips and
     repetition advice like the arabic app"): what is happening now, the lesson's blocks to tap
     and loop, the Spanish-speaker tip, and how to practise */
  const blockRows = h('div', { class: 'list blocklist' }, blocks.map(b => { const row = h('button', { class: 'wrow', onclick: () => { seek(b.t); S.yt.playVideo(); } },
    h('span', { class: 'd' }, fmtTime(b.t)), h('span', { class: 'g' }, P.lang === 'es' ? b.es : b.en)); row._block = b; return row; }));
  const blocksCard = blocks.length ? h('div', { class: 'card' }, h('div', { class: 'eyebrow' }, t('so_blocks')), blockRows) : null;
  const tipsCard = h('div', { class: 'card' },
    L.tip ? [h('div', { class: 'eyebrow' }, t('so_tip')), h('p', { class: 'lead' }, P.lang === 'es' ? L.tip.es : L.tip.en)] : null,
    h('div', { class: 'eyebrow' }, t('so_how')),
    ['so_rep1', 'so_rep2', 'so_rep3', 'so_rep4'].map(k => h('p', { class: 'note focus' }, t(k))));
  mount(APP(), h('section', { class: 'screen run' },
    h('div', { class: 'runbar' }, h('span', { class: 'eyebrow' }, t('so_lesson', { n: L.n })), h('span', { style: 'flex:1' }), h('button', { class: 'ghost small', onclick: () => leaveSoundLesson(), 'aria-label': t('close_x') }, t('close_x'))),
    h('h2', null, P.lang === 'es' ? L.es : L.title),
    box, track,
    h('div', { class: 'vctl' }, playBtn, btn('−5 s', () => seek(time() - 5), 'ghost small'), btn('+5 s', () => seek(time() + 5), 'ghost small'), rateN, rateF, loopBtn, coachBtn, timeEl),
    live, coachEl,
    h('div', { class: 'actions' }, finish),
    blocksCard, tipsCard));
  S.ui = { blockRows };
  setRate(P.soundsRate || RATES.normal);
  Object.assign(S.ui, { box, fill, timeEl, playBtn, loopBtn, live, coachEl });
  renderLive(null);
  const dur = () => (S.ready && S.yt.getDuration()) || L.duration;
  const time = () => S.ready ? S.yt.getCurrentTime() : 0;
  const seek = s => { if (!S.ready) return; s = Math.max(0, Math.min(dur(), s)); S.yt.seekTo(s, true); onTime(s); };
  const toggle = () => { if (!S.ready) return; coachEl.hidden = true; S.yt.getPlayerState() === 1 ? S.yt.pauseVideo() : S.yt.playVideo(); };
  const toggleLoop = () => {
    if (S.loop) { S.loop = null; loopBtn.classList.remove('on'); return; }
    const b = S.cur; if (!b) return;
    S.loop = { a: b.t, b: b.end }; loopBtn.classList.add('on'); seek(b.t); S.yt.playVideo();
  };
  function onState(playing, ended) {
    box.classList.toggle('playing', playing);
    playBtn.textContent = playing ? t('so_pause') : t('so_play');
    if (ended) finishSoundLesson();
  }
  function onTime(s) {
    if (!SOUND || SOUND !== S) return;
    fill.style.width = (100 * s / dur()) + '%'; timeEl.textContent = fmtTime(s) + ' / ' + fmtTime(dur());
    if (Math.floor(s) % 5 === 0) { st.pos[L.n] = Math.max(st.pos[L.n] || 0, s); save(); }
    if (S.loop && s >= S.loop.b) S.yt.seekTo(S.loop.a, true);
    let cur = null; for (const b of blocks) { if (b.t <= s) cur = b; else break; }
    if (cur !== S.cur) { S.cur = cur; renderLive(cur); for (const row of S.ui.blockRows.children) row.classList.toggle('now', row._block === cur); }
    if (cur && cur.marks) litMark(cur, s);
    /* the coach: a "repeat after me" block just ended, so you say it before the lesson moves on */
    if (S.coach && cur && cur.coach && s >= cur.end - 0.4 && S.coachFor !== cur && !S.loop) { S.coachFor = cur; S.yt.pauseVideo(); showCoach(cur); }
  }
  S.onTime = onTime;   // the timeline hook, so tests can drive the clock without YouTube
  function litMark(b, s) {
    const spans = live.querySelectorAll('.letters span'); if (!spans.length) return;
    let idx = -1; b.marks.forEach((m, i) => { if (m.t <= s) idx = i; });
    spans.forEach((sp, i) => { sp.classList.toggle('lit', i === idx); sp.classList.toggle('past', i < idx); });
  }
  function renderLive(b) {
    if (!b) return mount(live, h('div', { class: 'eyebrow' }, t('so_title')), h('p', { class: 'lead' }, P.lang === 'es' ? L.es : L.title));
    mount(live,
      h('div', { class: 'eyebrow' }, b.kind === 'say' ? t('so_say') : b.kind === 'rule' ? t('so_rule') : t('so_lesson', { n: L.n })),
      h('p', { class: 'lead' }, P.lang === 'es' ? b.es : b.en),
      b.marks ? h('div', { class: 'letters', translate: 'no', lang: 'en' }, b.marks.map(m => h('span', null, m.x))) : null,
      h('div', { class: 'row' }, btn(t('so_again'), () => { seek(b.t); S.yt.playVideo(); }, 'ghost small')));
  }
  function showCoach(b) {
    const words = coachWords(b.coach);
    const hear = async () => { for (const w of words) { await say('en', w.en); await wait(250); if (!SOUND) return; } };
    const heard = h('p', { class: 'note' });
    /* with a microphone: say each word, the app checks it (the same ear the arcade uses) */
    const check = async () => {
      if (!canSay()) return;
      EAR.start(); heard.textContent = t('g_say_now');
      for (const w of words) {
        if (!SOUND) return;
        const ok = await new Promise(res => { const ear = EAR.listen(w.en, (ok) => res(ok), () => res(null)); setTimeout(() => { ear.cancel(); res(false); }, 5000); });
        if (ok === null) { heard.textContent = t('mic_denied'); EAR.stop(); return; }
        heard.textContent = (ok ? t('so_heard_ok') : t('g_say_miss')) + ' · ' + w.en;
        LOG.push({ t: Date.now(), kind: 'say', share: ok ? 1 : 0, missed: ok ? [] : [norm(w.en)] });
        await wait(500);
      }
      EAR.stop();
    };
    mount(coachEl, h('div', { class: 'eyebrow ok' }, t('so_coach')),
      h('div', { class: 'row' }, words.map(w => h('button', { class: 'linkish', translate: 'no', lang: 'en', onclick: () => say('en', w.en) }, w.en))),
      heard,
      h('div', { class: 'actions' }, btn(t('so_again'), () => { seek(b.t); coachEl.hidden = true; EAR.stop(); S.yt.playVideo(); }, 'ghost'), btn(t('so_hear'), hear, 'ghost'),
        canSay() ? btn(t('so_check'), check, 'ghost') : null,
        primary(t('so_continue'), () => { coachEl.hidden = true; EAR.stop(); S.yt.playVideo(); })));
    coachEl.hidden = false;
  }
  loadYT().then(() => {
    if (!SOUND || SOUND !== S) return;
    S.yt = new YT.Player(host, {
      videoId: L.id, host: 'https://www.youtube-nocookie.com',
      playerVars: { rel: 0, modestbranding: 1, playsinline: 1, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, cc_load_policy: 0, origin: location.origin },
      events: {
        onReady: () => {
          S.ready = true;
          /* YouTube's own captions stay off; the app's cards do the teaching (his 10/30 word) */
          try { S.yt.unloadModule('captions'); S.yt.unloadModule('cc'); } catch {}
          S.yt.setPlaybackRate(P.soundsRate || 1.25);
          if (MUTED() || store.get('soundOff', false)) S.yt.mute();
          const resume = st.pos[L.n]; if (resume > 10 && resume < L.duration - 15) seek(resume);
        },
        onStateChange: e => {
          clearInterval(S.timer);
          if (e.data === 1) {
            /* YouTube loads its caption module only once the video plays: unload it on every play, twice (his 10/31 screenshot still showed captions) */
            const noCC = () => { try { S.yt.unloadModule('captions'); S.yt.unloadModule('cc'); S.yt.setOption('captions', 'track', {}); } catch {} };
            noCC(); setTimeout(noCC, 800); setTimeout(noCC, 2500);
            onState(true, false); S.timer = setInterval(() => onTime(S.yt.getCurrentTime()), 250);
          }
          else if (e.data === 2) onState(false, false);
          else if (e.data === 0) onState(false, true);
        }
      }
    });
  });
}
function leaveSoundLesson() {
  const S = SOUND; if (!S) return;
  clearInterval(S.timer); try { S.yt && S.yt.destroy(); } catch {}
  SOUND = null; stopVoice();
  document.body.classList.remove('running'); render();
}
/* after the video: the lesson's pattern, on real words, through the item flow */
function finishSoundLesson() {
  const S = SOUND; if (!S || S.over) return;
  S.over = true;
  const L = S.L, st = soundsState();
  /* watching opens the practice; passing all five practice challenges marks the lesson done */
  if (!st.watched.includes(L.n)) st.watched.push(L.n);
  st.pos[L.n] = 0;
  /* the rewatch ladder: this watch counts, the next one is due in 3, 7, then 21 days */
  if (st.last[L.n]) st.reps[L.n] = (st.reps[L.n] || 0) + 1;
  st.last[L.n] = Date.now();
  LOG.push({ t: Date.now(), kind: 'sound', n: L.n });
  snapshot(); save(); syncNow(true);
  clearInterval(S.timer); try { S.yt && S.yt.destroy(); } catch {}
  SOUND = null;
  document.body.classList.remove('running');
  /* back home, where the practice now shows up as the main button */
  TAB = 'today'; window.scrollTo(0, 0); render();
}

/* ============================ THE FIVE PRACTICE CHALLENGES ============================
   After a video: five short challenges built only from that lesson's sound. Each is five
   items; four right passes it and fills a dot. A miss retries that one challenge with new
   words. All five passed = lesson mastered, next video open. Every answer feeds memory.
     1 Listen and pick   hear a word, pick it from look-alikes
     2 Find the sound    the word with its sound blanked (m_p), pick the missing sound
     3 Type it           hear it, type it
     4 Say it            read it out loud, the mic checks (no mic: listen and pick again)
     5 Quick ear         two choices, five seconds each */
const PR_KINDS = ['pick', 'find', 'type', 'say', 'quick'];
let PRAC = null;
function practiceWords(L, need, kind) {
  const st = soundsState();
  const rx = new RegExp(L.pattern), chunk = w => L.chunks.find(c => w.includes(c));
  let pool = CONTENT.items.filter(it => it.kind === 'word' && !it.en.includes(' ') && it.en === it.en.toLowerCase() && it.en.length <= 8
    && rx.test(it.en) && !SOUND_EXCEPT.has(it.en) && clipUrl('en', it.en, false) && (kind !== 'find' || chunk(it.en)));
  const recent = new Set(st.used[L.n] || []);
  pool = [...pool.filter(it => !recent.has(it.id)).sort(() => Math.random() - 0.5), ...pool.filter(it => recent.has(it.id)).sort(() => Math.random() - 0.5)];
  return pool.slice(0, need);
}
function soundAlikes(word, k = 3) {
  const cands = CONTENT.items.filter(it => it.kind === 'word' && !it.en.includes(' ') && it.en !== word && it.en === it.en.toLowerCase() && Math.abs(it.en.length - word.length) <= 1);
  const near = [...new Set(cands.filter(it => lev(it.en, word) <= 2).map(it => it.en))].sort(() => Math.random() - 0.5);
  const out = near.slice(0, k);
  while (out.length < k && cands.length) { const r = cands[Math.floor(Math.random() * cands.length)].en; if (!out.includes(r)) out.push(r); }
  return out;
}
function practiceGrade(it, ok, kind, typed) {
  const c = CARDS[it.id];
  const e = { t: Date.now(), id: it.id, g: ok ? 3 : 1, ph: 'practice:' + kind };
  if (kind === 'type') { e.w = 1; if (!ok && typed != null) e.pat = spellPatterns(it.en, typed); }
  LOG.push(e);
  if (!c) CARDS[it.id] = FSRS.rate(null, e.g); else if (today(new Date(c.last)) !== today()) CARDS[it.id] = FSRS.rate(c, e.g);
}
function startPractice(n, k) {
  stopVoice();
  const L = CONTENT.sounds.find(x => x.n === n);
  let kind = PR_KINDS[k];
  if (kind === 'say' && !canSay()) kind = 'pick';
  const words = practiceWords(L, PRACTICE_ITEMS, kind);
  PRAC = { L, k, kind, words, i: 0, right: 0, token: 0, over: false };
  document.body.classList.add('running');
  if (kind === 'say') EAR.start();
  practiceItem();
}
function practiceShell(title) {
  const A = PRAC;
  const host = h('div', { class: 'stage practice' });
  const pips = h('div', { class: 'pdots' }, A.words.map((_, i) => h('span', { class: 'pd' + (i < A.i ? ' done' : i === A.i ? ' cur' : '') })));
  mount(APP(), h('section', { class: 'screen run' },
    h('div', { class: 'runbar' }, h('span', { class: 'eyebrow' }, t('pr_n', { k: A.k + 1 }) + ' · ' + t('pr_kind_' + A.kind)), h('span', { style: 'flex:1' }),
      h('button', { class: 'ghost small', onclick: () => leavePractice() }, t('close_x'))),
    pips, title ? h('h2', null, title) : null, host));
  return host;
}
function practiceItem() {
  const A = PRAC; if (!A || A.over) return;
  if (A.i >= A.words.length) return practiceEnd();
  const it = A.words[A.i], my = ++A.token;
  const next = (ok, typed) => {
    if (A.token !== my || A.over) return;
    A.token++; if (ok) A.right++;
    practiceGrade(it, ok, A.kind, typed);
    say('en', it.en);
    setTimeout(() => { if (PRAC !== A) return; A.i++; practiceItem(); }, ok ? 700 : 1500);
  };
  const choice = (opts, correct, label = o => o) => h('div', { class: 'choices grid' }, opts.map(o => h('button', { class: 'choice', translate: 'no', lang: 'en', onclick: ev => {
    if (A.token !== my) return;
    ev.currentTarget.classList.add(o === correct ? 'right' : 'wrong');
    if (o !== correct) [...ev.currentTarget.parentNode.children].find(b => b.textContent === label(correct)).classList.add('right');
    next(o === correct);
  } }, h('b', null, label(o)))));
  const hear = () => listenRow(() => say('en', it.en), () => say('en', it.en, true));
  if (A.kind === 'pick') {
    const host = practiceShell(t('g_k_sound'));
    mount(host, hear(), choice([it.en, ...soundAlikes(it.en)].sort(() => Math.random() - 0.5), it.en));
    say('en', it.en);
  } else if (A.kind === 'find') {
    const c = A.L.chunks.find(x => it.en.includes(x)), at = it.en.indexOf(c);
    const blanked = it.en.slice(0, at) + '_'.repeat(Math.max(1, c.length)) + it.en.slice(at + c.length);
    const others = A.L.chunks.filter(x => x !== c).sort(() => Math.random() - 0.5).slice(0, 2);
    const host = practiceShell(t('pr_find_q'));
    mount(host, hear(), h('div', { class: 'word', translate: 'no', lang: 'en' }, blanked), choice([c, ...others].sort(() => Math.random() - 0.5), c));
    say('en', it.en);
  } else if (A.kind === 'type') {
    const host = practiceShell(t('g_k_spell'));
    const inp = input(v => { if (!v.trim() || A.token !== my) return; const ok = isRight(v, it.en); if (!ok) mount(host, letterDiff(it.en, v)); next(ok, v); });
    mount(host, hear(), inp, h('div', { class: 'actions' }, primary(t('check'), () => inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })))));
    inp.focus(); say('en', it.en);
  } else if (A.kind === 'say') {
    const host = practiceShell(t('pr_say_q'));
    const status = h('p', { class: 'note' }, t('g_say_now'));
    const ear = EAR.listen(it.en, (ok, heard) => { if (A.token !== my) return; status.textContent = ok ? t('so_heard_ok') : heard ? t('heard', { w: heard }) : t('g_say_miss'); next(ok); },
      () => { if (A.token !== my) return; A.kind = 'pick'; practiceItem(); });
    setTimeout(() => { if (A.token !== my || A.over) return; ear.cancel(); status.textContent = t('g_say_miss'); next(false); }, 7000);
    mount(host, wordBlock(it, true, false), status, h('div', { class: 'actions' }, btn(t('slow'), () => say('en', it.en, true), 'ghost'),
      btn(t('skip'), () => { if (A.token !== my) return; ear.cancel(); next(false); }, 'ghost')));
  } else {
    /* quick ear: two choices, five seconds */
    const host = practiceShell(t('pr_quick_q'));
    const bar = h('div', { class: 'track' }, h('i', { style: 'width:100%' }));
    mount(host, bar, hear(), choice([it.en, soundAlikes(it.en, 1)[0]].sort(() => Math.random() - 0.5), it.en));
    requestAnimationFrame(() => requestAnimationFrame(() => { bar.firstChild.style.transition = 'width 5000ms linear'; bar.firstChild.style.width = '0%'; }));
    setTimeout(() => { if (A.token !== my || A.over) return; next(false); }, 5000);
    say('en', it.en);
  }
}
function practiceEnd() {
  const A = PRAC; A.over = true; EAR.stop();
  const st = soundsState(), n = A.L.n;
  const pass = A.right >= PRACTICE_PASS;
  st.used[n] = A.words.map(w => w.id);
  if (pass && (st.prac[n] || 0) === A.k) st.prac[n] = A.k + 1;
  st.score[n] = Math.max(st.score[n] || 0, Math.round(100 * A.right / A.words.length));
  const mastered = (st.prac[n] || 0) >= PRACTICE_N;
  if (mastered && !st.done.includes(n)) { st.done.push(n); LOG.push({ t: Date.now(), kind: 'soundmastered', n }); }
  LOG.push({ t: Date.now(), kind: 'soundpractice', n, k: A.k, kind2: A.kind, right: A.right, of: A.words.length, pass });
  snapshot(); save(); syncNow(true);
  const nextL = CONTENT.sounds.find(x => x.n === n + 1);
  const passedNow = st.prac[n] || 0;
  const home = () => { PRAC = null; document.body.classList.remove('running'); TAB = 'today'; render(); };
  const host = practiceShell(null);
  mount(host,
    h('div', { class: 'pdots big' }, Array.from({ length: PRACTICE_N }, (_, i) => h('span', { class: 'pd' + (i < passedNow ? ' on' : '') }))),
    h('h2', null, pass ? t('pr_pass', { a: A.right }) : t('pr_fail', { a: A.right })),
    mastered && nextL ? h('p', { class: 'lead opened' }, t('pr_unlocked', { n, m: nextL.n })) : null,
    h('div', { class: 'actions' },
      btn(t('pr_home'), home, 'ghost'),
      !pass ? primary(t('pr_again'), () => startPractice(n, A.k))
        : mastered ? (nextL ? primary(t('pr_watch_next', { m: nextL.n }), () => { PRAC = null; startSoundLesson(nextL.n); }) : null)
        : primary(t('pr_n', { k: passedNow + 1 }), () => startPractice(n, passedNow))));
}
function leavePractice() { if (PRAC) { PRAC.over = true; PRAC = null; } EAR.stop(); stopVoice(); document.body.classList.remove('running'); TAB = 'today'; render(); }
