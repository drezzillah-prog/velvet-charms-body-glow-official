import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { extname } from 'node:path';

const pages=['index.html','catalogue.html','about.html','faq.html','contact.html','universe.html','wishlist.html','product.html'];
const textFiles=[...pages,'features.js','script.js','ritual-experience.js','localization.js','multilingual.js','i18n-runtime.js'];

for(const page of pages){
  assert.ok(existsSync(page),`${page} must exist`);
  const html=readFileSync(page,'utf8');
  assert.match(html,/<!doctype html>/i,`${page} needs a doctype`);
  assert.match(html,/<html[^>]+lang=/i,`${page} needs an HTML language`);
  assert.match(html,/<meta[^>]+name=["']viewport["']/i,`${page} needs a viewport meta tag`);
  assert.match(html,/<title>[^<]+<\/title>/i,`${page} needs a page title`);
  assert.doesNotMatch(html,/localhost|127\.0\.0\.1/i,`${page} must not contain local development URLs`);
  const refs=[...html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)].map(m=>m[1]);
  for(const ref of refs){
    if(!ref||ref.startsWith('#')||/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(ref)) continue;
    const clean=decodeURIComponent(ref.split(/[?#]/)[0]).replace(/^\.\//,'');
    if(!clean||clean.startsWith('/api/')) continue;
    if(extname(clean)) assert.ok(existsSync(clean),`${page} references missing local asset: ${clean}`);
  }
  for(const img of html.matchAll(/<img\b[^>]*>/gi)) assert.match(img[0],/\balt=["'][^"']*["']/i,`${page} contains an image without alt text`);
}

for(const file of textFiles){
  const source=readFileSync(file,'utf8');
  assert.doesNotMatch(source,/['"]\/api\/[A-Za-z0-9_-]+\.js(?:['"?])/i,`${file} must use extensionless Vercel API routes`);
}

const customerPages=['index.html','catalogue.html','about.html','faq.html','contact.html','universe.html'];
for(const page of customerPages){
  const html=readFileSync(page,'utf8');
  assert.doesNotMatch(html,/href=["'][^"']*(?:wishlist|product)\.html/i,`${page} must not link to legacy fallback pages`);
}

const universe=readFileSync('universe.html','utf8');
assert.doesNotMatch(universe,/ideas we can build after|what comes next|in development|viziune pe termen lung/i,'Velvet Universe must not expose internal roadmap language');
assert.ok(existsSync('robots.txt'),'robots.txt must exist');
assert.ok(existsSync('sitemap.xml'),'sitemap.xml must exist');

console.log('PASS: Body Glow customer pages, legacy fallbacks, local assets, API routes, accessibility basics and public Universe copy pass the static prelaunch audit.');
