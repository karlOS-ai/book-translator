import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

test('generated page contains the app and bundled dictionary', () => {
  const html = read('docs/index.html');
  const dictionary = readFileSync(join(root, 'src/core-en.json.gz'));

  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /<div id="app">/);
  assert.ok(html.includes(dictionary.toString('base64')), 'core dictionary should be embedded in generated HTML');
});

test('manifest points to existing app icons', () => {
  const manifest = JSON.parse(read('docs/manifest.webmanifest'));

  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, './');
  assert.ok(manifest.icons.length >= 2);
  for (const icon of manifest.icons) {
    assert.ok(existsSync(join(root, 'docs', icon.src)), `missing icon: ${icon.src}`);
  }
});

test('page and service worker use the same source-derived cache version', () => {
  const source = read('src/app.html');
  const dictionary = readFileSync(join(root, 'src/core-en.json.gz')).toString('base64');
  const version = createHash('sha1').update(source).update(dictionary).digest('hex').slice(0, 10);

  assert.ok(read('docs/index.html').includes(`sw.js?v=${version}`));
  assert.ok(read('docs/sw.js').includes(`const CACHE = 'vokabeln-${version}'`));
});
