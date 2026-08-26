/* Body Glow catalogue — lightweight language state/switcher, deliberately observer-free. */
(() => {
  'use strict';
  const KEY='velvet_language';
  const SUPPORTED=['en','ro','fr','it','de'];
  const NAV={
    fr:{Home:'Accueil',Catalogue:'Catalogue',About:'À propos',FAQ:'FAQ',Contact:'Contact','Velvet Universe':'Univers Velvet','Visit Art & Gifts':'Découvrir Art & Gifts'},
    it:{Home:'Home',Catalogue:'Catalogo',About:'Chi siamo',FAQ:'FAQ',Contact:'Contatti','Velvet Universe':'Universo Velvet','Visit Art & Gifts':'Scopri Art & Gifts'},
    de:{Home:'Startseite',Catalogue:'Katalog',About:'Über uns',FAQ:'FAQ',Contact:'Kontakt','Velvet Universe':'Velvet Universum','Visit Art & Gifts':'Art & Gifts entdecken'}
  };
  const saved=localStorage.getItem(KEY);
  let current=SUPPORTED.includes(saved)?saved:(SUPPORTED.includes(document.documentElement.lang)?document.documentElement.lang:'en');
  localStorage.setItem(KEY,current);
  document.documentElement.lang=current;

  function setLanguage(lang){
    const next=SUPPORTED.includes(lang)?lang:'en';
    localStorage.setItem(KEY,next);
    document.documentElement.lang=next;
    if(next!==current) location.reload();
  }
  function translateNav(){
    if(!NAV[current])return;
    document.querySelectorAll('.site-header .nav a').forEach(a=>{
      const source=(a.textContent||'').trim();
      if(NAV[current][source])a.textContent=NAV[current][source];
    });
  }
  function makeSwitcher(){
    document.querySelectorAll('.velvet-language-switcher').forEach(n=>n.remove());
    document.querySelectorAll('[data-language-switcher]:not([data-velvet-selector-guard]),.language-switch,.language-switcher').forEach(n=>n.remove());
    const host=document.querySelector('.site-header .nav')||document.querySelector('.site-header .header-inner');
    if(!host)return;
    const wrap=document.createElement('div');
    wrap.className='velvet-language-switcher';
    wrap.setAttribute('role','group');
    wrap.setAttribute('aria-label','Language');
    SUPPORTED.forEach(lang=>{
      const b=document.createElement('button');
      b.type='button'; b.dataset.lang=lang; b.textContent=lang.toUpperCase();
      b.setAttribute('aria-pressed',String(lang===current));
      b.addEventListener('click',()=>setLanguage(lang));
      wrap.appendChild(b);
    });
    host.appendChild(wrap);
  }
  window.VELVET_GET_LANGUAGE=()=>current;
  window.VELVET_SET_SITE_LANGUAGE=setLanguage;
  function init(){
    translateNav();
    makeSwitcher();
    window.dispatchEvent(new CustomEvent('velvet-language-changed',{detail:{language:current}}));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
