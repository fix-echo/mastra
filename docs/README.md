# **为文档做贡献**

欢迎并高度赞赏对 Mastra 的贡献。
如果您想做贡献，请查看我们的开放议题列表。我们也欢迎您提交 PR 或开启一个新议题来提出您的问题。

第一步是克隆仓库

```bash
git clone git@github.com:mastra-ai/mastra.git
cd docs
```

## 环境变量

除非您拥有这些项目的私钥，否则文档的某些功能将无法工作。
这些包括：

- posthog
- 表单订阅
- 分析
- 聊天机器人
- algolia 搜索

复制环境文件：

```bash
cp .env.example .env
```

## 开发预览

安装包

```bash
npm i
```

> 文档有独立的 `package.json` 文件，不属于工作区，所以请不要使用
> `pnpm` 或 `yarn` 来启动文档。

在终端中运行相应的 CLI 命令：

```bash
npm run dev
```

文档将在 `localhost:3000/docs` 上提供服务。

## 搜索

搜索使用 Algolia 实现。要设置搜索功能：

1. 创建 Algolia 账户和应用程序
2. 在 `.env.local` 中设置您的环境变量：

```bash
   NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
   NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_key
```

3. 在 Algolia 中索引您的文档内容

有关详细设置说明，请参见 [ALGOLIA_SETUP.md](./ALGOLIA_SETUP.md)。

## 进行更改

Mastra 文档使用 [MDX](https://mdxjs.com/)。

添加新内容需要：

- YAML 前置元数据
- 在 `meta.ts` 文件中的导航条目
- 文档内容

前置元数据如下所示。标题和描述是必需的。

```bash
---
title: "Introduction | Mastra Docs"
description: "Mastra 是一个 TypeScript Agent 框架。它帮助您快速构建 AI 应用程序和功能。它为您提供所需的基本组件：工作流、Agents、RAG、集成、同步和评估。"
---
```

导航在相对的 `meta.ts` 文件中定义。它修改侧边栏中内容的标题

```ts
const meta = {
  overview: "概述",
};

export default meta;
```

### 组件和元素

Mastra 基于 [Nextra](https://nextra.site/docs) 构建，因此我们使用 `Nextra` 提供的自定义组件，包括 `callouts`、`Tabs` 等

您可以在 [nextra 网站](https://nextra.site/docs/built-ins) 上找到完整列表

### 指南

**寻找要处理的内容：**

1. 查看标记为 'documentation' 或 'good first issue' 的开放议题。
2. 识别不清晰、缺失或不正确的区域。

**进行更改：**

1. 为您的更改创建新分支 (`git checkout -b my-docs-update`)。
2. 对文档文件进行所需的编辑（通常在 `docs/en` 目录中）。
3. 使用清晰简洁的消息提交您的更改。

**风格指南：**

1. 确保您的写作清晰、简洁且使用一致的格式。

**提交更改：**

1. 将您的分支推送到您的 fork (`git push origin my-docs-update`)。
2. 针对主仓库的 `main` 分支开启 Pull Request (PR)。
3. 在 PR 描述中清楚地描述您所做的更改。

**审查流程：**

1. 维护者将审查您的 PR。
2. 处理任何反馈或请求的更改。
3. 一旦获得批准，您的更改将被合并。

我们感谢您为改进我们的文档所做的贡献。