/* READING LAB v5 — engine: DOM helper, storage, voice, microphone, melody, diff.
   No innerHTML anywhere: every node is built with h(). */

/* ============================ DOM ============================ */
const $ = s => document.querySelector(s);
function add(el, kids) {
  for (const k of kids.flat(9)) {
    if (k == null || k === false || k === '') continue;
    el.appendChild(k instanceof Node ? k : document.createTextNode(String(k)));
  }
}
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k === 'style') el.style.cssText = v;
    else if (k.startsWith('on')) el[k.toLowerCase()] = v;
    else if (k === 'value' || k === 'disabled') el[k] = v;
    else el.setAttribute(k, v);
  }
  add(el, kids);
  return el;
}
const SVGNS = 'http://www.w3.org/2000/svg';
function s(tag, attrs, ...kids) {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs || {})) if (v != null) el.setAttribute(k, v);
  add(el, kids);
  return el;
}
function mount(el, ...kids) { el.replaceChildren(); add(el, kids); return el; }

/* ============================ STORAGE ============================ */
const store = {
  get(k, def) {
    try { const v = localStorage.getItem('rl5.' + k); return v == null ? def : JSON.parse(v); }
    catch { return def; }
  },
  set(k, v) { try { localStorage.setItem('rl5.' + k, JSON.stringify(v)); } catch {} },
  wipe() {
    try { Object.keys(localStorage).filter(k => k.startsWith('rl5.')).forEach(k => localStorage.removeItem(k)); } catch {}
  }
};

/* ============================ CONTENT ============================ */
const ITEMS = Object.fromEntries(CONTENT.items.map(i => [i.id, i]));
const UI = CONTENT.ui;
function t(id, vars) {
  const row = UI[id];
  if (!row) return id;
  let out = row[(typeof P !== 'undefined' && P.lang) || 'en'] || row.en;
  if (vars) for (const [k, v] of Object.entries(vars)) out = out.split('{' + k + '}').join(v);
  return out;
}
const today = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

/* ============================ VOICE ============================
   Clips are pre-rendered neural voices (Andrew for English, Dalia for Spanish).
   ?mute=1 keeps this browser silent for testing; ?unmute=1 undoes it. */
const Q = new URLSearchParams(location.search);
try {
  if (Q.has('mute')) localStorage.setItem('rl.mute', '1');
  if (Q.has('unmute')) localStorage.removeItem('rl.mute');
} catch {}
const MUTED = () => { try { return localStorage.getItem('rl.mute') === '1'; } catch { return false; } };

const VOICE = { clips: {}, timings: {}, ready: false, el: null, token: 0, last: null };
const voiceReady = fetch('audio/manifest.json').then(r => r.json()).then(m => {
  VOICE.clips = m.clips || {}; VOICE.timings = m.timings || {}; VOICE.ready = true;
}).catch(() => {});

