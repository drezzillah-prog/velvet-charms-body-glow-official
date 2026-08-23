/* Completes the Body Glow About artist-specialty localization in FR/IT/DE. */
(() => {
  'use strict';
  const maps={
    fr:{
      'Needle-Felted Animals & Keepsakes':'Animaux feutrés à l’aiguille & objets-souvenirs',
      'Botanical Skincare & Body Care':'Soins botaniques du visage & du corps',
      'Knitted & Braided Textile Art':'Art textile tricoté & tressé',
      'Perfumery & Scent Design':'Parfumerie & création olfactive'
    },
    it:{
      'Needle-Felted Animals & Keepsakes':'Animali infeltriti ad ago & oggetti-ricordo',
      'Botanical Skincare & Body Care':'Skincare botanica & cura del corpo',
      'Knitted & Braided Textile Art':'Arte tessile lavorata a maglia & intrecciata',
      'Perfumery & Scent Design':'Profumeria & creazione olfattiva'
    },
    de:{
      'Needle-Felted Animals & Keepsakes':'Nadelgefilzte Tiere & Erinnerungsstücke',
      'Botanical Skincare & Body Care':'Botanische Haut- & Körperpflege',
      'Knitted & Braided Textile Art':'Gestrickte & geflochtene Textilkunst',
      'Perfumery & Scent Design':'Parfümerie & Duftgestaltung'
    }
  };
  const original=new WeakMap();
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim();
  const lang=()=>window.VELVET_GET_LANGUAGE?.()||document.documentElement.lang||'en';
  function restore(){const root=document.querySelector('.about-panel');if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(w.nextNode()){const n=w.currentNode;if(original.has(n))n.nodeValue=original.get(n);}}
  function apply(){const l=lang();if(!['fr','it','de'].includes(l))return;const root=document.querySelector('.about-panel');if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(w.nextNode()){const n=w.currentNode;if(!norm(n.nodeValue))continue;if(!original.has(n))original.set(n,n.nodeValue);const src=original.get(n),tr=maps[l]?.[norm(src)];if(tr){const a=src.match(/^\s*/)?.[0]||'',b=src.match(/\s*$/)?.[0]||'';n.nodeValue=a+tr+b;}}}
  function refresh(){restore();apply();}
  window.addEventListener('velvet-language-changed',refresh);document.addEventListener('velvet:language-change',refresh);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(refresh,0),{once:true});else refresh();
})();