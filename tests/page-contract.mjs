import fs from 'node:fs';
const pages=['index.html','catalogue.html','about.html','faq.html','contact.html','universe.html'];
const nav=['index.html','catalogue.html','about.html','faq.html','contact.html','universe.html'];
for(const page of pages){
  const s=fs.readFileSync(page,'utf8');
  for(const href of nav) if(!s.includes(`href="${href}"`)) throw new Error(`${page} missing nav ${href}`);
  if(!s.includes('localization.js')) throw new Error(`${page} missing language state wiring`);
  if(page==='catalogue.html'){
    if(!s.includes('catalogue-language.js')||!s.includes('catalogue-page-multilingual.js')) throw new Error('catalogue missing observer-free language runtime');
    if(s.includes('multilingual-pages.js')||s.includes('performance.css')) throw new Error('catalogue reintroduced unstable global observer/performance layer');
  }else{
    const hasDirectMultilingual=s.includes('multilingual.js');
    const hasRuntime=s.includes('script.js');
    if(!hasDirectMultilingual&&!hasRuntime) throw new Error(`${page} missing multilingual bootstrap`);
  }
}
const catalogueLanguage=fs.readFileSync('catalogue-language.js','utf8');
if(catalogueLanguage.includes('MutationObserver')) throw new Error('catalogue language runtime must remain observer-free');
const runtime=fs.readFileSync('script.js','utf8');
if(!runtime.includes('multilingual.js')||!runtime.includes('i18n-runtime.js')) throw new Error('site runtime no longer bootstraps multilingual layer');
if(!runtime.includes("page !== 'catalogue.html'")||!runtime.includes('velvet:catalogue-rendered')) throw new Error('catalogue runtime must avoid global polish observer and emit render completion');
console.log('Body Glow page/navigation/language contract PASS');