function clipUrl(lang, text, slow) {
  const rel = VOICE.clips[`${lang}|${String(text).trim()}|${slow ? 'slow' : 'norm'}`];
  return rel ? 'audio/' + rel : null;
}
function player() {
  if (!VOICE.el) { VOICE.el = new Audio(); VOICE.el.preload = 'auto'; }
  VOICE.el.muted = MUTED() || store.get('soundOff', false);
  return VOICE.el;
}
function stopVoice() {
  VOICE.token++;
  if (VOICE.el) { VOICE.el.pause(); VOICE.el.onended = null; }
  try { speechSynthesis.cancel(); } catch {}
}
/** Play a clip. Resolves when it ends (or at once if it cannot play). */
function say(lang, text, slow = false, onTime) {
  stopVoice();
  const my = VOICE.token;
  const url = clipUrl(lang, text, slow);
  VOICE.last = { lang, text, slow };
  if (!url) return fallbackSay(lang, text, slow);
  const a = player();
  a.src = url;
  return new Promise(res => {
    let raf = 0;
    const done = () => { cancelAnimationFrame(raf); if (onTime) onTime(-1); res(); };
    a.onended = done; a.onerror = done;
    a.play().then(() => {
      /* the RAF loop never checks a.paused: a muted or slow-to-start clip still
         reports time, and gating on paused froze the highlight before */
      const tick = () => { if (my !== VOICE.token) return; if (onTime) onTime(a.currentTime); raf = requestAnimationFrame(tick); };
      tick();
    }).catch(() => {
      /* refused for no user gesture is not a bad clip; just move on */
      setTimeout(done, 200);
    });
  });
}
function fallbackSay(lang, text, slow) {
  if (MUTED() || store.get('soundOff', false)) return new Promise(r => setTimeout(r, 400));
  return new Promise(res => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang === 'es' ? 'es-MX' : 'en-US';
      u.rate = slow ? 0.6 : 1;
      u.onend = res; u.onerror = res;
      speechSynthesis.speak(u);
    } catch { res(); }
  });
}
const wait = ms => new Promise(r => setTimeout(r, ms));
/** Play a sentence and light each word as it is spoken. */
function sayAlong(text, host, slow = false) {
  const words = [...host.querySelectorAll('.w')];
  const tm = VOICE.timings[`en|${text}|norm`];
  const rate = slow ? 1 / 0.6 : 1;
  return say('en', text, slow, tsec => {
    if (!tm || tsec < 0) { words.forEach(w => w.classList.remove('lit')); return; }
    const tt = tsec / rate;
    let idx = -1;
    for (let i = 0; i < tm.length; i++) if (tt >= tm[i][1] - 0.02) idx = i;
    words.forEach((w, i) => w.classList.toggle('lit', i === idx));
  });
}
/** Split a sentence into word spans that line up with the voice timings. */
function wordSpans(text) {
  const tm = VOICE.timings[`en|${text}|norm`];
  const toks = text.split(/\s+/);
  /* the space sits outside the span so an underline or highlight stops at the word */
  if (!tm) return toks.flatMap(w => [h('span', { class: 'w' }, w), ' ']);
  /* the voice can report "Third Street" as one boundary: group tokens to match */
  const out = []; let ti = 0;
  for (const b of tm) {
    const want = b[0].replace(/[^\w']/g, '').toLowerCase();
    let got = '', grp = [];
    while (ti < toks.length && got.length < want.length) {
      grp.push(toks[ti]); got += toks[ti].replace(/[^\w']/g, '').toLowerCase(); ti++;
    }
    out.push(h('span', { class: 'w' }, grp.join(' ')), ' ');
  }
  if (ti < toks.length) out.push(h('span', { class: 'w' }, toks.slice(ti).join(' ')));
  return out;
}

/* ============================ MICROPHONE ============================ */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let AC = null;
const audioCtx = () => (AC = AC || new (window.AudioContext || window.webkitAudioContext)());
const MIC = { stream: null, denied: false };
const micPossible = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);

async function getMic() {
  if (MIC.stream) return MIC.stream;
  MIC.stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: true }
  });
  return MIC.stream;
}
/** Record until the speaker goes quiet (or maxMs). Also runs speech
    recognition alongside when the browser has it. Returns
    { pcm, rate, url, heard: [alternatives] }. onLevel gets 0..1 for a meter. */
async function recordTake({ maxMs = 8000, onLevel, stopper } = {}) {
  const stream = await getMic();
  const ctx = audioCtx();
  if (ctx.state === 'suspended') await ctx.resume();
  const src = ctx.createMediaStreamSource(stream);
  const an = ctx.createAnalyser(); an.fftSize = 1024; src.connect(an);
  const rec = new MediaRecorder(stream);
  const chunks = [];
  rec.ondataavailable = e => e.data.size && chunks.push(e.data);

  let heard = [];
  let recog = null;
  if (SR) {
    try {
      recog = new SR(); recog.lang = 'en-US'; recog.maxAlternatives = 5; recog.interimResults = false;
      recog.onresult = e => {
        const r = e.results[0]; heard = [];
        for (let i = 0; i < r.length; i++) heard.push(r[i].transcript);
      };
      recog.onerror = () => {};
      recog.start();
    } catch { recog = null; }
  }
  rec.start();
  const t0 = performance.now();
  const buf = new Float32Array(an.fftSize);
  let spoke = false, quietSince = 0;
  await new Promise(res => {
    const done = () => { clearInterval(iv); res(); };
    if (stopper) stopper.stop = done;
    const iv = setInterval(() => {
      an.getFloatTimeDomainData(buf);
      let e = 0; for (const x of buf) e += x * x;
      const rms = Math.sqrt(e / buf.length);
      if (onLevel) onLevel(Math.min(1, rms * 8));
      const now = performance.now();
      if (rms > 0.02) { spoke = true; quietSince = 0; }
      else if (spoke) { quietSince = quietSince || now; if (now - quietSince > 1000) done(); }
      if (now - t0 > maxMs) done();
    }, 50);
  });
  const stopped = new Promise(r => rec.onstop = r);
  rec.stop();
  if (recog) try { recog.stop(); } catch {}
  await stopped;
  await wait(350); /* recognition result lands a beat after stop */
  src.disconnect();
  const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
  const ab = await blob.arrayBuffer();
  const audio = await ctx.decodeAudioData(ab);
  return { pcm: audio.getChannelData(0), rate: audio.sampleRate, url: URL.createObjectURL(blob), heard };
}
async function decodeUrl(url) {
  const ab = await (await fetch(url)).arrayBuffer();
  const audio = await audioCtx().decodeAudioData(ab);
  return { pcm: audio.getChannelData(0), rate: audio.sampleRate };
}

