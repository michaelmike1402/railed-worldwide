import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(path.join(root, 'site/index.html'), 'utf8');
const css = await readFile(path.join(root, 'site/styles.css'), 'utf8');
const js = await readFile(path.join(root, 'site/slideshow.js'), 'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"?#]+)"/g)) {
  if (!match[1].startsWith('https:')) await access(path.join(root, 'site', match[1]));
}
for (let id=1;id<=6;id++) for (const width of [640,1280,2400]) await access(path.join(root, `site/assets/campaign-${id}-${width}.webp`));
const links = [...html.matchAll(/<a\b[^>]*>/g)].map(m => m[0]);
assert.equal(links.length, 3, 'Only the purchase and two social links belong in the interface');
for (const link of links) { assert.match(link, /target="_blank"/); assert.match(link, /rel="noopener noreferrer"/); }
assert.match(links[0], /50862423247\?extraParams=/);
assert.match(links[1], /https:\/\/www.instagram.com\/railed_/);
assert.match(links[2], /https:\/\/www.tiktok.com\/@railed.worldwide/);
assert.doesNotMatch(html.replace(/<[^>]+>/g, ''), /https?:\/\//, 'Raw URLs must not be visible');
assert.match(css, /100dvh/);
assert.match(css, /prefers-reduced-motion/);
assert.match(js, /frame.decode\(\)/);
assert.match(js, /delay = 5000/);
assert.match(css, /opacity 1.3s/);
console.log('Site validation passed: assets, external destinations, safe link attributes, responsive and motion configuration.');
