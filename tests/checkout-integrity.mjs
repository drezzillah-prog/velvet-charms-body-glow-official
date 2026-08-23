import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import createOrder from '../api/create-order.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
process.env.PAYPAL_ENV = 'sandbox';
process.env.PAYPAL_CLIENT_ID = 'test-client';
process.env.PAYPAL_CLIENT_SECRET = 'test-secret';

const catalogue = JSON.parse(readFileSync(join(root, 'catalogue-body-glow.json'), 'utf8'));
const products = catalogue.categories.flatMap(category => [
  ...(category.products || []),
  ...(category.subcategories || []).flatMap(subcategory => subcategory.products || [])
]);
const byId = new Map(products.map(product => [product.id, product]));

assert.equal(products.length, 52, 'catalogue must contain all 52 products');
assert.equal(byId.size, 52, 'product IDs must remain unique');
assert.equal(products.filter(product => product.id.startsWith('refill_')).length, 6, 'all six refills must exist');

for (const product of products) {
  assert.ok(Number.isFinite(Number(product.price)) && Number(product.price) > 0, `${product.id} needs a valid international USD price`);
  assert.ok(Number.isFinite(Number(product.price_ro)) && Number(product.price_ro) > 0, `${product.id} needs a valid Romanian RON price`);
  assert.ok(Number.isFinite(Number(product.price_ro_usd)) && Number(product.price_ro_usd) > 0, `${product.id} needs a valid Romanian PayPal USD price`);
  const expectedRoUsd = Number((Number(product.price_ro) / 4.5).toFixed(2));
  assert.equal(Number(product.price_ro_usd), expectedRoUsd, `${product.id} Romanian PayPal price must stay aligned with its curated RON price`);
  assert.ok(Array.isArray(product.images) && product.images.length, `${product.id} must retain images`);
  for (const image of product.images) assert.ok(existsSync(join(root, image)), `${product.id} image is missing: ${image}`);
  for (const key of ['hidden_message', 'ritual_card', 'collectible_charm', 'velvet_passport']) {
    assert.ok(Array.isArray(product.options?.[key]) && product.options[key].length, `${product.id} lacks ${key}`);
  }
}

for (const file of ['catalogue.html','ritual-experience.js','ritual-experience.css','features.js','velvet-create-your-ritual.webp','shipping-clarity.js']) {
  assert.ok(existsSync(join(root, file)), `missing required experience file: ${file}`);
}
const catalogueHtml = readFileSync(join(root, 'catalogue.html'), 'utf8');
assert.match(catalogueHtml, /ritual-experience\.css/);
assert.match(catalogueHtml, /ritual-experience\.js/);
assert.match(catalogueHtml, /shipping-clarity\.js/, 'catalogue must load explicit shipping-cost disclosure');

const captureOrderSource = readFileSync(join(root, 'api/capture-order.js'), 'utf8');
assert.match(captureOrderSource, /storedMarket/, 'capture must use the server-stamped access market');
assert.match(captureOrderSource, /unit_amount/, 'capture must verify each approved PayPal unit price before capture');
assert.match(captureOrderSource, /amountMatches/, 'capture must verify the approved PayPal total before capture');
assert.doesNotMatch(captureOrderSource, /RESEND_API_KEY|resend\.com/i, 'current launch checkout must remain PayPal-only for customer payment confirmation');
assert.doesNotMatch(captureOrderSource, /delivery address in Romania|shipping.*Romania/i, 'delivery address must not determine Romanian pricing');

const currencySource = readFileSync(join(root, 'api/currency.js'), 'utf8');
assert.match(currencySource, /x-vercel-ip-country/, 'currency display must use access country');
assert.match(currencySource, /x-vercel-ip-timezone/, 'currency display must share the safe Bucharest fallback used by checkout');
assert.match(currencySource, /Europe\/Bucharest/, 'Romania fallback must stay aligned with checkout');

const shippingSource = readFileSync(join(root, 'shipping-clarity.js'), 'utf8');
assert.match(shippingSource, /Shipping is not included in the product total/);
assert.match(shippingSource, /No shipping charge is taken without your approval/);
for (const language of ['ro','fr','it','de']) assert.match(shippingSource, new RegExp(`${language}:`), `shipping disclosure needs ${language} localization`);

function responseRecorder() {
  return {
    statusCode: 200,
    payload: null,
    headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; }
  };
}

async function submit(body, country = 'US', timezone = '') {
  const calls = [];
  global.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).endsWith('/v1/oauth2/token')) return { ok: true, status: 200, json: async () => ({ access_token: 'token' }) };
    return { ok: true, status: 201, json: async () => ({ id: 'ORDER-1', links: [{ rel: 'approve', href: 'https://paypal.test/approve' }] }) };
  };
  const res = responseRecorder();
  const headers = { host: 'preview.test' };
  if (country) headers['x-vercel-ip-country'] = country;
  if (timezone) headers['x-vercel-ip-timezone'] = timezone;
  await createOrder({ method: 'POST', headers, body }, res);
  const orderCall = calls.find(call => call.url.endsWith('/v2/checkout/orders'));
  return { res, paypalBody: orderCall ? JSON.parse(orderCall.options.body) : null };
}

const refill = await submit({ cart: { items: [{ id: 'refill_face_cream', qty: 2, price: 0.01, options: {} }] } }, 'RO');
assert.equal(refill.res.statusCode, 200);
assert.equal(refill.res.payload.market, 'RO');
assert.equal(refill.paypalBody.purchase_units[0].amount.value, '24.44', 'Romanian server price must override client price');

const timezoneFallback = await submit({ cart: { items: [{ id: 'refill_face_cream', qty: 1, options: {} }] } }, '', 'Europe/Bucharest');
assert.equal(timezoneFallback.res.statusCode, 200);
assert.equal(timezoneFallback.res.payload.market, 'RO', 'Bucharest Vercel timezone must safely recover Romania when country is missing');

const international = await submit({ cart: { items: [{ id: 'spirit_full_200', qty: 1, options: {} }] } }, 'US');
assert.equal(international.res.statusCode, 200);
assert.equal(international.res.payload.market, 'INTL');
assert.equal(international.paypalBody.purchase_units[0].amount.value, byId.get('spirit_full_200').price.toFixed(2), 'International visitors must keep the international catalogue price');

const candle = byId.get('spirit_full_200');
const cream = byId.get('refill_face_cream');
const box = await submit({ cart: { items: [
  { id: candle.id, qty: 1, options: { scent: candle.options.scent[0], vessel_preference: candle.options.vessel_preference[0], ritual_card: candle.options.ritual_card[0] } },
  { id: cream.id, qty: 1, options: { ritual_card: cream.options.ritual_card[0], hidden_message: cream.options.hidden_message[0] } },
  { id: 'refill_candle_small', qty: 1, options: { scent: byId.get('refill_candle_small').options.scent[0], intensity: byId.get('refill_candle_small').options.intensity[0] } }
] } }, 'US');
assert.equal(box.res.statusCode, 200, 'three-product Velvet Box must reach PayPal');
assert.equal(box.paypalBody.purchase_units[0].items.length, 3);

const invalid = await submit({ cart: { items: [{ id: 'refill_face_cream', qty: 1, options: { vessel_preference: 'not supported' } }] } });
assert.equal(invalid.res.statusCode, 400, 'unsupported product option must be rejected');
assert.equal(invalid.paypalBody, null, 'invalid carts must never reach PayPal');

console.log('PASS: 52 products, regional pricing, media, shipping disclosure, ritual experience and pre-capture PayPal validation are intact.');
