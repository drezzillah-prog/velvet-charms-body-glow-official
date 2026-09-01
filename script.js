/* script.js — Velvet Charms catalogue loader */

(function () {

  const CATALOGUE_FILE = "catalogue-body-glow.json";

  function ensureScript(src) {
    if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  async function ensureModernLocalization() {
    try {
      const page = location.pathname.split('/').pop() || 'index.html';
      if (!window.VELVET_GET_LANGUAGE) await ensureScript("multilingual.js");
      if (!document.querySelector('script[src="i18n-runtime.js"]')) await ensureScript("i18n-runtime.js");
      if (page !== 'catalogue.html' && !document.querySelector('script[src="language-polish.js"]')) await ensureScript("language-polish.js");
      if (page === 'about.html') {
        await ensureScript("about-multilingual.js");
        await ensureScript("about-specialties-multilingual.js");
      }
      if (page === 'index.html' || page === '') await ensureScript("home-multilingual.js");
    } catch (error) {
      console.warn("Extended localization could not be loaded:", error);
    }
  }

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

  function firstProductImage(category) {
    const direct = Array.isArray(category.products)
      ? category.products.find(product => Array.isArray(product.images) && product.images[0])
      : null;
    if (direct) return direct.images[0];

    for (const sub of category.subcategories || []) {
      const product = (sub.products || []).find(item => Array.isArray(item.images) && item.images[0]);
      if (product) return product.images[0];
    }
    return "";
  }

  function buildCategoryImage(category) {
    const fallback = firstProductImage(category);
    const preferred = category.banner || fallback;
    if (!preferred) return null;

    const img = document.createElement("img");
    img.className = "catalogue-category-image";
    img.src = preferred;
    img.alt = category.name + " category";
    img.loading = "lazy";
    Object.assign(img.style, {
      width: "100%",
      maxHeight: "360px",
      objectFit: "cover",
      display: "block",
      margin: "0.75rem 0 1.5rem",
      borderRadius: "18px"
    });

    if (fallback && fallback !== preferred) {
      img.addEventListener("error", function useCategoryProductFallback() {
        img.removeEventListener("error", useCategoryProductFallback);
        img.src = fallback;
      });
    }

    return img;
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
      price.dataset.usdPrice = product.price;
      if (Number.isFinite(Number(product.price_ro))) price.dataset.roPrice = product.price_ro;
      price.textContent = window.VELVET_CURRENCY
        ? window.VELVET_CURRENCY.displayMoney(product.price, product.price_ro)
        : "$" + product.price;
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

      const categoryImage = buildCategoryImage(category);
      if (categoryImage) section.appendChild(categoryImage);

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

    document.dispatchEvent(new CustomEvent('velvet:catalogue-rendered'));
  }

  document.addEventListener("DOMContentLoaded", async function() {
    setTimeout(ensureModernLocalization, 20);
    try {
      const data = await loadCatalogue();
      window.VELVET_CATALOGUE = data;
      buildCatalogue(data);
    } catch (err) {
      console.error("Catalogue load error:", err);
    }
  });

})();