/* ============================ MELODY ============================
   Pitch per 10 ms frame (YIN), in semitones around the speaker's own median,
   so a deep voice and a high voice can match the same shape. Compared with
   dynamic time warping, so talking slower is not punished as wrong melody. */
function downsample(pcm, rate, to = 16000) {
  if (rate === to) return pcm;
  const k = rate / to, n = Math.floor(pcm.length / k), out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const a = Math.floor(i * k), b = Math.min(pcm.length, Math.floor((i + 1) * k));
    let sum = 0; for (let j = a; j < b; j++) sum += pcm[j];
    out[i] = sum / Math.max(1, b - a);
  }
  return out;
}
function pitchTrack(pcm, rate) {
  const x = downsample(pcm, rate), sr = 16000, W = 512, HOP = 160;
  const tMin = Math.floor(sr / 400), tMax = Math.floor(sr / 70);
  const frames = [], rmsAll = [];
  for (let st = 0; st + W + tMax < x.length; st += HOP) {
    let e = 0; for (let i = 0; i < W; i++) e += x[st + i] * x[st + i];
    rmsAll.push(Math.sqrt(e / W));
  }
  const loud = Math.max(...rmsAll, 1e-6);
  const d = new Float32Array(tMax + 1);
  let fi = 0;
  for (let st = 0; st + W + tMax < x.length; st += HOP, fi++) {
    if (rmsAll[fi] < loud * 0.12) { frames.push(null); continue; }
    for (let tau = 1; tau <= tMax; tau++) {
      let sum = 0;
      for (let i = 0; i < W; i++) { const q = x[st + i] - x[st + i + tau]; sum += q * q; }
      d[tau] = sum;
    }
    let run = 0, best = -1;
    for (let tau = 1; tau <= tMax; tau++) {
      run += d[tau];
      const c = d[tau] * tau / (run || 1);
      if (tau >= tMin && c < 0.15) {
        best = tau;
        while (best + 1 <= tMax) {
          let r2 = run + d[best + 1];
          const c2 = d[best + 1] * (best + 1) / r2;
          if (c2 < c) { best++; run = r2; } else break;
        }
        break;
      }
    }
    frames.push(best > 0 ? sr / best : null);
  }
  return frames;
}
function contour(frames, n = 60) {
  let a = frames.findIndex(f => f), b = frames.length - 1 - [...frames].reverse().findIndex(f => f);
  if (a < 0) return null;
  const seg = frames.slice(a, b + 1);
  const voiced = seg.filter(Boolean).sort((p, q) => p - q);
  if (voiced.length < 8) return null;
  const med = voiced[voiced.length >> 1];
  let st = seg.map(f => f ? 12 * Math.log2(f / med) : null);
  /* octave slips from the tracker: anything more than 8 semitones out is noise */
  st = st.map(v => v != null && Math.abs(v) > 8 ? null : v);
  /* fill the gaps between voiced stretches in a straight line */
  let last = st.findIndex(v => v != null);
  for (let i = 0; i < last; i++) st[i] = st[last];
  for (let i = last + 1; i < st.length; i++) {
    if (st[i] == null) {
      let j = i; while (j < st.length && st[j] == null) j++;
      const v0 = st[i - 1], v1 = j < st.length ? st[j] : v0;
      for (let k = i; k < j; k++) st[k] = v0 + (v1 - v0) * (k - i + 1) / (j - i + 1);
      i = j - 1;
    }
  }
  /* median of 5, then resample to n points */
  const sm = st.map((_, i) => { const w = st.slice(Math.max(0, i - 2), i + 3).sort((p, q) => p - q); return w[w.length >> 1]; });
  const out = [];
  for (let i = 0; i < n; i++) out.push(sm[Math.min(sm.length - 1, Math.round(i * (sm.length - 1) / (n - 1)))]);
  const mean = out.reduce((p, q) => p + q, 0) / n;
  return { pts: out.map(v => v - mean), secs: seg.length * 0.01 };
}
function melodyScore(m, u) {
  if (!m || !u) return null;
  const A = m.pts, B = u.pts, n = A.length, band = 12, INF = 1e9;
  const D = Array.from({ length: n + 1 }, () => new Float64Array(n + 1).fill(INF));
  D[0][0] = 0;
  for (let i = 1; i <= n; i++)
    for (let j = Math.max(1, i - band); j <= Math.min(n, i + band); j++)
      D[i][j] = Math.abs(A[i - 1] - B[j - 1]) + Math.min(D[i - 1][j], D[i][j - 1], D[i - 1][j - 1]);
  /* walk back the path and correlate the aligned pairs */
  const pa = [], pb = []; let i = n, j = n;
  while (i > 0 && j > 0) {
    pa.push(A[i - 1]); pb.push(B[j - 1]);
    const c = Math.min(D[i - 1][j - 1], D[i - 1][j], D[i][j - 1]);
    if (c === D[i - 1][j - 1]) { i--; j--; } else if (c === D[i - 1][j]) i--; else j--;
  }
  const mean = v => v.reduce((p, q) => p + q, 0) / v.length;
  const ma = mean(pa), mb = mean(pb);
  let sab = 0, saa = 0, sbb = 0;
  for (let k = 0; k < pa.length; k++) { const x = pa[k] - ma, y = pb[k] - mb; sab += x * y; saa += x * x; sbb += y * y; }
  const corr = sab / Math.sqrt(saa * sbb || 1);
  const sdA = Math.sqrt(saa / pa.length), sdB = Math.sqrt(sbb / pb.length);
  const range = Math.min(sdA, sdB) / Math.max(sdA, sdB, 1e-6);
  const melody = Math.round(100 * Math.max(0, 0.75 * Math.max(0, corr) + 0.25 * range));
  const ratio = u.secs / m.secs;
  const pace = Math.round(100 * Math.exp(-Math.abs(Math.log(ratio)) * 1.5));
  return { melody, pace, ratio };
}
/** Melody of a reference clip, cached. */
const MODEL_CONTOUR = {};
async function modelContour(text) {
  if (MODEL_CONTOUR[text]) return MODEL_CONTOUR[text];
  const url = clipUrl('en', text, false);
  if (!url) return null;
  const { pcm, rate } = await decodeUrl(url);
  return (MODEL_CONTOUR[text] = contour(pitchTrack(pcm, rate)));
}
function contourChart(m, u) {
  const Wd = 600, Ht = 150, pad = 12;
  const all = [...(m ? m.pts : []), ...(u ? u.pts : [])];
  const lo = Math.min(-4, ...all), hi = Math.max(4, ...all);
  const path = c => c.pts.map((v, i) =>
    (i ? 'L' : 'M') + (pad + i * (Wd - 2 * pad) / (c.pts.length - 1)).toFixed(1) + ' ' +
    (Ht - pad - (v - lo) / (hi - lo) * (Ht - 2 * pad)).toFixed(1)).join(' ');
  return s('svg', { viewBox: `0 0 ${Wd} ${Ht}`, class: 'contour', role: 'img' },
    m && s('path', { d: path(m), class: 'c-model' }),
    u && s('path', { d: path(u), class: 'c-user' }));
}

