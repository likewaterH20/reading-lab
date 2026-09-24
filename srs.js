/* READING LAB v5 — spaced repetition.
   FSRS-5 (open-spaced-repetition), default weights, target retention 0.9.
   A card: { s: stability in days, d: difficulty 1..10, last, due (ms), reps, lapses }.
   Ratings: 1 Again, 2 Hard, 3 Good, 4 Easy. The app picks the rating from
   what the learner did, so there are no self-grading buttons. */
const FSRS = (() => {
  const W = [0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575,
             0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621];
  const DECAY = -0.5, FACTOR = 19 / 81, DAY = 864e5, RETAIN = 0.9;
  const clampD = d => Math.min(10, Math.max(1, d));
  const d0 = g => clampD(W[4] - Math.exp(W[5] * (g - 1)) + 1);

  function retrievability(c, now = Date.now()) {
    if (!c || !c.reps) return 0;
    const t = Math.max(0, (now - c.last) / DAY);
    return Math.pow(1 + FACTOR * t / c.s, DECAY);
  }
  function intervalDays(s) {
    return s / FACTOR * (Math.pow(RETAIN, 1 / DECAY) - 1);
  }
  function nextD(d, g) {
    const dp = d + (-W[6] * (g - 3)) * (10 - d) / 9;
    return clampD(W[7] * d0(4) + (1 - W[7]) * dp);
  }
  function rate(card, g, now = Date.now()) {
    const c = card ? { ...card } : { reps: 0, lapses: 0 };
    if (!c.reps) {
      c.s = W[g - 1];
      c.d = d0(g);
    } else {
      const days = (now - c.last) / DAY;
      if (days < 1) {
        /* same day: the short-term formula, no retrievability decay yet */
        c.s = c.s * Math.exp(W[17] * (g - 3 + W[18]));
      } else {
        const r = retrievability(c, now);
        if (g === 1) {
          c.s = Math.min(c.s, W[11] * Math.pow(c.d, -W[12]) * (Math.pow(c.s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)));
        } else {
          const hard = g === 2 ? W[15] : 1, easy = g === 4 ? W[16] : 1;
          c.s = c.s * (1 + Math.exp(W[8]) * (11 - c.d) * Math.pow(c.s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * hard * easy);
        }
      }
      c.d = nextD(c.d, g);
    }
    c.s = Math.max(0.1, c.s);
    if (g === 1) c.lapses = (c.lapses || 0) + (c.reps ? 1 : 0);
    c.reps = (c.reps || 0) + 1;
    c.last = now;
    /* a miss comes back in ten minutes; everything else waits its interval, at least a day */
    c.due = g === 1 ? now + 10 * 60e3 : now + Math.max(1, Math.round(intervalDays(c.s))) * DAY;
    return c;
  }
  /* a word someone proved in the placement check: strong, spot-checked later */
  function seed(now = Date.now(), spreadDays = 30) {
    const c = rate(null, 4, now);
    c.due = now + (3 + Math.random() * (spreadDays - 3)) * DAY;
    return c;
  }
  return { rate, seed, retrievability, intervalDays, DAY };
})();
