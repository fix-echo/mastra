# 安装 Memory

首先，我们需要安装 Mastra memory 包来为我们的 agent 添加 memory 功能。我们还安装一个存储适配器来持久化 memory 数据。我们将使用 `libsql` 存储适配器。在您的终端中运行以下命令：

```bash
npm install @mastra/memory @mastra/libsql
```

`@mastra/memory` 包为您的 Mastra agents 提供了一个简单而强大的 memory 系统。它允许您的 agent 记住之前的对话并在多次交互中保持上下文。

`@mastra/libsql` 包是众多存储适配器之一，它将 memory 数据持久化到 `SQLite` 数据库。

这些包与核心 Mastra 包是分开的，以保持框架的模块化，并允许您只在项目中包含需要的功能。
