import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

assert.ok(existsSync('api/order-reference.js'), 'signed private reference endpoint must exist');
const capture = readFileSync('api/capture-order.js', 'utf8');
const viewer = readFileSync('api/order-reference.js', 'utf8');

assert.match(capture, /notifySeller/, 'paid orders must create a seller handoff');
assert.match(capture, /FORMSPREE_ENDPOINT|FORMSPREE_FORM_ID/, 'seller handoff must use the configured Formspree endpoint');
assert.match(capture, /paypal_order_id/, 'seller handoff must include the PayPal order ID');
assert.match(capture, /paypal_capture_id/, 'seller handoff must include the PayPal capture ID');
assert.match(capture, /Preferred date/, 'seller handoff must preserve the requested date');
assert.match(capture, /Reference photo/, 'seller handoff must include reference-photo entries');
assert.match(capture, /sellerNotificationSent/, 'payment success must track seller-notification success separately');
assert.match(capture, /createHmac/, 'private photo links must be signed server-side');
assert.match(viewer, /timingSafeEqual/, 'signed photo links must be compared safely');
assert.match(viewer, /Date\.now\(\) > Number\(exp\)/, 'signed photo links must expire');
assert.match(viewer, /Cache-Control.*private, no-store/s, 'private photos must never be publicly cached');
assert.doesNotMatch(capture, /RESEND_API_KEY|resend\.com/i, 'seller handoff must not re-enable Resend customer email');

console.log('PASS: paid orders have a secure seller handoff with PayPal IDs, preferred date, customizations and signed private references.');
