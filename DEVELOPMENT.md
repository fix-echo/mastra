# Mastra 开发指南

本指南为希望为 Mastra 代码库做贡献或与其一起工作的开发人员提供说明。

## 先决条件

- **Node.js** (v20.0+)
- **pnpm** (v9.7.0+) - Mastra 使用 pnpm 进行包管理
- **Docker** (用于本地开发服务)

## 仓库结构

Mastra 以 monorepo 形式组织，包含以下关键目录：

- **packages/** - 构成 Mastra 框架的核心包
  - **core/** - Mastra 框架的基础，提供基本组件，包括 Agent 系统、LLM 抽象、工作流编排、向量存储、内存管理和工具基础设施
  - **cli/** - 命令行界面，用于创建、运行和管理 Mastra 项目，包括用于测试 Agents 和 Workflows 的交互式 playground UI
  - **deployer/** - 用于将 Mastra 应用程序部署到各种环境的服务器基础设施和构建工具，具有用于 Agents、Workflows 和内存管理的 API 端点
  - **rag/** - 检索增强生成工具，用于文档处理、分块、嵌入和语义搜索，支持各种重排序策略
  - **memory/** - 用于存储和检索会话间对话历史、向量数据和应用程序状态的内存系统
  - **evals/** - 用于测量 LLM 性能的评估框架，具有准确性、相关性、毒性等质量维度的指标
  - **mcp/** - Model Context Protocol 实现，用于与 AI 模型进行标准化通信，支持跨不同提供商的工具使用和结构化响应

- **deployers/** - 用于 Vercel、Netlify 和 Cloudflare 等服务的特定平台部署适配器，处理环境配置和无服务器函数部署
- **stores/** - 用于各种向量和键值数据库的存储适配器，为不同存储后端提供一致的数据持久化 API

- **voice/** - 语音到文本和语音处理功能，用于实时转录和基于语音的交互
- **client-sdks/** - 用于不同平台和框架的客户端库，提供类型安全的接口与 Mastra 服务交互
- **examples/** - 演示各种 Mastra 功能的示例应用程序，包括 Agents、Workflows、内存系统以及与不同框架的集成

## 入门指南

### 设置开发环境

1. **克隆仓库**：

   ```bash
   git clone https://github.com/mastra-ai/mastra.git
   cd mastra
   ```

2. **启用 corepack**（确保正确的 pnpm 版本）：

   ```bash
   corepack enable
   ```

3. **安装依赖并构建初始包**：

   ```bash
   pnpm run setup
   ```

   此命令安装所有依赖并构建 CLI 包，这是其他包所必需的。

### 构建包

如果在构建过程中遇到以下错误：

```text
Error [ERR_WORKER_OUT_OF_MEMORY]: Worker terminated due to reaching memory limit: JS heap out of memory
```

您可以通过在构建命令前添加以下内容来增加 Node 的堆大小：

```bash
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

- **构建所有包**：

  ```bash
  pnpm build
  ```

- **构建特定包组**：

  ```bash
  pnpm build:packages         # 所有核心包
  pnpm build:deployers        # 所有部署适配器
  pnpm build:combined-stores  # 所有向量和数据存储
  pnpm build:speech           # 所有语音处理包
  pnpm build:clients          # 所有客户端 SDK
  ```

- **构建单个包**：
  ```bash
  pnpm build:core             # 核心框架包
  pnpm build:cli              # CLI 和 playground 包
  pnpm build:deployer         # Deployer 包
  pnpm build:rag              # RAG 包
  pnpm build:memory           # 内存包
  pnpm build:evals            # 评估框架包
  pnpm build:docs-mcp         # MCP 文档服务器
  ```

## 测试

Mastra 使用 Vitest 进行测试。要运行测试：

1. **确保开发服务正在运行**：

   ```bash
   pnpm run dev:services:up
   ```

2. **设置环境变量**：

   ```bash
   cp .env.example .env
   ```

   将任何必要的 API 密钥添加到 `.env` 文件中。

3. **运行测试**：
   - 所有测试：
     ```bash
     pnpm test
     ```
   - 特定包测试：
     ```bash
     pnpm test:core             # 核心包测试
     pnpm test:cli              # CLI 测试
     pnpm test:rag              # RAG 测试
     pnpm test:memory           # 内存测试
     pnpm test:evals            # Evals 测试
     pnpm test:clients          # 客户端 SDK 测试
     pnpm test:combined-stores  # 组合存储测试
     ```
   - 监视模式（用于开发）：
     ```bash
     pnpm test:watch
     ```

## 贡献

1. **为您的更改创建分支**：

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **进行更改并确保测试通过**：

   ```bash
   pnpm test
   ```

3. **创建 changeset**（用于版本管理）：

   ```bash
   pnpm changeset
   ```

   按照提示描述您的更改。

4. **提交 Pull Request** 包含您的更改。

## 文档

文档站点从 `/docs` 目录构建。要为文档做贡献：

1. 修改 `/docs` 目录中相关的 Markdown 文件
2. 在本地测试您的更改
3. 提交包含文档更新的 Pull Request

## 需要帮助？

加入 [Mastra Discord 社区](https://discord.gg/BTYqqHKUrf) 获取支持和讨论。