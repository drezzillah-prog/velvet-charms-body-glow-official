(() => {
  'use strict';
  const copy = {
    en: {
      total: 'Product total',
      shipping: 'Shipping is not included in the product total. After we review the destination, parcel size and weight, we confirm the shipping cost separately. No shipping charge is taken without your approval.'
    },
    ro: {
      total: 'Total produse',
      shipping: 'Transportul nu este inclus în totalul produselor. După ce verificăm destinația, dimensiunea și greutatea coletului, îți comunicăm separat costul transportului. Nu se percepe nicio taxă de transport fără acordul tău.'
    },
    fr: {
      total: 'Total des produits',
      shipping: 'La livraison n’est pas incluse dans le total des produits. Après vérification de la destination, des dimensions et du poids du colis, nous vous confirmons séparément les frais de livraison. Aucun frais de livraison n’est prélevé sans votre accord.'
    },
    it: {
      total: 'Totale prodotti',
      shipping: 'La spedizione non è inclusa nel totale dei prodotti. Dopo aver verificato destinazione, dimensioni e peso del pacco, ti comunichiamo separatamente il costo della spedizione. Nessun costo di spedizione viene addebitato senza la tua approvazione.'
    },
    de: {
      total: 'Produktgesamtbetrag',
      shipping: 'Die Versandkosten sind nicht im Produktgesamtbetrag enthalten. Nach Prüfung von Zielort, Paketgröße und Gewicht bestätigen wir die Versandkosten separat. Versandkosten werden nur mit Ihrer Zustimmung berechnet.'
    }
  };
  const language = () => {
    const value = (window.VELVET_GET_LANGUAGE?.() || document.documentElement.lang || localStorage.getItem('velvet_language') || 'en').slice(0, 2).toLowerCase();
    return copy[value] ? value : 'en';
  };
  function apply() {
    const c = copy[language()];
    const totalRow = document.querySelector('.cart-summary-row.cart-total span');
    if (totalRow) totalRow.textContent = c.total;
    const note = document.querySelector('.cart-shipping-note');
    if (note) note.textContent = c.shipping;
  }
  document.addEventListener('DOMContentLoaded', () => setTimeout(apply, 0));
  window.addEventListener('velvet-language-changed', () => setTimeout(apply, 0));
  document.addEventListener('velvet:language-change', () => setTimeout(apply, 0));
  new MutationObserver(() => apply()).observe(document.documentElement, { childList: true, subtree: true });
})();
