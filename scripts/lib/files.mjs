import { readdir } from 'node:fs/promises';
import path from 'node:path';

const ignored = new Set(['.git', 'node_modules', '.next', '.next-build', '.turbo', '.venv',
  '__pycache__', '.pytest_cache', '.ruff_cache', '.mypy_cache', 'output', 'test-results', 'playwright-report']);

export async function sourceFiles(root, relative = '') {
  const output = [];
  for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
    if (ignored.has(entry.name) || entry.isSymbolicLink()) continue;
    const name = path.join(relative, entry.name);
    if (entry.isDirectory()) output.push(...await sourceFiles(root, name));
    else if (!entry.name.endsWith('.tsbuildinfo') && !entry.name.endsWith('.log')
      && !(entry.name.startsWith('.env') && entry.name !== '.env.example')) output.push(name);
  }
  return output.sort();
}
