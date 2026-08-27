/* checkout-return-guard.js — protects approved PayPal returns from losing their retry token */
(() => {
  "use strict";
  const CART_KEY = "velvet_cart_body_glow";
  const originalReplaceState = window.history.replaceState.bind(window.history);
  let captureCompleted = false;

  const copy = {
    en: {
      cancelled: "PayPal checkout was cancelled. Your cart has been kept so you can review it or try again.",
      missingWithCart: "PayPal returned without an order reference. Please do not place a second order. Contact us so we can verify the payment safely.",
      missingWithoutCart: "PayPal returned without an order reference. Please contact us so we can verify the payment safely."
    },
    ro: {
      cancelled: "Plata prin PayPal a fost anulată. Coșul tău a fost păstrat pentru a-l putea verifica sau pentru a încerca din nou.",
      missingWithCart: "PayPal a revenit fără referința comenzii. Te rugăm să nu plasezi o a doua comandă. Contactează-ne pentru a verifica plata în siguranță.",
      missingWithoutCart: "PayPal a revenit fără referința comenzii. Te rugăm să ne contactezi pentru a verifica plata în siguranță."
    },
    fr: {
      cancelled: "Le paiement PayPal a été annulé. Votre panier a été conservé afin que vous puissiez le vérifier ou réessayer.",
      missingWithCart: "PayPal est revenu sans référence de commande. Veuillez ne pas passer une deuxième commande. Contactez-nous afin que nous puissions vérifier le paiement en toute sécurité.",
      missingWithoutCart: "PayPal est revenu sans référence de commande. Veuillez nous contacter afin que nous puissions vérifier le paiement en toute sécurité."
    },
    it: {
      cancelled: "Il pagamento PayPal è stato annullato. Il carrello è stato conservato per consentirti di controllarlo o riprovare.",
      missingWithCart: "PayPal è tornato senza un riferimento dell’ordine. Non effettuare un secondo ordine. Contattaci per consentirci di verificare il pagamento in sicurezza.",
      missingWithoutCart: "PayPal è tornato senza un riferimento dell’ordine. Contattaci per consentirci di verificare il pagamento in sicurezza."
    },
    de: {
      cancelled: "Der PayPal-Bezahlvorgang wurde abgebrochen. Ihr Warenkorb wurde beibehalten, damit Sie ihn prüfen oder es erneut versuchen können.",
      missingWithCart: "PayPal ist ohne Bestellreferenz zurückgekehrt. Bitte geben Sie keine zweite Bestellung auf. Kontaktieren Sie uns, damit wir die Zahlung sicher prüfen können.",
      missingWithoutCart: "PayPal ist ohne Bestellreferenz zurückgekehrt. Bitte kontaktieren Sie uns, damit wir die Zahlung sicher prüfen können."
    }
  };

  function language() {
    const value = (window.VELVET_GET_LANGUAGE?.() || document.documentElement.lang || localStorage.getItem("velvet_language") || "en").slice(0, 2).toLowerCase();
    return copy[value] ? value : "en";
  }

  document.addEventListener("velvet:order-completed", () => { captureCompleted = true; });

  window.history.replaceState = function guardedReplaceState(state, title, url) {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success" && !captureCompleted) return;
    return originalReplaceState(state, title, url);
  };

  document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const c = copy[language()];
    if (params.get("payment") === "cancelled") {
      alert(c.cancelled);
      originalReplaceState({}, document.title, window.location.pathname);
      return;
    }

    if (params.get("payment") === "success" && !params.get("token")) {
      const hasCart = Boolean(localStorage.getItem(CART_KEY));
      alert(hasCart ? c.missingWithCart : c.missingWithoutCart);
    }
  });
})();
