# @mastra/core

Mastra 是用于构建 AI Agents 和助手的 Typescript 框架。世界上一些最大的公司使用它来构建内部 AI 自动化工具和面向客户的 Agents。

这是 `core` 包，包含 Mastra 的主要功能，包括 Agents、Workflows、Tools 和遥测。

## 安装

```bash
npm install @mastra/core
```

## 核心组件

### Agents (`/agent`)

Mastra Agents 是可以理解指令、使用工具和完成任务的自主 AI 实体。它们封装了 LLM 交互，可以维护对话历史、使用提供的工具，并通过指令遵循特定的行为准则。

```typescript
import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';

const agent = new Agent({
  name: 'my-agent',
  instructions: 'Your task-specific instructions',
  model: openai('gpt-4o-mini'),
  tools: {}, // 可选工具
});
```

[Agent 文档 →](https://mastra.ai/docs/agents/overview)

### Workflows (`/workflows`)

Mastra Workflows 是一个基于图形的执行引擎，允许您链接、分支和并行化 LLM 调用。您可以通过组合多个操作来编排复杂的 AI 任务。Workflows 处理状态管理、错误恢复，并可以包含条件逻辑。

```typescript
import { createWorkflow } from '@mastra/core/workflows';
import z from 'zod'

const workflow = createWorkflow({
  id: 'my-workflow',
  inputSchema: z.object({}),
  outputSchema: z.object({})
  steps: [
    // Workflow 步骤
  ],
});
```

[Workflow 文档 →](https://mastra.ai/docs/workflows/overview)

### Tools (`/tools`)

Tools 是 Agents 可以用来与外部系统交互或执行特定任务的函数。每个工具都有清晰的描述和模式，使 AI 能够轻松理解和有效使用它们。

```typescript
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const weatherInfo = createTool({
  id: 'Get Weather Information',
  inputSchema: z.object({
    city: z.string(),
  }),
  description: 'Fetches the current weather information for a given city',
  execute: async ({ context: { city } }) => {
    // 工具实现
  },
});
```

[Tools 文档 →](https://mastra.ai/docs/agents/adding-tools)

### Evals (`/eval`)

评估系统能够对 AI 输出进行定量评估。创建自定义指标来衡量 AI 性能的特定方面，从响应质量到任务完成准确性。

```typescript
import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { SummarizationMetric } from '@mastra/evals/llm';
import { ContentSimilarityMetric, ToneConsistencyMetric } from '@mastra/evals/nlp';

const model = openai('gpt-4o');

const agent = new Agent({
  name: 'ContentWriter',
  instructions: 'You are a content writer that creates accurate summaries',
  model,
  evals: {
    summarization: new SummarizationMetric(model),
    contentSimilarity: new ContentSimilarityMetric(),
    tone: new ToneConsistencyMetric(),
  },
});
```

[更多 evals 文档 →](https://mastra.ai/docs/evals/overview)

### Logger (`/logger`)

日志系统提供结构化、分层的日志记录，具有多种传输选项。它支持调试信息、性能监控和跨 AI 应用程序的错误跟踪。

```typescript
import { LogLevel } from '@mastra/core';
import { PinoLogger } from '@mastra/loggers';

const logger = new PinoLogger({
  name: 'MyApp',
  level: LogLevel.INFO,
});
```

[更多日志记录文档 →](https://mastra.ai/reference/observability/logging)

### Telemetry (`/telemetry`)

遥测提供 OpenTelemetry (Otel) 集成，用于全面监控您的 AI 系统。通过分布式追踪和指标收集来跟踪延迟、成功率和系统健康状况。

```typescript
import { Mastra } from '@mastra/core';

const mastra = new Mastra({
  telemetry: {
    serviceName: 'my-service',
    enabled: true,
    sampling: {
      type: 'ratio',
      probability: 0.5,
    },
    export: {
      type: 'otlp',
      endpoint: 'https://otel-collector.example.com/v1/traces',
    },
  },
});
```

[更多遥测文档 →](https://mastra.ai/reference/observability/telemetry)

## 其他资源

- [入门指南](https://mastra.ai/docs/getting-started/installation)
- [API 参考](https://mastra.ai/reference)
- [示例](https://mastra.ai/docs/examples)
- [部署指南](https://mastra.ai/docs/deployment/overview)