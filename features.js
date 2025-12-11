/* features.js — Cart + Wishlist for Velvet Charms
   Safe augment: does not replace your existing scripts.
   Put this file in repo root and include <script src="features.js"></script>
   Works for both sites (Body Glow & Art & Gifts).
*/

(() => {
  const CATALOG_FILES = ['/catalogue-body-glow.json','/catalogue-art-gifts.json','/catalogue.json'];

  /* ---------- Utilities ---------- */
  function qs(sel,parent=document){return parent.querySelector(sel);}
  function qsa(sel,parent=document){return Array.from(parent.querySelectorAll(sel));}
  function $(tag,attrs={},parent=null){
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v])=>{
      if(k==='html') el.innerHTML = v;
      else if(k==='text') el.textContent = v;
      else el.setAttribute(k,v);
    });
    if(parent) parent.appendChild(el);
    return el;
  }
  function money(n){ return (Number(n)||0).toFixed(2) + ' USD'; }

  /* ---------- LocalStorage keys ---------- */
  const CART_KEY = 'velvetcharms_cart_v1';
  const WISH_KEY = 'velvetcharms_wishlist_v1';

  function loadCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch(e){return {};} }
  function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }
  function loadWish(){ try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; } catch(e){return [];} }
  function saveWish(w){ localStorage.setItem(WISH_KEY, JSON.stringify(w)); }

  /* ---------- Catalog loading (merge multiple JSONs) ---------- */
  let catalogue = {}; // id -> product
  async function loadCatalogues(){
    const promises = CATALOG_FILES.map(f => fetch(f).then(r => r.ok? r.json().catch(()=>null) : null).catch(()=>null));
    const results = await Promise.all(promises);
    results.forEach(json=>{
      if(!json || !json.categories) return;
      json.categories.forEach(cat=>{
        if(cat.products) cat.products.forEach(p => catalogue[p.id] = p);
        if(cat.subcategories) {
          cat.subcategories.forEach(sc=>{
            if(sc.products) sc.products.forEach(p=>catalogue[p.id] = p);
            if(sc.subcategories) sc.subcategories.forEach(sc2=>{
              if(sc2.products) sc2.products.forEach(p=>catalogue[p.id] = p);
            });
          });
        }
      });
    });
  }

  /* ---------- DOM: header icons, cart drawer ---------- */
  function injectHeaderUI(){
    const header = qs('nav') || qs('header') || document.body;
    if(!header) return;
    // avoid injecting twice
    if(header.querySelector('.vc-header-actions')) return;
    const wrapper = $('div',{class:'vc-header-actions'}, header);
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '10px';
    const wishBtn = $('button',{class:'vc-wish-btn','aria-label':'Wishlist'},wrapper);
    wishBtn.innerHTML = '❤ <span class="vc-count"></span>';
    wishBtn.addEventListener('click', ()=> { window.location.href = '/wishlist.html'; });
    const cartBtn = $('button',{class:'vc-cart-btn','aria-label':'Cart'},wrapper);
    cartBtn.innerHTML = '🛒 <span class="vc-count"></span>';
    cartBtn.addEventListener('click', ()=> toggleCartDrawer(true));
    updateHeaderCounts();
  }

  function updateHeaderCounts(){
    const cart = loadCart();
    const qty = Object.values(cart).reduce((s,i)=>s + (i.qty||0),0);
    const wish = loadWish().length;
    // set counts per button correctly
    qsa('.vc-header-actions .vc-count').forEach(span => {
      const parent = span.parentElement;
      if (parent && parent.classList.contains('vc-cart-btn')) span.textContent = qty;
      else span.textContent = wish;
    });
    qsa('.vc-header-actions button').forEach(b=>{
      if(b.classList.contains('vc-cart-btn')) b.title = `Cart — ${qty} item(s)`;
      if(b.classList.contains('vc-wish-btn')) b.title = `Wishlist — ${wish} item(s)`;
    });
  }

  let drawerEl = null;
  function createCartDrawer(){
    if(drawerEl) return;
    drawerEl = $('div',{class:'vc-cart-drawer'}, document.body);
    drawerEl.innerHTML = `
      <div class="vc-cart-drawer__backdrop"></div>
      <aside class="vc-cart-drawer__panel" role="dialog" aria-label="Cart">
        <button class="vc-cart-drawer__close" aria-label="Close cart">✕</button>
        <h3>Your Cart</h3>
        <div class="vc-cart-items"></div>
        <div class="vc-cart-summary">
          <div class="vc-cart-subtotal">Subtotal: <strong class="vc-subtotal"></strong></div>
          <div style="display:flex; gap:8px; margin-top:8px;">
            <button class="vc-checkout-all">Checkout All (opens PayPal)</button>
            <button class="vc-clear-cart">Clear</button>
          </div>
        </div>
      </aside>
    `;
    qs('.vc-cart-drawer__close',drawerEl).addEventListener('click', ()=> toggleCartDrawer(false));
    qs('.vc-cart-drawer__backdrop',drawerEl).addEventListener('click', ()=> toggleCartDrawer(false));
    qs('.vc-clear-cart',drawerEl).addEventListener('click', ()=> {
      if(confirm('Clear cart?')) { localStorage.removeItem(CART_KEY); renderCartItems(); updateHeaderCounts(); }
    });
    qs('.vc-checkout-all',drawerEl).addEventListener('click', checkoutAll);
    renderCartItems();
  }

  function toggleCartDrawer(open){
    createCartDrawer();
    drawerEl.classList.toggle('vc-open', !!open);
    renderCartItems();
  }

  function renderCartItems(){
    createCartDrawer();
    const container = qs('.vc-cart-items',drawerEl);
    container.innerHTML = '';
    const cart = loadCart();
    const ids = Object.keys(cart);
    if(ids.length === 0){
      container.innerHTML = `<p class="vc-empty">Cart is empty — add something lovely 💚</p>`;
      qs('.vc-subtotal',drawerEl).textContent = money(0);
      updateHeaderCounts();
      return;
    }
    let total = 0;
    ids.forEach(id=>{
      const item = cart[id];
      const prod = catalogue[id] || item;
      const price = Number(item.price || prod.price || 0);
      const qty = item.qty || 1;
      total += price * qty;
      const row = $('div',{class:'vc-cart-row'}, container);
      row.innerHTML = `
        <div class="vc-cart-row__left">
          <img src="${(prod.images && prod.images[0]) ? encodeURI(prod.images[0]) : ''}" alt="" onerror="this.style.display='none'">
        </div>
        <div class="vc-cart-row__mid">
          <a href="/product.html?id=${id}" class="vc-cart-row__title">${prod.name || item.name}</a>
          <div class="vc-cart-row__price">${money(price)} × <span class="vc-qty">${qty}</span></div>
        </div>
        <div class="vc-cart-row__actions">
          <button class="vc-dec">−</button>
          <button class="vc-inc">+</button>
          <button class="vc-remove">Remove</button>
          <div><button class="vc-checkout-item">Checkout</button></div>
        </div>
      `;
      qs('.vc-inc',row).addEventListener('click', ()=> {
        cart[id].qty = (cart[id].qty || 1) + 1; saveCart(cart); renderCartItems(); updateHeaderCounts();
      });
      qs('.vc-dec',row).addEventListener('click', ()=> {
        cart[id].qty = Math.max(1,(cart[id].qty || 1)-1); saveCart(cart); renderCartItems(); updateHeaderCounts();
      });
      qs('.vc-remove',row).addEventListener('click', ()=> {
        delete cart[id]; saveCart(cart); renderCartItems(); updateHeaderCounts();
      });
      qs('.vc-checkout-item',row).addEventListener('click', ()=> {
        const link = (prod.paymentLink || item.paymentLink);
        if(link) window.open(link, '_blank');
        else alert('No direct PayPal payment link for this product.');
      });
    });
    qs('.vc-subtotal',drawerEl).textContent = money(total);
    updateHeaderCounts();
  }

  // CheckoutAll posts the cart to /api/create-order to build a PayPal order server-side.
  async function checkoutAll(){
    const cart = loadCart();
    const ids = Object.keys(cart);
    if(ids.length === 0) return alert('Cart empty');

    // Build cart payload
    const items = ids.map(id => {
      const it = cart[id];
      return { id, name: it.name || id, price: Number(it.price || 0).toFixed(2), qty: it.qty || 1 };
    });

    // Try server-side order creation
    try {
      const r = await fetch('/api/create-order', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ cart: { items } })
      });
      const j = await r.json();
      if (r.ok && j.approveUrl) {
        window.open(j.approveUrl, '_blank');
        return;
      } else {
        console.warn('create-order response missing approveUrl', j);
      }
    } catch (e) {
      console.warn('create-order failed', e);
    }

    // Fallback: open each product.paymentLink
    ids.forEach(id=>{
      const prod = catalogue[id] || cart[id];
      if(prod && prod.paymentLink) window.open(prod.paymentLink, '_blank');
      else console.warn('Missing paymentLink for', id);
    });
  }

  /* ---------- Add to cart / wishlist helpers ---------- */
  function addToCart(productId, productObj, qty=1){
    const cart = loadCart();
    if(!cart[productId]){
      cart[productId] = { id: productId, name: productObj.name || productId, price: productObj.price || 0, paymentLink: productObj.paymentLink || '' , qty:0};
    }
    cart[productId].qty = (cart[productId].qty || 0) + qty;
    saveCart(cart);
    renderCartItems();
    updateHeaderCounts();
  }
  function setCartQty(productId, qty){
    const cart = loadCart();
    if(!cart[productId]) return;
    cart[productId].qty = qty;
    if(qty <= 0) delete cart[productId];
    saveCart(cart);
    renderCartItems();
    updateHeaderCounts();
  }
  function toggleWishlist(productId){
    const w = loadWish();
    const i = w.indexOf(productId);
    if(i === -1) { w.push(productId); saveWish(w); updateHeaderCounts(); return true; }
    w.splice(i,1); saveWish(w); updateHeaderCounts(); return false;
  }

  /* ---------- Insert buttons into catalogue and product page ---------- */
  function insertButtonsOnProductPage(productId, productObj){
    const selectors = ['.product-actions', '.product-details', '.product-meta', '#product-info', '.product-card', 'main', 'body'];
    let container = selectors.map(s=>qs(s)).find(x=>x!==null);
    if(!container) container = document.body;
    if(container.querySelector('.vc-product-controls')) return;
    const controls = $('div',{class:'vc-product-controls'}, container);
    controls.innerHTML = `
      <button class="vc-ialoveit small">❤ I love it</button>
      <button class="vc-addcart small">Add to cart</button>
      <div class="vc-product-price">Price: <strong>${money(productObj.price)}</strong></div>
    `;
    qs('.vc-addcart',controls).addEventListener('click', ()=> {
      addToCart(productId, productObj, 1);
      qs('.vc-addcart',controls).textContent = 'Added ✓';
      setTimeout(()=> qs('.vc-addcart',controls).textContent = 'Add to cart', 1000);
    });
    qs('.vc-ialoveit',controls).addEventListener('click', ()=> {
      const now = toggleWishlist(productId);
      qs('.vc-ialoveit',controls).textContent = now? '❤ Saved' : '❤ I love it';
      updateHeaderCounts();
    });
  }

  function insertButtonsOnCatalogue(){
    // find anchors linking to product.html (common pattern used by your script.js)
    const anchors = Array.from(document.querySelectorAll('a[href*="product.html"]'));
    if(!anchors.length) return;
    anchors.forEach(a=>{
      try {
        const url = new URL(a.href, location.href);
        const pid = url.searchParams.get('id');
        if(!pid) return;
        const card = a.closest('.product-card, .card, .product, article, li, div.item, div.product-card') || a.parentElement;
        if(card && card.querySelector('.vc-mini-controls')) return;
        const cont = card || a;
        const btnWrap = $('div',{class:'vc-mini-controls'}, cont);
        btnWrap.style.marginTop = '6px';
        const heart = $('button',{class:'vc-mini-love','data-id':pid}, btnWrap);
        heart.textContent = '❤';
        heart.title = 'Add to wishlist';
        heart.addEventListener('click', (e)=>{
          e.stopPropagation();
          const now = toggleWishlist(pid);
          heart.textContent = now? '❤' : '♡';
          updateHeaderCounts();
        });
        const add = $('button',{class:'vc-mini-add','data-id':pid}, btnWrap);
        add.textContent = 'Add';
        add.title = 'Add to cart';
        add.addEventListener('click', (e)=>{
          e.stopPropagation();
          const prod = catalogue[pid] || { name: a.textContent.trim(), price: 0, paymentLink: '' };
          addToCart(pid, prod, 1);
          add.textContent = '✓';
          setTimeout(()=> add.textContent = 'Add', 900);
        });
      } catch(e){}
    });
  }

  /* ---------- Wishlist page renderer ---------- */
  function createWishlistPage(){
    if(!location.pathname.endsWith('/wishlist.html') && !location.pathname.endsWith('wishlist.html')) return;
    (async ()=>{
      await ensureCataloguesLoaded();
      const w = loadWish();
      const container = $('div',{class:'vc-wishlist-root'}, document.body);
      container.innerHTML = `<h2>Your wishlist</h2><div class="vc-wishlist-items"></div>`;
      const list = qs('.vc-wishlist-items',container);
      if(w.length === 0) { list.innerHTML = `<p>No saved items yet.</p>`; return; }
      w.forEach(id=>{
        const prod = catalogue[id] || { name: id, images: [], price: 0, paymentLink: ''};
        const card = $('div',{class:'vc-wish-card'}, list);
        card.innerHTML = `
          <div class="vc-wish-card__img"><img src="${(prod.images && prod.images[0])? encodeURI(prod.images[0]) : ''}" onerror="this.style.display='none'"></div>
          <div class="vc-wish-card__body">
            <a href="/product.html?id=${id}" class="vc-wish-title">${prod.name}</a>
            <div class="vc-wish-price">${money(prod.price)}</div>
            <div style="margin-top:8px">
              <button data-id="${id}" class="vc-wish-add">Add to cart</button>
              <button data-id="${id}" class="vc-wish-remove">Remove</button>
            </div>
          </div>
        `;
        qs('.vc-wish-add',card).addEventListener('click', ()=> { addToCart(id, prod, 1); alert('Added to cart'); });
        qs('.vc-wish-remove',card).addEventListener('click', ()=> {
          const arr = loadWish().filter(x=>x!==id); saveWish(arr); card.remove(); updateHeaderCounts();
        });
      });
    })();
  }

  /* ---------- page product-id detection & boot sequence ---------- */
  function getProductIdFromUrl(){
    try{
      const url = new URL(location.href);
      return url.searchParams.get('id');
    }catch(e){ return null; }
  }

  let catalogLoaded = false;
  async function ensureCataloguesLoaded(){
    if(catalogLoaded) return;
    await loadCatalogues();
    catalogLoaded = true;
  }

  async function boot(){
    await ensureCataloguesLoaded();
    injectHeaderUI();
    createCartDrawer();
    // try to inject buttons now (if catalogue already rendered)
    insertButtonsOnCatalogue();
    const pid = getProductIdFromUrl();
    if(pid){
      const prod = catalogue[pid] || { id: pid, name: pid, price: 0, images: [], paymentLink: ''};
      insertButtonsOnProductPage(pid, prod);
    }
    // also handle data-product-id attributes
    qsa('[data-product-id]').forEach(el=>{
      const id = el.getAttribute('data-product-id');
      if(!id) return;
      if(el.querySelector('.vc-mini-controls')) return;
      const ctrl = $('div',{class:'vc-mini-controls'}, el);
      const heart = $('button',{class:'vc-mini-love','data-id':id}, ctrl);
      heart.textContent = '❤';
      heart.addEventListener('click', ()=> { const now = toggleWishlist(id); heart.textContent = now? '❤':'♡'; updateHeaderCounts();});
      const add = $('button',{class:'vc-mini-add','data-id':id}, ctrl);
      add.textContent = 'Add';
      add.addEventListener('click', ()=> { addToCart(id, catalogue[id]||{} ,1); add.textContent='✓'; setTimeout(()=>add.textContent='Add',800);});
    });

    createWishlistPage();
    updateHeaderCounts();

    // Secondary safety: if your `script.js` builds catalogue later, set up observer & retry injection:
    setupInjectionObserver();
  }

  // +++ MutationObserver: watches for added product links/sections and injects buttons when they appear +++
  let observer = null;
  function setupInjectionObserver(){
    try {
      if (observer) return;
      const target = document.body;
      observer = new MutationObserver((mutations) => {
        // cheap check: if document contains anchor to product.html -> try to insert
        if (document.querySelector('a[href*="product.html"]') || document.querySelector('.product-card') ) {
          insertButtonsOnCatalogue();
        }
      });
      observer.observe(target, { childList: true, subtree: true });
      // also run a couple of scheduled retries in case MutationObserver misses timing
      setTimeout(insertButtonsOnCatalogue, 400);
      setTimeout(insertButtonsOnCatalogue, 1000);
      setTimeout(insertButtonsOnCatalogue, 2500);
    } catch(e){ /* ignore */ }
  }

  /* ---------- Run ---------- */
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* ---------- CSS injection fallback ---------- */
  const INJECTED_CSS_ID = 'vc-features-css';
  if(!document.getElementById(INJECTED_CSS_ID)){
    const css = `
      .vc-header-actions{ gap:10px; margin-left: auto; display:flex; align-items:center; }
      .vc-header-actions button{ background:transparent; border:none; color:inherit; cursor:pointer; font-size:16px; padding:6px 8px; border-radius:6px;}
      .vc-cart-drawer{ position:fixed; inset:0; pointer-events:none; z-index:10000; transition:opacity .15s ease;}
      .vc-cart-drawer.vc-open{ pointer-events:auto; }
      .vc-cart-drawer__backdrop{ position:fixed; inset:0; background:rgba(0,0,0,.5); opacity:0; transition:opacity .2s; }
      .vc-cart-drawer.vc-open .vc-cart-drawer__backdrop{ opacity:1; }
      .vc-cart-drawer__panel{ position:fixed; right:0; top:0; height:100%; width:360px; background: #061013; color:#fff; transform:translateX(100%); transition:transform .22s ease; box-shadow: -10px 0 30px rgba(0,0,0,.6); padding:18px; overflow:auto; }
      .vc-cart-drawer.vc-open .vc-cart-drawer__panel{ transform:translateX(0); }
      .vc-cart-row{ display:flex; gap:10px; align-items:center; padding:8px 0; border-bottom:1px solid rgba(255,255,255,.04); }
      .vc-cart-row__left img{ width:64px; height:64px; object-fit:cover; border-radius:6px; }
      .vc-cart-row__actions button{ margin:4px 4px 0 0; padding:6px 8px; border-radius:6px; cursor:pointer; }
      .vc-product-controls{ margin-top:14px; display:flex; gap:12px; align-items:center; }
      .vc-product-controls .small{ padding:8px 10px; border-radius:8px; cursor:pointer; }
      .vc-mini-controls{ margin-top:8px; display:flex; gap:6px; }
      .vc-mini-controls button{ padding:6px 8px; border-radius:6px; cursor:pointer; }
      .vc-wishlist-root{ padding:18px; }
      .vc-wish-card{ display:flex; gap:12px; align-items:center; border-bottom:1px solid rgba(0,0,0,.06); padding:12px 0; }
      .vc-wish-card__img img{ width:96px; height:96px; object-fit:cover; border-radius:8px; }
      .vc-empty{ color: rgba(255,255,255,.7); }
    `;
    const style = document.createElement('style'); style.id = INJECTED_CSS_ID; style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

})();
