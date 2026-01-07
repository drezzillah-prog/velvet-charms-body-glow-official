/* script.js — Velvet Charms Body Glow (clean, non-seasonal) */

(function () {

  const CATALOGUE_FILE = "catalogue-body-glow.json";

  async function loadCatalogue() {
    const res = await fetch(CATALOGUE_FILE, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load catalogue");
    return res.json();
  }

  function buildCatalogue(data) {
    const root = document.getElementById("catalogue-root");
    if (!root) return;
    root.innerHTML = "";

    data.categories.forEach(cat => {
      const section = document.createElement("section");
      section.className = "cat-card";

      const h3 = document.createElement("h3");
      h3.textContent = cat.name;
      section.appendChild(h3);

      const grid = document.createElement("div");
      grid.className = "products-grid";

      cat.products.forEach(p => {
        const card = document.createElement("article");
        card.className = "product-card";

        if (p.images?.length) {
          const img = document.createElement("img");
          img.src = p.images[0];
          img.alt = p.name;
          img.loading = "lazy";
          card.appendChild(img);
        }

        const name = document.createElement("h5");
        name.textContent = p.name;
        card.appendChild(name);

        const price = document.createElement("div");
        price.className = "price";
        price.textContent = `${p.price} USD`;
        card.appendChild(price);

        const btn = document.createElement("a");
        btn.className = "btn small";
        btn.textContent = "View details";
        btn.href = `product.html?id=${p.id}`;
        card.appendChild(btn);

        grid.appendChild(card);
      });

      section.appendChild(grid);
      root.appendChild(section);
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const data = await loadCatalogue();
      buildCatalogue(data);
    } catch (e) {
      console.error(e);
    }
  });

})();
