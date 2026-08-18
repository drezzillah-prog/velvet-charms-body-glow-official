/* features.js — Velvet Charms Body Glow
   Cart + PayPal Orders API (MULTI-ITEM) — FIXED
*/

(function () {

  const CART_KEY = "velvet_cart_body_glow";

  /* ================= CART STORAGE ================= */

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || { items: [] };
    } catch {
      return { items: [] };
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  /* ================= ADD TO CART ================= */

  function addToCart(product, qty = 1, options = {}) {
    const cart = loadCart();

    const existing = cart.items.find(
      i =>
        i.id === product.id &&
        JSON.stringify(i.options) === JSON.stringify(options)
    );

    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        qty,
        options
      });
    }

    saveCart(cart);
    alert("Added to cart");
  }

  /* ================= CHECKOUT (THE FIX IS HERE) ================= */

  async function checkoutAll() {
    const cart = loadCart();

    if (!cart.items.length) {
      alert("Your cart is empty");
      return;
    }

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        // 🔥 THIS IS THE CRITICAL FIX
        // API expects { cart: { items: [...] } }
        body: JSON.stringify({ cart })
      });

      const data = await res.json();

      if (!res.ok || !data.approveUrl) {
        console.error("PayPal error:", data);
        alert("Checkout failed — see console");
        return;
      }

      // Redirect to PayPal approval page (FULL CART)
      window.location.href = data.approveUrl;

    } catch (err) {
      console.error("Checkout crash:", err);
      alert("Checkout failed — API error");
    }
  }

  /* ================= EVENTS ================= */

  document.addEventListener("DOMContentLoaded", () => {

    // Add to cart buttons
    document.querySelectorAll("[data-add-to-cart]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.addToCart;

        const product = window.VELVET_CATALOGUE?.categories
          ?.flatMap(c => c.products || [])
          ?.find(p => p.id === id);

        if (!product) {
          alert("Product not found");
          return;
        }

        addToCart(product, 1);
      });
    });

    // Checkout all button
    const checkoutBtn = document.querySelector("[data-checkout-all]");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", checkoutAll);
    }
  });

})();
