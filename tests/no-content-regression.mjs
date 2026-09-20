import fs from 'node:fs';
const checks={
'index.html':['Created around you','Why Choose Velvet Charms?','Simple & secure','Payments & Ordering','The story continues','Step inside the Velvet Universe'],
'catalogue.html':['Body Glow Collection','Order as shown — or personalize your ritual.','Made Especially for You','Create Your Velvet Ritual','Velvet Stories','Every scent begins with a feeling'],
'about.html':['About Velvet Charms','Fourteen Makers, Many Creative Worlds','Created around your story','Have Something Different in Mind?'],
'faq.html':['Frequently Asked Questions'],
'contact.html':['Contact'],
'universe.html':['Velvet Universe']};
for(const [f,terms] of Object.entries(checks)){const s=fs.readFileSync(f,'utf8'); for(const t of terms) if(!s.includes(t)) throw new Error(`${f} lost approved content: ${t}`);}
console.log('Body Glow approved content regression guard PASS');


// Velvet Classics must remain present in Body Glow only.
const fragranceWorld=fs.readFileSync('fragrance-world.js','utf8');
const fragranceOptions=fs.readFileSync('fragrance-catalogue-options.js','utf8');
for(const name of ['IVORY HOUR','VEILED','BLACK HONEY','SACRED SMOKE']){
  if(!fragranceWorld.includes(name)) throw new Error(`Missing Velvet Classic story: ${name}`);
  if(!fragranceOptions.includes(name)) throw new Error(`Missing Velvet Classic catalogue choice: ${name}`);
}
