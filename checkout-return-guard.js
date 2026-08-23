/* checkout-return-guard.js — protects approved PayPal returns from losing their retry token */
(() => {
  "use strict";
  const CART_KEY = "velvet_cart_body_glow";
  const originalReplaceState = window.history.replaceState.bind(window.history);
  let captureCompleted = false;

  document.addEventListener("velvet:order-completed", () => { captureCompleted = true; });

  window.history.replaceState = function guardedReplaceState(state, title, url) {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success" && !captureCompleted) return;
    return originalReplaceState(state, title, url);
  };

  document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "cancelled") {
      alert(window.VELVET_I18N ? window.VELVET_I18N.t("PayPal checkout was cancelled. Your cart has been kept so you can review it or try again.") : "PayPal checkout was cancelled. Your cart has been kept so you can review it or try again.");
      originalReplaceState({}, document.title, window.location.pathname);
      return;
    }

    if (params.get("payment") === "success" && !params.get("token")) {
      const hasCart = Boolean(localStorage.getItem(CART_KEY));
      alert(window.VELVET_I18N ? window.VELVET_I18N.t(hasCart ? "PayPal returned without an order reference. Please do not place a second order. Contact us so we can verify the payment safely." : "PayPal returned without an order reference. Please contact us so we can verify the payment safely.") : "PayPal returned without an order reference. Please do not place a second order. Contact us so we can verify the payment safely.");
    }
  });
})();
