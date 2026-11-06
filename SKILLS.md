# Skills 清单

## 随模板提供的自有 skills

唯一编辑源：`.agents/skills/`。`pnpm skills:sync` 生成 `.claude/skills/` 镜像；
`pnpm check:template` 检查镜像相同。它们只使用仓库脚本和普通终端，不依赖专属 MCP。

| 名称 | 触发场景 | 输出 |
| --- | --- | --- |
| `project-bootstrap` | 从模板创建一个新项目 | 元数据、模块、初始文档与运行验证 |
| `project-doc-sync` | 功能或架构变化后同步文档，准备交接 | 对应文档与简短交接 |
| `design-system-apply` | 实现/修改产品 UI | 使用共享 token/组件的界面与状态验收 |
| `fastapi-conventions` | 添加或修改 API | 分层接口、明确契约与边界测试 |

各 skill 保持单一用途。首次会话要求 agent 明确实际读到哪些 skill；不同版本的
自动发现机制可能不同。必要时直接指定对应 SKILL.md 路径。
镜像只包含本模板自有规则，不覆盖全局 Codex/Claude 配置。

## 来源项目开发环境中的外部候选

以下是可用技能的配置建议，不宣称所有技能都曾在每项开发中实际执行，也不宣称
在新机器已安装。它们不被复制进模板；安装时核对上游版本、许可、工具依赖并记录。

| 候选 | 使用条件 | 安装/获取入口 |
| --- | --- | --- |
| Vercel React Best Practices | React/Next 实现与性能 | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |
| Web Design Guidelines | UI/可访问性审查 | 同一 Vercel skills 仓库 |
| Modern Web Guidance | HTML/CSS/客户端 API 实现前查询 | [npm 包](https://www.npmjs.com/package/modern-web-guidance)；本次使用 2026_10_30-58d055df 指南版本 |
| Playwright skill | 浏览器操作与界面检查 | [OpenAI skills](https://github.com/openai/skills)；模板浏览器测试本身无需该 skill |
| Supabase skills | 启用数据库/身份集成时 | 在所用 agent 的插件或 skills 管理器安装官方 Supabase 集成 |
| Chrome Extensions skill | 启用扩展模块时 | 选择可核实来源的 MV3 skill；基础规范参照 [Chrome 文档](https://developer.chrome.com/docs/extensions/) |
| OpenAI Docs / API skills | 实际采用 OpenAI 产品时 | 所用 agent 的官方 OpenAI 开发者插件；默认模板不调用 AI |

例如 Vercel skills 可用其官方 CLI 指南安装：

```sh
pnpx skills add vercel-labs/agent-skills --skill vercel-react-best-practices
```

执行前查看 CLI 帮助，选择项目范围和目标 agent；安装后记录实际 revision 与目标目录。
不要把仅在某一台机器的路径或插件名称当作跨 agent 可用能力。
来源项目旧 `.ai/skills` 中缺失引用的数据库规则未迁移；优先使用完整的上游版本。
