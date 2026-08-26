import fs from 'node:fs';
const pages=['index.html','catalogue.html','about.html','faq.html','contact.html','universe.html'];
const nav=['index.html','catalogue.html','about.html','faq.html','contact.html','universe.html'];
for(const page of pages){const s=fs.readFileSync(page,'utf8'); for(const href of nav) if(!s.includes(`href="${href}"`)) throw new Error(`${page} missing nav ${href}`); if(!s.includes('localization.js')||!s.includes('multilingual.js')) throw new Error(`${page} missing unified language wiring`);}
console.log('Body Glow page/navigation contract PASS');
