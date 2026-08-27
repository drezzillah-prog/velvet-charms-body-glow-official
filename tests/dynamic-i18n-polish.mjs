import fs from 'node:fs';
import assert from 'node:assert/strict';

const shipping = fs.readFileSync('shipping-clarity.js', 'utf8');
const guard = fs.readFileSync('checkout-return-guard.js', 'utf8');

for (const lang of ['en:', 'ro:', 'fr:', 'it:', 'de:']) {
  assert.ok(shipping.includes(lang), `shipping-clarity missing ${lang}`);
  assert.ok(guard.includes(lang), `checkout-return-guard missing ${lang}`);
}

assert.ok(shipping.includes('uploadProgress'), 'dynamic upload progress localization missing');
assert.ok(shipping.includes('connectingPayPal'), 'PayPal connecting localization missing');
assert.ok(shipping.includes('checkoutPayPal'), 'checkout button localization missing');
assert.ok(shipping.includes('checkoutError'), 'checkout error localization missing');
assert.ok(shipping.includes('node.textContent !== value'), 'dynamic localization writes must stay idempotent');
assert.ok(guard.includes('missingWithCart') && guard.includes('missingWithoutCart'), 'PayPal return safety messages must be localized');

console.log('Dynamic i18n polish guard passed.');
