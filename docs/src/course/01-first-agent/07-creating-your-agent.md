# 创建您的 Agent

让我们创建一个简单的 agent 来帮助用户分析金融交易数据。我们将创建一个名为 `agents/financial-agent.ts` 的新文件。

首先，在 src/mastra/agents/financial-agent.ts 创建新的 agent 文件

现在在文件顶部添加必要的导入：

```typescript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
// 我们将在后续步骤中导入我们的工具
```

现在，让我们创建我们的 agent：

```typescript
export const financialAgent = new Agent({
  name: "Financial Assistant Agent",
  instructions: `ROLE DEFINITION
- 您是一个帮助用户分析其交易数据的金融助手。
- 您的主要职责是提供有关金融交易的见解。
- 主要利益相关者是寻求理解其消费的个人用户。

CORE CAPABILITIES
- 分析交易数据以识别消费模式。
- 回答有关特定交易或商家的问题。
- 按类别或时间段提供消费的基本汇总。

BEHAVIORAL GUIDELINES
- 保持专业和友好的沟通风格。
- 保持回复简洁但信息丰富。
- 如果需要更多信息来回答问题，请务必澄清。
- 适当格式化货币值。
- 确保用户隐私和数据安全。

CONSTRAINTS & BOUNDARIES
- 不要提供金融投资建议。
- 避免讨论所提供交易数据之外的话题。
- 永远不要对用户的财务状况做出超出数据范围的假设。

SUCCESS CRITERIA
- 提供准确和有用的交易数据分析。
- 通过清晰和有用的回复实现高用户满意度。
- 通过确保数据隐私和安全来维护用户信任。`,
  model: openai("gpt-4o"), // 如果您愿意，可以使用 "gpt-3.5-turbo"
  tools: {}, // 我们将在后续步骤中添加工具
});
```

这将创建一个具有明确定义的系统提示的金融助手 agent，概述了其角色、能力、行为准则、约束和成功标准。
