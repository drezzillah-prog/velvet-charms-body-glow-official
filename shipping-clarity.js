(() => {
  'use strict';
  const copy = {
    en: {
      total: 'Product total',
      shipping: 'Shipping is not included in the product total. After we review the destination, parcel size and weight, we confirm the shipping cost separately. No shipping charge is taken without your approval.',
      uploadFailed: 'Photo upload failed. Please try again.',
      uploadProgress: (current, total, percent) => `Uploading photo ${current} of ${total}: ${percent}%`,
      connectingPayPal: 'Connecting to PayPal…',
      checkoutPayPal: 'Checkout securely with PayPal',
      checkoutError: 'Checkout could not be started. Please try again or contact us.'
    },
    ro: {
      total: 'Total produse',
      shipping: 'Transportul nu este inclus în totalul produselor. După ce verificăm destinația, dimensiunea și greutatea coletului, îți comunicăm separat costul transportului. Nu se percepe nicio taxă de transport fără acordul tău.',
      uploadFailed: 'Încărcarea fotografiei a eșuat. Te rugăm să încerci din nou.',
      uploadProgress: (current, total, percent) => `Se încarcă fotografia ${current} din ${total}: ${percent}%`,
      connectingPayPal: 'Se realizează conexiunea cu PayPal…',
      checkoutPayPal: 'Plătește în siguranță cu PayPal',
      checkoutError: 'Plata nu a putut fi inițiată. Te rugăm să încerci din nou sau să ne contactezi.'
    },
    fr: {
      total: 'Total des produits',
      shipping: 'La livraison n’est pas incluse dans le total des produits. Après vérification de la destination, des dimensions et du poids du colis, nous vous confirmons séparément les frais de livraison. Aucun frais de livraison n’est prélevé sans votre accord.',
      uploadFailed: 'Le téléchargement de la photo a échoué. Veuillez réessayer.',
      uploadProgress: (current, total, percent) => `Téléchargement de la photo ${current} sur ${total} : ${percent} %`,
      connectingPayPal: 'Connexion à PayPal…',
      checkoutPayPal: 'Payer en toute sécurité avec PayPal',
      checkoutError: 'Le paiement n’a pas pu être démarré. Veuillez réessayer ou nous contacter.'
    },
    it: {
      total: 'Totale prodotti',
      shipping: 'La spedizione non è inclusa nel totale dei prodotti. Dopo aver verificato destinazione, dimensioni e peso del pacco, ti comunichiamo separatamente il costo della spedizione. Nessun costo di spedizione viene addebitato senza la tua approvazione.',
      uploadFailed: 'Il caricamento della foto non è riuscito. Riprova.',
      uploadProgress: (current, total, percent) => `Caricamento foto ${current} di ${total}: ${percent}%`,
      connectingPayPal: 'Connessione a PayPal…',
      checkoutPayPal: 'Paga in sicurezza con PayPal',
      checkoutError: 'Non è stato possibile avviare il pagamento. Riprova o contattaci.'
    },
    de: {
      total: 'Produktgesamtbetrag',
      shipping: 'Die Versandkosten sind nicht im Produktgesamtbetrag enthalten. Nach Prüfung von Zielort, Paketgröße und Gewicht bestätigen wir die Versandkosten separat. Versandkosten werden nur mit Ihrer Zustimmung berechnet.',
      uploadFailed: 'Das Hochladen des Fotos ist fehlgeschlagen. Bitte versuchen Sie es erneut.',
      uploadProgress: (current, total, percent) => `Foto ${current} von ${total} wird hochgeladen: ${percent}%`,
      connectingPayPal: 'Verbindung zu PayPal wird hergestellt…',
      checkoutPayPal: 'Sicher mit PayPal bezahlen',
      checkoutError: 'Der Bezahlvorgang konnte nicht gestartet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.'
    }
  };
  const language = () => {
    const value = (window.VELVET_GET_LANGUAGE?.() || document.documentElement.lang || localStorage.getItem('velvet_language') || 'en').slice(0, 2).toLowerCase();
    return copy[value] ? value : 'en';
  };
  const staticKeys = ['connectingPayPal', 'checkoutPayPal', 'checkoutError', 'uploadFailed'];
  function translatedKey(text) {
    for (const lang of Object.keys(copy)) {
      for (const key of staticKeys) {
        if (copy[lang][key] === text) return key;
      }
    }
    return null;
  }
  function setText(node, value) {
    if (node && node.textContent !== value) node.textContent = value;
  }
  function apply() {
    const c = copy[language()];
    setText(document.querySelector('.cart-summary-row.cart-total span'), c.total);
    setText(document.querySelector('.cart-shipping-note'), c.shipping);

    const uploadStatus = document.querySelector('[data-custom-upload-status]');
    if (uploadStatus && uploadStatus.textContent.trim()) {
      const text = uploadStatus.textContent.trim();
      const numbers = text.match(/(\d+)\D+(\d+)\D+(\d+)\s*%/);
      if (numbers) {
        setText(uploadStatus, c.uploadProgress(numbers[1], numbers[2], numbers[3]));
      } else {
        const key = translatedKey(text);
        setText(uploadStatus, key ? c[key] : c.uploadFailed);
      }
    }

    const checkoutButton = document.querySelector('[data-checkout-all]');
    if (checkoutButton) {
      const key = translatedKey(checkoutButton.textContent.trim());
      if (key === 'connectingPayPal' || key === 'checkoutPayPal') setText(checkoutButton, c[key]);
    }

    const cartStatus = document.querySelector('[data-cart-status]');
    if (cartStatus && cartStatus.textContent.trim()) {
      const text = cartStatus.textContent.trim();
      const key = translatedKey(text);
      if (key) setText(cartStatus, c[key]);
      else if (language() !== 'en' && /checkout|paypal|payment|order/i.test(text)) setText(cartStatus, c.checkoutError);
    }
  }
  let scheduled = false;
  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      apply();
    });
  }
  document.addEventListener('DOMContentLoaded', scheduleApply);
  window.addEventListener('velvet-language-changed', scheduleApply);
  document.addEventListener('velvet:language-change', scheduleApply);
  new MutationObserver(scheduleApply).observe(document.documentElement, { childList: true, subtree: true });
})();
