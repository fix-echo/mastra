# Mastra

[![npm version](https://badge.fury.io/js/@mastra%2Fcore.svg)](https://www.npmjs.com/package/@mastra/core)
[![CodeQl](https://github.com/mastra-ai/mastra/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/mastra-ai/mastra/actions/workflows/github-code-scanning/codeql)
[![GitHub Repo stars](https://img.shields.io/github/stars/mastra-ai/mastra)](https://github.com/mastra-ai/mastra/stargazers)
[![Discord](https://img.shields.io/discord/1309558646228779139?logo=discord&label=Discord&labelColor=white&color=7289DA)](https://discord.gg/BTYqqHKUrf)
[![Twitter Follow](https://img.shields.io/twitter/follow/mastra_ai?style=social)](https://x.com/mastra_ai)
[![NPM Downloads](https://img.shields.io/npm/dm/%40mastra%252Fcore)](https://www.npmjs.com/package/@mastra/core)
[![Static Badge](https://img.shields.io/badge/Y%20Combinator-W25-orange)](https://www.ycombinator.com/companies?batch=W25)

Mastra 是用于构建 AI Agents 和助手的 Typescript 框架。世界上一些最大的公司使用它来构建内部 AI 自动化工具和面向客户的 Agents。

您可以在本地机器上运行 Mastra，将其打包到带有 Hono 的 Node.js 服务器中，或部署到无服务器云。

Mastra 的主要功能包括：

| 功能                                               | 描述                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| LLM Models                                             | Mastra 使用 [Vercel AI SDK](https://sdk.vercel.ai/docs/introduction) 进行模型路由，提供统一接口与任何 LLM 提供商交互，包括 OpenAI、Anthropic 和 Google Gemini。您可以选择特定的模型和提供商，并决定是否流式传输响应。 |
| [Agents](https://mastra.ai/docs/agents/overview)       | Agents 是语言模型选择一系列操作的系统。在 Mastra 中，Agents 为 LLM 模型提供 Tools、Workflows 和同步数据。Agents 可以调用您自己的函数或第三方集成的 APIs，并访问您构建的知识库。                                   |
| [Tools](https://mastra.ai/docs/agents/adding-tools)    | Tools 是可以由 Agents 或 Workflows 执行的类型化函数，具有内置的集成访问和参数验证。每个 Tool 都有一个定义其输入的模式、一个实现其逻辑的执行器函数，以及对配置的集成的访问。                               |
| [Workflows](https://mastra.ai/docs/workflows/overview) | Workflows 是持久的基于图形的状态机。它们具有循环、分支、等待人工输入、嵌入其他 Workflows、错误处理、重试、解析等功能。它们可以在代码中构建或使用可视化编辑器构建。Workflows 中的每个步骤都内置了 OpenTelemetry 追踪。               |
| [RAG](https://mastra.ai/docs/rag/overview)             | 检索增强生成 (RAG) 让您能够为 Agents 构建知识库。RAG 是一个 ETL 管道，具有特定的查询技术，包括分块、嵌入和向量搜索。                                                                                                       |
| [Integrations](https://mastra.ai/docs/integrations)    | 在 Mastra 中，Integrations 是为第三方服务自动生成的类型安全的 API 客户端，可以作为 Tools 用于 Agents 或 Workflows 中的步骤。                                                                                                                                                 |
| [Evals](https://mastra.ai/docs/08-running-evals)       | Evals 是使用模型评分、基于规则和统计方法评估 LLM 输出的自动化测试。每个 Eval 返回 0-1 之间的标准化分数，可以记录和比较。Evals 可以使用您自己的提示和评分函数进行自定义。                                    |

## 快速开始

### 先决条件

- Node.js (v20.0+)

## 获取 LLM 提供商 API 密钥

如果您没有 LLM 提供商的 API 密钥，可以从以下服务获取：

- [OpenAI](https://platform.openai.com/)
- [Anthropic](https://console.anthropic.com/settings/keys)
- [Google Gemini](https://ai.google.dev/gemini-api/docs)
- [Groq](https://console.groq.com/docs/overview)
- [Cerebras](https://inference-docs.cerebras.ai/introduction)

如果您没有这些提供商的账户，可以注册并获取 API 密钥。Anthropic 需要信用卡才能获取 API 密钥。一些 OpenAI 模型和 Gemini 不需要，并且其 API 有慷慨的免费层级。

## 创建新项目

开始使用 Mastra 最简单的方法是使用 `create-mastra`。这个 CLI 工具使您能够快速开始构建新的 Mastra 应用程序，并为您设置好一切。

```bash
npx create-mastra@latest
```

### 运行脚本

最后，运行 `mastra dev` 打开 Mastra playground。

```bash copy
npm run dev
```

如果您使用 Anthropic，请设置 `ANTHROPIC_API_KEY`。如果您使用 Gemini，请设置 `GOOGLE_GENERATIVE_AI_API_KEY`。

# MCP Server ([@mastra/mcp-docs-server](https://www.npmjs.com/package/@mastra/mcp-docs-server))

使用我们的 MCP server [@mastra/mcp-docs-server](https://www.npmjs.com/package/@mastra/mcp-docs-server) 来教您的 LLM 如何使用 Mastra。

这是一个 Model Context Protocol (MCP) 服务器，为 AI 助手提供对 Mastra.ai 完整知识库的直接访问。

## 在 Cursor 中

在项目根目录创建或更新 .cursor/mcp.json：

### MacOS/Linux

```
{
  "mcpServers": {
    "mastra": {
      "command": "npx",
      "args": ["-y", "@mastra/mcp-docs-server"]
    }
  }
}
```

### Windows

```
{
  "mcpServers": {
    "mastra": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@mastra/mcp-docs-server"]
    }
  }
}
```

这将使所有 Mastra 文档工具在您的 Cursor 工作区中可用。请注意，MCP 服务器默认不会启用。您需要前往 Cursor 设置 -> MCP 设置并点击 Mastra MCP 服务器上的 "enable"。

## 在 Windsurf 中

创建或更新 ~/.codeium/windsurf/mcp_config.json：

### MacOS/Linux

```
{
  "mcpServers": {
    "mastra": {
      "command": "npx",
      "args": ["-y", "@mastra/mcp-docs-server"]
    }
  }
}
```

更多安装选项请访问 [https://www.npmjs.com/package/@mastra/mcp-docs-server](https://www.npmjs.com/package/@mastra/mcp-docs-server)

## 贡献

想要贡献吗？欢迎各种形式的帮助，从编码到测试和功能规范。

如果您是开发人员并希望贡献代码，请在提交 Pull Request 之前先开启一个议题进行讨论。

有关项目设置的信息可以在[开发文档](./DEVELOPMENT.md)中找到

## 支持

我们有一个[开放的社区 Discord](https://discord.gg/BTYqqHKUrf)。来打个招呼，告诉我们如果您有任何问题或需要帮助来启动项目。

如果您在[页面顶部](https://github.com/mastra-ai/mastra)给项目点个星也会非常有帮助