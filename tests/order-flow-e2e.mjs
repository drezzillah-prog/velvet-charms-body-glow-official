import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import createOrder from '../api/create-order.js';
import captureOrder from '../api/capture-order.js';

process.env.PAYPAL_ENV = 'sandbox';
process.env.PAYPAL_CLIENT_ID = 'test-client';
process.env.PAYPAL_CLIENT_SECRET = 'test-secret';
delete process.env.FORMSPREE_ENDPOINT;
delete process.env.FORMSPREE_FORM_ID;

const catalogue = JSON.parse(readFileSync(join(process.cwd(), 'catalogue-body-glow.json'), 'utf8'));
const products = catalogue.categories.flatMap(category => [
  ...(category.products || []),
  ...(category.subcategories || []).flatMap(subcategory => subcategory.products || [])
]);
const byId = new Map(products.map(product => [product.id, product]));

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

function clone(value) { return JSON.parse(JSON.stringify(value)); }

async function createCheckout(cart, { country = 'US', timezone = '', orderID = 'ORDERFLOW1' } = {}) {
  let createdBody = null;
  global.fetch = async (url, options = {}) => {
    const href = String(url);
    if (href.endsWith('/v1/oauth2/token')) return { ok: true, status: 200, json: async () => ({ access_token: 'token' }) };
    if (href.endsWith('/v2/checkout/orders')) {
      createdBody = JSON.parse(options.body);
      return { ok: true, status: 201, json: async () => ({ id: orderID, links: [{ rel: 'approve', href: 'https://paypal.test/approve' }] }) };
    }
    throw new Error(`Unexpected create fetch: ${href}`);
  };
  const headers = { host: 'preview.test' };
  if (country) headers['x-vercel-ip-country'] = country;
  if (timezone) headers['x-vercel-ip-timezone'] = timezone;
  const res = responseRecorder();
  await createOrder({ method: 'POST', headers, body: { cart } }, res);
  return { res, createdBody };
}

async function captureCheckout(cart, createdBody, {
  orderID = 'ORDERFLOW1',
  mutateDetails,
  captureOk = true,
  captureStatus = 'COMPLETED',
  captureAmount,
  completedAlready = false
} = {}) {
  const purchaseUnit = clone(createdBody.purchase_units[0]);
  let details = {
    id: orderID,
    status: completedAlready ? 'COMPLETED' : 'APPROVED',
    purchase_units: [purchaseUnit],
    payer: { name: { given_name: 'Test', surname: 'Buyer' }, email_address: 'buyer@example.test' }
  };
  const total = purchaseUnit.amount.value;
  if (completedAlready) {
    details.purchase_units[0].payments = { captures: [{ id: 'CAPTURE-OLD', amount: { currency_code: 'USD', value: total } }] };
  }
  if (mutateDetails) details = mutateDetails(details) || details;

  let captureCalled = false;
  global.fetch = async (url) => {
    const href = String(url);
    if (href.endsWith('/v1/oauth2/token')) return { ok: true, status: 200, json: async () => ({ access_token: 'token' }) };
    if (href.endsWith(`/v2/checkout/orders/${orderID}`)) return { ok: true, status: 200, json: async () => details };
    if (href.endsWith(`/v2/checkout/orders/${orderID}/capture`)) {
      captureCalled = true;
      if (!captureOk) return { ok: false, status: 422, json: async () => ({ name: 'UNPROCESSABLE_ENTITY' }) };
      const value = captureAmount ?? total;
      return {
        ok: true,
        status: 201,
        json: async () => ({
          id: orderID,
          status: captureStatus,
          purchase_units: [{ payments: { captures: [{ id: 'CAPTURE-1', amount: { currency_code: 'USD', value } }] } }]
        })
      };
    }
    throw new Error(`Unexpected capture fetch: ${href}`);
  };

  const res = responseRecorder();
  await captureOrder({ method: 'POST', headers: { host: 'preview.test' }, body: { orderID, cart } }, res);
  return { res, captureCalled };
}

const simpleProduct = byId.get('spirit_full_200');
assert.ok(simpleProduct, 'expected Body Glow test product');
const simpleCart = { items: [{ id: simpleProduct.id, qty: 1, options: {} }] };
const simpleCreate = await createCheckout(simpleCart);
assert.equal(simpleCreate.res.statusCode, 200, 'simple international order must be created');
assert.equal(simpleCreate.res.payload.market, 'INTL');
assert.equal(simpleCreate.createdBody.purchase_units[0].amount.value, Number(simpleProduct.price).toFixed(2));
assert.equal(simpleCreate.createdBody.payment_source.paypal.experience_context.cancel_url, 'https://preview.test/catalogue.html?payment=cancelled');
assert.equal(simpleCreate.createdBody.payment_source.paypal.experience_context.return_url, 'https://preview.test/catalogue.html?payment=success');
const simpleCapture = await captureCheckout(simpleCart, simpleCreate.createdBody);
assert.equal(simpleCapture.res.statusCode, 200, 'simple approved order must capture');
assert.equal(simpleCapture.res.payload.status, 'COMPLETED');
assert.equal(simpleCapture.captureCalled, true);

