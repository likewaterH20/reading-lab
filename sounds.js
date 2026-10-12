/* ============================ THE SOUNDS OF ENGLISH ============================
   EnglishAnyone's 12 phonics videos, watched in order inside the app, the way
   the Arabic app plays Asmae's course: the video stays on YouTube (embedded,
   chrome hidden behind a poster and a shield), a live card follows the
   timeline, the coach pauses after a "repeat after me" block so you produce
   before moving on, and after the video the app drills real words from the
   library that carry the lesson's pattern (the proven item flow, so it feeds
   memory). Progress: P.sounds = { done: [n...], pos: { n: seconds } }. */
function soundsState() { P.sounds = P.sounds || { done: [], pos: {} }; return P.sounds; }
const soundsDone = () => P && soundsState().done.length >= CONTENT.sounds.length;
function nextSoundLesson() {
  const st = soundsState();
  return CONTENT.sounds.find(L => !st.done.includes(L.n)) || CONTENT.sounds[0];
}
function soundsCard() {
  const st = soundsState(), L = nextSoundLesson();
  const all = soundsDone();
  return h('div', { class: 'card' },
    h('div', { class: 'row between' }, h('h2', null, t('so_title')), h('span', { class: 'note' }, all ? t('so_all_done') : st.done.length ? t('so_done_n', { a: st.done.length }) : t('so_sub'))),
    h('p', { class: 'lead' }, t('so_lesson', { n: L.n }) + ' · ' + (P.lang === 'es' ? L.es : L.title)),
    h('div', { class: 'row between' },
      h('span', { class: 'note' }, Math.round(L.duration / 60) + ' min'),
      primary(t('so_watch', { n: L.n }), () => startSoundLesson(L.n))));
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
  const coachBtn = btn(t('so_coach_on'), () => { S.coach = !S.coach; coachBtn.classList.toggle('primary', S.coach); }, 'ghost' + (S.coach ? ' primary' : ''));
  const live = h('div', { class: 'card' });
  const coachEl = h('div', { class: 'coachbox', hidden: true });
  const finish = primary(t('so_finish'), () => finishSoundLesson());
  mount(APP(), h('section', { class: 'screen run' },
    h('div', { class: 'runbar' }, h('span', { class: 'eyebrow' }, t('so_lesson', { n: L.n })), h('span', { style: 'flex:1' }), h('button', { class: 'ghost small', onclick: () => leaveSoundLesson(), 'aria-label': t('close_x') }, t('close_x'))),
    h('h2', null, P.lang === 'es' ? L.es : L.title),
    box, track,
    h('div', { class: 'vctl' }, playBtn, btn('−5 s', () => seek(time() - 5), 'ghost small'), btn('+5 s', () => seek(time() + 5), 'ghost small'), loopBtn, coachBtn, timeEl),
    live, coachEl,
    h('div', { class: 'actions' }, finish)));
  S.ui = { box, fill, timeEl, playBtn, loopBtn, live, coachEl };
  renderLive(null);
  const dur = () => (S.ready && S.yt.getDuration()) || L.duration;
  const time = () => S.ready ? S.yt.getCurrentTime() : 0;
  const seek = s => { if (!S.ready) return; s = Math.max(0, Math.min(dur(), s)); S.yt.seekTo(s, true); onTime(s); };
  const toggle = () => { if (!S.ready) return; coachEl.hidden = true; S.yt.getPlayerState() === 1 ? S.yt.pauseVideo() : S.yt.playVideo(); };
  const toggleLoop = () => {
    if (S.loop) { S.loop = null; loopBtn.classList.remove('primary'); return; }
    const b = S.cur; if (!b) return;
    S.loop = { a: b.t, b: b.end }; loopBtn.classList.add('primary'); seek(b.t); S.yt.playVideo();
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
    if (cur !== S.cur) { S.cur = cur; renderLive(cur); }
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
    mount(coachEl, h('div', { class: 'eyebrow ok' }, t('so_coach')),
      h('div', { class: 'row' }, words.map(w => h('button', { class: 'linkish', translate: 'no', lang: 'en', onclick: () => say('en', w.en) }, w.en))),
      h('div', { class: 'actions' }, btn(t('so_again'), () => { seek(b.t); coachEl.hidden = true; S.yt.playVideo(); }, 'ghost'), btn(t('so_hear'), hear, 'ghost'), primary(t('so_continue'), () => { coachEl.hidden = true; S.yt.playVideo(); })));
    coachEl.hidden = false;
  }
  loadYT().then(() => {
    if (!SOUND || SOUND !== S) return;
    S.yt = new YT.Player(host, {
      videoId: L.id, host: 'https://www.youtube-nocookie.com',
      playerVars: { rel: 0, modestbranding: 1, playsinline: 1, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, origin: location.origin },
      events: {
        onReady: () => {
          S.ready = true;
          if (MUTED() || store.get('soundOff', false)) S.yt.mute();
          const resume = st.pos[L.n]; if (resume > 10 && resume < L.duration - 15) seek(resume);
        },
        onStateChange: e => {
          clearInterval(S.timer);
          if (e.data === 1) { onState(true, false); S.timer = setInterval(() => onTime(S.yt.getCurrentTime()), 250); }
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
  if (!st.done.includes(L.n)) st.done.push(L.n);
  st.pos[L.n] = 0;
  LOG.push({ t: Date.now(), kind: 'sound', n: L.n });
  snapshot(); save();
  clearInterval(S.timer); try { S.yt && S.yt.destroy(); } catch {}
  SOUND = null;
  const ids = soundLessonWords(L);
  document.body.classList.remove('running');
  if (!ids.length) return render();
  startRun([{ intro: 'soundwords', key: L.n }, ...ids.map(id => ({ id, mode: CARDS[id] ? 'review' : 'new' }))]);
}
