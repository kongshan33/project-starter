import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { normalizeTitle } from '../src/index.ts';
import { isPreview } from '../../types/src/index.ts';

test('shared Python/TypeScript contract preserves the normalized input', async () => {
  const fixture = JSON.parse(await readFile(new URL('../../types/fixtures/preview.json', import.meta.url)));
  assert.equal(normalizeTitle(fixture.input.title), fixture.output.title);
  assert.ok(isPreview(fixture.output));
});

test('runtime boundary rejects malformed API results', () => {
  for (const value of [null, {}, { title: 'x', word_count: '1', character_count: 1 },
    { title: 'x', word_count: -1, character_count: 1 }]) assert.equal(isPreview(value), false);
});
