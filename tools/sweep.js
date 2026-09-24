/* SCREEN SWEEP. Run tools/mock-sr.js first. Opens every screen type for four
   learner profiles and reports throws, blank screens and page errors.
   It runs in the background (the pane's JS tool times out at 45 s):
   start it, then poll `({done: __done, log: __log})` every ~20 s. */
window.__log = []; window.__done = false;
(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms)), log = window.__log;
  const profiles = [{lang:'es', level:'reader', inds:['music','banking']}, {lang:'en', level:'reader', inds:['health']},
                    {lang:'es', level:'beginner', inds:['construction']}, {lang:'en', level:'beginner', inds:[]}];
  for (const pf of profiles) {
    store.wipe(); CARDS = {}; LOG = []; DAYS = {}; SEEN = {}; MIC.denied = false; MIC.srOff = false;
    P = { ...pf, when: 'when_night', created: Date.now() - 20 * 864e5, grade: 1, passed: {} };
    for (let d = 10; d >= 1; d--) { const t0 = Date.now() - d * 864e5;
      LOG.push({ t: t0, id: 'w:balance', g: 1, w: 1, pat: ['double'] }, { t: t0, kind: 'read', pid: 'g1-0', grade: 1, mode: 'oral', speed: 50, target: 60, c: 2, acc: 85, missed: ['morning'] });
      DAYS[today(new Date(t0))] = { n: 3, first: 1, graded: 3, mel: [], cov: 0.1, owned: 5 + d }; }
    P.practice = { pid: 'g1-0', grade: 1, target: 60, best: 50, missed: [] };
    const tag = pf.lang + '/' + pf.level; let n = 0;
    const tryE = async (label, q) => { try { RUN = null; startRun(q); n++; await sleep(120); stopVoice();
      if (!document.querySelector('.stage')) log.push('NO STAGE ' + tag + ' ' + label); } catch (e) { log.push('THROW ' + tag + ' ' + label + ': ' + e.message); } };
    try { buildSession(); n++; } catch (e) { log.push('THROW ' + tag + ' build: ' + e.message); }
    for (let g = 1; g <= 13; g++) { try { RUN = null; P.grade = 13; startLevel(g); n++; await sleep(30); stopVoice(); } catch (e) { log.push('THROW ' + tag + ' level ' + g + ': ' + e.message); } }
    P.grade = 1;
    for (const k of ['word','cog','trap','fact','sent']) for (const it of CONTENT.items.filter(i => i.kind === k).slice(0, 2)) {
      delete CARDS[it.id]; await tryE(k + ' new', [{ id: it.id, mode: 'new' }]);
      for (const reps of [1, 2, 3]) { CARDS[it.id] = { s: 3, d: 5, reps, lapses: reps === 3 ? 1 : 0, last: Date.now() - 864e5, due: Date.now() - 1 };
        await tryE(k + ' r' + reps, [{ id: it.id, mode: 'review' }]); } }
    for (const intro of [{intro:'rule', key:'cion'}, {intro:'trap', key:CONTENT.traps[0]}, {intro:'melody'}, {intro:'sound', key:'th'}, {intro:'fact', key:CONTENT.facts[5]}])
      await tryE('intro ' + intro.intro, [intro]);
    for (let g = 1; g <= 13; g += 3) await tryE('read ' + g, [{ read: g }]);
    await tryE('practice', [{ practice: true }]); await tryE('dailyread', [{ dread: true }]);
    RUN = null;
    try { startGame('mix'); await sleep(60); document.querySelector('[data-primary]').click(); await sleep(200); stopVoice(); GAME.t0 -= 61000; await sleep(300); n++;
      if (!document.querySelector('.hero')) log.push('NO END ' + tag + ' game'); } catch (e) { log.push('THROW ' + tag + ' game: ' + e.message); }
    GAME = null; stopListen(); P.weekSeen = null;
    for (const tab of ['today','words','progress']) { try { TAB = tab; RUN = null; render(); n++; } catch (e) { log.push('THROW ' + tag + ' tab ' + tab + ': ' + e.message); } }
    const bad = document.body.textContent.includes('[object') || document.body.textContent.includes('undefined');
    log.push(tag + ' screens ' + n + (bad ? ' | STRAY TEXT ([object / undefined) on page' : ''));
  }
  log.push('errors ' + __errs.length + (__errs.length ? ': ' + __errs.slice(0, 6).join(' | ') : ''));
  window.__done = true;
})();
'sweep started';
