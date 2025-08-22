# 将 Memory 添加到您的 Agent

现在，让我们更新我们的 agent 以包含 memory。打开您的 `agents/index.ts` 文件并进行以下更改：

1. 导入 Memory 和 LibSQLStore 类：

```typescript
import { Agent } from "@mastra/core";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { getTransactionsTool } from "../tools";
```

2. 将由存储实例配置的 memory 添加到您的 agent：

```typescript
export const financialAgent = new Agent({
  name: "Financial Assistant Agent",
  instructions: `ROLE DEFINITION
  // ... 现有的指令 ...
  `,
  model: openai("gpt-4o"),
  tools: { getTransactionsTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../../memory.db", // 本地文件系统数据库。位置相对于输出目录 `.mastra/output`
    }),
  }), // 在这里添加 memory
});
```

通过将 `memory` 属性添加到您的 agent 配置中，您使其能够记住之前的对话。`@mastra/memory` 包中的 `Memory` 类为您的 agent 提供了一种添加 memory 功能的简单方法。`@mastra/libsql` 中的 `LibSQLStore` 类将 memory 数据持久化到 `SQLite` 数据库。
