/* features.js — shared across both websites
   cart + wishlist UI + PayPal multi-item checkout
*/

// ---- LocalStorage helpers ----
function loadLS(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function saveLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- Load state ----
let cart = loadLS("vc_cart", []);
let wishlist = loadLS("vc_wishlist", []);

// ---- Update badge numbers ----
function updateBadges() {
  const c = document.querySelector("#cart-count");
  const w = document.querySelector("#wishlist-count");
  if (c) c.textContent = cart.reduce((a, b) => a + b.qty, 0);
  if (w) w.textContent = wishlist.length;
}
updateBadges();

// ---- Wishlist toggle ----
function toggleWishlist(id, product) {
  const exists = wishlist.find(x => x.id === id);

  if (exists) {
    wishlist = wishlist.filter(x => x.id !== id);
  } else {
    wishlist.push(product);
  }

  saveLS("vc_wishlist", wishlist);
  updateBadges();
}

// ---- Add to cart ----
function addToCart(id, product) {
  const item = cart.find(x => x.id === id);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveLS("vc_cart", cart);
  updateBadges();
}

// ---- Build buttons under each product card ----
function injectButtons() {
  document.querySelectorAll("[data-product-id]").forEach(card => {
    if (card.dataset.vcEnhanced) return;
    card.dataset.vcEnhanced = "1";

    const id = card.dataset.productId;
    const title = card.querySelector(".product-title")?.textContent?.trim() || "Item";
    const priceText = card.querySelector(".product-price")?.textContent || "";
    const price = parseFloat(priceText.replace(/[^\d.]/g, "")) || 0;

    const product = { id, name: title, price };

    const bar = document.createElement("div");
    bar.className = "vc-btn-row";
    bar.innerHTML = `
      <button class="vc-wish">❤</button>
      <button class="vc-add">Add</button>
    `;

    bar.querySelector(".vc-wish").onclick = () => toggleWishlist(id, product);
    bar.querySelector(".vc-add").onclick = () => addToCart(id, product);

    card.appendChild(bar);
  });
}

document.addEventListener("DOMContentLoaded", injectButtons);



// ==================================================
//  FIXED — PayPal “Checkout All”
// ==================================================

function checkoutAll() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  // ✅ The important fix: build ITEM LIST properly
  const items = cart.map(item => ({
    name: item.name,
    quantity: item.qty,
    unit_amount: {
      currency_code: "USD",
      value: item.price
    }
  }));

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);

  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: total
            }
          }
        },
        items
      }
    ]
  };

  // ---- Send to PayPal ----
  fetch("https://www.paypal.com/sdk/js?client-id=sb&currency=USD", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  // Open your existing PayPal page
  window.open(cart[0].paypalLink || "#", "_blank");
}

// Attach if “Checkout All” button exists
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("#checkout-all");
  if (btn) btn.addEventListener("click", checkoutAll);
});
