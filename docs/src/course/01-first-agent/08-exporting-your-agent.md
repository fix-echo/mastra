# 导出您的 Agent

为了使您的 agent 在 playground 中可用，您需要通过 `src/mastra/index.ts` 文件中的 Mastra 类导出它。

首先，导入必要的依赖项和您的 agent：

```typescript
import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { financialAgent } from "./agents/financial-agent";

export const mastra = new Mastra({
  agents: {
    financialAgent,
  },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
```

这将创建一个新的 Mastra 实例，包括：

- 您的金融 agent
- 用于开发的内存存储
- 用于调试和监控的记录器

Mastra 类是您 Mastra 项目的主要入口点。它负责注册您的 agent 并配置存储和记录等核心服务。
