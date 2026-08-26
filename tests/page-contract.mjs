import fs from 'node:fs';
const pages=['index.html','catalogue.html','about.html','faq.html','contact.html','universe.html'];
const nav=['index.html','catalogue.html','about.html','faq.html','contact.html','universe.html'];
for(const page of pages){
  const s=fs.readFileSync(page,'utf8');
  for(const href of nav) if(!s.includes(`href="${href}"`)) throw new Error(`${page} missing nav ${href}`);
  if(!s.includes('localization.js')) throw new Error(`${page} missing language state wiring`);
  if(!s.includes('script.js')) throw new Error(`${page} missing site runtime`);
}
const runtime=fs.readFileSync('script.js','utf8');
if(!runtime.includes('multilingual.js')||!runtime.includes('i18n-runtime.js')) throw new Error('site runtime no longer bootstraps multilingual layer');
console.log('Body Glow page/navigation/language contract PASS');
