/* features.js — Velvet Charms Body Glow
   Full-store cart + PayPal Orders API
*/

(function () {
  "use strict";

  const CART_KEY = "velvet_cart_body_glow";
  const CURRENCY = "USD";
  let customPhotoFiles = [];
  let retainedAttachments = [];
  let editingItemIndex = null;
  let customStep = 1;

  function emptyCart() {
    return { items: [], requiredByDate: "" };
  }

  function loadCart() {
    try {
      const stored = JSON.parse(localStorage.getItem(CART_KEY));
      if (!stored || !Array.isArray(stored.items)) return emptyCart();

      return {
        requiredByDate: /^\d{4}-\d{2}-\d{2}$/.test(String(stored.requiredByDate || ""))
          ? String(stored.requiredByDate)
          : "",
        items: stored.items
          .filter(item => item && typeof item.id === "string")
          .map(item => ({
            id: item.id,
            name: String(item.name || ""),
            price: Number(item.price) || 0,
            qty: Math.max(1, Math.min(99, Number.parseInt(item.qty, 10) || 1)),
            options: item.options && typeof item.options === "object" ? item.options : {},
            attachments: Array.isArray(item.attachments) ? item.attachments.slice(0, 5) : []
          }))
      };
    } catch {
      return emptyCart();
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
  }

  function allProducts() {
    const categories = window.VELVET_CATALOGUE?.categories || [];
    const products = [];

    categories.forEach(category => {
      if (Array.isArray(category.products)) {
        products.push(...category.products);
      }

      (category.subcategories || []).forEach(subcategory => {
        if (Array.isArray(subcategory.products)) {
          products.push(...subcategory.products);
        }
      });
    });

    return products;
  }

  function findProduct(id) {
    return allProducts().find(product => product.id === id);
  }

  function sameOptions(left, right) {
    return JSON.stringify(left || {}) === JSON.stringify(right || {});
  }

  function optionLabel(key) {
    if (key === "intensity") return "Scent intensity";
    return key.replaceAll("_", " ");
  }

  function optionSummary(options) {
    return Object.entries(options || {})
      .filter(([, value]) => String(value || "").trim())
      .map(([key, value]) => `${optionLabel(key)}: ${value}`);
  }

  function addToCart(product, qty = 1, options = {}, attachments = []) {
    if (!product || !product.id || !Number.isFinite(Number(product.price))) return;

    const cart = loadCart();
    const existing = cart.items.find(
      item => item.id === product.id && sameOptions(item.options, options) && !attachments.length && !item.attachments?.length
    );

    if (existing) {
      existing.qty = Math.min(99, existing.qty + qty);
    } else {
      cart.items.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        qty: Math.max(1, qty),
        options,
        attachments: attachments.slice(0, 5)
      });
    }

    saveCart(cart);
    openCart();
  }

  function changeQuantity(index, amount) {
    const cart = loadCart();
    const item = cart.items[index];
    if (!item) return;

    item.qty += amount;
    if (item.qty <= 0) {
      cart.items.splice(index, 1);
    } else {
      item.qty = Math.min(99, item.qty);
    }

    saveCart(cart);
  }

  function removeItem(index) {
    const cart = loadCart();
    if (!cart.items[index]) return;
    cart.items.splice(index, 1);
    saveCart(cart);
  }

  function money(value) {
    if (window.VELVET_CURRENCY) {
      return window.VELVET_CURRENCY.displayMoney(value);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: CURRENCY
    }).format(value);
  }

  function cartTotals(cart) {
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.qty),
      0
    );

    return {
      itemCount: cart.items.reduce((sum, item) => sum + Number(item.qty), 0),
      subtotal,
      total: subtotal
    };
  }

  function createCartUI() {
    if (document.querySelector("[data-cart-drawer]")) return;

    document.body.insertAdjacentHTML(
      "beforeend",
      `
        <button class="btn cart-launcher" type="button" data-cart-open aria-label="Open shopping cart">
          Cart <span class="cart-count" data-cart-count>0</span>
        </button>

        <div class="cart-backdrop" data-cart-backdrop></div>

        <aside class="cart-drawer" data-cart-drawer aria-hidden="true" aria-label="Shopping cart">
          <div class="cart-header">
            <h2>Your cart</h2>
            <button class="cart-close" type="button" data-cart-close aria-label="Close shopping cart">×</button>
          </div>

          <div data-cart-items></div>

          <div class="cart-summary">
            <div class="cart-summary-row">
              <span>Subtotal</span>
              <strong data-cart-subtotal>$0.00</strong>
            </div>
            <div class="cart-summary-row cart-total">
              <span>Total</span>
              <strong data-cart-total>$0.00</strong>
            </div>
            <label class="cart-needed-date">
              <span>Do you need it by a specific date? <small>(optional)</small></span>
              <input type="date" data-required-by-date>
              <small>Tell us your preferred date. It is only confirmed after we review the creation and our current production schedule.</small>
            </label>
            <p class="cart-production-note">Payment reserves your place in our production schedule. Your production window and estimated dispatch date will be confirmed within 1–2 business days.</p>
            <p class="cart-shipping-note">Shipping time is added separately after your creation is ready.</p>
            <button class="btn cart-checkout" type="button" data-checkout-all>
              Checkout securely with PayPal
            </button>
          </div>
        </aside>

        <div class="custom-modal" data-custom-modal aria-hidden="true">
          <div class="custom-dialog" role="dialog" aria-modal="true" aria-labelledby="custom-title">
            <button class="custom-close" type="button" data-custom-close aria-label="Close customization">×</button>
            <h2 id="custom-title" data-custom-title>Customize product</h2>
            <p class="custom-intro">Choose your preferences, then add this personalized item to your cart.</p>
            <ol class="custom-steps" aria-label="Customization progress">
              <li data-step-indicator="1">1. Options</li>
              <li data-step-indicator="2">2. Photos</li>
              <li data-step-indicator="3">3. Review</li>
            </ol>
            <form data-custom-form>
              <section class="custom-step" data-custom-step="1">
                <div data-custom-fields></div>
                <label class="custom-field">
                  <span>Special instructions</span>
                  <textarea name="special_instructions" rows="4" maxlength="1000" placeholder="Colors, shapes, personal message, or any other details..."></textarea>
                </label>
                <div class="custom-actions"><button class="btn" type="button" data-custom-next>Continue to photos</button></div>
              </section>
              <section class="custom-step" data-custom-step="2" hidden>
                <label class="custom-field custom-photo-field">
                  <span>Reference photos (up to 5)</span>
                  <input type="file" name="reference_photos" accept="image/jpeg,image/png,image/webp" capture="environment" multiple>
                  <small>Preview, remove or reorder photos before upload.</small>
                </label>
                <div class="custom-photo-preview" data-custom-photo-preview></div>
                <div class="custom-upload-status" data-custom-upload-status aria-live="polite"></div>
                <div class="custom-actions">
                  <button class="btn custom-secondary" type="button" data-custom-prev>Back</button>
                  <button class="btn" type="button" data-custom-next>Review customization</button>
                </div>
              </section>
              <section class="custom-step" data-custom-step="3" hidden>
                <div class="custom-review" data-custom-review></div>
                <div class="custom-actions">
                  <button class="btn custom-secondary" type="button" data-custom-prev>Back</button>
                  <button class="btn custom-submit" type="submit">Add customized item to cart</button>
                </div>
              </section>
            </form>
          </div>
        </div>
      `
    );

    renderCart();
  }

  function renderCart() {
    const itemsRoot = document.querySelector("[data-cart-items]");
    if (!itemsRoot) return;

    const cart = loadCart();
    const totals = cartTotals(cart);

    document.querySelectorAll("[data-cart-count]").forEach(node => {
      node.textContent = totals.itemCount;
    });

    document.querySelector("[data-cart-subtotal]").textContent = money(totals.subtotal);
    document.querySelector("[data-cart-total]").textContent = money(totals.total);

    const checkoutButton = document.querySelector("[data-checkout-all]");
    checkoutButton.disabled = cart.items.length === 0;

    const requiredDateInput = document.querySelector("[data-required-by-date]");
    if (requiredDateInput) {
      requiredDateInput.value = cart.requiredByDate || "";
      requiredDateInput.min = new Date().toISOString().slice(0, 10);
    }

    if (!cart.items.length) {
      itemsRoot.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      return;
    }

    itemsRoot.innerHTML = cart.items
      .map(
        (item, index) => `
          <div class="cart-item">
            <div class="cart-item-details">
              <p class="cart-item-name">${escapeHtml(item.name)}</p>
              <p class="cart-item-price">${money(item.price)} each</p>
              ${optionSummary(item.options).length
                ? `<ul class="cart-item-options">${optionSummary(item.options).map(line => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`
                : ""}
              ${item.attachments?.length
                ? `<div class="cart-photo-strip">${item.attachments.map((photo, photoIndex) => `<span class="private-photo-chip">📷 Reference photo ${photoIndex + 1} attached</span>`).join("")}</div>`
                : ""}
              <div class="cart-quantity" aria-label="Quantity controls for ${escapeHtml(item.name)}">
                <button type="button" data-cart-decrease="${index}" aria-label="Decrease quantity">−</button>
                <strong>${item.qty}</strong>
                <button type="button" data-cart-increase="${index}" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <div>
              <p><strong>${money(item.price * item.qty)}</strong></p>
              <button class="cart-edit" type="button" data-cart-edit="${index}">Edit customization</button>
              <button class="cart-remove" type="button" data-cart-remove="${index}">Remove</button>
            </div>
          </div>
        `
      )
      .join("");
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function openCart() {
    document.querySelector("[data-cart-drawer]")?.classList.add("is-open");
    document.querySelector("[data-cart-backdrop]")?.classList.add("is-open");
    document.querySelector("[data-cart-drawer]")?.setAttribute("aria-hidden", "false");
  }

  function closeCart() {
    document.querySelector("[data-cart-drawer]")?.classList.remove("is-open");
    document.querySelector("[data-cart-backdrop]")?.classList.remove("is-open");
    document.querySelector("[data-cart-drawer]")?.setAttribute("aria-hidden", "true");
  }

  function openCustomization(product, itemIndex = null) {
    const modal = document.querySelector("[data-custom-modal]");
    const form = document.querySelector("[data-custom-form]");
    const fields = document.querySelector("[data-custom-fields]");
    if (!modal || !form || !fields) return;

    const item = itemIndex === null ? null : loadCart().items[itemIndex];
    editingItemIndex = itemIndex;
    customPhotoFiles = [];
    retainedAttachments = item?.attachments ? [...item.attachments] : [];
    form.reset();
    form.dataset.productId = product.id;
    document.querySelector("[data-custom-photo-preview]").innerHTML = "";
    document.querySelector("[data-custom-upload-status]").textContent = "";
    document.querySelector("[data-custom-title]").textContent = item ? `Edit ${product.name}` : `Customize ${product.name}`;

    fields.innerHTML = Object.entries(product.options || {})
      .map(([key, values]) => {
        if (!Array.isArray(values) || values.length === 0) return "";
        const label = optionLabel(key);
        return `
          <label class="custom-field">
            <span>${escapeHtml(label.charAt(0).toUpperCase() + label.slice(1))}</span>
            <select name="${escapeHtml(key)}" required>
              <option value="">Choose an option</option>
              ${values.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")}
            </select>
          </label>
        `;
      })
      .join("");

    if (item) {
      Object.entries(item.options || {}).forEach(([key, value]) => {
        const field = form.elements[key];
        if (field) field.value = value;
      });
    }
    renderSelectedPhotos();
    setCustomStep(1);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function renderSelectedPhotos() {
    const preview = document.querySelector("[data-custom-photo-preview]");
    if (!preview) return;
    preview.innerHTML = retainedAttachments.map((photo, index) =>
      `<div class="photo-preview-card"><span>📷 Saved photo ${index + 1}</span><button type="button" data-existing-photo-remove="${index}">Remove</button></div>`
    ).join("");
    customPhotoFiles.forEach((file, index) => {
      const card = document.createElement("div");
      card.className = "photo-preview-card";
      const image = document.createElement("img");
      const url = URL.createObjectURL(file);
      image.src = url;
      image.alt = file.name;
      image.onload = () => URL.revokeObjectURL(url);
      card.appendChild(image);
      card.insertAdjacentHTML("beforeend", `<div class="photo-controls"><button type="button" data-photo-up="${index}" aria-label="Move photo left">←</button><button type="button" data-photo-down="${index}" aria-label="Move photo right">→</button><button type="button" data-photo-remove="${index}">Remove</button></div>`);
      preview.appendChild(card);
    });
  }

  function setCustomStep(step) {
    const form = document.querySelector("[data-custom-form]");
    if (!form) return;
    if (step > customStep && customStep === 1 && !form.reportValidity()) return;
    customStep = Math.max(1, Math.min(3, step));
    document.querySelectorAll("[data-custom-step]").forEach(section => {
      section.hidden = Number(section.dataset.customStep) !== customStep;
    });
    document.querySelectorAll("[data-step-indicator]").forEach(indicator => {
      indicator.classList.toggle("is-active", Number(indicator.dataset.stepIndicator) === customStep);
      indicator.classList.toggle("is-complete", Number(indicator.dataset.stepIndicator) < customStep);
    });
    if (customStep === 3) renderCustomizationReview();
  }

  function renderCustomizationReview() {
    const form = document.querySelector("[data-custom-form]");
    const review = document.querySelector("[data-custom-review]");
    const product = findProduct(form?.dataset.productId);
    if (!form || !review || !product) return;
    const data = new FormData(form);
    const details = [];
    for (const [key, value] of data.entries()) {
      if (key !== "reference_photos" && String(value).trim()) {
        details.push(`<li><strong>${escapeHtml(optionLabel(key))}:</strong> ${escapeHtml(value)}</li>`);
      }
    }
    const photoCount = retainedAttachments.length + customPhotoFiles.length;
    review.innerHTML = `<h3>${escapeHtml(product.name)}</h3><p><strong>${money(product.price)}</strong></p>${details.length ? `<ul>${details.join("")}</ul>` : "<p>As displayed, with no extra options.</p>"}<p>📷 ${photoCount} private reference photo(s)</p><p class="review-note">Please confirm every detail before adding this item to your cart.</p>`;
  }

  function closeCustomization() {
    const modal = document.querySelector("[data-custom-modal]");
    modal?.classList.remove("is-open");
    modal?.setAttribute("aria-hidden", "true");
  }

  function optimizedImage(file) {
    if (file.size <= 3.5 * 1024 * 1024) return Promise.resolve(file);
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(file);
      image.onload = () => {
        const scale = Math.min(1, 1800 / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          URL.revokeObjectURL(url);
          if (!blob) return reject(new Error("Photo optimization failed."));
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
        }, "image/jpeg", .86);
      };
      image.onerror = () => reject(new Error("One selected photo could not be read."));
      image.src = url;
    });
  }

  function uploadPhoto(file, onProgress) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open("POST", "/api/upload-photo");
      request.responseType = "json";
      request.upload.onprogress = event => {
        if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
      };
      request.onload = () => request.status >= 200 && request.status < 300
        ? resolve(request.response)
        : reject(new Error(request.response?.error || "Photo upload failed."));
      request.onerror = () => reject(new Error("Photo upload failed."));
      const body = new FormData();
      body.append("photo", file);
      request.send(body);
    });
  }

  async function addCustomizedItem(form) {
    const product = findProduct(form.dataset.productId);
    if (!product) return;

    const data = new FormData(form);
    const options = {};
    for (const [key, value] of data.entries()) {
      if (key === "reference_photos") continue;
      const cleanValue = String(value).trim();
      if (cleanValue) options[key] = cleanValue;
    }

    const files = customPhotoFiles;
    if (retainedAttachments.length + files.length > 5) {
      alert("Please choose no more than 5 reference photos.");
      return;
    }

    const status = document.querySelector("[data-custom-upload-status]");
    const submit = form.querySelector("[type=submit]");
    submit.disabled = true;

    try {
      const attachments = [...retainedAttachments];
      for (let index = 0; index < files.length; index += 1) {
        const file = await optimizedImage(files[index]);
        const uploaded = await uploadPhoto(file, percentage => {
          status.textContent = `Uploading photo ${index + 1} of ${files.length}: ${percentage}%`;
        });
        attachments.push({ pathname: uploaded.pathname, name: file.name });
      }
      if (editingItemIndex !== null) {
        const cart = loadCart();
        const item = cart.items[editingItemIndex];
        if (item) {
          item.options = options;
          item.attachments = attachments;
          saveCart(cart);
          openCart();
        }
      } else {
        addToCart(product, 1, options, attachments);
      }
      status.textContent = "";
      closeCustomization();
    } catch (error) {
      console.error("Photo upload error:", error);
      status.textContent = error.message;
    } finally {
      submit.disabled = false;
    }
  }

  async function checkoutAll() {
    const cart = loadCart();
    if (!cart.items.length) return;

    const checkoutButton = document.querySelector("[data-checkout-all]");
    checkoutButton.disabled = true;
    checkoutButton.textContent = "Connecting to PayPal…";

    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart })
      });

      const data = await response.json();

      if (!response.ok || !data.approveUrl) {
        throw new Error(data.error || "PayPal could not create the order.");
      }

      window.location.assign(data.approveUrl);
    } catch (error) {
      console.error("PayPal checkout error:", error);
      alert(error.message || "PayPal checkout is temporarily unavailable.");
      checkoutButton.disabled = false;
      checkoutButton.textContent = "Checkout securely with PayPal";
    }
  }

  async function captureApprovedOrder() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") !== "success" || !params.get("token")) return;

    try {
      const response = await fetch("/api/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: params.get("token"), cart: loadCart() })
      });

      const data = await response.json();
      if (!response.ok || data.status !== "COMPLETED") {
        throw new Error(data.error || "PayPal payment could not be confirmed.");
      }

      localStorage.removeItem(CART_KEY);
      renderCart();
      alert(
        data.customerEmailSent
          ? "Payment completed successfully. Your confirmation email is on its way!"
          : "Payment completed successfully. Thank you for your order!"
      );
    } catch (error) {
      console.error("PayPal capture error:", error);
      alert("PayPal approved the order, but confirmation failed. Please contact us before trying again.");
    } finally {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  document.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add-to-cart]");
    if (addButton) {
      const product = findProduct(addButton.dataset.addToCart);
      if (!product) {
        alert("This product could not be added. Please refresh the page.");
        return;
      }

      addToCart(product);
      return;
    }

    const customizeButton = event.target.closest("[data-customize-product]");
    if (customizeButton) {
      const product = findProduct(customizeButton.dataset.customizeProduct);
      if (!product) {
        alert("This product could not be customized. Please refresh the page.");
        return;
      }
      openCustomization(product);
      return;
    }

    if (event.target.closest("[data-cart-open]")) openCart();
    if (event.target.closest("[data-cart-close], [data-cart-backdrop]")) closeCart();
    if (event.target.closest("[data-custom-close]")) closeCustomization();
    if (event.target.matches("[data-custom-modal]")) closeCustomization();

    const increaseButton = event.target.closest("[data-cart-increase]");
    if (increaseButton) changeQuantity(Number(increaseButton.dataset.cartIncrease), 1);

    const decreaseButton = event.target.closest("[data-cart-decrease]");
    if (decreaseButton) changeQuantity(Number(decreaseButton.dataset.cartDecrease), -1);

    const editButton = event.target.closest("[data-cart-edit]");
    if (editButton) {
      const index = Number(editButton.dataset.cartEdit);
      const item = loadCart().items[index];
      const product = item ? findProduct(item.id) : null;
      if (product) {
        closeCart();
        openCustomization(product, index);
      }
    }

    const removeButton = event.target.closest("[data-cart-remove]");
    if (removeButton) removeItem(Number(removeButton.dataset.cartRemove));

    if (event.target.closest("[data-custom-next]")) setCustomStep(customStep + 1);
    if (event.target.closest("[data-custom-prev]")) setCustomStep(customStep - 1);

    const removePhoto = event.target.closest("[data-photo-remove]");
    if (removePhoto) {
      customPhotoFiles.splice(Number(removePhoto.dataset.photoRemove), 1);
      renderSelectedPhotos();
    }
    const removeExisting = event.target.closest("[data-existing-photo-remove]");
    if (removeExisting) {
      retainedAttachments.splice(Number(removeExisting.dataset.existingPhotoRemove), 1);
      renderSelectedPhotos();
    }
    const moveUp = event.target.closest("[data-photo-up]");
    if (moveUp) {
      const index = Number(moveUp.dataset.photoUp);
      if (index > 0) [customPhotoFiles[index - 1], customPhotoFiles[index]] = [customPhotoFiles[index], customPhotoFiles[index - 1]];
      renderSelectedPhotos();
    }
    const moveDown = event.target.closest("[data-photo-down]");
    if (moveDown) {
      const index = Number(moveDown.dataset.photoDown);
      if (index < customPhotoFiles.length - 1) [customPhotoFiles[index + 1], customPhotoFiles[index]] = [customPhotoFiles[index], customPhotoFiles[index + 1]];
      renderSelectedPhotos();
    }

    if (event.target.closest("[data-checkout-all]")) checkoutAll();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeCart();
      closeCustomization();
    }
  });

  document.addEventListener("submit", event => {
    if (!event.target.matches("[data-custom-form]")) return;
    event.preventDefault();
    addCustomizedItem(event.target);
  });

  document.addEventListener("change", event => {
    if (event.target.matches("[data-required-by-date]")) {
      const cart = loadCart();
      cart.requiredByDate = event.target.value || "";
      saveCart(cart);
      return;
    }

    if (!event.target.matches('input[name="reference_photos"]')) return;
    const available = Math.max(0, 5 - retainedAttachments.length);
    customPhotoFiles = Array.from(event.target.files || []).slice(0, available);
    renderSelectedPhotos();
  });

  document.addEventListener("velvet:currency-change", renderCart);

  document.addEventListener("DOMContentLoaded", () => {
    createCartUI();
    captureApprovedOrder();
  });
})();
