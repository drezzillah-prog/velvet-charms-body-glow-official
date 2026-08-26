/* Velvet Charms Body Glow — one active translation engine at a time */
(() => {
  'use strict';
  const KEY = 'velvet_language';
  const SUPPORTED = ['en','ro','fr','it','de'];
  const current = SUPPORTED.includes(localStorage.getItem(KEY)) ? localStorage.getItem(KEY) : 'en';
  const load = (src) => new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-velvet-engine="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src; s.dataset.velvetEngine = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
  const select = (lang) => {
    const target = SUPPORTED.includes(lang) ? lang : 'en';
    localStorage.setItem(KEY, target);
    document.documentElement.lang = target;
    if (target !== current) location.reload();
  };
  const removeLegacyControl = () => document.querySelectorAll('[data-language-switcher], .language-switch, .language-switcher').forEach(n => n.remove());
  const makeFiveControl = () => {
    document.querySelectorAll('.velvet-language-switcher').forEach(n => n.remove());
    removeLegacyControl();
    const host = document.querySelector('.site-header .nav') || document.querySelector('.site-header .header-inner');
    if (!host) return;
    const wrap = document.createElement('div');
    wrap.className = 'velvet-language-switcher';
    wrap.setAttribute('role','group');
    wrap.setAttribute('aria-label','Language');
    SUPPORTED.forEach(lang => {
      const b = document.createElement('button'); b.type='button'; b.dataset.lang=lang; b.textContent=lang.toUpperCase();
      b.setAttribute('aria-pressed', String(lang === current)); b.addEventListener('click', () => select(lang)); wrap.appendChild(b);
    });
    host.appendChild(wrap);
  };
  async function init() {
    if (current === 'ro') {
      await load('localization-ro.js');
      makeFiveControl();
      setTimeout(makeFiveControl, 0);
      setTimeout(makeFiveControl, 80);
      new MutationObserver(removeLegacyControl).observe(document.documentElement,{childList:true,subtree:true});
    } else {
      await load('multilingual-modern.js');
      document.addEventListener('click', (e) => {
        const b = e.target.closest('.velvet-language-switcher button[data-lang]');
        if (b?.dataset.lang === 'ro') { e.preventDefault(); e.stopImmediatePropagation(); select('ro'); }
      }, true);
    }
  }
  init().catch(err => console.error('Language engine load failed', err));
})();