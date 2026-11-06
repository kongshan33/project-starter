import { cp, lstat, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export async function checkMirrorTarget(root) {
  const destination = path.join(root, '.claude/skills');
  let stat;
  try { stat = await lstat(destination); }
  catch (error) { if (error.code === 'ENOENT') return; throw error; }
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('Refusing a non-directory skill mirror.');
  try {
    const marker = await readFile(path.join(destination, '.generated'), 'utf8');
    if (marker.trim() !== 'Generated from .agents/skills by scripts/sync-skills.mjs') throw new Error('Unknown skill mirror marker.');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    throw new Error('Refusing to overwrite an unmarked .claude/skills directory.');
  }
}

export async function syncSkills(root) {
  await checkMirrorTarget(root);
  const destination = path.join(root, '.claude/skills');
  await rm(destination, { recursive: true, force: true });
  await cp(path.join(root, '.agents/skills'), destination, { recursive: true });
  await writeFile(path.join(destination, '.generated'), 'Generated from .agents/skills by scripts/sync-skills.mjs\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await syncSkills(path.resolve(fileURLToPath(new URL('..', import.meta.url))));
  console.log('Claude skill mirror synchronized.');
}
