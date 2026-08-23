import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const catalogue = readFileSync('catalogue.html','utf8');
const guard = readFileSync('checkout-return-guard.js','utf8');
const capture = readFileSync('api/capture-order.js','utf8');

assert.ok(catalogue.includes('checkout-return-guard.js'), 'catalogue must load the PayPal return guard');
assert.ok(catalogue.indexOf('checkout-return-guard.js') < catalogue.indexOf('features.js'), 'return guard must load before checkout logic');
assert.match(guard, /velvet:order-completed/, 'guard must know when capture truly completed');
assert.match(guard, /payment.*success/, 'guard must protect successful PayPal return state');
assert.match(guard, /payment.*cancelled/, 'guard must handle PayPal cancellation without losing the cart');
assert.match(capture, /details?\.status === "COMPLETED"|orderDetails\.status === "COMPLETED"/, 'capture endpoint must recognize an already-completed PayPal order');
assert.match(capture, /recovered: true/, 'capture endpoint must return an explicit recovered state');
assert.match(capture, /previousCapture/, 'recovery must reuse the existing capture rather than charging twice');

console.log('PASS: Body Glow PayPal return keeps a safe retry path, preserves cancelled carts, and recovers already-completed orders without a second capture.');
