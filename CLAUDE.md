# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在处理此仓库中的代码时提供指导。

## 开发命令

### 设置和构建

- `pnpm run setup` - 安装依赖并构建 CLI（必需的第一步）
- `pnpm build` - 构建所有包（不包括示例和文档）
- `pnpm build:packages` - 仅构建核心包
- `pnpm build:core` - 构建核心框架包
- `pnpm build:cli` - 构建 CLI 和 playground 包
- `pnpm build:memory` - 构建内存包
- `pnpm build:rag` - 构建 RAG 包
- `pnpm build:combined-stores` - 构建所有存储适配器
- `pnpm build:deployers` - 构建部署适配器
- `pnpm build:evals` - 构建评估框架
- `NODE_OPTIONS="--max-old-space-size=4096" pnpm build` - 如有需要，增加内存进行构建

### 测试

- `pnpm dev:services:up` - 启动本地 Docker 服务（集成测试所需）
- 更快的测试方法：先从根目录构建，然后 cd 到特定包并在此处运行测试
  ```bash
  pnpm build  # 先从 monorepo 根目录构建
  cd packages/memory
  pnpm test   # 比运行所有测试快得多
  ```
- `pnpm test` - 运行所有测试（较慢，谨慎使用）
- `pnpm test:watch` - 以监视模式运行测试
- 包特定测试：`pnpm test:core`、`pnpm test:cli`、`pnpm test:memory`、`pnpm test:rag` 等

### 开发

- `pnpm dev:services:down` - 停止本地 Docker 服务
- `pnpm typecheck` - 在所有包中运行 TypeScript 检查
- `pnpm prettier:format` - 使用 Prettier 格式化代码
- `pnpm format` - 在所有包中运行 linting 并自动修复（不包括示例、文档、集成、playground）

## 文档

### 文档位置

- **主要文档**：`docs/` 目录 - 包含使用 Next.js 构建的完整文档站点
- **课程内容**：`docs/src/course/` - 教程和学习材料
- **API 参考**：从代码注释和导出类型生成
- **包 README**：每个包/集成都有自己的 README.md
- **开发指南**：`DEVELOPMENT.md` - 设置和贡献说明

### 文档指南

- 遵循 `.cursor/rules/writing-documentation.mdc` 的写作风格
- 避免营销语言，专注于技术实现细节
- 示例应该是实用且可运行的

## 架构概述

Mastra 是一个围绕中央编排构建的模块化 AI 框架，具有可插拔组件。关键架构模式：

### 核心组件

- **Mastra 类** (`packages/core/src/mastra/`) - 具有依赖注入的中央配置中心
- **Agents** (`packages/core/src/agent/`) - 具有工具、内存和语音的主要 AI 交互抽象
- **工具系统** (`packages/core/src/tools/`) - 支持多来源的动态工具组合
- **内存系统** (`packages/core/src/memory/`) - 基于线程的对话持久化，支持语义回忆
- **Workflows** (`packages/core/src/workflows/`) - 具有暂停/恢复功能的基于步骤的执行
- **存储层** (`packages/core/src/storage/`) - 具有标准化接口的可插拔后端

### 包结构

- **packages/** - 核心框架包（core、cli、deployer、rag、memory、evals、mcp、server）
- **stores/** - 存储适配器（pg、chroma、pinecone 等）
- **deployers/** - 平台部署适配器（vercel、netlify、cloudflare）
- **speech/** - 语音处理包（语音合成和识别）
- **client-sdks/** - 不同平台的客户端库
- **integrations/** - 第三方 API 集成（github、firecrawl 等）
- **examples/** - 演示应用程序
- **auth/** - 认证提供商集成

### 关键模式

1. **依赖注入** - 组件向中央 Mastra 实例注册
2. **插件架构** - 可插拔的存储、向量、内存、部署器
3. **运行时上下文** - 用于动态配置的请求范围上下文传播
4. **消息列表抽象** - 跨格式的统一消息处理

### 工具和集成

- 工具从多个来源动态组合（分配的、内存的、工具集、MCP）
- 集成基于 OpenAPI，支持 OAuth/API 密钥认证
- MCP (Model Context Protocol) 启用外部工具集成

### 存储和内存

- 具有标准化接口的可插拔存储后端
- 内存系统支持基于线程的对话、语义回忆和工作内存
- 向量存储提供语义搜索功能

## 开发指南

### 文档写作

遵循 `.cursor/rules/writing-documentation.mdc`：

- 避免营销语言（"强大的"、"完整的"、"开箱即用的"）
- 不要使用 "您的需求"、"生产就绪的"、"使它变得容易"
- 专注于技术细节而不是优势
- 为工程师而不是营销人员写作

### Monorepo 管理

- 使用 pnpm (v9.7.0+) 进行包管理
- 构建依赖通过 turbo.json 管理
- 所有包都使用带有严格类型检查的 TypeScript
- 对于测试：先从根目录构建，然后 cd 到特定包以加快迭代

### 组件开发

- 组件应与中央 Mastra 编排集成
- 遵循插件模式以实现可扩展性
- 为存储/向量操作实现标准化接口
- 使用遥测装饰器实现可观察性
- 在适用的地方支持同步和异步操作

### 测试策略

- 集成测试需要 Docker 服务 (`pnpm dev:services:up`)
- 使用 Vitest 作为测试框架
- 测试文件应与源代码共存
- 更快的开发：先从根目录构建，然后测试单个包
- 在单元测试中模拟外部服务

### 常见问题

- 构建期间内存错误：使用 `NODE_OPTIONS="--max-old-space-size=4096"`
- 缺少依赖：先运行 `pnpm setup`
- 测试失败：确保 Docker 服务正在运行并先从根目录构建
- 类型错误：运行 `pnpm typecheck` 检查所有包