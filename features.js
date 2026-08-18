/* features.js — Velvet Charms Body Glow
   Full-store cart + PayPal Orders API
*/

(function () {
  "use strict";

  const CART_KEY = "velvet_cart_body_glow";
  const CURRENCY = "USD";

  function emptyCart() {
    return { items: [] };
  }

  function loadCart() {
    try {
      const stored = JSON.parse(localStorage.getItem(CART_KEY));
      if (!stored || !Array.isArray(stored.items)) return emptyCart();

      return {
        items: stored.items
          .filter(item => item && typeof item.id === "string")
          .map(item => ({
            id: item.id,
            name: String(item.name || ""),
            price: Number(item.price) || 0,
            qty: Math.max(1, Math.min(99, Number.parseInt(item.qty, 10) || 1)),
            options: item.options && typeof item.options === "object" ? item.options : {}
          }))
      };
    } catch {
      return emptyCart();
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
  }

  function allProducts() {
    const categories = window.VELVET_CATALOGUE?.categories || [];
    const products = [];

    categories.forEach(category => {
      if (Array.isArray(category.products)) {
        products.push(...category.products);
      }

      (category.subcategories || []).forEach(subcategory => {
        if (Array.isArray(subcategory.products)) {
          products.push(...subcategory.products);
        }
      });
    });

    return products;
  }

  function findProduct(id) {
    return allProducts().find(product => product.id === id);
  }

  function sameOptions(left, right) {
    return JSON.stringify(left || {}) === JSON.stringify(right || {});
  }

  function addToCart(product, qty = 1, options = {}) {
    if (!product || !product.id || !Number.isFinite(Number(product.price))) return;

    const cart = loadCart();
    const existing = cart.items.find(
      item => item.id === product.id && sameOptions(item.options, options)
    );

    if (existing) {
      existing.qty = Math.min(99, existing.qty + qty);
    } else {
      cart.items.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        qty: Math.max(1, qty),
        options
      });
    }

    saveCart(cart);
    openCart();
  }

  function changeQuantity(index, amount) {
    const cart = loadCart();
    const item = cart.items[index];
    if (!item) return;

    item.qty += amount;
    if (item.qty <= 0) {
      cart.items.splice(index, 1);
    } else {
      item.qty = Math.min(99, item.qty);
    }

    saveCart(cart);
  }

  function removeItem(index) {
    const cart = loadCart();
    if (!cart.items[index]) return;
    cart.items.splice(index, 1);
    saveCart(cart);
  }

  function money(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: CURRENCY
    }).format(value);
  }

  function cartTotals(cart) {
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.qty),
      0
    );

    return {
      itemCount: cart.items.reduce((sum, item) => sum + Number(item.qty), 0),
      subtotal,
      total: subtotal
    };
  }

  function createCartUI() {
    if (document.querySelector("[data-cart-drawer]")) return;

    document.body.insertAdjacentHTML(
      "beforeend",
      `
        <button class="btn cart-launcher" type="button" data-cart-open aria-label="Open shopping cart">
          Cart <span class="cart-count" data-cart-count>0</span>
        </button>

        <div class="cart-backdrop" data-cart-backdrop></div>

        <aside class="cart-drawer" data-cart-drawer aria-hidden="true" aria-label="Shopping cart">
          <div class="cart-header">
            <h2>Your cart</h2>
            <button class="cart-close" type="button" data-cart-close aria-label="Close shopping cart">×</button>
          </div>

          <div data-cart-items></div>

          <div class="cart-summary">
            <div class="cart-summary-row">
              <span>Subtotal</span>
              <strong data-cart-subtotal>$0.00</strong>
            </div>
            <div class="cart-summary-row cart-total">
              <span>Total</span>
              <strong data-cart-total>$0.00</strong>
            </div>
            <p class="cart-shipping-note">Shipping is confirmed separately when required.</p>
            <button class="btn cart-checkout" type="button" data-checkout-all>
              Checkout securely with PayPal
            </button>
          </div>
        </aside>
      `
    );

    renderCart();
  }

  function renderCart() {
    const itemsRoot = document.querySelector("[data-cart-items]");
    if (!itemsRoot) return;

    const cart = loadCart();
    const totals = cartTotals(cart);

    document.querySelectorAll("[data-cart-count]").forEach(node => {
      node.textContent = totals.itemCount;
    });

    document.querySelector("[data-cart-subtotal]").textContent = money(totals.subtotal);
    document.querySelector("[data-cart-total]").textContent = money(totals.total);

    const checkoutButton = document.querySelector("[data-checkout-all]");
    checkoutButton.disabled = cart.items.length === 0;

    if (!cart.items.length) {
      itemsRoot.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      return;
    }

    itemsRoot.innerHTML = cart.items
      .map(
        (item, index) => `
          <div class="cart-item">
            <div class="cart-item-details">
              <p class="cart-item-name">${escapeHtml(item.name)}</p>
              <p class="cart-item-price">${money(item.price)} each</p>
              <div class="cart-quantity" aria-label="Quantity controls for ${escapeHtml(item.name)}">
                <button type="button" data-cart-decrease="${index}" aria-label="Decrease quantity">−</button>
                <strong>${item.qty}</strong>
                <button type="button" data-cart-increase="${index}" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <div>
              <p><strong>${money(item.price * item.qty)}</strong></p>
              <button class="cart-remove" type="button" data-cart-remove="${index}">Remove</button>
            </div>
          </div>
        `
      )
      .join("");
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function openCart() {
    document.querySelector("[data-cart-drawer]")?.classList.add("is-open");
    document.querySelector("[data-cart-backdrop]")?.classList.add("is-open");
    document.querySelector("[data-cart-drawer]")?.setAttribute("aria-hidden", "false");
  }

  function closeCart() {
    document.querySelector("[data-cart-drawer]")?.classList.remove("is-open");
    document.querySelector("[data-cart-backdrop]")?.classList.remove("is-open");
    document.querySelector("[data-cart-drawer]")?.setAttribute("aria-hidden", "true");
  }

  async function checkoutAll() {
    const cart = loadCart();
    if (!cart.items.length) return;

    const checkoutButton = document.querySelector("[data-checkout-all]");
    checkoutButton.disabled = true;
    checkoutButton.textContent = "Connecting to PayPal…";

    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart })
      });

      const data = await response.json();

      if (!response.ok || !data.approveUrl) {
        throw new Error(data.error || "PayPal could not create the order.");
      }

      window.location.assign(data.approveUrl);
    } catch (error) {
      console.error("PayPal checkout error:", error);
      alert(error.message || "PayPal checkout is temporarily unavailable.");
      checkoutButton.disabled = false;
      checkoutButton.textContent = "Checkout securely with PayPal";
    }
  }

  async function captureApprovedOrder() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") !== "success" || !params.get("token")) return;

    try {
      const response = await fetch("/api/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: params.get("token") })
      });

      const data = await response.json();
      if (!response.ok || data.status !== "COMPLETED") {
        throw new Error(data.error || "PayPal payment could not be confirmed.");
      }

      localStorage.removeItem(CART_KEY);
      renderCart();
      alert("Payment completed successfully. Thank you for your order!");
    } catch (error) {
      console.error("PayPal capture error:", error);
      alert("PayPal approved the order, but confirmation failed. Please contact us before trying again.");
    } finally {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  document.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add-to-cart]");
    if (addButton) {
      const product = findProduct(addButton.dataset.addToCart);
      if (!product) {
        alert("This product could not be added. Please refresh the page.");
        return;
      }

      addToCart(product);
      return;
    }

    if (event.target.closest("[data-cart-open]")) openCart();
    if (event.target.closest("[data-cart-close], [data-cart-backdrop]")) closeCart();

    const increaseButton = event.target.closest("[data-cart-increase]");
    if (increaseButton) changeQuantity(Number(increaseButton.dataset.cartIncrease), 1);

    const decreaseButton = event.target.closest("[data-cart-decrease]");
    if (decreaseButton) changeQuantity(Number(decreaseButton.dataset.cartDecrease), -1);

    const removeButton = event.target.closest("[data-cart-remove]");
    if (removeButton) removeItem(Number(removeButton.dataset.cartRemove));

    if (event.target.closest("[data-checkout-all]")) checkoutAll();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeCart();
  });

  document.addEventListener("DOMContentLoaded", () => {
    createCartUI();
    captureApprovedOrder();
  });
})();

