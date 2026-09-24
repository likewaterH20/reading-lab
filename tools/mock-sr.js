/* Paste into the page console (or the Browser pane javascript tool) BEFORE a
   read-aloud test. The pane blocks the real microphone; this stands in for
   Chrome's speech recognition and "hears" whatever window.__srText holds.
   Set window.__srText to a passage's text (or a version with words dropped). */
window.__srText = window.__srText || '';
(() => {
  const Pr = webkitSpeechRecognition.prototype;
  Pr.start = function () {
    const self = this;
    setTimeout(() => {
      const r = [{ transcript: window.__srText }]; r.isFinal = true;
      self.onresult && self.onresult({ results: [r], resultIndex: 0 });
    }, 30);
  };
  Pr.stop = function () { const self = this; setTimeout(() => self.onend && self.onend(), 10); };
})();
window.__errs = [];
addEventListener('error', e => __errs.push(e.message + ' @' + (e.filename || '').split('/').pop() + ':' + e.lineno));
addEventListener('unhandledrejection', e => __errs.push('rej ' + String(e.reason && (e.reason.stack || e.reason.message) || e.reason)));
'mock speech recognition + error capture on';
