/* Final language polish for Body Glow customer-facing FR/IT/DE copy. */
(() => {
  'use strict';
  const exact={
    fr:{
      'Carte rituel':'Carte de rituel',
      'Charm à collectionner':'Charm de collection',
      'Beurre corporel':'Beurre pour le corps'
    },
    it:{
      'Burro corpo':'Burro per il corpo',
      'Crema mani & piedi':'Crema mani e piedi',
      'Lavorato a mano':'Lavorato a maglia a mano'
    },
    de:{}
  };
  const lang=()=>{const l=(window.VELVET_GET_LANGUAGE?.()||document.documentElement.lang||'en').slice(0,2).toLowerCase();return ['fr','it','de'].includes(l)?l:'en';};
  function polish(value,l){
    const raw=String(value||''),clean=raw.trim();if(!clean||l==='en')return raw;
    let out=exact[l]?.[clean]||clean,m;
    if((m=clean.match(/^(\d+) photo\(s\) de référence privée\(s\)$/))&&l==='fr')out=Number(m[1])===1?'1 photo de référence privée':`${m[1]} photos de référence privées`;
    if((m=clean.match(/^(\d+) private Referenzfoto\(s\)$/))&&l==='de')out=Number(m[1])===1?'1 privates Referenzfoto':`${m[1]} private Referenzfotos`;
    return raw.replace(clean,out);
  }
  function apply(root=document.body){if(!root)return;const l=lang();if(l==='en')return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(w.nextNode()){const n=w.currentNode;if(!n.nodeValue.trim())continue;const next=polish(n.nodeValue,l);if(next!==n.nodeValue)n.nodeValue=next;}}
  let queued=false;function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;apply(document.body);});}
  const obs=new MutationObserver(schedule);
  function start(){apply(document.body);obs.observe(document.body,{childList:true,subtree:true,characterData:true});}
  window.addEventListener('velvet-language-changed',()=>setTimeout(()=>apply(document.body),0));document.addEventListener('velvet:language-change',()=>setTimeout(()=>apply(document.body),0));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();