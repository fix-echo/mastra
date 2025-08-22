# 将 Tool 连接到您的 Agent

既然我们已经创建了我们的工具，我们需要将其连接到我们的 agent。回到您的 `agents/financial-agent.ts` 文件并更新它：

1. 导入工具：

```typescript
import { getTransactionsTool } from "../tools/get-transactions-tool";
```

2. 将工具添加到您的 agent：

```typescript
export const financialAgent = new Agent({
  name: "Financial Assistant Agent",
  instructions: `ROLE DEFINITION
  // ... 现有的指令 ...
  
  TOOLS
  - 使用 getTransactions 工具来获取金融交易数据。
  - 分析交易数据以回答用户有关其消费的问题。`,
  model: openai("gpt-4o"),
  tools: { getTransactionsTool }, // 在这里添加我们的工具
});
```

通过将工具添加到您的 agent 配置中，您使其可供 agent 使用。现在，当 agent 需要访问交易数据时，它将能够调用 `getTransactions` 工具。

更新 agent 的指令以包含有关工具的信息也很重要。这有助于 agent 理解何时以及如何使用工具来满足用户请求。