/* ============================ READING ALOUD ============================
   Continuous recognition while someone reads a passage. Each heard word is
   matched in order against the passage (a short lookahead lets a skipped
   word stay missed without derailing the rest), and lit as it is heard.
   Chrome ends a recognition session after a pause, so it restarts itself and
   keeps what was already heard. */
function liveRead(para, onError) {
  const spans = [...para.querySelectorAll('.w')];
  const want = spans.map(sp => norm(sp.textContent).split(' '));
  const hit = new Array(spans.length).fill(false);
  let kept = '', live = '', stopped = false, failed = false;
  const align = () => {
    hit.fill(false);
    let p = 0;
    for (const w of norm(kept + ' ' + live).split(' ').filter(Boolean)) {
      for (let k = p; k < Math.min(p + 4, spans.length); k++) {
        const tw = want[k][want[k].length - 1];
        if (tw === w || want[k].includes(w) || (tw.length > 3 && lev(tw, w) <= 1)) { hit[k] = true; p = k + 1; break; }
      }
    }
    spans.forEach((sp, i) => { sp.classList.toggle('said', hit[i]); sp.classList.toggle('here', i === p); });
  };
  const recog = new SR();
  recog.lang = 'en-US'; recog.continuous = true; recog.interimResults = true; recog.maxAlternatives = 1;
  recog.onresult = e => {
    let fin = '', inter = '';
    for (let i = 0; i < e.results.length; i++) (e.results[i].isFinal ? (fin += e.results[i][0].transcript + ' ') : (inter += e.results[i][0].transcript + ' '));
    live = fin + inter; recog._fin = fin; align();
  };
  recog.onerror = e => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed' || e.error === 'audio-capture') { failed = true; stopped = true; if (onError) onError(e.error); } };
  recog.onend = () => {
    kept += ' ' + (recog._fin || ''); live = ''; recog._fin = '';
    if (!stopped) try { recog.start(); } catch {}
  };
  try { recog.start(); } catch { failed = true; if (onError) onError('start'); }
  return {
    stop() {
      stopped = true; try { recog.stop(); } catch {}
      /* only words before the last one heard count as missed; the rest were not reached */
      const reached = hit.lastIndexOf(true) + 1;
      spans.forEach((sp, i) => { sp.classList.remove('here'); sp.classList.toggle('miss', i < reached && !hit[i]); });
      return { right: hit.filter(Boolean).length, total: reached, failed };
    }
  };
}

