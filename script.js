/* script.js — Velvet Charms Body Glow
   Loads ONLY catalogue-body-glow.json
*/

(function () {

  /* ================= Snow Background ================= */

  function createSnow() {
    const snow = document.createElement("div");
    snow.className = "snowflake";
    snow.style.left = Math.random() * 100 + "vw";
    snow.style.top = (-10 - Math.random() * 10) + "vh";
    const size = 6 + Math.random() * 18;
    snow.style.width = size + "px";
    snow.style.height = size + "px";
    snow.style.borderRadius = "50%";
    snow.style.background = "rgba(255,255,255," + (0.7 + Math.random() * 0.3) + ")";
    snow.style.animation = `snow ${6 + Math.random() * 8}s linear`;
    snow.style.opacity = Math.random() * 0.6 + 0.4;
    snow.style.zIndex = 2;
    document.body.appendChild(snow);
    setTimeout(() => snow.remove(), 16000);
  }

  for (let i = 0; i < 6; i++) setTimeout(createSnow, i * 350);
  setInterval(createSnow, 700);

  /* ================= Catalogue Loader ================= */

  const CATALOGUE_FILE = "catalogue-body-glow.json";

  async function loadCatalogue() {
    const res = await fetch(CATALOGUE_FILE, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load " + CATALOGUE_FILE);
    console.info("Loaded catalogue:", CATALOGUE_FILE);
    return res.json();
  }

  function basename(path) {
    if (!path) return path;
    return path.split("/").pop();
  }

  function makeImg(src, alt) {
    const img = document.createElement("img");
    img.alt = alt || "";
    img.loading = "lazy";
    img.src = src;
    img.onerror = () => {
      const name = basename(src);
      if (name) img.src = "./" + name;
    };
    return img;
  }

  /* ================= Catalogue Rendering ================= */

  function buildCatalogue(data) {
    const root = document.getElementById("catalogue-root");
    if (!root) return;

    root.innerHTML = "";

    (data.categories || []).forEach(cat => {
      const section = document.createElement("section");
      section.className = "cat-card";

      const h3 = document.createElement("h3");
      h3.textContent = cat.name;
      section.appendChild(h3);

      const grid = document.createElement("div");
      grid.className = "products-grid";

      (cat.products || []).forEach(p => {
        const card = document.createElement("article");
        card.className = "product-card";

        if (p.images?.length) {
          const imgWrap = document.createElement("div");
          imgWrap.className = "thumb";
          imgWrap.appendChild(makeImg(p.images[0], p.name));
          card.appendChild(imgWrap);
        }

        const name = document.createElement("h5");
        name.textContent = p.name;
        card.appendChild(name);

        const price = document.createElement("div");
        price.className = "price";
        price.textContent = p.price ? `${p.price} USD` : "Contact";
        card.appendChild(price);

        const btn = document.createElement("a");
        btn.className = "btn small";
        btn.href = `product.html?id=${encodeURIComponent(p.id)}`;
        btn.textContent = "See details";
        card.appendChild(btn);

        grid.appendChild(card);
      });

      section.appendChild(grid);
      root.appendChild(section);
    });
  }

  function findProduct(data, id) {
    for (const cat of data.categories || []) {
      for (const p of cat.products || []) {
        if (p.id === id) return p;
      }
    }
    return null;
  }

  function renderProduct(data, id) {
    const root = document.getElementById("product-root");
    if (!root) return;

    const product = findProduct(data, id);
    if (!product) {
      root.innerHTML = "<p class='error'>Product not found.</p>";
      return;
    }

    root.innerHTML = `<h2>${product.name}</h2>`;
  }

  /* ================= Bootstrap ================= */

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const data = await loadCatalogue();

      const catRoot = document.getElementById("catalogue-root");
      const prodRoot = document.getElementById("product-root");

      if (catRoot) buildCatalogue(data);
      if (prodRoot) {
        const id = new URL(location.href).searchParams.get("id");
        renderProduct(data, id);
      }

      window.VELVET_CATALOGUE = data; // single source
    } catch (err) {
      console.error(err);
    }
  });

})();
