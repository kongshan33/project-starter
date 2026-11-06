import { cp, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sourceFiles } from './lib/files.mjs';
import { checkMirrorTarget, syncSkills } from './sync-skills.mjs';

export async function initialize(root, { name, title, description, extension = false }) {
  if (!/^[a-z][a-z0-9-]{1,47}$/.test(name ?? '')) throw new Error('Name must be a 2–48 character lowercase slug.');
  for (const [label, value, limit] of [['title', title, 80], ['description', description, 240]]) {
    if (typeof value !== 'string' || !value.trim() || value.length > limit || /[\r\n\0]/.test(value))
      throw new Error(`Provide a single-line ${label} of 1–${limit} characters.`);
  }
  const config = JSON.parse(await readFile(path.join(root, 'project.json'), 'utf8'));
  if (config.initialized) throw new Error('This project is already initialized; edit its configuration normally.');
  await checkMirrorTarget(root);
  if (extension) {
    let exists = false;
    try { await access(path.join(root, 'apps/extension')); exists = true; } catch (e) { if (e.code !== 'ENOENT') throw e; }
    if (exists) throw new Error('apps/extension already exists; refusing to overwrite it.');
    await cp(path.join(root, 'modules/extension'), path.join(root, 'apps/extension'), { recursive: true });
    const manifestFile = path.join(root, 'apps/extension/manifest.json');
    const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
    manifest.name = title;
    await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
  }
  // Rename package references, including lock importers, without rewriting business prose.
  for (const relative of await sourceFiles(root)) {
    if (relative.startsWith(`.claude${path.sep}skills`) || relative === 'project.json') continue;
    if (!/\.(?:json|ya?ml|toml|lock|tsx?|m?js|md)$/.test(relative)) continue;
    const filename = path.join(root, relative);
    const original = await readFile(filename, 'utf8');
    let updated = original.replaceAll(`@${config.packageScope}/`, `@${name}/`);
    if (relative === 'apps/api/pyproject.toml' || relative === 'apps/api/uv.lock')
      updated = updated.replaceAll(`${config.name}-api`, `${name}-api`);
    if (updated !== original) await writeFile(filename, updated);
  }
  const packageFile = path.join(root, 'package.json');
  const pkg = JSON.parse(await readFile(packageFile, 'utf8'));
  pkg.name = name;
  await writeFile(packageFile, JSON.stringify(pkg, null, 2) + '\n');
  const now = new Date().toISOString();
  await writeFile(path.join(root, 'project.json'), JSON.stringify({ name, packageScope: name, title, description, initialized: true,
    modules: { extension } }, null, 2) + '\n');
  await writeFile(path.join(root, 'PROJECT.md'), `# ${title}\n\n${description}\n\n## 当前状态\n\n已从模板初始化（${now}）。工程骨架可用；本项目尚未执行验证，也未实现具体产品功能。\n\n## 当前目标\n\n在 design/docs/PRODUCT_SPEC.md 中明确目标用户和第一个可验收流程。\n\n## 可选模块\n\n扩展：${extension ? '已生成；待浏览器验收' : '未启用'}。数据库、登录、队列、AI、部署未接入。\n`);
  await writeFile(path.join(root, 'TASK.md'), '# 当前任务\n\n- [ ] 明确目标用户、主要流程与验收条件。\n- [ ] 安装依赖并验证本地运行。\n- [ ] 实现第一个可验证的产品流程。\n- [ ] 同步专项规范和交接。\n');
  const readmeFile = path.join(root, 'README.md');
  const readme = await readFile(readmeFile, 'utf8');
  await writeFile(readmeFile, readme.replace(/^# .+/, `# ${title}\n\n${description}`));
  await writeFile(path.join(root, '.ai/handoff/current.md'), `# 当前任务交接\n\n更新时间：${now}\n分支 / 基准 commit：初始化后请核对实际 Git 状态。\n\n## 目标与验收条件\n\n为 ${title} 建立第一个可验收流程。\n\n## 用户已确定的要求\n\n项目说明：${description}\n其他产品约束待确认。\n\n## 已完成\n\n模板初始化及包命名空间替换完成。\n\n## 工作区状态\n\n初始化文件尚未提交；检查 git status 和 diff。\n\n## 验证\n\n新项目尚未运行验证；模板的历史通过不代表此项目已通过。\n\n## 下一步\n\n安装依赖、pnpm setup:api、pnpm check，并填写 PRODUCT_SPEC。\n\n## 必要运行信息\n\npnpm dev；Web 3000 / API 8000。外部服务未配置。\n`);
  await syncSkills(root);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2), options = {};
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--extension') options.extension = true;
      else if (['--name', '--title', '--description'].includes(args[i]) && args[i + 1]) options[args[i].slice(2)] = args[++i];
      else throw new Error(`Unknown or incomplete argument: ${args[i]}`);
    }
    await initialize(fileURLToPath(new URL('..', import.meta.url)), options);
    console.log('Initialized. Install dependencies, run pnpm setup:api and pnpm check; then define the product.');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
