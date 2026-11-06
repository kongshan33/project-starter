# 系统架构

## 技术基线

pnpm 10.19 + Turborepo；Next.js 16 / React 19 / TypeScript strict；FastAPI /
Pydantic v2 / uv / Python 3.12；ESLint、Ruff、mypy、pytest、Playwright。
具体可复现版本以 `pnpm-lock.yaml` 和 `apps/api/uv.lock` 为准。
Node.js 22。默认无云端服务，所有开发服务器只监听 loopback。

## 文件结构

```text
apps/
  web/                    # Next 路由、应用组合、功能 UI
    app/  components/  features/
  api/                    # FastAPI 与 Python 测试
    app/routers/  app/schemas/  app/services/  app/integrations/
    tests/
packages/
  core/                   # 不依赖 UI/网络的纯逻辑
  types/                  # TypeScript 契约、运行时校验、跨端 fixture
  ui/                     # 设计 tokens、通用控件与反馈
  config/                 # 共享工程配置
design/
  docs/                   # 产品、架构、设计、交付规范与 decisions/
  prototypes/  assets/  references/  archive/
modules/extension/        # 首次初始化可选择生成 apps/extension
scripts/                  # 初始化、文档/skills/交接检查
tests/browser/            # Web → API 与交互验收
.agents/skills/           # 自有 skill 的编辑源
.claude/skills/           # 生成的 Claude 镜像
.ai/handoff/              # 当前任务接力上下文
.github/workflows/        # 自动验证
```

`components/` 在有应用级组合时创建；初始示例的组件直接归属 `features/preview`。
新项目延续目录职责，业务功能按需增加，不必提前创建空业务模块。

## 边界与数据流

```mermaid
flowchart LR
  Browser[浏览器功能组件] --> Next[Next 同源 API 路由]
  Next --> Router[FastAPI router]
  Router --> Service[业务 service]
  Service -. 按需添加 .-> Adapter[integrations]
  Adapter -. 按需连接 .-> Provider[数据库 / 外部服务]
```

- `app/` 组合页面，`features/` 组织交互，`components/` 放应用级组合。
- API router 校验契约并调用 service。外部连接只存在于 integrations，业务层
  不依赖客户端传入的 owner 身份。加入私有数据时先建立可信身份边界。
- `packages/core` 只有纯函数；`types` 提供 TypeScript 类型和运行时校验。
- Python 采用独立 Pydantic 模型；共同 JSON fixture 由两端检查。
  未来字段较多时再增加 OpenAPI 代码生成，不声明已有自动生成。
- `packages/ui` 直接导出 TS/TSX，Next 负责转译；其他消费者需配置等价转译。
- Python 的 `package.json` 只供 Turbo 编排，Python 依赖由 uv 管理。

## 当前示例契约

`POST /api/preview` 接收 `{title: string}`，去掉首尾空白后长度为 1–120。
返回 `{title, word_count, character_count}`；单词按空白切分，字符按 Unicode
码点计算。这是结构示例，不是语言学计数器。API 不保存输入、不使用 AI。
空白、超长和非字符串请求返回 422。Web 不在日志或界面显示上游内部错误。
Next 路由等待 API 最多 5 秒，失败返回可识别的非 2xx 状态。

浏览器只访问同源 Next 路由。`API_INTERNAL_URL` 是 Web 服务端配置，默认
`http://127.0.0.1:8000`。无需开放跨域访问或把服务地址注入浏览器。

## 运行与构建

`pnpm dev` 编排 Web 3000 / API 8000。`.next` 与 `.next-build` 分离，生产构建
不覆盖运行中的开发输出。生产构建显式使用 webpack，保持可复现的基本构建路径。
API build 仅做语法编译；真正 lint 是 Ruff，静态类型检查是 mypy。
Turbo 输入包含项目配置；新增影响构建的环境变量应同步 `turbo.json`。

## 扩展边界

数据库、登录、队列、AI、部署和浏览器扩展参见 [可选模块](OPTIONAL_MODULES.md)。
加入真实存储时，用新迁移建立新项目数据库，不复制来源项目的表或生产标识。
