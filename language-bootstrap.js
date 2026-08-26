/* Velvet Charms Body Glow — conflict-free EN/RO/FR/IT/DE bootstrap */
(() => {
  'use strict';
  const KEY = 'velvet_language';
  const SUPPORTED = new Set(['en','ro','fr','it','de']);
  let current = localStorage.getItem(KEY) || (navigator.language?.toLowerCase().startsWith('ro') ? 'ro' : 'en');
  if (!SUPPORTED.has(current)) current = 'en';
  localStorage.setItem(KEY, current);
  document.documentElement.lang = current;

  // Romanian uses the original, approved EN/RO dictionary. Other languages use
  // the modern five-language layer. Keeping the two mutation observers apart
  // prevents the translation loop that previously froze catalogue rendering.
  if (current === 'ro') {
    document.write('<script src="localization.js"><\/script>');
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

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-language-switcher], .language-switch').forEach((node) => node.remove());
  });
})();
