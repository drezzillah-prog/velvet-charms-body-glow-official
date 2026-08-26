/* Velvet Charms Body Glow — single source of language state */
(() => {
  'use strict';
  const KEY = 'velvet_language';
  const SUPPORTED = ['en','ro','fr','it','de'];
  let current = localStorage.getItem(KEY) || (navigator.language?.toLowerCase().startsWith('ro') ? 'ro' : 'en');
  if (!SUPPORTED.includes(current)) current = 'en';
  localStorage.setItem(KEY, current);
  document.documentElement.lang = current;
  window.VELVET_GET_LANGUAGE = () => current;
  window.VELVET_SET_SITE_LANGUAGE = (lang) => {
    const target = SUPPORTED.includes(lang) ? lang : 'en';
    localStorage.setItem(KEY, target);
    if (target !== current) location.reload();
  };
})();