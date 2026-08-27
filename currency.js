/* currency.js — automatic local price display; checkout remains securely in USD */
(function () {
  "use strict";

  const state = { country: "", currency: "USD", rates: { USD: 1 } };

  function formatCurrency(amount, currency) {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: ["RON", "HUF", "JPY", "KRW", "IDR"].includes(currency) ? 0 : 2
    }).format(amount);
  }

  function displayMoney(usdValue, romanianPrice = null) {
    if (state.country === "RO" && Number.isFinite(Number(romanianPrice))) {
      return formatCurrency(Number(romanianPrice), "RON");
    }
    const usd = Number(usdValue) || 0;
    const rate = Number(state.rates[state.currency]) || 1;
    return formatCurrency(usd * rate, state.currency);
  }

  function refreshPriceLabels() {
    document.querySelectorAll("[data-usd-price]").forEach(node => {
      const nextValue = displayMoney(node.dataset.usdPrice, node.dataset.roPrice);
      if (node.textContent !== nextValue) node.textContent = nextValue;
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
      state.country = data.country || "";
      state.currency = data.currency && state.rates[data.currency] ? data.currency : "USD";
    } catch (error) {
      console.warn("Automatic local currency unavailable:", error);
    }

    notifyCurrencyChange();
  }

  window.VELVET_CURRENCY = {
    displayMoney,
    get currency() { return state.currency; },
    get country() { return state.country; },
    get isRomania() { return state.country === "RO"; }
  };

  /* Catalogue rendering already emits an explicit completion event. Using that event
     avoids observing the same DOM subtree that price updates modify. */
  document.addEventListener("velvet:catalogue-rendered", refreshPriceLabels);
  document.addEventListener("DOMContentLoaded", initialize);
})();
