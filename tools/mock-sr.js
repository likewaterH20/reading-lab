/* Paste into the page console (or the Browser pane javascript tool) BEFORE a
   read-aloud test. The pane blocks the real microphone; this stands in for
   Chrome's speech recognition and "hears" whatever window.__srText holds.
   Set window.__srText to a passage's text (or a version with words dropped). */
window.__srText = window.__srText || '';
(() => {
  const Pr = webkitSpeechRecognition.prototype;
  Pr.start = function () {
    const self = this; window.__srLive = self; self.__results = [];
    setTimeout(() => {
      if (!window.__srText) return;
      const r = [{ transcript: window.__srText }]; r.isFinal = true;
      self.__results.push(r);
      self.onresult && self.onresult({ results: self.__results, resultIndex: self.__results.length - 1 });
    }, 30);
  };
  Pr.stop = function () { const self = this; if (window.__srLive === self) window.__srLive = null; setTimeout(() => self.onend && self.onend(), 10); };
  /* speak into whichever recogniser is open now (the game's EAR): __srSay('word') or __srSay('wo', false) for an interim */
  window.__srSay = (text, final = true) => {
    const self = window.__srLive; if (!self) return false;
    const rs = self.__results; const last = rs[rs.length - 1];
    /* an open interim grows into the new text only when it is a prefix of it, as Chrome does; anything else is a new utterance */
    if (last && !last.isFinal && text.startsWith(last[0].transcript)) { last[0] = { transcript: text }; last.isFinal = final; }
    else { const r = [{ transcript: text }]; r.isFinal = final; rs.push(r); }
    self.onresult && self.onresult({ results: rs, resultIndex: rs.length - 1 });
    return true;
  };
})();
window.__errs = [];
addEventListener('error', e => __errs.push(e.message + ' @' + (e.filename || '').split('/').pop() + ':' + e.lineno));
addEventListener('unhandledrejection', e => __errs.push('rej ' + String(e.reason && (e.reason.stack || e.reason.message) || e.reason)));
'mock speech recognition + error capture on';
