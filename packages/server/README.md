# @mastra/server

类型化的 HTTP 处理程序和实用程序，用于通过 HTTP 暴露 `Mastra` 实例。
此包为 `mastra dev` 提供支持，可以添加到您自己的服务器中，为 Agents、Workflows、遥测等提供 REST 和流式端点。

## 安装

```bash
npm install @mastra/server
```

## 用法

处理程序是与框架无关的函数，接受 `Mastra` 实例和请求上下文。它们通常在您选择的 Web 框架内挂载到 URL 前缀下：

```typescript
import { Hono } from 'hono';
import { handlers } from '@mastra/server';
import { mastra } from './mastra-instance';

const app = new Hono();

app.get('/mastra/agents', ctx => handlers.agents.getAgentsHandler({ mastra, runtimeContext: ctx }));
app.post('/mastra/agents/:id/generate', async ctx => {
  const body = await ctx.req.json();
  return handlers.agents.generateHandler({
    mastra,
    runtimeContext: ctx,
    agentId: ctx.req.param('id'),
    body,
  });
});

// 根据需要挂载额外的处理程序
```

运行 `mastra dev` 会使用这些处理程序在 `http://localhost:3000` 启动一个本地开发 UI。

## 可用的处理程序组

- **Agents** - 列出定义的 Agents，检索元数据，以及运行 `generate` 或 `stream`。
- **Workflows** - 启动和检查工作流运行。
- **Tools** - 发现 `Mastra` 实例可用的工具。
- **Memory** - 与配置的内存存储交互。
- **Logs** - 当使用支持的日志记录器传输时查询运行时日志。
- **Telemetry** - 暴露遥测子系统产生的指标。
- **Networks** - 与 Agent 网络交互。
- **Vector / Voice** - 与向量存储和语音合成相关的端点。

处理程序返回可 JSON 序列化的数据，并在失败应导致非 2xx HTTP 状态时抛出 `HTTPException`（`Error` 的子类）。

## OpenAPI 规范生成

CLI playground 和类似工具使用的本地 OpenAPI 规范可以通过运行以下命令刷新：

```bash
pnpm run pull:openapispec
```

在 `@mastra/server` 目录中执行。

## 许可证

根据 Elastic License 2.0 发布。完整许可证文本在此仓库中可用。