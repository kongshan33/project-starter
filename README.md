# Project Starter

从 Libitu 提炼的独立项目模板：pnpm/Turborepo monorepo、Next.js/React、FastAPI、
共享 UI、`design/` 设计资料，以及 Codex / Claude Code 的共同规则与任务交接。

默认运行不需要数据库、登录账号、AI API key 或云服务。首页提供真实的 Web →
Next 路由 → FastAPI 示例；`/design-system` 展示基础组件。示例不保存数据。

## 开始一个新项目

在 GitHub 选择 **Use this template → Create a new repository**，克隆新仓库。
也可以复制模板文件到空目录，排除 `.git`、缓存和本地环境文件。

需要 Node.js 22（至少 22.15）、pnpm 10.19.0、uv 0.9.24 或更高的兼容版本、Python 3.12。

```sh
node scripts/init-project.mjs --name my-product --title "My Product" --description "What this product does."
pnpm install --frozen-lockfile
pnpm setup:api
pnpm dev
```

打开 <http://127.0.0.1:3000>，API 文档在 <http://127.0.0.1:8000/docs>。
初始化会更换包命名空间、项目元数据和当前状态文件，并同步 Claude skill 镜像。
它不创建远程资源、不提交代码、不覆写现有 `.env`，重复初始化会明确拒绝。
需要浏览器扩展时，在首次初始化添加 `--extension`，随后将安装命令改为
`pnpm install`，为新增的 workspace 更新锁文件。

修改 `project.json` 中的标题与描述即可调整应用展示。`apps/web/.env.example` 记录
可选的 `API_INTERNAL_URL`；默认不必创建 `.env`。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 同时启动 Web 与 API |
| `pnpm check` | 模板检查、lint、类型、单元测试、生产构建 |
| `pnpm test:browser` | 启动隔离本地服务器，验证实际 API 流程与失败恢复 |
| `pnpm skills:sync` | 从 `.agents/skills` 生成 `.claude/skills` 镜像 |
| `pnpm handoff:check` | 检查交接必要字段，仍需人工核对真实性 |

第一次运行浏览器验收前执行 `pnpm exec playwright install chromium`。
浏览器截图和报告放在被 Git 忽略的 `output/`、`test-results/`。
CI 在 Ubuntu 上执行同一套检查；通过状态以 GitHub 实际运行结果为准。

## 文档入口

- [AI 共同规则](AGENTS.md) · [当前状态](PROJECT.md) · [任务](TASK.md)
- [文档职责与更新矩阵](design/docs/DOCUMENTATION.md)
- [系统架构](design/docs/ARCHITECTURE.md) · [产品行为](design/docs/PRODUCT_SPEC.md)
- [新项目交付顺序](design/docs/DEVELOPMENT_ROADMAP.md)
- [设计规范](design/docs/DESIGN_SYSTEM.md) · [设计资料目录](design/README.md)
- [Skills 清单](SKILLS.md) · [Codex / Claude 交接](design/docs/AGENT_HANDOFF.md)
- [可选模块](design/docs/OPTIONAL_MODULES.md) · [提炼与验收记录](design/docs/TEMPLATE_ACCEPTANCE.md)

## 边界

数据库、认证、后台任务、AI 调用、部署与扩展发布均未默认接入。
它们的接入条件与验收要求在可选模块文档中。模板通过不等于新产品已经上线验收。
Next.js 版本与 Libitu 分开管理；锁文件记录可复现依赖，升级后重新运行验收。

本仓库尚未指定项目级开源许可证。公开可见性不替代授权条款；第三方 skill 的
安装来源和许可需分别确认，模板没有捆绑机器私有配置或未核实授权的外部技能。
