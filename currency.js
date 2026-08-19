/* currency.js — estimated local price display; checkout remains in USD */
(function () {
  "use strict";

  const STORAGE_KEY = "velvet_display_currency";
  const CURRENCIES = ["USD", "EUR", "RON", "GBP", "CAD", "AUD"];
  const state = { currency: "USD", rates: { USD: 1 }, ready: false };

  function formatCurrency(amount, currency) {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "RON" ? 0 : 2
    }).format(amount);
  }

  function displayMoney(usdValue) {
    const usd = Number(usdValue) || 0;
    if (state.currency === "USD" || !state.rates[state.currency]) {
      return formatCurrency(usd, "USD");
    }
    return `${formatCurrency(usd * state.rates[state.currency], state.currency)} est. · ${formatCurrency(usd, "USD")}`;
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

  function createSelector() {
    if (document.querySelector("[data-currency-selector]")) return;
    const control = document.createElement("aside");
    control.className = "currency-control";
    control.setAttribute("aria-label", "Display currency");
    control.innerHTML = `
      <label>
        <span>Display prices in</span>
        <select data-currency-selector aria-label="Choose display currency">
          ${CURRENCIES.map(currency => `<option value="${currency}">${currency}</option>`).join("")}
        </select>
      </label>
      <p data-currency-note>Checkout is securely completed in USD. Local prices are estimates.</p>
    `;
    const catalogueInfo = document.querySelector(".catalogue-info");
    (catalogueInfo || document.querySelector("main") || document.body).prepend(control);

    const selector = control.querySelector("[data-currency-selector]");
    selector.value = state.currency;
    selector.addEventListener("change", () => {
      state.currency = selector.value;
      localStorage.setItem(STORAGE_KEY, state.currency);
      notifyCurrencyChange();
    });
  }

  async function initialize() {
    try {
      const response = await fetch("/api/currency", { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Currency service unavailable");
      const data = await response.json();
      state.rates = data.rates || { USD: 1 };
      const saved = localStorage.getItem(STORAGE_KEY);
      state.currency = CURRENCIES.includes(saved)
        ? saved
        : (CURRENCIES.includes(data.suggestedCurrency) ? data.suggestedCurrency : "USD");
    } catch (error) {
      console.warn("Local currency estimates unavailable:", error);
      state.currency = "USD";
    }

    state.ready = true;
    createSelector();
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
