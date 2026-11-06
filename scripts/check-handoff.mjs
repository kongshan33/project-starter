import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function validateHandoff(text) {
  const labels = ['目标与验收条件', '用户已确定的要求', '已完成', '工作区状态', '验证', '下一步', '必要运行信息'];
  const missing = labels.filter(label => !new RegExp(`## ${label}\\s*\\n+[^#\\s]`).test(text));
  if (!/更新时间：\S/.test(text) || !/分支 \/ 基准 commit：\S/.test(text)) missing.push('时间/代码基线');
  return missing;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const text = await readFile(new URL('../.ai/handoff/current.md', import.meta.url), 'utf8');
  const missing = validateHandoff(text);
  if (missing.length) { console.error(`Incomplete handoff: ${missing.join(', ')}`); process.exitCode = 1; }
  else console.log('Handoff structure complete; verify its facts against Git and actual test output.');
}
