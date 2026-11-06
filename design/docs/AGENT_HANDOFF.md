# Codex / Claude Code 交接

## 共享入口

`AGENTS.md` 是共同规则；`CLAUDE.md` 使用 `@AGENTS.md` 显式导入。
不要让 AGENTS 再导入 CLAUDE。采用官方大小写，避免大小写敏感环境出错。
项目规则与会话聊天分开保存。工具自己的 memory 是辅助信息，不能替代仓库状态。

- [Codex AGENTS 文档](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Claude Code memory / imports](https://code.claude.com/docs/en/memory)

自动加载会受 agent 版本、工作目录和设置影响。首次使用时要求 agent 列出读取的
规则来源。本文描述模板工作流程，不承诺任意工具版本一定自动加载所有文件。

## 三层上下文

1. 长期规则：AGENTS、架构、设计、已接受决策。
2. 当前项目：PROJECT 与 TASK。
3. 当前接力：`.ai/handoff/current.md`，尽量一两屏，指向具体文件和证据。

交接写清用户已经确定的要求、未决问题、代码基线、相关未提交修改、实际验证、
失败尝试中仍有价值的结论和下一步。记录端口/启动方式，但不记录密钥或用户数据。
跨机器交接必须同步代码及必要未提交改动；摘要不是补丁。

## 交出任务

1. 检查实际 diff；将长期事实写回对应文档。
2. 更新交接时间、分支与基准 commit；区分自己的改动和原有改动。
3. 写实际测试命令、结果与范围。未运行就写未运行。
4. 写下一项可执行操作和验收条件，执行 `pnpm handoff:check`。
5. 切换后避免两个 agent 同时修改同一工作区。需要并行时各用独立 worktree 和交接文件。

## 接手任务

1. 读取共同规则、PROJECT、TASK、当前交接。
2. 检查当前分支、HEAD、git status 与相关 diff；发现过期信息时先核对。
3. 根据任务加载设计文档和 skills；核对依赖工具是否实际可用。
4. 简要复述当前目标、已完成和下一步，然后继续用户已授权的工作。

直接复制给新 agent：

> 接手当前项目。读取 AGENTS.md、PROJECT.md、TASK.md 和 .ai/handoff/current.md，
> 检查分支、git status 与相关 diff。简述目标、已完成部分和下一步；发现交接与
> 代码不一致时先说明差异，再继续明确的工作。完成后更新相关文档和交接。

## Skills 与工具

`.agents/skills` 是本模板自有 skill 的唯一编辑源。执行 `pnpm skills:sync`
生成 `.claude/skills` 实体镜像，便于两种 agent 发现；检查脚本防止镜像漂移。
不是所有外部 skills、插件或 MCP 都能跨 agent 直接迁移。安装来源与依赖见 SKILLS。

## 真实交接验收

让一个 agent 实现小功能的一部分并更新交接，在没有原聊天记录的新会话中由另一
agent 接手；核对目标、约束、代码和验证是否恢复。结构检查不能替代该行为验收。
本模板的自动初始化测试不会宣称已经完成真人 Codex → Claude 会话接力。
