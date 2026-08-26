/* Body Glow catalogue static FR/IT/DE copy. Event-driven; no MutationObserver. */
(() => {
  'use strict';
  const maps={
    fr:{
      'Body Glow Collection':'Collection Body Glow',
      'Order as shown — or personalize your ritual.':'Commandez la création telle qu’elle est présentée, ou personnalisez votre rituel.',
      'Made Especially for You':'Créé spécialement pour vous',
      'Every Velvet Charms creation is individually handmade after your order is placed. Your payment reserves a place in our production schedule, and within 1–2 business days, you will receive confirmation of your production window and estimated dispatch date.':'Chaque création Velvet Charms est réalisée à la main spécialement après votre commande. Votre paiement réserve votre place dans notre planning de production ; sous 1 à 2 jours ouvrés, nous vous confirmons votre créneau de fabrication ainsi que la date d’expédition estimée.',
      'The approximate making time shown for each item begins from the confirmed production start date rather than the payment date. More intricate, fully personalized or photo-inspired creations will receive a carefully assessed individual timeframe before production begins.':'Le délai de fabrication indicatif affiché pour chaque article commence à la date de mise en production que nous vous confirmons, et non à la date du paiement. Les créations plus complexes, entièrement personnalisées ou inspirées d’une photo font l’objet d’une estimation individuelle avant le début de la fabrication.',
      'Delivery time is calculated separately and begins once your finished creation is ready to be dispatched.':'Le délai de livraison est calculé séparément et commence lorsque votre création terminée est prête à être expédiée.',
      'Velvet Stories':'Histoires Velvet','Every scent begins with a feeling':'Chaque parfum commence par une émotion'
    },
    it:{
      'Body Glow Collection':'Collezione Body Glow',
      'Order as shown — or personalize your ritual.':'Ordina la creazione così com’è oppure personalizza il tuo rituale.',
      'Made Especially for You':'Creato appositamente per te',
      'Every Velvet Charms creation is individually handmade after your order is placed. Your payment reserves a place in our production schedule, and within 1–2 business days, you will receive confirmation of your production window and estimated dispatch date.':'Ogni creazione Velvet Charms viene realizzata a mano appositamente dopo il tuo ordine. Il pagamento riserva il tuo posto nel nostro programma di produzione e, entro 1–2 giorni lavorativi, riceverai la conferma del periodo di lavorazione e della data di spedizione stimata.',
      'The approximate making time shown for each item begins from the confirmed production start date rather than the payment date. More intricate, fully personalized or photo-inspired creations will receive a carefully assessed individual timeframe before production begins.':'Il tempo di realizzazione indicativo mostrato per ogni articolo decorre dalla data di inizio produzione che ti confermiamo, non dalla data del pagamento. Per le creazioni più complesse, completamente personalizzate o ispirate a una fotografia, definiamo con cura una tempistica individuale prima di iniziare.',
      'Delivery time is calculated separately and begins once your finished creation is ready to be dispatched.':'I tempi di consegna vengono calcolati separatamente e iniziano quando la creazione finita è pronta per la spedizione.',
      'Velvet Stories':'Storie Velvet','Every scent begins with a feeling':'Ogni profumo nasce da un’emozione'
    },
    de:{
      'Body Glow Collection':'Body Glow Kollektion',
      'Order as shown — or personalize your ritual.':'Bestellen Sie die Kreation wie gezeigt oder gestalten Sie Ihr Ritual persönlich.',
      'Made Especially for You':'Speziell für Sie gefertigt',
      'Every Velvet Charms creation is individually handmade after your order is placed. Your payment reserves a place in our production schedule, and within 1–2 business days, you will receive confirmation of your production window and estimated dispatch date.':'Jede Velvet Charms Kreation wird nach Ihrer Bestellung individuell von Hand gefertigt. Mit der Zahlung reservieren Sie Ihren Platz in unserer Produktionsplanung; innerhalb von 1–2 Werktagen bestätigen wir Ihr Fertigungsfenster und den voraussichtlichen Versandtermin.',
      'The approximate making time shown for each item begins from the confirmed production start date rather than the payment date. More intricate, fully personalized or photo-inspired creations will receive a carefully assessed individual timeframe before production begins.':'Die angegebene Fertigungszeit beginnt mit dem von uns bestätigten Produktionsstart und nicht mit dem Zahlungstag. Aufwendigere, vollständig personalisierte oder nach Fotos gestaltete Kreationen erhalten vor Produktionsbeginn einen individuell geprüften Zeitrahmen.',
      'Delivery time is calculated separately and begins once your finished creation is ready to be dispatched.':'Die Lieferzeit wird separat berechnet und beginnt, sobald Ihre fertige Kreation versandbereit ist.',
      'Velvet Stories':'Velvet Geschichten','Every scent begins with a feeling':'Jeder Duft beginnt mit einem Gefühl'
    }
  };
  const originals=new WeakMap();
  const language=()=>window.VELVET_GET_LANGUAGE?.()||localStorage.getItem('velvet_language')||'en';
  const roots=()=>[document.querySelector('.catalogue-hero'),document.querySelector('.catalogue-info'),document.querySelector('.scent-stories-section')].filter(Boolean);
  function restore(){
    roots().forEach(root=>{const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(w.nextNode()){const n=w.currentNode;if(originals.has(n))n.nodeValue=originals.get(n);}});
  }
  function apply(){
    restore(); const l=language(); if(!['fr','it','de'].includes(l))return;
    roots().forEach(root=>{const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(w.nextNode()){
      const n=w.currentNode;if(!n.nodeValue.trim())continue;if(!originals.has(n))originals.set(n,n.nodeValue);
      const src=originals.get(n),clean=src.trim(),translated=maps[l]?.[clean];
      if(translated){const a=src.match(/^\s*/)?.[0]||'',b=src.match(/\s*$/)?.[0]||'';n.nodeValue=a+translated+b;}
    }});
  }
  window.addEventListener('velvet-language-changed',apply);
  document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,0));
})();