const roCreate = await createCheckout(simpleCart, { country: 'RO', orderID: 'ORDERFLOW2' });
assert.equal(roCreate.res.statusCode, 200);
assert.equal(roCreate.res.payload.market, 'RO');
assert.equal(roCreate.createdBody.purchase_units[0].items[0].unit_amount.value, Number(simpleProduct.price_ro_usd).toFixed(2));
const roCapture = await captureCheckout(simpleCart, roCreate.createdBody, { orderID: 'ORDERFLOW2' });
assert.equal(roCapture.res.statusCode, 200, 'Romanian pricing must survive create-to-capture');

const candle = byId.get('spirit_full_200');
const cream = byId.get('refill_face_cream');
const refill = byId.get('refill_candle_small');
const customCart = {
  requiredByDate: '2026-12-20',
  items: [
    {
      id: candle.id,
      qty: 2,
      options: { scent: candle.options.scent[0], ritual_card: candle.options.ritual_card[0], special_instructions: 'Keep the finish soft and elegant.' },
      attachments: [{ pathname: 'custom-orders/reference-test-one.jpg', name: 'front view.jpg' }]
    },
    { id: cream.id, qty: 1, options: { hidden_message: cream.options.hidden_message[0] } },
    { id: refill.id, qty: 1, options: { scent: refill.options.scent[0], intensity: refill.options.intensity[0] } }
  ]
};
const customCreate = await createCheckout(customCart, { orderID: 'ORDERFLOW3' });
assert.equal(customCreate.res.statusCode, 200, 'multi-item customized order must be created');
assert.equal(customCreate.createdBody.purchase_units[0].items.length, 3);
assert.match(customCreate.createdBody.purchase_units[0].items[0].description, /reference photo/);
assert.match(customCreate.createdBody.purchase_units[0].items[0].description, /Preferred date: 2026-12-20/);
const customCapture = await captureCheckout(customCart, customCreate.createdBody, { orderID: 'ORDERFLOW3' });
assert.equal(customCapture.res.statusCode, 200, 'customized order with reference and preferred date must capture');

const tamperedCart = clone(customCart);
tamperedCart.items[0].options.special_instructions = 'Changed after PayPal approval';
const tampered = await captureCheckout(tamperedCart, customCreate.createdBody, { orderID: 'ORDERFLOW3' });
assert.equal(tampered.res.statusCode, 409, 'customization changed after approval must be rejected');
assert.equal(tampered.captureCalled, false, 'tampered customization must never be captured');

const tamperedDateCart = clone(customCart);
tamperedDateCart.requiredByDate = '2026-12-21';
const tamperedDate = await captureCheckout(tamperedDateCart, customCreate.createdBody, { orderID: 'ORDERFLOW3' });
assert.equal(tamperedDate.res.statusCode, 409, 'preferred date changed after approval must be rejected');
assert.equal(tamperedDate.captureCalled, false);

const tamperedPhotoCart = clone(customCart);
tamperedPhotoCart.items[0].attachments[0].pathname = 'custom-orders/reference-other.jpg';
const tamperedPhoto = await captureCheckout(tamperedPhotoCart, customCreate.createdBody, { orderID: 'ORDERFLOW3' });
assert.equal(tamperedPhoto.res.statusCode, 409, 'reference photo changed after approval must be rejected');
assert.equal(tamperedPhoto.captureCalled, false);

const priceTampered = await captureCheckout(simpleCart, simpleCreate.createdBody, {
  mutateDetails(details) {
    details.purchase_units[0].items[0].unit_amount.value = '0.01';
    details.purchase_units[0].amount.value = '0.01';
    details.purchase_units[0].amount.breakdown.item_total.value = '0.01';
    return details;
  }
});
assert.equal(priceTampered.res.statusCode, 409, 'PayPal amount tampering must be rejected before capture');
assert.equal(priceTampered.captureCalled, false);

const captureFailure = await captureCheckout(simpleCart, simpleCreate.createdBody, { captureOk: false });
assert.equal(captureFailure.res.statusCode, 502, 'PayPal capture failure must surface as a checkout failure');
assert.equal(captureFailure.captureCalled, true);

const incompleteCapture = await captureCheckout(simpleCart, simpleCreate.createdBody, { captureStatus: 'PENDING' });
assert.equal(incompleteCapture.res.statusCode, 502, 'non-completed PayPal capture must not be treated as paid');

const recovery = await captureCheckout(simpleCart, simpleCreate.createdBody, { completedAlready: true });
assert.equal(recovery.res.statusCode, 200, 'already-completed PayPal order must recover idempotently');
assert.equal(recovery.res.payload.recovered, true);
assert.equal(recovery.captureCalled, false, 'already-completed order must not be captured twice');

console.log('PASS: Body Glow create→approve→capture flow, RO/INTL pricing, multi-item customization, photos, preferred date, tamper protection, failure handling and idempotent recovery are intact.');
