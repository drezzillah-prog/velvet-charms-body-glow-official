/* Velvet Charms Body Glow — localization compatibility dispatcher.
   The original approved EN/RO dictionary is preserved verbatim in localization-ro.js. */
(() => {
  'use strict';
  const KEY = 'velvet_language';
  const SUPPORTED = new Set(['en','ro','fr','it','de']);
  let current = localStorage.getItem(KEY) || (navigator.language?.toLowerCase().startsWith('ro') ? 'ro' : 'en');
  if (!SUPPORTED.has(current)) current = 'en';
  localStorage.setItem(KEY, current);
  document.documentElement.lang = current;

  if (current === 'ro' && !document.querySelector('script[data-velvet-ro-localization]')) {
    const script = document.createElement('script');
    script.src = 'localization-ro.js';
    script.dataset.velvetRoLocalization = 'true';
    document.head.appendChild(script);
  }

  const removeLegacySelector = () => {
    document.querySelectorAll('[data-language-switcher], .language-switch, .language-switcher').forEach((node) => node.remove());
  };

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
  new MutationObserver(removeLegacySelector).observe(document.documentElement, { childList:true, subtree:true });
})();
