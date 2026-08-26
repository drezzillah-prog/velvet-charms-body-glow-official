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
