import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync('api/upload-photo.js', 'utf8');

assert.match(source, /MAX_FILE_SIZE\s*=\s*4\s*\*\s*1024\s*\*\s*1024/, 'photo uploads must stay capped at 4 MB');
assert.match(source, /image\/jpeg/, 'JPEG must be explicitly allow-listed');
assert.match(source, /image\/png/, 'PNG must be explicitly allow-listed');
assert.match(source, /image\/webp/, 'WEBP must be explicitly allow-listed');
assert.match(source, /access:\s*["']private["']/, 'reference photos must remain private blobs');
assert.match(source, /sameOriginRequest\(req\)/, 'upload endpoint must reject cross-site browser uploads');
assert.match(source, /allowUpload\(req\)/, 'upload endpoint must apply burst limiting');
assert.match(source, /status\(429\)/, 'upload endpoint must return HTTP 429 when rate limited');
assert.match(source, /Retry-After/, 'rate-limited uploads must tell clients when to retry');

console.log('PASS: Body Glow private photo upload keeps file restrictions, private storage, same-origin checks and burst limiting.');
