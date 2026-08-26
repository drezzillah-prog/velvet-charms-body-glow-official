import fs from 'node:fs';
const s=fs.readFileSync('script.js','utf8');
for(const t of ['catalogue-body-glow.json','fetch(CATALOGUE_FILE','buildCatalogue(data)','buildProductCard','catalogue-root','product-card']) if(!s.includes(t)) throw new Error(`catalogue renderer missing ${t}`);
if(!s.includes('window.VELVET_CATALOGUE = data')) throw new Error('catalogue state handoff missing');
console.log('Body Glow catalogue renderer source contract PASS');
