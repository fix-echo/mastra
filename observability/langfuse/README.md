# @mastra/langfuse

用于 Mastra 应用程序的 Langfuse AI 可观测性导出器。

## 安装

```bash
npm install @mastra/langfuse
```

## 使用方法

```typescript
import { LangfuseExporter } from '@mastra/langfuse';

// 与 Mastra 一起使用
const mastra = new Mastra({
  ...,
  observability: {
    instances: {
      langfuse: {
        serviceName: 'service',
        exporters: [
          new LangfuseExporter({
            publicKey: process.env.LANGFUSE_PUBLIC_KEY,
            secretKey: process.env.LANGFUSE_SECRET_KEY,
            baseUrl: process.env.LANGFUSE_BASE_URL,
            realtime: true,
          }),
        ],
      },
    },
  },
});
```

## 功能特性

### AI 追踪

- **自动跨度映射**：根跨度变成 Langfuse 追踪
- **LLM 生成支持**：`LLM_GENERATION` 跨度变成具有令牌使用的 Langfuse 生成
- **类型特定元数据**：为每种跨度类型（代理、工具、工作流）提取相关元数据
- **错误跟踪**：自动错误状态和消息跟踪
- **分层追踪**：维护父子关系

## 许可证

Apache 2.0
