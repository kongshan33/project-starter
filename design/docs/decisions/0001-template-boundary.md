# 0001 — 独立模板边界

状态：accepted。日期：2026-11-06。

## 背景

用户要求从已开发的项目提炼架构、文档体系、skills、设计规范和跨 agent 交接，
保留 design 目录，并作为独立公开 GitHub 仓库供下一项目使用。

## 选择

- 独立历史与命名，代码不进入来源项目仓库。
- 保留 pnpm/Turbo + Next/React + FastAPI/uv 和 apps/packages 分工。
- Next 采用新模板验收时的 16.4.5，React 19.3.1；不继承来源项目旧主版本。
  Node 22 / Python 3.12，锁文件固定依赖。TypeScript 保持成熟的 5.9 分支。
- ESLint 固定 9.39.5，以满足当前 Next 配置中 React/import/a11y 插件的 peer
  范围；该分支已收到上游 deprecated 提示。插件兼容后单独升级到 10 并验收。
- 默认本地无凭据运行；外部数据库、身份、队列和模型是可选集成。
- 正式专项规范统一在 design/docs；当前状态和 AI 入口位于根目录。
- AGENTS 为共同规则，CLAUDE 显式导入；自有 skills 同源生成两个发现目录。
- 只提炼通用结构和组件经验，不迁移业务数据、业务设计稿或历史实现声明。

## 影响与验证

这是一套可演进的基础，不是完整 SaaS 或已部署的产品。
新增组件和 provider 仍需业务验收。模板复现和交接结构由自动检查覆盖；真实
跨 agent 行为验收单独记录。证据见 TEMPLATE_ACCEPTANCE。

参考：[Next.js 支持策略](https://nextjs.org/support-policy)、
[uv 锁定与同步](https://docs.astral.sh/uv/concepts/projects/sync/)。
