(()=>{
'use strict';
const families=[
 {name:'Evolving Stories',tagline:'Scents that change as the story unfolds.',items:[
  ['The Gift of Death / Cadoul Morții','Old → Dust → Decay → Transformation → Sweetness → New Life','Old paper, dusty iris, cedar, oak, fine leather, unburnt tobacco and controlled patchouli evolving into honey, black vanilla, fig, blackcurrant, warm resin and a dark flower.'],
  ['The Last Train Home','Cold distance → Home','Cold metal and rain move through textile and wood into coffee, warm skin and the feeling of home.'],
  ['After the Funeral','Grief → Continuation','Lilies, wet earth, discreet incense and wood gradually give way to green, luminous notes.'],
  ['3:17 A.M.','Night → Morning','Cold night air, clean sheets, ozone/electricity and skin, resolving into coffee and morning.'],
  ['The House Remembers','Memory held in a room','Old wood, furniture wax, books, dust, dried apples and very distant smoke.'],
  ['The Witch Was Right','Wild → Resinous → Sweet-dark','Crushed wild herbs, black tea, dark fruit, resins, a trace of smoke and burnt honey.'],
  ['The House Burns Down','Ashes → New life','Smoke, burnt wood and paper → resin → wet earth → greenery → flowers → honey.']
 ]},
 {name:'Relief in Times of Diet',tagline:'Forbidden comfort, bottled with a straight face.',items:[
  ['Sunday Roast','Savory comfort','Aromatic herbs, rosemary and pepper → browned crust and butter → baked potato and savory warmth.'],
  ['French Bakery at 7 A.M.','Morning temptation','Butter → warm dough → croissant crust → coffee → marmalade.'],
  ['Pizza Night','In development','Concept preserved; final scent composition remains intentionally unpublished until approved.'],
  ['Cinnamon Roll Incident','In development','Concept preserved; final scent composition remains intentionally unpublished until approved.'],
  ['Movie Night','In development','Concept preserved; final scent composition remains intentionally unpublished until approved.'],
  ['Boiled Potato — The Forbidden Feast','In development','Concept preserved; final scent composition remains intentionally unpublished until approved.'],
  ['Diet Survival Kit','In development','Concept preserved; final scent composition remains intentionally unpublished until approved.']
 ]},
 {name:'SERIOUSLY UNSERIOUS™',tagline:'Fine fragrance. Questionable inspiration.',items:[
  ['Eau de Chantier — Chantier Intense™','Construction-site couture','Mineral air, cement dust, warm stone, steel and ozone → sun-warmed salty skin, clean musk, warm cotton and dry cedar → a discreet hot-asphalt facet, freshly cut wood, resin, mineral notes and black coffee.'],
  ['Freshly Divorced','Freedom, with paperwork','Champagne, lipstick, paper/documents, leather and cold air.'],
  ['IKEA Relationship Test','Assembly required','Pine, cardboard, pencil, coffee, cinnamon and fine Swedish fury.'],
  ['Monday, Unfortunately','Corporate despair','Strong coffee → printer toner and paper → clean cotton → corporate despair.'],
  ['Salary Just Hit','Brief financial optimism','Paper, ink, leather, expensive perfume and coffee; remaining composition stays unpublished until approved.'],
  ["Grandma's Plastic-Covered Sofa",'In development','Concept preserved; final scent composition remains intentionally unpublished until approved.'],
  ['The Uber Is Here','In development','Concept preserved; final scent composition remains intentionally unpublished until approved.'],
  ['One More Episode','In development','Concept preserved; final scent composition remains intentionally unpublished until approved.'],
  ["I Cleaned Because You're Coming Over",'In development','Concept preserved; final scent composition remains intentionally unpublished until approved.']
 ]},
 {name:'Experimental / Oddities',tagline:'For scents that refuse ordinary categories.',items:[
  ['SHINIMARC™','Sea-clean → Honeyed strange','Sea salt/ocean, ozone and aldehydic cleanliness, clean musk, a very discreet antiseptic facet and honey.']
 ]}
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){
 const anchor=document.querySelector('#scent-stories'); if(!anchor||document.querySelector('#fragrance-world'))return;
 const section=document.createElement('section'); section.id='fragrance-world'; section.className='fragrance-world';
 section.innerHTML=`<p class="section-kicker">New Velvet scent worlds</p><h3>Fragrance World</h3><p class="fragrance-world-intro">The original Velvet scent stories remain part of the collection. These new fragrance families expand the world without replacing them.</p><div class="fragrance-family-grid">${families.map(f=>`<article class="fragrance-family"><h4>${esc(f.name)}</h4><p class="fragrance-tagline">${esc(f.tagline)}</p><div class="fragrance-list">${f.items.map(i=>`<details class="fragrance-story"><summary><strong>${esc(i[0])}</strong><span>${esc(i[1])}</span></summary><p>${esc(i[2])}</p></details>`).join('')}</div></article>`).join('')}</div>`;
 anchor.insertAdjacentElement('afterend',section);
}
document.addEventListener('DOMContentLoaded',render);
})();
