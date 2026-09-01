/* Additive bridge: keeps existing perfume scents and adds the complete approved Velvet fragrance library. */
(()=>{
'use strict';

const COMPLETE_VELVET_FRAGRANCES=[
  'THE GIFT OF DEATH / CADOUL MORȚII',
  'THE LAST TRAIN HOME',
  'AFTER THE FUNERAL',
  '3:17 A.M.',
  'THE HOUSE REMEMBERS',
  'THE WITCH WAS RIGHT',
  'THE HOUSE BURNS DOWN',
  'SUNDAY ROAST',
  'FRENCH BAKERY AT 7 A.M.',
  'PIZZA NIGHT',
  'CINNAMON ROLL INCIDENT',
  'MOVIE NIGHT',
  'BOILED POTATO — THE FORBIDDEN FEAST',
  'DIET SURVIVAL KIT',
  'EAU DE CHANTIER — CHANTIER INTENSE™',
  'FRESHLY DIVORCED',
  'IKEA RELATIONSHIP TEST',
  'MONDAY, UNFORTUNATELY',
  'SALARY JUST HIT',
  "GRANDMA'S PLASTIC-COVERED SOFA",
  'THE UBER IS HERE',
  'ONE MORE EPISODE',
  "I CLEANED BECAUSE YOU'RE COMING OVER",
  'SHINIMARC™',
  'Midnight Library',
  'First Snow',
  'Secret Garden',
  'Moonlight Letters',
  'Silent Forest',
  'Grandma’s Garden',
  'Sunday Morning',
  'First Kiss',
  'Autumn Rain',
  'Paris Café',
  'Winter Library',
  'Vanilla',
  'Gucci Bloom',
  'Dior Sauvage',
  'YSL Libre',
  'Tom Ford Oud Wood',
  'Kilian Love',
  'Don Julio 1942',
  'Double Espresso Martini',
  'Mojito'
];

function addChoices(){
  const perfumeCategory=(window.VELVET_CATALOGUE?.categories||[]).find(category=>category.name==='Perfumes');
  if(!perfumeCategory)return;

  const renderedNames=[...document.querySelectorAll('#fragrance-world .fragrance-story summary strong')]
    .map(node=>node.textContent.trim())
    .filter(Boolean);
  const names=[...new Set([...COMPLETE_VELVET_FRAGRANCES,...renderedNames])];

  const products=[...(perfumeCategory.products||[])];
  (perfumeCategory.subcategories||[]).forEach(sub=>products.push(...(sub.products||[])));

  products.forEach(product=>{
    if(!product.options||!Array.isArray(product.options.scent))return;
    names.forEach(name=>{
      if(!product.options.scent.includes(name))product.options.scent.push(name);
    });
  });
}

document.addEventListener('velvet:catalogue-rendered',()=>setTimeout(addChoices,0));
document.addEventListener('DOMContentLoaded',()=>setTimeout(addChoices,50));
})();
