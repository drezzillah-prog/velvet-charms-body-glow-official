/* features.js — Velvet Charms Body Glow
   Cart + PayPal CART checkout (NO per-product PayPal redirects)
*/

(function () {

  const CART_KEY = "velvet_cart_body_glow";

  // ---------------- CART STORAGE ----------------

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

  // ---------------- ADD TO CART ----------------

  function addToCart(product, qty = 1, options = {}) {
    const cart = loadCart();

    const existing = cart.items.find(
      i => i.id === product.id &&
           JSON.stringify(i.options) === JSON.stringify(options)
    );

    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        qty,
        options
      });
    }

    saveCart(cart);
    alert("Added to cart");
  }

  // ---------------- CHECKOUT (CART → PAYPAL) ----------------

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
        body: JSON.stringify({ cart })
      });

      const data = await res.json();

      if (!res.ok || !data.approveUrl) {
        console.error("Create order failed:", data);
        alert("Payment error. Check console.");
        return;
      }

      // 🔥 THIS is the ONLY PayPal redirect that should exist
      window.location.href = data.approveUrl;

    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed. See console.");
    }
  }

  // ---------------- BOOTSTRAP ----------------

  document.addEventListener("DOMContentLoaded", () => {

    // ADD TO CART buttons
    document.querySelectorAll("[data-add-to-cart]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.addToCart;

        const product =
          window._velvet_catalogue?.categories
            ?.flatMap(c => [
              ...(c.products || []),
              ...(c.subcategories?.flatMap(s => s.products || []) || [])
            ])
            ?.find(p => p.id === id);

        if (!product) {
          alert("Product not found");
          return;
        }

        addToCart(product, 1);
      });
    });

    // CHECKOUT ALL button
    document.querySelectorAll("[data-checkout]").forEach(btn => {
      btn.addEventListener("click", checkoutAll);
    });

  });

})();
