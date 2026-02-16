/* script.js — Velvet Charms catalogue loader */

(function () {

  const CATALOGUE_FILE = "catalogue-body-glow.json";

  async function loadCatalogue() {
    const res = await fetch(CATALOGUE_FILE, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load catalogue JSON");
    return res.json();
  }

  function buildProductCard(product) {

    const card = document.createElement("article");
    card.className = "product-card";

    if (product.images && product.images.length > 0) {
      const img = document.createElement("img");
      img.src = product.images[0];
      img.alt = product.name;
      img.loading = "lazy";
      card.appendChild(img);
    }

    const name = document.createElement("h4");
    name.textContent = product.name;
    card.appendChild(name);

    if (product.price) {
      const price = document.createElement("div");
      price.className = "price";
      price.textContent = `$${product.price}`; // ✅ USD
      card.appendChild(price);

      /* 🔹 BUY NOW BUTTON */
      const buyBtn = document.createElement("a");
      buyBtn.className = "btn primary";
      buyBtn.textContent = "Buy Now";

      if (product.paymentLink) {
        buyBtn.href = product.paymentLink;
      } else {
        buyBtn.href = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=rosalinda.mauve@gmail.com&item_name=${encodeURIComponent(product.name)}&amount=${product.price}&currency_code=USD`;
      }

      buyBtn.target = "_blank";
      buyBtn.rel = "noopener noreferrer";
      card.appendChild(buyBtn);
    }

    /* 🔹 REQUEST CUSTOMIZATION BUTTON */
    const btn = document.createElement("a");
    btn.className = "btn small";
    btn.textContent = "Request customization";

    const message =
      `Hello! I’d like to request a customization for:\n\n` +
      `Product: ${product.name}\n` +
      `Product ID: ${product.id}\n\n` +
      `My customization idea:`;

    btn.href = `contact.html?message=${encodeURIComponent(message)}`;
    card.appendChild(btn);

    return card;
  }

  function buildCatalogue(data) {
    const root = document.getElementById("catalogue-root");
    if (!root) return;
    root.innerHTML = "";

    data.categories.forEach(category => {
      const catTitle = document.createElement("h2");
      catTitle.textContent = category.name;
      root.appendChild(catTitle);

      if (Array.isArray(category.subcategories)) {
        category.subcategories.forEach(sub => {
          const subTitle = document.createElement("h3");
          subTitle.textContent = sub.name;
          root.appendChild(subTitle);

          if (Array.isArray(sub.products)) {
            const grid = document.createElement("div");
            grid.className = "products-grid";

            sub.products.forEach(product => {
              grid.appendChild(buildProductCard(product));
            });

            root.appendChild(grid);
          }
        });
      }

      if (Array.isArray(category.products)) {
        const grid = document.createElement("div");
        grid.className = "products-grid";

        category.products.forEach(product => {
          grid.appendChild(buildProductCard(product));
        });

        root.appendChild(grid);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const data = await loadCatalogue();
      buildCatalogue(data);
    } catch (err) {
      console.error("Catalogue load error:", err);
    }
  });

})();
