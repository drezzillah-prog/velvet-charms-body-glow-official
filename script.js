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
      price.textContent = `${product.price} EUR`;
      card.appendChild(price);
    }

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

      // Categories with subcategories
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

      // Categories with products directly
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