/* ============================ TEXT COMPARISON ============================ */
const norm = x => String(x).toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
function lev(a, b) {
  const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
/** Which positions of `target` the learner got, by longest common subsequence. */
function lcsMarks(target, typed) {
  const m = target.length, n = typed.length;
  const L = Array.from({ length: m + 1 }, () => new Int16Array(n + 1));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--)
    L[i][j] = target[i] === typed[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const got = new Array(m).fill(false); let i = 0, j = 0;
  while (i < m && j < n) {
    if (target[i] === typed[j]) { got[i] = true; i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++;
  }
  return got;
}
function letterDiff(target, typed) {
  const tg = target.toLowerCase(), ty = norm(typed);
  const got = lcsMarks([...tg], [...ty]);
  return h('div', { class: 'diff' }, [...target].map((ch, i) => h('span', { class: got[i] || ch === ' ' ? 'ok' : 'miss' }, ch)));
}
function wordDiff(target, typed) {
  const tw = target.split(/\s+/), nw = tw.map(norm), yw = norm(typed).split(' ');
  const got = lcsMarks(nw, yw);
  return { el: h('div', { class: 'diff sent' }, tw.flatMap((w, i) => [h('span', { class: got[i] ? 'ok' : 'miss' }, w), ' '])),
           share: got.filter(Boolean).length / tw.length };
}
/** Did recognition hear the target? Returns per-word hits against the best alternative. */
function heardMatch(target, alts) {
  const tw = norm(target).split(' ');
  let best = { hits: tw.map(() => false), share: 0, text: alts[0] || '' };
  for (const alt of alts) {
    const aw = norm(alt).split(' ');
    const hits = tw.map(w => aw.some(a => a === w || (w.length > 3 && lev(a, w) <= 1)));
    const share = hits.filter(Boolean).length / tw.length;
    if (share > best.share) best = { hits, share, text: alt };
  }
  return best;
}
