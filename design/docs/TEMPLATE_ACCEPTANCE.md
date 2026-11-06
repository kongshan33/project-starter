# 模板提炼与验收

日期：2026-11-06。当前状态：本地验收完成，远端发布单独记录。

## 提炼范围

保留：apps/packages 分工、pnpm/Turbo 编排、FastAPI 分层、规范职责、design
目录、共享灰阶和异步反馈原则。重写：最小业务示例、干净配置、初始化工具、
交接机制和精简组件。排除：业务 prompt、媒体模型、账户、环境文件、云资源
标识、原项目提交历史和参考截图。没有复制外部 skills 的未核实许可文件。

## 验收记录

| 项目 | 结果 |
| --- | --- |
| 冻结依赖安装 | `pnpm install --frozen-lockfile`、`pnpm setup:api` 通过 |
| 模板/文档/skills 一致性 | `pnpm check:template` 通过；4 个自有 skills 通过 skill-creator 格式检查 |
| ESLint、Ruff、TypeScript、mypy | `pnpm check` 全部通过 |
| API、契约、初始化测试 | 8 项 pytest、2 项契约、4 项初始化测试通过 |
| Next 生产构建 | `pnpm check` 中的 production build 通过 |
| 实际本地 API 与浏览器流程 | `pnpm test:browser` 7/7 通过 |
| 窄屏、错误恢复、重复提交、减少动画 | 1440px/390px、正常/减少动画、故障注入与重试通过；已检查截图 |
| 新项目初始化 | 干净目录初始化为 orbit-demo，冻结安装、完整 check 和浏览器 7/7 通过 |
| 可选扩展开关 | 另一干净目录启用扩展，安装、扩展文件校验和模板检查通过 |
| 公开内容检查与 GitHub template 设置 | 发布时确认 |

## 维护事项

ESLint 9 为当前插件兼容性选择，升级计划见决策 0001。API 测试可出现 Starlette
对 httpx 测试客户端的弃用提示；当前锁定组合通过，迁移时单独更新并复验。
截图与运行缓存不进入 Git；CI 日志提供远端可复查的执行证据。

## 证据边界

浏览器正常路径使用真实本地 FastAPI；故障与延迟路径采用明确的网络注入。
无生产部署、真实账号、数据库、付费 AI、真人可访问性或实际跨 agent 会话验收。
自动交接检查只证明结构完整，不能证明叙述真实或 agent 一定遵守。
扩展只验证生成与 MV3 文件结构，尚未执行浏览器加载或商店发布验收。
