import assert from 'node:assert/strict';
import { imageType } from '../src/lib/image-type.ts';
assert.equal(imageType(Buffer.from('<svg onload="alert(1)"></svg>')), null);
assert.equal(imageType(Buffer.from('<html>fake image</html>')), null);
assert.equal(imageType(new Uint8Array(0)), null);
for (const [signature, mime] of [
 ['89504e470d0a1a0a00000000', 'image/png'],
 ['ffd8ff000000000000000000', 'image/jpeg'],
 ['474946383961000000000000', 'image/gif'],
 ['524946460000000057454250', 'image/webp'],
 ['000000186674797061766966', 'image/avif'],
]) assert.equal(imageType(Buffer.from(signature, 'hex'))?.mime, mime);
console.log('Image signature regression checks passed (8).');
