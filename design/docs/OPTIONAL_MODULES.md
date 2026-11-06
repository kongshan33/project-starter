# 可选模块

基础模板已经可以独立启动。下列模块按新产品需求启用；没有配置就不假装接入。

| 模块 | 模板提供 | 接入时必须补齐 |
| --- | --- | --- |
| Chrome 扩展 | `modules/extension` 最小 MV3 popup；初始化 `--extension` 复制到 apps | 实际业务、最小权限、浏览器验收、发布资料 |
| Supabase/Postgres | 目录/身份边界说明 | 新项目 schema/migrations、RLS、隔离测试、环境配置 |
| Clerk 或其他身份 | 服务端身份归属原则 | 服务端验证、登录/退出、账号切换、真实登录验收 |
| Redis / 后台 worker | 编排原则 | 独立 worker、持久状态、幂等、租约/重试、监控 |
| AI 提供方 | adapter 边界与验证要求 | 服务端凭据、超时、结构校验、样本评测、费用控制 |
| 部署 | 本地构建与 CI | 托管配置、运行 secrets、健康检查、恢复流程 |

## 扩展

首次 `node scripts/init-project.mjs ... --extension` 后，`apps/extension` 加入工作区。
运行 `pnpm install` 更新 importer 锁文件，然后 `pnpm --filter @<项目名>/extension build`。
在 Chrome 扩展页开启开发者模式，加载 `apps/extension`。默认 popup 只有项目名称
与说明，不读取页面、账号、音频或网络数据，也不申请额外权限。

模块源保留在 `modules/extension`，不进入默认 workspace。后续接入可手动复制到
apps、调整包命名空间并更新 `project.json.modules.extension`，重新安装和验收。

## 数据和任务

实际私有数据必须从服务端验证的身份确定 owner，不接收客户端 owner_id 作为授权。
持久存储失败不得静默切换到内存。读取不应隐式创建付费任务。
后台任务按业务确定幂等键、不可变输入、领取租约、重试预算、取消/删除与迟到结果
隔离；这些机制需用实际数据库/队列验证，不由模板空目录证明。

模板不带原项目的迁移、表、云项目 ID、服务地址或业务 prompt。
