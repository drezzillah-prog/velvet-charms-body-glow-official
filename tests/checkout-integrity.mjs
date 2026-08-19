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
  assert.ok(Array.isArray(product.images) && product.images.length, `${product.id} must retain images`);
  for (const image of product.images) assert.ok(existsSync(join(root, image)), `${product.id} image is missing: ${image}`);
  for (const key of ['hidden_message', 'ritual_card', 'collectible_charm', 'velvet_passport']) {
    assert.ok(Array.isArray(product.options?.[key]) && product.options[key].length, `${product.id} lacks ${key}`);
  }
}

for (const file of ['catalogue.html', 'ritual-experience.js', 'ritual-experience.css', 'features.js', 'velvet-create-your-ritual.webp']) {
  assert.ok(existsSync(join(root, file)), `missing required experience file: ${file}`);
}
const catalogueHtml = readFileSync(join(root, 'catalogue.html'), 'utf8');
assert.match(catalogueHtml, /ritual-experience\.css/);
assert.match(catalogueHtml, /ritual-experience\.js/);

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

async function submit(body, country = 'US') {
  const calls = [];
  global.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).endsWith('/v1/oauth2/token')) {
      return { ok: true, status: 200, json: async () => ({ access_token: 'token' }) };
    }
    return {
      ok: true,
      status: 201,
      json: async () => ({ id: 'ORDER-1', links: [{ rel: 'approve', href: 'https://paypal.test/approve' }] })
    };
  };
  const res = responseRecorder();
  await createOrder({ method: 'POST', headers: { host: 'preview.test', 'x-vercel-ip-country': country }, body }, res);
  const orderCall = calls.find(call => call.url.endsWith('/v2/checkout/orders'));
  return { res, paypalBody: orderCall ? JSON.parse(orderCall.options.body) : null };
}

const refill = await submit({ cart: { items: [{ id: 'refill_face_cream', qty: 2, price: 0.01, options: {} }] } }, 'RO');
assert.equal(refill.res.statusCode, 200);
assert.equal(refill.res.payload.market, 'RO');
assert.equal(refill.paypalBody.purchase_units[0].amount.value, '24.44', 'Romanian server price must override client price');

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

console.log('PASS: 52 products, media, ritual experience, regional pricing and PayPal validation are intact.');

