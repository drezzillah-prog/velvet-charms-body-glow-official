import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const mustExist = (file) => { if (!fs.existsSync(file)) throw new Error(`Missing required release file: ${file}`); };
const mustContain = (file, terms) => {
  const source = read(file);
  for (const term of terms) if (!source.includes(term)) throw new Error(`${file} missing release-critical content: ${term}`);
  return source;
};

for (const file of ['index.html','catalogue.html','about.html','faq.html','contact.html','universe.html','catalogue-body-glow.json','script.js','features.js','localization.js','localization-ro.js','multilingual.js','multilingual-pages.js','catalogue-language.js','catalogue-page-multilingual.js','catalogue-multilingual.js','catalogue-extra-translations.js','ritual-experience.js']) mustExist(file);

mustContain('index.html', ['Why Choose Velvet Charms?','Payments & Ordering','Step inside the Velvet Universe']);
mustContain('about.html', ['About Velvet Charms','14 artists','Fourteen Makers']);
mustContain('contact.html', ['contact-form']);
mustContain('universe.html', ['Second Life Collection','Refill Collection','Hidden Messages','Velvet Stories','Velvet Passport','Velvet Box']);
const catalogue = mustContain('catalogue.html', ['catalogue-root','Made Especially for You','ritual-hub','scent-stories','catalogue-language.js','features.js','ritual-experience.js']);
if (catalogue.includes('performance.css')) throw new Error('Body Glow catalogue must not load performance.css');
if (/<script[^>]+src=["']multilingual\.js["']/i.test(catalogue)) throw new Error('Body Glow catalogue must not load global multilingual.js directly');
if (/<script[^>]+src=["']language-polish\.js["']/i.test(catalogue)) throw new Error('Body Glow catalogue must not load global language-polish.js');

const catLanguage = read('catalogue-language.js');
for (const lang of ['en','ro','fr','it','de']) if (!catLanguage.includes(`'${lang}'`)) throw new Error(`Catalogue language missing ${lang}`);
if (catLanguage.includes('MutationObserver')) throw new Error('Catalogue language runtime must remain observer-free');

const compatibility = read('localization.js');
if (!compatibility.includes("const isCatalogue = page === 'catalogue.html'")) throw new Error('Compatibility localization must detect catalogue');
if (!compatibility.includes('if (!isCatalogue)')) throw new Error('Compatibility observer must stay off catalogue');

const ro = read('localization-ro.js');
for (const term of ['Colecția Refill','De ce să alegi Velvet Charms?']) if (!ro.includes(term)) throw new Error(`Approved Romanian copy missing: ${term}`);
const multiPages = read('multilingual-pages.js');
for (const lang of ['fr','it','de']) if (!multiPages.includes(`${lang}:`)) throw new Error(`Full-page translation layer missing ${lang}`);

console.log('Body Glow release guard PASS: core pages/copy, five-language catalogue wiring, approved Romanian copy and observer-free catalogue protections are present.');
