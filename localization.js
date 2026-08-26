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
    document.querySelectorAll('[data-language-switcher], .language-switch, .language-switcher').forEach((node) => node.remove());
  };

  /* Catalogue must keep the approved RO dictionary, but the legacy RO runtime must not
     attach its whole-body translation observer. That observer was rescanning the DOM
     while product cards were rendered and could also recreate the old EN/RO selector. */
  if (isCatalogue && current === 'ro' && !window.__VELVET_CATALOGUE_RO_OBSERVER_GUARD__) {
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

  const cleanupCatalogueSelectors = () => {
    removeLegacySelector();
    if (isCatalogue) {
      setTimeout(removeLegacySelector, 0);
      setTimeout(removeLegacySelector, 60);
      setTimeout(removeLegacySelector, 250);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cleanupCatalogueSelectors);
  else cleanupCatalogueSelectors();
  if (!isCatalogue) {
    new MutationObserver(removeLegacySelector).observe(document.documentElement, { childList:true, subtree:true });
  }
})();
