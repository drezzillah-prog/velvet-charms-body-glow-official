/* currency.js — automatic local price display; checkout remains securely in USD */
(function () {
  "use strict";

  const state = { currency: "USD", rates: { USD: 1 } };

  function formatCurrency(amount, currency) {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: ["RON", "HUF", "JPY", "KRW", "IDR"].includes(currency) ? 0 : 2
    }).format(amount);
  }

  function displayMoney(usdValue) {
    const usd = Number(usdValue) || 0;
    const rate = Number(state.rates[state.currency]) || 1;
    return formatCurrency(usd * rate, state.currency);
  }

  function refreshPriceLabels() {
    document.querySelectorAll("[data-usd-price]").forEach(node => {
      node.textContent = displayMoney(node.dataset.usdPrice);
    });
  }

  function notifyCurrencyChange() {
    refreshPriceLabels();
    document.dispatchEvent(new CustomEvent("velvet:currency-change"));
  }

  async function initialize() {
    try {
      const response = await fetch("/api/currency", { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Currency service unavailable");
      const data = await response.json();
      state.rates = data.rates || { USD: 1 };
      state.currency = data.currency && state.rates[data.currency] ? data.currency : "USD";
    } catch (error) {
      console.warn("Automatic local currency unavailable:", error);
    }

    notifyCurrencyChange();

    const root = document.getElementById("catalogue-root");
    if (root) {
      new MutationObserver(refreshPriceLabels).observe(root, { childList: true, subtree: true });
    }
  }

  window.VELVET_CURRENCY = {
    displayMoney,
    get currency() { return state.currency; }
  };

  document.addEventListener("DOMContentLoaded", initialize);
})();
