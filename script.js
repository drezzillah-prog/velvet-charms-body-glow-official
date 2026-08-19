/* script.js — Velvet Charms catalogue loader */

(function () {

  const CATALOGUE_FILE = "catalogue-body-glow.json";

  async function loadCatalogue() {
    const res = await fetch(CATALOGUE_FILE, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load catalogue JSON");
    return res.json();
  }

  function approximateMakingTime(categoryName, subcategoryName) {
    if (categoryName === "Candles") {
      return ["Spiritual Candle", "Divination Candles"].includes(subcategoryName)
        ? "5–7 business days"
        : "3–5 business days";
    }
    if (categoryName === "Body Care" || categoryName === "Soaps") return "3–5 business days";
    if (categoryName === "Perfumes") return "5–7 business days";
    if (subcategoryName === "Braided Blankets") return "10–20 business days";
    if (["Hand-Knitted Scarves", "Matching Winter Set", "Felted Animals", "Pet Wear"].includes(subcategoryName)) {
      return "7–14 business days";
    }
    if (categoryName === "Knitted & Braided Wool Creations") return "5–10 business days";
    if (categoryName === "Bundles") return "7–14 business days";
    return "Confirmed with your production slot";
  }

  function buildProductCard(product, categoryName, subcategoryName = "") {

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

    if (product.description) {
      const description = document.createElement("p");
      description.className = "product-description";
      description.textContent = product.description;
      card.appendChild(description);
    }

    const makingTime = document.createElement("p");
    makingTime.className = "product-making-time";
    makingTime.innerHTML = "<strong>Approximate making time:</strong> " +
      approximateMakingTime(categoryName, subcategoryName);
    card.appendChild(makingTime);

    if (product.price) {

      const price = document.createElement("div");
      price.className = "price";
      price.textContent = "$" + product.price;
      card.appendChild(price);

      const cartBtn = document.createElement("button");
      cartBtn.className = "btn primary cart-add-btn";
      cartBtn.type = "button";
      cartBtn.textContent = "Add to cart";
      cartBtn.dataset.addToCart = product.id;
      card.appendChild(cartBtn);
    }

    const customBtn = document.createElement("button");
    customBtn.className = "btn small";
    customBtn.type = "button";
    customBtn.textContent = "Customize";
    customBtn.dataset.customizeProduct = product.id;
    card.appendChild(customBtn);

    return card;
  }

  function buildCatalogueNav(categories) {

    const nav = document.getElementById("catalogue-nav");
    if (!nav) return;

    let html = '<div class="catalogue-nav-inner">';

    categories.forEach(function(cat) {

      const id = cat.name.replace(/\s+/g, "-").toLowerCase();

      html += '<a href="#' + id + '">' + cat.name + '</a>';

    });

    html += "</div>";

    nav.innerHTML = html;
  }

  function buildCatalogue(data) {

    const root = document.getElementById("catalogue-root");
    if (!root) return;

    root.innerHTML = "";

    buildCatalogueNav(data.categories);

    data.categories.forEach(function(category) {

      const catId = category.name.replace(/\s+/g, "-").toLowerCase();

      const section = document.createElement("section");
      section.className = "catalogue-category";
      section.id = catId;

      const catTitle = document.createElement("h2");
      catTitle.textContent = category.name;
      section.appendChild(catTitle);

      if (Array.isArray(category.subcategories)) {

        category.subcategories.forEach(function(sub) {

          const subTitle = document.createElement("h3");
          subTitle.textContent = sub.name;
          section.appendChild(subTitle);

          if (Array.isArray(sub.products)) {

            const grid = document.createElement("div");
            grid.className = "products-grid";

            sub.products.forEach(function(product) {
              grid.appendChild(buildProductCard(product, category.name, sub.name));
            });

            section.appendChild(grid);
          }
        });
      }

      if (Array.isArray(category.products)) {

        const grid = document.createElement("div");
        grid.className = "products-grid";

        category.products.forEach(function(product) {
          grid.appendChild(buildProductCard(product, category.name));
        });

        section.appendChild(grid);
      }

      root.appendChild(section);

    });

  }

  document.addEventListener("DOMContentLoaded", async function() {
    try {
      const data = await loadCatalogue();
      window.VELVET_CATALOGUE = data;
      buildCatalogue(data);
    } catch (err) {
      console.error("Catalogue load error:", err);
    }
  });

})();
