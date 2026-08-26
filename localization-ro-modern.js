/* Romanian additions for current Body Glow copy introduced after the original EN/RO dictionary. */
(() => {
  'use strict';
  if ((localStorage.getItem('velvet_language') || 'en') !== 'ro') return;
  const map = new Map([
    ['FAQ','Întrebări frecvente'],
    ['Velvet Universe','Universul Velvet'],
    ['Art & Gifts','Artă & Cadouri'],
    ['The catalogue price remains the product price. Your production window and any preferred date are reviewed against the current production queue. Shipping is calculated separately according to destination, parcel size and weight.','Prețul afișat în catalog rămâne prețul produsului. Intervalul de producție și orice dată preferată sunt verificate în funcție de programul actual de producție. Transportul se calculează separat, în funcție de destinație, dimensiunea și greutatea coletului.'],
    ['The story continues','Povestea continuă'],
    ['Step inside the Velvet Universe','Pășește în Universul Velvet'],
    ['Discover the ritual details already woven into Body Glow — scent stories, reusable vessels, refills, hidden messages, collectible charms, the Velvet Passport and build-your-own Velvet Boxes.','Descoperă detaliile ritualului deja integrate în Body Glow — povești olfactive, recipiente reutilizabile, rezerve, mesaje ascunse, charmuri de colecție, Pașaportul Velvet și cutii Velvet pe care ți le poți compune singur.'],
    ['Explore the Velvet Universe','Explorează Universul Velvet']
  ]);
  const translate = (root) => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const key = node.nodeValue.trim();
      if (!map.has(key)) continue;
      const leading = node.nodeValue.match(/^\s*/)?.[0] || '';
      const trailing = node.nodeValue.match(/\s*$/)?.[0] || '';
      node.nodeValue = leading + map.get(key) + trailing;
    }
  };
  const start = () => {
    translate(document.body);
    new MutationObserver((mutations) => mutations.forEach((m) => m.addedNodes.forEach((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) translate(n);
    }))).observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
