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

  data.categories.forEach(category => {
    // Category title
    const catTitle = document.createElement("h2");
    catTitle.textContent = category.name;
    root.appendChild(catTitle);

    // CASE 1: category has subcategories
    if (Array.isArray(category.subcategories)) {
      category.subcategories.forEach(sub => {
        const subTitle = document.createElement("h3");
        subTitle.textContent = sub.name;
        root.appendChild(subTitle);

        if (Array.isArray(sub.products)) {
          const grid = document.createElement("div");
          grid.className = "product-grid";

          sub.products.forEach(product => {
            grid.appendChild(buildProductCard(product));
          });

          root.appendChild(grid);
        }
      });
    }

    // CASE 2: category has products directly
    if (Array.isArray(category.products)) {
      const grid = document.createElement("div");
      grid.className = "product-grid";

      category.products.forEach(product => {
        grid.appendChild(buildProductCard(product));
      });

      root.appendChild(grid);
    }
  });
}

function buildProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  const img = document.createElement("img");
  img.src = `images/${product.images?.[0] || "placeholder.png"}`;
  img.alt = product.name;
  card.appendChild(img);

  const name = document.createElement("h4");
  name.textContent = product.name;
  card.appendChild(name);

  const price = document.createElement("p");
  price.textContent = `${product.price} RON`;
  card.appendChild(price);

  return card;
}
