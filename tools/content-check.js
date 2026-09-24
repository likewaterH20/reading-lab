/* CONTENT CHECK. Every item has the audio the app will play, and every
   read-along text lines up word for word with its voice timings. Run in the page. */
(() => {
  const missing = [];
  for (const it of CONTENT.items) {
    if (!clipUrl('en', it.en, false)) missing.push('en ' + it.en);
    if (['word','cog'].includes(it.kind) && !clipUrl('en', it.en, true)) missing.push('slow ' + it.en);
    if (it.sentence && !VOICE.timings['en|' + it.sentence + '|norm']) missing.push('timing ' + it.sentence);
    if (it.kind === 'fact') { if (!clipUrl('en', it.q, false)) missing.push('q ' + it.q); it.a.forEach(a => { if (!clipUrl('en', a, false)) missing.push('a ' + a); }); }
  }
  for (const L of CONTENT.levels) for (const p of L.passages) if (!VOICE.timings['en|' + p.text + '|norm']) missing.push('passage ' + p.id);
  for (const d of CONTENT.daily) if (!VOICE.timings['en|' + d.text + '|norm']) missing.push('daily ' + d.id);
  let misaligned = 0;
  for (const k of Object.keys(VOICE.timings)) { const txt = k.split('|')[1];
    if (wordSpans(txt).filter(x => typeof x !== 'string').length !== VOICE.timings[k].length) misaligned++; }
  return { missing: missing.length, examples: missing.slice(0, 8), misaligned };
})();
