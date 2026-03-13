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
      price.textContent = "$" + product.price;
      card.appendChild(price);

      const buyBtn = document.createElement("a");
      buyBtn.className = "btn primary";
      buyBtn.textContent = "Buy Now";

      if (product.paymentLink) {
        buyBtn.href = product.paymentLink;
      } else {
        buyBtn.href =
          "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick" +
          "&business=rosalinda.mauve@gmail.com" +
          "&item_name=" + encodeURIComponent(product.name) +
          "&amount=" + product.price +
          "&currency_code=USD";
      }

      buyBtn.target = "_blank";
      buyBtn.rel = "noopener noreferrer";
      card.appendChild(buyBtn);
    }

    const customBtn = document.createElement("a");
    customBtn.className = "btn small";
    customBtn.textContent = "Request customization";

    const message =
      "Hello! I’d like to request a customization for:\n\n" +
      "Product: " + product.name + "\n" +
      "Product ID: " + product.id + "\n\n" +
      "My customization idea:";

    customBtn.href = "contact.html?message=" + encodeURIComponent(message);
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
              grid.appendChild(buildProductCard(product));
            });

            section.appendChild(grid);
          }
        });
      }

      if (Array.isArray(category.products)) {

        const grid = document.createElement("div");
        grid.className = "products-grid";

        category.products.forEach(function(product) {
          grid.appendChild(buildProductCard(product));
        });

        section.appendChild(grid);
      }

      root.appendChild(section);

    });

  }

  document.addEventListener("DOMContentLoaded", async function() {
    try {
      const data = await loadCatalogue();
      buildCatalogue(data);
    } catch (err) {
      console.error("Catalogue load error:", err);
    }
  });

})();
