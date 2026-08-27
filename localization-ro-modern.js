/* Romanian additions for current Body Glow copy introduced after the original EN/RO dictionary. */
(() => {
  'use strict';
  if ((localStorage.getItem('velvet_language') || 'en') !== 'ro') return;
  const map = new Map([
    ['FAQ','Întrebări frecvente'],
    ['Velvet Universe','Universul Velvet'],
    ['Art & Gifts','Art & Gifts'],
    ['Artă & Cadouri','Art & Gifts'],
    ['Ritual beauty, soft radiance, handcrafted self-care.','Frumusețe ritualică, strălucire delicată și îngrijire creată manual.'],
    ['Browse the Catalogue','Descoperă catalogul'],
    ['Created around you','Creat în jurul tău'],
    ['Why Choose Velvet Charms?','De ce să alegi Velvet Charms?'],
    ['One-of-a-kind creations shaped around your story, preferences or reference photos','Creații unicat, construite în jurul poveștii, preferințelor sau fotografiilor tale'],
    ['A collective of 14 artists bringing together skincare, candles, textiles and meaningful handmade art','Un colectiv de 14 artiști care reunește îngrijirea corporală, lumânările, arta textilă și creațiile lucrate manual cu semnificație'],
    ['Thoughtful gifts and keepsakes made especially for the person receiving them','Cadouri și amintiri atent concepute, create special pentru persoana care le primește'],
    ['Personal guidance from your first idea to the finished creation — never a mass-produced experience','Îndrumare personală de la prima idee până la creația finală — niciodată o experiență de serie'],
    ['Simple & secure','Simplu și sigur'],
    ['Payments & Ordering','Plată și comandă'],
    ['Every creation is handmade to order and carefully scheduled for production. Checkout is securely processed by','Fiecare creație este realizată manual la comandă și programată cu grijă pentru producție. Plata este procesată în siguranță prin'],
    ['using either your','folosind fie'],
    ['PayPal account or an eligible debit or credit card — no PayPal account is required.','contul PayPal, fie un card de debit sau de credit eligibil — nu este necesar un cont PayPal.'],
    ['The catalogue price remains the product price. Your production window and any preferred date are reviewed against the current production queue. Shipping is calculated separately according to destination, parcel size and weight.','Prețul afișat în catalog rămâne prețul produsului. Intervalul de producție și orice dată preferată sunt verificate în funcție de programul actual de producție. Transportul se calculează separat, în funcție de destinație, dimensiunea și greutatea coletului.'],
    ['Yes, Velvet Charms creations can be sent internationally. Because every parcel may differ in destination, size and weight, delivery is calculated separately according to the finished order. We confirm the appropriate delivery option, cost and estimated transit time based on the destination and parcel details.','Da. Creațiile Velvet Charms pot fi expediate internațional. Pentru că fiecare colet poate diferi ca destinație, dimensiune și greutate, livrarea se calculează separat în funcție de comanda finală. Îți confirmăm opțiunea de livrare potrivită, costul și timpul estimat de tranzit pe baza destinației și a caracteristicilor coletului.'],
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
