import fs from 'node:fs';

const currency = fs.readFileSync('currency.js', 'utf8');
const shipping = fs.readFileSync('shipping-clarity.js', 'utf8');

if (currency.includes('new MutationObserver')) {
  throw new Error('Body Glow currency.js must remain observer-free');
}
if (!currency.includes('velvet:catalogue-rendered')) {
  throw new Error('Body Glow currency.js must refresh from the explicit catalogue render event');
}
if (!currency.includes('node.textContent !== nextValue')) {
  throw new Error('Body Glow currency price writes must remain idempotent');
}
if (!shipping.includes('node.textContent !== value')) {
  throw new Error('Shipping and dynamic copy writes must remain idempotent');
}
if (!shipping.includes("setText(document.querySelector('.cart-summary-row.cart-total span'), c.total)")) {
  throw new Error('Shipping total label must use the idempotent writer');
}
if (!shipping.includes("setText(document.querySelector('.cart-shipping-note'), c.shipping)")) {
  throw new Error('Shipping note must use the idempotent writer');
}
if (!shipping.includes('queueMicrotask')) {
  throw new Error('Shipping observer updates must remain coalesced');
}

console.log('Observer loop regression guard PASS');
