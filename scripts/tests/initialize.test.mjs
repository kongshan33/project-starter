import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, writeFile, rm, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initialize } from '../init-project.mjs';
import { sourceFiles } from '../lib/files.mjs';
import { checkTemplate } from '../check-template.mjs';
import { syncSkills } from '../sync-skills.mjs';

const source = fileURLToPath(new URL('../../', import.meta.url));
async function fixture(fn) {
  const root = await mkdtemp(path.join(tmpdir(), 'starter-test-'));
  try {
    for (const file of await sourceFiles(source)) {
      await mkdir(path.dirname(path.join(root, file)), { recursive: true });
      await cp(path.join(source, file), path.join(root, file));
    }
    // These are disposable template fixtures, even when tests run in a new product.
    const configFile = path.join(root, 'project.json');
    const config = JSON.parse(await readFile(configFile, 'utf8'));
    config.initialized = false;
    config.modules.extension = false;
    await writeFile(configFile, JSON.stringify(config));
    await rm(path.join(root, 'apps/extension'), { recursive: true, force: true });
    await fn(root);
  } finally { await rm(root, { recursive: true, force: true }); }
}
for (const extension of [false, true]) test(`initialize a clean copy; extension=${extension}`, async () => fixture(async root => {
  await writeFile(path.join(root, '.env.local'), 'KEEP_LOCAL=1\n');
  await initialize(root, { name: 'example-product', title: 'Example 产品', description: 'A new product.', extension });
  const config = JSON.parse(await readFile(path.join(root, 'project.json')));
  assert.equal(config.initialized, true);
  assert.equal(config.modules.extension, extension);
  assert.equal(JSON.parse(await readFile(path.join(root, 'apps/web/package.json'))).name, '@example-product/web');
  assert.match(await readFile(path.join(root, 'pnpm-lock.yaml'), 'utf8'), /@example-product\/ui/);
  assert.match(await readFile(path.join(root, 'apps/api/uv.lock'), 'utf8'), /name = "example-product-api"/);
  assert.equal(await readFile(path.join(root, '.env.local'), 'utf8'), 'KEEP_LOCAL=1\n');
  assert.deepEqual(await checkTemplate(root), []);
  if (extension) assert.equal(JSON.parse(await readFile(path.join(root, 'apps/extension/manifest.json'))).name, 'Example 产品');
  const before = await readFile(path.join(root, 'project.json'), 'utf8');
  await assert.rejects(initialize(root, { name: 'another-project', title: 'Other', description: 'Other.' }), /already initialized/);
  assert.equal(await readFile(path.join(root, 'project.json'), 'utf8'), before);
}));

test('invalid identity is rejected before mutating the checkout', async () => fixture(async root => {
  const before = await readFile(path.join(root, 'project.json'), 'utf8');
  await assert.rejects(initialize(root, { name: '../escape', title: 'Title', description: 'Text' }), /slug/);
  assert.equal(await readFile(path.join(root, 'project.json'), 'utf8'), before);
}));

test('unmarked Claude skills are preserved', async () => fixture(async root => {
  await rm(path.join(root, '.claude/skills/.generated'));
  await assert.rejects(syncSkills(root), /unmarked/);
  const before = await readFile(path.join(root, 'project.json'), 'utf8');
  await assert.rejects(initialize(root, { name: 'blocked-project', title: 'Blocked', description: 'Preserve custom skills.' }), /unmarked/);
  assert.equal(await readFile(path.join(root, 'project.json'), 'utf8'), before);
  assert.ok(await readFile(path.join(root, '.claude/skills/project-bootstrap/SKILL.md')));
}));
