# 创建 getTransactions Tool

让我们创建一个从 Google Sheet 获取交易数据的工具。我们将创建一个名为 `tools/get-transactions-tool.ts` 的新文件。

首先，在 src/mastra/tools/get-transactions-tool.ts 创建新的工具文件

现在添加必要的导入：

```typescript
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
```

现在，让我们创建我们的工具：

```typescript
export const getTransactionsTool = createTool({
  id: "get-transactions",
  description: "Get transaction data from Google Sheets",
  inputSchema: z.object({}), // 不需要输入参数
  outputSchema: z.object({
    csvData: z.string(),
  }),
  execute: async () => {
    return await getTransactions();
  },
});

const getTransactions = async () => {
  // 这个 URL 指向一个包含交易数据的公共 Google Sheet
  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTQWaCzJAFsF4owWRHQRLo4G0-ERv31c74OOZFnqLiTLaP7NweoiX7IXvzQud2H6bdUPnIqZEA485Ux/pub?gid=0&single=true&output=csv";
  const response = await fetch(url);
  const data = await response.text();
  return {
    csvData: data,
  };
};
```

这个工具从公共 Google Sheet 获取交易数据并将其作为字符串返回。Mastra 的 `createTool` 函数使您可以轻松定义工具的 ID、描述、输入输出 schema 和执行逻辑。
