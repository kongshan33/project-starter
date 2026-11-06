import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sourceFiles } from './lib/files.mjs';
import { validateHandoff } from './check-handoff.mjs';

export async function checkTemplate(root) {
  const errors = [], files = await sourceFiles(root);
  for (const required of ['AGENTS.md', 'CLAUDE.md', 'PROJECT.md', 'TASK.md', 'DECISIONS.md', 'SKILLS.md',
    'design/docs/ARCHITECTURE.md', 'design/docs/DESIGN_SYSTEM.md', 'design/docs/PRODUCT_SPEC.md']) {
    if (!files.includes(required)) errors.push(`Missing ${required}`);
  }
  const claude = await readFile(path.join(root, 'CLAUDE.md'), 'utf8');
  if (claude.trim() !== '@AGENTS.md') errors.push('CLAUDE.md must import the shared source.');
  const canonical = files.filter(file => file.startsWith('.agents/skills/'));
  for (const file of canonical) {
    const mirror = file.replace('.agents/', '.claude/');
    try {
      if (!Buffer.from(await readFile(path.join(root, file))).equals(await readFile(path.join(root, mirror)))) errors.push(`Stale mirror: ${mirror}`);
    } catch { errors.push(`Missing mirror: ${mirror}`); }
  }
  for (const mirror of files.filter(file => file.startsWith('.claude/skills/') && !file.endsWith('/.generated'))) {
    if (!canonical.includes(mirror.replace('.claude/', '.agents/'))) errors.push(`Unowned mirror: ${mirror}`);
  }
  for (const file of files.filter(file => file.endsWith('.md'))) {
    const text = await readFile(path.join(root, file), 'utf8');
    if (file.endsWith('/SKILL.md') && (!/^---\nname: [a-z0-9-]+\ndescription: .+\n---/m.test(text))) errors.push(`Invalid skill header: ${file}`);
    const prose = text.replace(/```[\s\S]*?```/g, '');
    for (const match of prose.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const link = match[1].split('#')[0];
      if (!link || /^[a-z]+:/.test(link) || link.startsWith('/')) continue;
      try { await access(path.resolve(root, path.dirname(file), decodeURIComponent(link))); }
      catch { errors.push(`Broken link in ${file}: ${link}`); }
    }
  }
  const handoff = await readFile(path.join(root, '.ai/handoff/current.md'), 'utf8');
  errors.push(...validateHandoff(handoff).map(item => `Handoff missing: ${item}`));
  for (const file of files.filter(file => /\.(?:json|ya?ml|toml|lock|tsx?|m?js|md|py|css|html)$/.test(file))) {
    const text = await readFile(path.join(root, file), 'utf8');
    if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bAKIA[A-Z0-9]{16}\b|\bsk-proj-[A-Za-z0-9_-]{32,}/.test(text)) errors.push(`Potential credential in ${file}`);
    if (/\/Users\/[^/\s]+\//.test(text)) errors.push(`Machine-specific path in ${file}`);
  }
  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const errors = await checkTemplate(fileURLToPath(new URL('..', import.meta.url)));
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
  else console.log('Template structure, documentation links, skill mirrors and handoff checks passed.');
}
