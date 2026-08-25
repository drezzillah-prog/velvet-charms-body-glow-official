/* Natural FR/IT/DE copy for Body Glow homepage details. */
(() => {
'use strict';
const maps={
fr:{
'The catalogue price remains the product price. Your production window and any preferred date are reviewed against the current production queue. Shipping is calculated separately according to destination, parcel size and weight.':'Le prix affiché dans le catalogue reste le prix du produit. Votre créneau de fabrication et toute date souhaitée sont vérifiés en fonction de la file de production en cours. Les frais de livraison sont calculés séparément selon la destination, les dimensions et le poids du colis.',
'The story continues':'L’histoire continue','Step inside the Velvet Universe':'Entrez dans l’Univers Velvet','Discover the ritual details already woven into Body Glow — scent stories, reusable vessels, refills, hidden messages, collectible charms, the Velvet Passport and build-your-own Velvet Boxes.':'Découvrez les détails rituels déjà intégrés à Body Glow : histoires olfactives, contenants réutilisables, recharges, messages cachés, charms à collectionner, Velvet Passport et Velvet Boxes à composer vous-même.','Explore the Velvet Universe':'Découvrir l’Univers Velvet'
},
it:{
'The catalogue price remains the product price. Your production window and any preferred date are reviewed against the current production queue. Shipping is calculated separately according to destination, parcel size and weight.':'Il prezzo mostrato nel catalogo resta il prezzo del prodotto. Il periodo di produzione e l’eventuale data richiesta vengono valutati in base alla coda di lavorazione attuale. La spedizione viene calcolata separatamente secondo destinazione, dimensioni e peso del pacco.',
'The story continues':'La storia continua','Step inside the Velvet Universe':'Entra nell’Universo Velvet','Discover the ritual details already woven into Body Glow — scent stories, reusable vessels, refills, hidden messages, collectible charms, the Velvet Passport and build-your-own Velvet Boxes.':'Scopri i dettagli rituali già intrecciati a Body Glow: storie olfattive, contenitori riutilizzabili, ricariche, messaggi nascosti, charm da collezione, Velvet Passport e Velvet Box da comporre come desideri.','Explore the Velvet Universe':'Scopri l’Universo Velvet'
},
de:{
'The catalogue price remains the product price. Your production window and any preferred date are reviewed against the current production queue. Shipping is calculated separately according to destination, parcel size and weight.':'Der im Katalog angezeigte Preis bleibt der Produktpreis. Ihr Fertigungsfenster und ein eventuelles Wunschdatum werden anhand der aktuellen Produktionsauslastung geprüft. Die Versandkosten werden separat nach Zielort, Paketgröße und Gewicht berechnet.',
'The story continues':'Die Geschichte geht weiter','Step inside the Velvet Universe':'Entdecken Sie das Velvet Universum','Discover the ritual details already woven into Body Glow — scent stories, reusable vessels, refills, hidden messages, collectible charms, the Velvet Passport and build-your-own Velvet Boxes.':'Entdecken Sie die Ritualdetails, die bereits zu Body Glow gehören: Duftgeschichten, wiederverwendbare Behälter, Nachfüllungen, verborgene Nachrichten, Sammel-Charms, den Velvet Passport und individuell zusammengestellte Velvet Boxes.','Explore the Velvet Universe':'Velvet Universum entdecken'
}}
const original=new WeakMap();
const language=()=>window.VELVET_GET_LANGUAGE?.()||document.documentElement.lang||'en';
const normalize=v=>String(v||'').replace(/\s+/g,' ').trim();
function restore(){const root=document.querySelector('main')||document.body;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(w.nextNode()){const n=w.currentNode;if(original.has(n))n.nodeValue=original.get(n);}}
function apply(){const l=language();if(!['fr','it','de'].includes(l))return;const root=document.querySelector('main')||document.body;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(w.nextNode()){const n=w.currentNode;if(!normalize(n.nodeValue))continue;if(!original.has(n))original.set(n,n.nodeValue);const src=original.get(n),tr=maps[l]?.[normalize(src)];if(tr){const lead=src.match(/^\s*/)?.[0]||'',trail=src.match(/\s*$/)?.[0]||'';n.nodeValue=lead+tr+trail;}}}
function refresh(){restore();apply();}
window.addEventListener('velvet-language-changed',refresh);document.addEventListener('velvet:language-change',refresh);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(refresh,0),{once:true});else refresh();
})();