/* Velvet Charms Body Glow — runtime localization for cart, customization and checkout messages. */
(() => {
  'use strict';
  const KEY = 'velvet_language';
  const SUPPORTED = ['en','ro','fr','it','de'];
  const ui = {
    fr: {
      'Open shopping cart':'Ouvrir le panier','Shopping cart':'Panier','Close shopping cart':'Fermer le panier','Cart':'Panier','Your cart':'Votre panier','Subtotal':'Sous-total','Total':'Total','Your cart is empty.':'Votre panier est vide.',
      'Do you need it by a specific date?':'Avez-vous besoin de votre commande pour une date précise ?','(optional)':'(facultatif)','Tell us your preferred date. It is only confirmed after we review the creation and our current production schedule.':'Indiquez-nous la date souhaitée. Elle ne sera confirmée qu’après examen de votre création et de notre planning de production actuel.',
      'Payment reserves your place in our production schedule. Your production window and estimated dispatch date will be confirmed within 1–2 business days.':'Votre paiement réserve votre place dans notre planning de production. Votre période de fabrication et la date d’expédition estimée vous seront confirmées sous 1 à 2 jours ouvrés.','Shipping time is added separately after your creation is ready.':'Le délai de livraison s’ajoute séparément lorsque votre création est prête.','Checkout securely with PayPal':'Payer en toute sécurité avec PayPal',
      'Close customization':'Fermer la personnalisation','Customize product':'Personnaliser le produit','Choose your preferences, then add this personalized item to your cart.':'Choisissez vos préférences, puis ajoutez cette création personnalisée à votre panier.','Customization progress':'Étapes de personnalisation','1. Options':'1. Options','2. Photos':'2. Photos','3. Review':'3. Vérification','Special instructions':'Indications particulières','Colors, shapes, personal message, or any other details...':'Couleurs, formes, message personnel ou tout autre détail…','Continue to photos':'Continuer vers les photos','Reference photos (up to 5)':'Photos de référence (5 maximum)','Preview, remove or reorder photos before upload.':'Prévisualisez, supprimez ou réorganisez vos photos avant l’envoi.','Back':'Retour','Review customization':'Vérifier la personnalisation','Add customized item to cart':'Ajouter la création personnalisée au panier','Choose an option':'Choisir une option',
      'Scent intensity':'Intensité du parfum','Vessel preference':'Choix du contenant','Hidden message':'Message caché','Ritual card':'Carte rituel','Collectible charm':'Charm à collectionner','Velvet Passport':'Velvet Passport','special instructions':'indications particulières','scent':'parfum','intensity':'intensité','color':'couleur','size':'taille','form':'forme','deity':'divinité','fruit':'fruit','flower':'fleur','animal':'animal',
      'Remove':'Retirer','Edit customization':'Modifier la personnalisation','Decrease quantity':'Diminuer la quantité','Increase quantity':'Augmenter la quantité','Move photo left':'Déplacer la photo vers la gauche','Move photo right':'Déplacer la photo vers la droite','As displayed, with no extra options.':'Comme présenté, sans option supplémentaire.','Please confirm every detail before adding this item to your cart.':'Merci de vérifier chaque détail avant d’ajouter cette création au panier.',
      'Please choose no more than 5 reference photos.':'Veuillez sélectionner au maximum 5 photos de référence.','Photo optimization failed.':'L’optimisation de la photo a échoué.','One selected photo could not be read.':'L’une des photos sélectionnées n’a pas pu être lue.','Photo upload failed.':'L’envoi de la photo a échoué.','Connecting to PayPal…':'Connexion à PayPal…','PayPal could not create the order.':'PayPal n’a pas pu créer la commande.','PayPal checkout is temporarily unavailable.':'Le paiement PayPal est temporairement indisponible.','PayPal payment could not be confirmed.':'Le paiement PayPal n’a pas pu être confirmé.','Payment completed successfully. Thank you for your order!':'Paiement effectué avec succès. Merci pour votre commande !','Payment completed successfully. Your confirmation email is on its way!':'Paiement effectué avec succès. Votre e-mail de confirmation est en route !','PayPal approved the order, but confirmation failed. Please contact us before trying again.':'PayPal a approuvé la commande, mais sa confirmation a échoué. Merci de nous contacter avant de réessayer.','This product could not be added. Please refresh the page.':'Ce produit n’a pas pu être ajouté. Veuillez actualiser la page.'
    },
    it: {
      'Open shopping cart':'Apri il carrello','Shopping cart':'Carrello','Close shopping cart':'Chiudi il carrello','Cart':'Carrello','Your cart':'Il tuo carrello','Subtotal':'Subtotale','Total':'Totale','Your cart is empty.':'Il carrello è vuoto.',
      'Do you need it by a specific date?':'Ti serve l’ordine entro una data precisa?','(optional)':'(facoltativo)','Tell us your preferred date. It is only confirmed after we review the creation and our current production schedule.':'Indicaci la data che preferisci. Sarà confermata solo dopo aver valutato la creazione e il nostro attuale programma di produzione.',
      'Payment reserves your place in our production schedule. Your production window and estimated dispatch date will be confirmed within 1–2 business days.':'Il pagamento riserva il tuo posto nel nostro programma di produzione. Entro 1–2 giorni lavorativi confermeremo il periodo di lavorazione e la data di spedizione stimata.','Shipping time is added separately after your creation is ready.':'I tempi di spedizione si aggiungono separatamente quando la creazione è pronta.','Checkout securely with PayPal':'Paga in sicurezza con PayPal',
      'Close customization':'Chiudi la personalizzazione','Customize product':'Personalizza il prodotto','Choose your preferences, then add this personalized item to your cart.':'Scegli le tue preferenze e aggiungi questa creazione personalizzata al carrello.','Customization progress':'Fasi della personalizzazione','1. Options':'1. Opzioni','2. Photos':'2. Foto','3. Review':'3. Riepilogo','Special instructions':'Indicazioni speciali','Colors, shapes, personal message, or any other details...':'Colori, forme, messaggio personale o qualsiasi altro dettaglio…','Continue to photos':'Continua con le foto','Reference photos (up to 5)':'Foto di riferimento (massimo 5)','Preview, remove or reorder photos before upload.':'Visualizza, elimina o riordina le foto prima del caricamento.','Back':'Indietro','Review customization':'Rivedi la personalizzazione','Add customized item to cart':'Aggiungi la creazione personalizzata al carrello','Choose an option':'Scegli un’opzione',
      'Scent intensity':'Intensità del profumo','Vessel preference':'Preferenza del contenitore','Hidden message':'Messaggio nascosto','Ritual card':'Carta rituale','Collectible charm':'Charm da collezione','Velvet Passport':'Velvet Passport','special instructions':'indicazioni speciali','scent':'profumo','intensity':'intensità','color':'colore','size':'dimensione','form':'forma','deity':'divinità','fruit':'frutto','flower':'fiore','animal':'animale',
      'Remove':'Rimuovi','Edit customization':'Modifica personalizzazione','Decrease quantity':'Riduci quantità','Increase quantity':'Aumenta quantità','Move photo left':'Sposta la foto a sinistra','Move photo right':'Sposta la foto a destra','As displayed, with no extra options.':'Come mostrato, senza opzioni aggiuntive.','Please confirm every detail before adding this item to your cart.':'Controlla ogni dettaglio prima di aggiungere questa creazione al carrello.',
      'Please choose no more than 5 reference photos.':'Seleziona al massimo 5 foto di riferimento.','Photo optimization failed.':'Non è stato possibile ottimizzare la foto.','One selected photo could not be read.':'Una delle foto selezionate non può essere letta.','Photo upload failed.':'Caricamento della foto non riuscito.','Connecting to PayPal…':'Connessione a PayPal…','PayPal could not create the order.':'PayPal non ha potuto creare l’ordine.','PayPal checkout is temporarily unavailable.':'Il pagamento PayPal è temporaneamente non disponibile.','PayPal payment could not be confirmed.':'Non è stato possibile confermare il pagamento PayPal.','Payment completed successfully. Thank you for your order!':'Pagamento completato. Grazie per il tuo ordine!','Payment completed successfully. Your confirmation email is on its way!':'Pagamento completato. L’e-mail di conferma è in arrivo!','PayPal approved the order, but confirmation failed. Please contact us before trying again.':'PayPal ha approvato l’ordine, ma la conferma non è riuscita. Contattaci prima di riprovare.','This product could not be added. Please refresh the page.':'Non è stato possibile aggiungere questo prodotto. Aggiorna la pagina.'
    },
    de: {
      'Open shopping cart':'Warenkorb öffnen','Shopping cart':'Warenkorb','Close shopping cart':'Warenkorb schließen','Cart':'Warenkorb','Your cart':'Ihr Warenkorb','Subtotal':'Zwischensumme','Total':'Gesamtsumme','Your cart is empty.':'Ihr Warenkorb ist leer.',
      'Do you need it by a specific date?':'Benötigen Sie Ihre Bestellung bis zu einem bestimmten Datum?','(optional)':'(optional)','Tell us your preferred date. It is only confirmed after we review the creation and our current production schedule.':'Nennen Sie uns Ihr Wunschdatum. Es wird erst bestätigt, nachdem wir die Kreation und unsere aktuelle Produktionsplanung geprüft haben.',
      'Payment reserves your place in our production schedule. Your production window and estimated dispatch date will be confirmed within 1–2 business days.':'Mit der Zahlung reservieren Sie Ihren Platz in unserer Produktionsplanung. Innerhalb von 1–2 Werktagen bestätigen wir das Fertigungsfenster und den voraussichtlichen Versandtermin.','Shipping time is added separately after your creation is ready.':'Die Versandzeit kommt separat hinzu, sobald Ihre Kreation fertig ist.','Checkout securely with PayPal':'Sicher mit PayPal bezahlen',
      'Close customization':'Personalisierung schließen','Customize product':'Produkt personalisieren','Choose your preferences, then add this personalized item to your cart.':'Wählen Sie Ihre Wünsche und legen Sie die personalisierte Kreation anschließend in den Warenkorb.','Customization progress':'Schritte der Personalisierung','1. Options':'1. Optionen','2. Photos':'2. Fotos','3. Review':'3. Prüfen','Special instructions':'Besondere Wünsche','Colors, shapes, personal message, or any other details...':'Farben, Formen, persönliche Nachricht oder weitere Wünsche…','Continue to photos':'Weiter zu den Fotos','Reference photos (up to 5)':'Referenzfotos (maximal 5)','Preview, remove or reorder photos before upload.':'Fotos vor dem Hochladen ansehen, entfernen oder neu anordnen.','Back':'Zurück','Review customization':'Personalisierung prüfen','Add customized item to cart':'Personalisierte Kreation in den Warenkorb','Choose an option':'Option auswählen',
      'Scent intensity':'Duftintensität','Vessel preference':'Wahl des Behälters','Hidden message':'Verborgene Nachricht','Ritual card':'Ritualkarte','Collectible charm':'Sammel-Charm','Velvet Passport':'Velvet Passport','special instructions':'besondere Wünsche','scent':'Duft','intensity':'Intensität','color':'Farbe','size':'Größe','form':'Form','deity':'Gottheit','fruit':'Frucht','flower':'Blume','animal':'Tier',
      'Remove':'Entfernen','Edit customization':'Personalisierung bearbeiten','Decrease quantity':'Menge verringern','Increase quantity':'Menge erhöhen','Move photo left':'Foto nach links verschieben','Move photo right':'Foto nach rechts verschieben','As displayed, with no extra options.':'Wie abgebildet, ohne zusätzliche Optionen.','Please confirm every detail before adding this item to your cart.':'Bitte prüfen Sie alle Details, bevor Sie diese Kreation in den Warenkorb legen.',
      'Please choose no more than 5 reference photos.':'Bitte wählen Sie höchstens 5 Referenzfotos aus.','Photo optimization failed.':'Das Foto konnte nicht optimiert werden.','One selected photo could not be read.':'Eines der ausgewählten Fotos konnte nicht gelesen werden.','Photo upload failed.':'Das Foto konnte nicht hochgeladen werden.','Connecting to PayPal…':'Verbindung zu PayPal wird hergestellt…','PayPal could not create the order.':'PayPal konnte die Bestellung nicht erstellen.','PayPal checkout is temporarily unavailable.':'Die PayPal-Zahlung ist vorübergehend nicht verfügbar.','PayPal payment could not be confirmed.':'Die PayPal-Zahlung konnte nicht bestätigt werden.','Payment completed successfully. Thank you for your order!':'Zahlung erfolgreich abgeschlossen. Vielen Dank für Ihre Bestellung!','Payment completed successfully. Your confirmation email is on its way!':'Zahlung erfolgreich abgeschlossen. Ihre Bestätigungs-E-Mail ist unterwegs!','PayPal approved the order, but confirmation failed. Please contact us before trying again.':'PayPal hat die Bestellung genehmigt, die Bestätigung ist jedoch fehlgeschlagen. Bitte kontaktieren Sie uns, bevor Sie es erneut versuchen.','This product could not be added. Please refresh the page.':'Dieses Produkt konnte nicht hinzugefügt werden. Bitte laden Sie die Seite neu.'
    }
  };

  const originals = new WeakMap();
  const originalAttrs = new WeakMap();
  const baseT = window.VELVET_I18N?.t ? window.VELVET_I18N.t.bind(window.VELVET_I18N) : (v => v);
  const lang = () => window.VELVET_GET_LANGUAGE?.() || localStorage.getItem(KEY) || document.documentElement.lang || 'en';
  function translate(source, language = lang()) {
    const value = String(source ?? '');
    if (language === 'en') return value;
    if (language === 'ro') return baseT(value);
    const clean = value.trim();
    let translated = ui[language]?.[clean];
    if (!translated && window.VELVET_TRANSLATE_CATALOGUE_TEXT) translated = window.VELVET_TRANSLATE_CATALOGUE_TEXT(clean, language);
    if (!translated || translated === clean) {
      let match = clean.match(/^Reference photo (\d+) attached$/);
      if (match) translated = language === 'fr' ? `Photo de référence ${match[1]} jointe` : language === 'it' ? `Foto di riferimento ${match[1]} allegata` : `Referenzfoto ${match[1]} angehängt`;
      match = clean.match(/^Saved photo (\d+)$/);
      if (match) translated = language === 'fr' ? `Photo enregistrée ${match[1]}` : language === 'it' ? `Foto salvata ${match[1]}` : `Gespeichertes Foto ${match[1]}`;
      match = clean.match(/^(\d+) private reference photo\(s\)$/);
      if (match) translated = language === 'fr' ? `${match[1]} photo(s) de référence privée(s)` : language === 'it' ? `${match[1]} foto di riferimento private` : `${match[1]} private Referenzfoto(s)`;
      match = clean.match(/^Uploading photo (\d+) of (\d+): (\d+)%$/);
      if (match) translated = language === 'fr' ? `Envoi de la photo ${match[1]} sur ${match[2]} : ${match[3]} %` : language === 'it' ? `Caricamento foto ${match[1]} di ${match[2]}: ${match[3]}%` : `Foto ${match[1]} von ${match[2]} wird hochgeladen: ${match[3]} %`;
      match = clean.match(/^Edit (.+)$/);
      if (match) translated = language === 'fr' ? `Modifier ${match[1]}` : language === 'it' ? `Modifica ${match[1]}` : `${match[1]} bearbeiten`;
      match = clean.match(/^Customize (.+)$/);
      if (match) translated = language === 'fr' ? `Personnaliser ${match[1]}` : language === 'it' ? `Personalizza ${match[1]}` : `${match[1]} personalisieren`;
      if (clean.endsWith(' each')) {
        const amount = clean.slice(0,-5);
        translated = language === 'fr' ? `${amount} l’unité` : language === 'it' ? `${amount} ciascuno` : `${amount} pro Stück`;
      }
    }
    if (!translated) translated = value;
    return value.replace(clean, translated);
  }

  function translateNode(node) {
    if (!node || !node.nodeValue || !node.nodeValue.trim()) return;
    if (!originals.has(node)) originals.set(node,node.nodeValue);
    node.nodeValue = translate(originals.get(node));
  }
  function translateAttrs(el) {
    if (!(el instanceof Element)) return;
    if (!originalAttrs.has(el)) originalAttrs.set(el,{});
    const bag = originalAttrs.get(el);
    ['aria-label','placeholder','title'].forEach(attr => {
      if (!el.hasAttribute(attr)) return;
      if (!(attr in bag)) bag[attr] = el.getAttribute(attr);
      el.setAttribute(attr,translate(bag[attr]));
    });
  }
  function applyRuntime(root=document.body) {
    if (!root) return;
    const scopes = [];
    if (root.matches?.('[data-cart-drawer],[data-custom-modal],[data-cart-open]')) scopes.push(root);
    root.querySelectorAll?.('[data-cart-drawer],[data-custom-modal],[data-cart-open]').forEach(el=>scopes.push(el));
    scopes.forEach(scope => {
      const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);
      while(walker.nextNode()) translateNode(walker.currentNode);
      translateAttrs(scope); scope.querySelectorAll('[aria-label],[placeholder],[title]').forEach(translateAttrs);
    });
  }

  if (!window.VELVET_I18N) window.VELVET_I18N = {};
  window.VELVET_I18N.t = value => translate(value);
  window.VELVET_RUNTIME_T = translate;
  const observer = new MutationObserver(mutations => mutations.forEach(m => m.addedNodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) applyRuntime(node);
    else if (node.parentElement) applyRuntime(node.parentElement);
  })));
  function refresh(){ applyRuntime(document.body); }
  window.addEventListener('velvet-language-changed',refresh);
  document.addEventListener('velvet:language-change',refresh);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',()=>{ observer.observe(document.body,{childList:true,subtree:true}); refresh(); },{once:true});
  else { observer.observe(document.body,{childList:true,subtree:true}); refresh(); }
})();