/* Velvet Charms Body Glow — curated EN/RO/FR/IT/DE localization layer */
(() => {
  'use strict';

  const STORAGE_KEY = 'velvet_language';
  const SUPPORTED = ['en', 'ro', 'fr', 'it', 'de'];
  const LABELS = { en: 'EN', ro: 'RO', fr: 'FR', it: 'IT', de: 'DE' };

  const dictionaries = {
    fr: {
      'Home':'Accueil','Catalogue':'Catalogue','About':'À propos','FAQ':'FAQ','Contact':'Contact','Velvet Universe':'Univers Velvet','Visit Art & Gifts':'Découvrir Art & Gifts','Art & Gifts':'Art & Gifts',
      'Browse the Catalogue':'Découvrir le catalogue','Ritual beauty, soft radiance, handcrafted self-care.':'Beauté rituelle, éclat délicat et soins artisanaux pensés comme un moment pour soi.','Created around you':'Pensé autour de vous','Why Choose Velvet Charms?':'Pourquoi choisir Velvet Charms ?',
      'One-of-a-kind creations shaped around your story, preferences or reference photos':'Des créations uniques inspirées de votre histoire, de vos préférences ou de vos photos de référence','A collective of 14 artists bringing together skincare, candles, textiles and meaningful handmade art':'Un collectif de 14 artistes réunissant soins, bougies, textile et créations artisanales porteuses de sens','Thoughtful gifts and keepsakes made especially for the person receiving them':'Des cadeaux et souvenirs conçus avec attention, spécialement pour la personne qui les recevra','Personal guidance from your first idea to the finished creation — never a mass-produced experience':'Un accompagnement personnel, de la première idée à la création finale — jamais une expérience standardisée',
      'Simple & secure':'Simple et sécurisé','Payments & Ordering':'Paiement & commande','Every creation is handmade to order and carefully scheduled for production. Checkout is securely processed by':'Chaque création est réalisée à la main sur commande et intégrée avec soin à notre planning de production. Le paiement est traité en toute sécurité par','using either your':'avec votre','PayPal account or an eligible debit or credit card — no PayPal account is required.':'compte PayPal ou une carte de débit/crédit éligible — aucun compte PayPal n’est nécessaire.',
      'Fourteen artists, one creative home':'Quatorze artistes, un même univers créatif','About Velvet Charms':'À propos de Velvet Charms','Meet the collective':'Rencontrer le collectif','Fourteen Makers, Many Creative Worlds':'Quatorze créateurs, de nombreux univers artistiques','Made with purpose':'Créé avec intention','Created around your story':'Créé autour de votre histoire','Beyond the catalogue':'Au-delà du catalogue','Have Something Different in Mind?':'Vous imaginez autre chose ?','Share your idea':'Partagez votre idée','Ordering with care':'Une commande accompagnée avec soin',
      'A little clarity before we begin':'Quelques repères avant de commencer','Frequently Asked Questions':'Questions fréquentes','Everything you need to know about made-to-order creations, personalization, production and delivery.':'Tout ce qu’il faut savoir sur les créations réalisées à la commande, la personnalisation, la production et la livraison.','Is every Velvet Charms piece made to order?':'Chaque création Velvet Charms est-elle réalisée à la commande ?','When does my production time begin?':'Quand commence mon délai de fabrication ?','What if I need my order for a special date?':'Et si j’ai besoin de ma commande pour une date particulière ?','Can my chosen piece be personalized?':'Puis-je personnaliser la création choisie ?','Is the catalogue price the price I pay?':'Le prix du catalogue est-il bien le prix du produit ?',
      'Refill Collection':'Collection Refill','Natural Face Cream Refill (50ml)':'Recharge de crème visage naturelle (50 ml)','Body Butter Refill (100ml)':'Recharge de beurre corporel (100 ml)','Hand & Foot Cream Refill (50ml)':'Recharge de crème mains & pieds (50 ml)','Candle Refill Insert — Small (150ml)':'Recharge de bougie — petite (150 ml)','Candle Refill Insert — Medium (250ml)':'Recharge de bougie — moyenne (250 ml)','Candle Refill Insert — Large (400ml)':'Recharge de bougie — grande (400 ml)','Vessel preference':'Choix du contenant','Hidden message':'Message caché','Ritual card':'Carte rituel','Collectible charm':'Charm à collectionner','Velvet Passport':'Velvet Passport','As displayed':'Comme présenté','Reusable ceramic vessel':'Contenant réutilisable en céramique','Reusable glass vessel':'Contenant réutilisable en verre','Surprise Second Life vessel':'Contenant surprise Second Life','Morning Ritual':'Rituel du matin','Night Ritual':'Rituel du soir','Spa Ritual':'Rituel spa','Self-Love Ritual':'Rituel pour soi','Travel Ritual':'Rituel de voyage','Surprise me':'Surprenez-moi','Moon':'Lune','Star':'Étoile','Butterfly':'Papillon','Key':'Clé','Flower':'Fleur','Heart':'Cœur','Include my first Velvet Passport':'Ajouter mon premier Velvet Passport','Add stamps to my existing Passport':'Ajouter les tampons à mon Passport existant','Velvet Stories':'Histoires Velvet','Every scent begins with a feeling':'Chaque parfum commence par une émotion',
      'Add to cart':'Ajouter au panier','Request customization':'Personnaliser','Cart':'Panier','Your cart':'Votre panier','Subtotal':'Sous-total','Total':'Total','Remove':'Retirer','Edit customization':'Modifier la personnalisation','Your cart is empty.':'Votre panier est vide.','Checkout securely with PayPal':'Payer en toute sécurité avec PayPal','Do you need it by a specific date?':'Avez-vous besoin de votre commande pour une date précise ?','(optional)':'(facultatif)','Shipping is handled separately according to destination, parcel size and weight.':'Les frais de livraison sont calculés séparément selon la destination, les dimensions et le poids du colis.','Customize product':'Personnaliser le produit','Special instructions':'Indications particulières','Reference photos (up to 5)':'Photos de référence (5 maximum)','Save customization':'Enregistrer la personnalisation','Cancel':'Annuler','Name':'Nom','Message':'Message','Send':'Envoyer','Sending…':'Envoi…','Message sent. Thank you!':'Votre message a bien été envoyé. Merci !'
    },
    it: {
      'Home':'Home','Catalogue':'Catalogo','About':'Chi siamo','FAQ':'FAQ','Contact':'Contatti','Velvet Universe':'Universo Velvet','Visit Art & Gifts':'Scopri Art & Gifts','Art & Gifts':'Art & Gifts',
      'Browse the Catalogue':'Scopri il catalogo','Ritual beauty, soft radiance, handcrafted self-care.':'Bellezza rituale, luminosità delicata e cura artigianale trasformata in un momento tutto per te.','Created around you':'Creato intorno a te','Why Choose Velvet Charms?':'Perché scegliere Velvet Charms?',
      'One-of-a-kind creations shaped around your story, preferences or reference photos':'Creazioni uniche costruite intorno alla tua storia, alle tue preferenze o alle tue fotografie di riferimento','A collective of 14 artists bringing together skincare, candles, textiles and meaningful handmade art':'Un collettivo di 14 artisti che unisce skincare, candele, tessili e creazioni artigianali ricche di significato','Thoughtful gifts and keepsakes made especially for the person receiving them':'Regali e ricordi pensati con cura, creati appositamente per chi li riceverà','Personal guidance from your first idea to the finished creation — never a mass-produced experience':'Un accompagnamento personale, dalla prima idea alla creazione finita — mai un’esperienza standardizzata',
      'Simple & secure':'Semplice e sicuro','Payments & Ordering':'Pagamenti e ordini','Every creation is handmade to order and carefully scheduled for production. Checkout is securely processed by':'Ogni creazione è realizzata a mano su ordinazione e inserita con cura nel nostro programma di produzione. Il pagamento viene elaborato in sicurezza tramite','using either your':'utilizzando il tuo','PayPal account or an eligible debit or credit card — no PayPal account is required.':'conto PayPal oppure una carta di debito o credito idonea — non è necessario avere un account PayPal.',
      'Fourteen artists, one creative home':'Quattordici artisti, un’unica casa creativa','About Velvet Charms':'Chi è Velvet Charms','Meet the collective':'Conosci il collettivo','Fourteen Makers, Many Creative Worlds':'Quattordici creatori, molti mondi creativi','Made with purpose':'Creato con intenzione','Created around your story':'Creato intorno alla tua storia','Beyond the catalogue':'Oltre il catalogo','Have Something Different in Mind?':'Hai in mente qualcosa di diverso?','Share your idea':'Raccontaci la tua idea','Ordering with care':'Un ordine seguito con cura',
      'A little clarity before we begin':'Qualche risposta prima di iniziare','Frequently Asked Questions':'Domande frequenti','Everything you need to know about made-to-order creations, personalization, production and delivery.':'Tutto ciò che serve sapere su creazioni su ordinazione, personalizzazione, produzione e consegna.','Is every Velvet Charms piece made to order?':'Ogni creazione Velvet Charms viene realizzata su ordinazione?','When does my production time begin?':'Quando inizia il tempo di produzione?','What if I need my order for a special date?':'E se mi serve l’ordine per una data speciale?','Can my chosen piece be personalized?':'Posso personalizzare la creazione scelta?','Is the catalogue price the price I pay?':'Il prezzo del catalogo è il prezzo del prodotto?',
      'Refill Collection':'Collezione Refill','Natural Face Cream Refill (50ml)':'Ricarica crema viso naturale (50 ml)','Body Butter Refill (100ml)':'Ricarica burro corpo (100 ml)','Hand & Foot Cream Refill (50ml)':'Ricarica crema mani e piedi (50 ml)','Candle Refill Insert — Small (150ml)':'Ricarica candela — piccola (150 ml)','Candle Refill Insert — Medium (250ml)':'Ricarica candela — media (250 ml)','Candle Refill Insert — Large (400ml)':'Ricarica candela — grande (400 ml)','Vessel preference':'Preferenza contenitore','Hidden message':'Messaggio nascosto','Ritual card':'Carta rituale','Collectible charm':'Charm da collezione','Velvet Passport':'Velvet Passport','As displayed':'Come mostrato','Reusable ceramic vessel':'Contenitore riutilizzabile in ceramica','Reusable glass vessel':'Contenitore riutilizzabile in vetro','Surprise Second Life vessel':'Contenitore sorpresa Second Life','Morning Ritual':'Rituale del mattino','Night Ritual':'Rituale della sera','Spa Ritual':'Rituale spa','Self-Love Ritual':'Rituale dedicato a te','Travel Ritual':'Rituale da viaggio','Surprise me':'Sorprendimi','Moon':'Luna','Star':'Stella','Butterfly':'Farfalla','Key':'Chiave','Flower':'Fiore','Heart':'Cuore','Include my first Velvet Passport':'Aggiungi il mio primo Velvet Passport','Add stamps to my existing Passport':'Aggiungi i timbri al mio Passport esistente','Velvet Stories':'Storie Velvet','Every scent begins with a feeling':'Ogni profumo nasce da un’emozione',
      'Add to cart':'Aggiungi al carrello','Request customization':'Personalizza','Cart':'Carrello','Your cart':'Il tuo carrello','Subtotal':'Subtotale','Total':'Totale','Remove':'Rimuovi','Edit customization':'Modifica personalizzazione','Your cart is empty.':'Il carrello è vuoto.','Checkout securely with PayPal':'Paga in sicurezza con PayPal','Do you need it by a specific date?':'Ti serve l’ordine entro una data precisa?','(optional)':'(facoltativo)','Shipping is handled separately according to destination, parcel size and weight.':'La spedizione viene calcolata separatamente in base a destinazione, dimensioni e peso del pacco.','Customize product':'Personalizza il prodotto','Special instructions':'Indicazioni speciali','Reference photos (up to 5)':'Foto di riferimento (massimo 5)','Save customization':'Salva personalizzazione','Cancel':'Annulla','Name':'Nome','Message':'Messaggio','Send':'Invia','Sending…':'Invio…','Message sent. Thank you!':'Messaggio inviato. Grazie!'
    },
    de: {
      'Home':'Startseite','Catalogue':'Katalog','About':'Über uns','FAQ':'FAQ','Contact':'Kontakt','Velvet Universe':'Velvet Universum','Visit Art & Gifts':'Art & Gifts entdecken','Art & Gifts':'Art & Gifts',
      'Browse the Catalogue':'Katalog entdecken','Ritual beauty, soft radiance, handcrafted self-care.':'Rituelle Schönheit, sanfte Ausstrahlung und handgefertigte Pflege als bewusster Moment für Sie.','Created around you':'Für Sie gedacht','Why Choose Velvet Charms?':'Warum Velvet Charms?',
      'One-of-a-kind creations shaped around your story, preferences or reference photos':'Einzigartige Kreationen, abgestimmt auf Ihre Geschichte, Ihre Wünsche oder Ihre Referenzfotos','A collective of 14 artists bringing together skincare, candles, textiles and meaningful handmade art':'Ein Kollektiv aus 14 Künstlerinnen und Künstlern, das Hautpflege, Kerzen, Textilien und bedeutungsvolle Handarbeit zusammenführt','Thoughtful gifts and keepsakes made especially for the person receiving them':'Sorgfältig ausgewählte Geschenke und Erinnerungsstücke, eigens für die Person gefertigt, die sie erhält','Personal guidance from your first idea to the finished creation — never a mass-produced experience':'Persönliche Begleitung von der ersten Idee bis zur fertigen Kreation — niemals ein Erlebnis von der Stange',
      'Simple & secure':'Einfach und sicher','Payments & Ordering':'Zahlung & Bestellung','Every creation is handmade to order and carefully scheduled for production. Checkout is securely processed by':'Jede Kreation wird auf Bestellung von Hand gefertigt und sorgfältig in unsere Produktionsplanung aufgenommen. Die Zahlung wird sicher abgewickelt über','using either your':'mit Ihrem','PayPal account or an eligible debit or credit card — no PayPal account is required.':'PayPal-Konto oder einer geeigneten Debit- bzw. Kreditkarte — ein PayPal-Konto ist nicht erforderlich.',
      'Fourteen artists, one creative home':'Vierzehn Künstler, ein kreatives Zuhause','About Velvet Charms':'Über Velvet Charms','Meet the collective':'Das Kollektiv kennenlernen','Fourteen Makers, Many Creative Worlds':'Vierzehn Kreative, viele künstlerische Welten','Made with purpose':'Mit Bedeutung geschaffen','Created around your story':'Für Ihre Geschichte geschaffen','Beyond the catalogue':'Über den Katalog hinaus','Have Something Different in Mind?':'Sie haben etwas anderes im Sinn?','Share your idea':'Erzählen Sie uns von Ihrer Idee','Ordering with care':'Mit Sorgfalt bestellt',
      'A little clarity before we begin':'Ein paar Antworten vorab','Frequently Asked Questions':'Häufige Fragen','Everything you need to know about made-to-order creations, personalization, production and delivery.':'Alles Wissenswerte zu Anfertigungen auf Bestellung, Personalisierung, Produktion und Lieferung.','Is every Velvet Charms piece made to order?':'Wird jede Velvet Charms Kreation auf Bestellung gefertigt?','When does my production time begin?':'Wann beginnt meine Fertigungszeit?','What if I need my order for a special date?':'Was ist, wenn ich meine Bestellung zu einem besonderen Termin brauche?','Can my chosen piece be personalized?':'Kann ich meine ausgewählte Kreation personalisieren?','Is the catalogue price the price I pay?':'Ist der Katalogpreis der Produktpreis?',
      'Refill Collection':'Refill-Kollektion','Natural Face Cream Refill (50ml)':'Nachfüllung natürliche Gesichtscreme (50 ml)','Body Butter Refill (100ml)':'Nachfüllung Körperbutter (100 ml)','Hand & Foot Cream Refill (50ml)':'Nachfüllung Hand- & Fußcreme (50 ml)','Candle Refill Insert — Small (150ml)':'Kerzen-Nachfüllung — klein (150 ml)','Candle Refill Insert — Medium (250ml)':'Kerzen-Nachfüllung — mittel (250 ml)','Candle Refill Insert — Large (400ml)':'Kerzen-Nachfüllung — groß (400 ml)','Vessel preference':'Behälterwunsch','Hidden message':'Versteckte Botschaft','Ritual card':'Ritualkarte','Collectible charm':'Sammel-Charm','Velvet Passport':'Velvet Passport','As displayed':'Wie abgebildet','Reusable ceramic vessel':'Wiederverwendbarer Keramikbehälter','Reusable glass vessel':'Wiederverwendbarer Glasbehälter','Surprise Second Life vessel':'Überraschungsbehälter Second Life','Morning Ritual':'Morgenritual','Night Ritual':'Abendritual','Spa Ritual':'Spa-Ritual','Self-Love Ritual':'Ritual für mich','Travel Ritual':'Reiseritual','Surprise me':'Überraschen Sie mich','Moon':'Mond','Star':'Stern','Butterfly':'Schmetterling','Key':'Schlüssel','Flower':'Blume','Heart':'Herz','Include my first Velvet Passport':'Meinen ersten Velvet Passport beilegen','Add stamps to my existing Passport':'Stempel in meinen vorhandenen Passport eintragen','Velvet Stories':'Velvet Geschichten','Every scent begins with a feeling':'Jeder Duft beginnt mit einem Gefühl',
      'Add to cart':'In den Warenkorb','Request customization':'Personalisieren','Cart':'Warenkorb','Your cart':'Ihr Warenkorb','Subtotal':'Zwischensumme','Total':'Gesamtsumme','Remove':'Entfernen','Edit customization':'Personalisierung bearbeiten','Your cart is empty.':'Ihr Warenkorb ist leer.','Checkout securely with PayPal':'Sicher mit PayPal bezahlen','Do you need it by a specific date?':'Benötigen Sie Ihre Bestellung zu einem bestimmten Termin?','(optional)':'(optional)','Shipping is handled separately according to destination, parcel size and weight.':'Die Versandkosten werden separat nach Zielort, Paketgröße und Gewicht berechnet.','Customize product':'Produkt personalisieren','Special instructions':'Besondere Hinweise','Reference photos (up to 5)':'Referenzfotos (max. 5)','Save customization':'Personalisierung speichern','Cancel':'Abbrechen','Name':'Name','Message':'Nachricht','Send':'Senden','Sending…':'Wird gesendet…','Message sent. Thank you!':'Nachricht gesendet. Vielen Dank!'
    }
  };

  function preferredLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED.includes(saved)) return saved;
    const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return SUPPORTED.includes(browser) ? browser : 'en';
  }

  const originals = new WeakMap();
  const originalAttrs = new WeakMap();
  let current = preferredLanguage();
  let observer;

  function remember(node) { if (!originals.has(node)) originals.set(node, node.nodeValue); }
  function rememberAttr(el, name) {
    if (!originalAttrs.has(el)) originalAttrs.set(el, {});
    const bag = originalAttrs.get(el);
    if (!(name in bag)) bag[name] = el.getAttribute(name);
  }
  function translateString(source) {
    if (current === 'en' || current === 'ro') return source;
    const trimmed = String(source || '').trim();
    if (!trimmed) return source;
    const translated = dictionaries[current]?.[trimmed];
    if (!translated) return source;
    const leading = source.match(/^\s*/)?.[0] || '';
    const trailing = source.match(/\s*$/)?.[0] || '';
    return leading + translated + trailing;
  }
  function translateTree(root = document.body) {
    if (!root) return;
    if (current === 'ro') {
      document.querySelectorAll('.lang-en').forEach(el => { el.style.display = 'none'; });
      document.querySelectorAll('.lang-ro').forEach(el => { el.style.display = ''; });
      return;
    }
    document.querySelectorAll('.lang-ro').forEach(el => { el.style.display = 'none'; });
    document.querySelectorAll('.lang-en').forEach(el => { el.style.display = ''; });
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode(node) {
      const p = node.parentElement;
      if (!p || ['SCRIPT','STYLE','NOSCRIPT'].includes(p.tagName) || p.closest('.velvet-language-switcher')) return NodeFilter.FILTER_REJECT;
      return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }});
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) { remember(node); const source = originals.get(node); node.nodeValue = current === 'en' ? source : translateString(source); }
    root.querySelectorAll?.('[placeholder],[title],[aria-label]').forEach(el => {
      for (const attr of ['placeholder','title','aria-label']) {
        if (!el.hasAttribute(attr) || el.closest('.velvet-language-switcher')) continue;
        rememberAttr(el, attr); const source = originalAttrs.get(el)[attr]; el.setAttribute(attr, current === 'en' ? source : translateString(source));
      }
    });
  }
  function makeSwitcher() {
    if (document.querySelector('.velvet-language-switcher')) return;
    const host = document.querySelector('.header-inner') || document.querySelector('.site-header') || document.body;
    const wrap = document.createElement('div'); wrap.className = 'velvet-language-switcher'; wrap.setAttribute('aria-label','Language');
    SUPPORTED.forEach(lang => { const b = document.createElement('button'); b.type='button'; b.textContent=LABELS[lang]; b.dataset.lang=lang; b.setAttribute('aria-pressed',String(current===lang)); b.addEventListener('click',()=>setLanguage(lang)); wrap.appendChild(b); });
    host.appendChild(wrap);
    const style = document.createElement('style');
    style.textContent = `.velvet-language-switcher{display:flex;gap:.28rem;align-items:center;justify-content:center;flex-wrap:wrap;margin-left:auto;padding:.25rem .35rem}.velvet-language-switcher button{border:1px solid rgba(90,40,70,.26);background:rgba(255,255,255,.22);color:inherit;border-radius:999px;padding:.3rem .48rem;font:inherit;font-size:.72rem;letter-spacing:.05em;cursor:pointer}.velvet-language-switcher button[aria-pressed="true"]{background:rgba(255,255,255,.62);border-color:rgba(90,40,70,.48)}@media(max-width:760px){.velvet-language-switcher{width:100%;margin:.35rem 0 0}}`;
    document.head.appendChild(style);
  }
  function setLanguage(lang) {
    if (!SUPPORTED.includes(lang)) lang='en';
    current=lang; localStorage.setItem(STORAGE_KEY,lang); document.documentElement.lang=lang;
    document.querySelectorAll('.velvet-language-switcher button').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.lang===lang)));
    if (window.VELVET_SET_LANGUAGE) window.VELVET_SET_LANGUAGE(lang==='ro'?'ro':'en');
    translateTree(document.body);
    window.dispatchEvent(new CustomEvent('velvet-language-changed',{detail:{language:lang}}));
  }
  function startObserver() {
    observer?.disconnect(); observer=new MutationObserver(mutations=>{ observer.disconnect(); for (const m of mutations) m.addedNodes.forEach(node=>{ if(node.nodeType===Node.ELEMENT_NODE) translateTree(node); else if(node.nodeType===Node.TEXT_NODE&&node.parentElement) translateTree(node.parentElement); }); observer.observe(document.body,{childList:true,subtree:true}); }); observer.observe(document.body,{childList:true,subtree:true});
  }
  function init(){ makeSwitcher(); setLanguage(current); startObserver(); window.VELVET_GET_LANGUAGE=()=>current; window.VELVET_SET_SITE_LANGUAGE=setLanguage; }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
