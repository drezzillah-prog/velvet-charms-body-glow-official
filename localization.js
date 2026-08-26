/* Velvet Charms Body Glow — localization compatibility dispatcher.
   The original approved EN/RO dictionary is preserved verbatim in localization-ro.js. */
(() => {
  'use strict';
  const KEY = 'velvet_language';
  const SUPPORTED = new Set(['en','ro','fr','it','de']);
  const page = location.pathname.split('/').pop() || 'index.html';
  const isCatalogue = page === 'catalogue.html';
  let current = localStorage.getItem(KEY) || (navigator.language?.toLowerCase().startsWith('ro') ? 'ro' : 'en');
  if (!SUPPORTED.has(current)) current = 'en';
  localStorage.setItem(KEY, current);
  document.documentElement.lang = current;

  const removeLegacySelector = () => {
    document.querySelectorAll('[data-language-switcher]:not([data-velvet-selector-guard]), .language-switch, .language-switcher').forEach((node) => node.remove());
  };

  /* Catalogue keeps the approved RO dictionary but must never let the legacy runtime
     create its old EN/RO selector or attach its whole-body translation observer. */
  if (isCatalogue && current === 'ro') {
    if (!document.querySelector('[data-velvet-selector-guard]')) {
      const guard = document.createElement('span');
      guard.hidden = true;
      guard.dataset.languageSwitcher = '';
      guard.dataset.velvetSelectorGuard = 'true';
      document.head.appendChild(guard);
    }
    if (!window.__VELVET_CATALOGUE_RO_OBSERVER_GUARD__) {
      window.__VELVET_CATALOGUE_RO_OBSERVER_GUARD__ = true;
      const NativeMutationObserver = window.MutationObserver;
      if (typeof NativeMutationObserver === 'function') {
        const GuardedMutationObserver = function (callback) {
          const source = Function.prototype.toString.call(callback || (() => {}));
          if (source.includes('translateTree') && source.includes('addedNodes')) {
            return { observe() {}, disconnect() {}, takeRecords() { return []; } };
          }
          return new NativeMutationObserver(callback);
        };
        GuardedMutationObserver.prototype = NativeMutationObserver.prototype;
        window.MutationObserver = GuardedMutationObserver;
      }
    }
  }

  if (current === 'ro' && !document.querySelector('script[data-velvet-ro-localization]')) {
    const script = document.createElement('script');
    script.src = 'localization-ro.js';
    script.dataset.velvetRoLocalization = 'true';
    document.head.appendChild(script);
    if (!isCatalogue) {
      const modern = document.createElement('script');
      modern.src = 'localization-ro-modern.js';
      modern.dataset.velvetRoModern = 'true';
      document.head.appendChild(modern);
    }
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('.velvet-language-switcher button[data-lang]');
    if (!button) return;
    const target = button.dataset.lang;
    if (!SUPPORTED.has(target)) return;
    const active = localStorage.getItem(KEY) || current;
    if (target === 'ro' || active === 'ro') {
      event.preventDefault();
      event.stopImmediatePropagation();
      localStorage.setItem(KEY, target);
      document.documentElement.lang = target;
      location.reload();
    }
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', removeLegacySelector);
  else removeLegacySelector();
  if (!isCatalogue) {
    new MutationObserver(removeLegacySelector).observe(document.documentElement, { childList:true, subtree:true });
  }
})();
