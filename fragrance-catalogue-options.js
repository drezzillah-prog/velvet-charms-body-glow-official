/* Additive bridge: makes every Fragrance World scent available in existing perfume customization. */
(()=>{
'use strict';
function addChoices(){
 const perfumeCategory=(window.VELVET_CATALOGUE?.categories||[]).find(category=>category.name==='Perfumes');
 const names=[...document.querySelectorAll('#fragrance-world .fragrance-story summary strong')].map(node=>node.textContent.trim()).filter(Boolean);
 if(!perfumeCategory||!names.length)return;
 const products=[...(perfumeCategory.products||[])];
 (perfumeCategory.subcategories||[]).forEach(sub=>products.push(...(sub.products||[])));
 products.forEach(product=>{
   if(!product.options||!Array.isArray(product.options.scent))return;
   names.forEach(name=>{if(!product.options.scent.includes(name))product.options.scent.push(name);});
 });
}
document.addEventListener('velvet:catalogue-rendered',()=>setTimeout(addChoices,0));
document.addEventListener('DOMContentLoaded',()=>setTimeout(addChoices,50));
})();
