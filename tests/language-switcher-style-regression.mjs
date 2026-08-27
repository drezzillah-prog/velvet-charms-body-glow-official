import fs from 'node:fs';

const css = fs.readFileSync('performance.css', 'utf8');

for (const required of [
  '.velvet-language-switcher{',
  '.velvet-language-switcher button{',
  '.velvet-language-switcher button[aria-pressed="true"]{'
]) {
  if (!css.includes(required)) throw new Error(`Missing Body Glow language switcher styling: ${required}`);
}

console.log('Body Glow language switcher style regression PASS');
