# Mastra Client

[Mastra AI](https://mastra.ai) 框架的 JavaScript/TypeScript 客户端库。该客户端提供与 Mastra AI 的 API 交互的简单接口，用于代理、向量、内存、工具和工作流。

## 安装

```bash
npm install @mastra/client-js
```

## 快速开始

```typescript
import { MastraClient } from '@mastra/client-js';

// 初始化客户端
const client = new MastraClient({
  baseUrl: 'http://localhost:4111', // 您的 Mastra API 端点
});

// 示例：与代理一起工作
async function main() {
  // 获取代理实例
  const agent = client.getAgent('your-agent-id');

  // 生成响应
  const response = await agent.generate({
    messages: [{ role: 'user', content: "今天天气怎么样？" }],
  });

  console.log(response);
}
```

## 客户端配置

客户端可以使用几个选项进行配置：

```typescript
const client = new MastraClient({
    baseUrl: string;           // Mastra API 的基础 URL
    retries?: number;          // 重试次数（默认：3）
    backoffMs?: number;        // 初始退避时间（单位：毫秒，默认：300）
    maxBackoffMs?: number;     // 最大退避时间（单位：毫秒，默认：5000）
    headers?: Record<string, string>; // 自定义请求头
});
```

## 可用方法

### 代理

- `getAgents()`: 获取所有可用代理
- `getAgent(agentId)`: 获取特定代理实例
  - `agent.details()`: 获取代理详情
  - `agent.generate(params)`: 生成响应
  - `agent.stream(params)`: 流式传输响应
  - `agent.getTool(toolId)`: 获取代理工具详情
  - `agent.evals()`: 获取代理评估
  - `agent.liveEvals()`: 获取实时评估

### 内存

- `getMemoryThreads(params)`: 获取内存线程
- `createMemoryThread(params)`: 创建新的内存线程
- `getMemoryThread(threadId)`: 获取内存线程实例
- `saveMessageToMemory(params)`: 将消息保存到内存
- `getMemoryStatus()`: 获取内存系统状态

### 工具

- `getTools()`: 获取所有可用工具
- `getTool(toolId)`: 获取工具实例
  - `tool.details()`: 获取工具详情
  - `tool.execute(params)`: 执行工具

### 工作流

- `getWorkflows()`: 获取所有工作流
- `getWorkflow(workflowId)`: 获取工作流实例
  - `workflow.details()`: 获取工作流详情
  - `workflow.createRun()`: 创建工作流运行
  - `workflow.createRunAsync()`: 创建工作流运行（别名）
  - `workflow.startAsync(params)`: 执行工作流并等待执行结果
  - `workflow.resumeAsync(parmas)`: 异步恢复挂起的工作流步骤
  - `workflow.watch({runId},(record)=>{})`: 监视工作流运行的步骤转换
  - `workflow.start({runId, triggerData})`: 同步启动工作流运行
  - `workflow.resume(params)`: 同步恢复工作流运行

### 向量

- `getVector(vectorName)`: 获取向量实例
  - `vector.details(indexName)`: 获取向量索引详情
  - `vector.delete(indexName)`: 删除向量索引
  - `vector.getIndexes()`: 获取所有索引
  - `vector.createIndex(params)`: 创建新索引
  - `vector.upsert(params)`: 插入或更新向量
  - `vector.query(params)`: 查询向量

### 日志

- `getLogs(params)`: 获取系统日志
- `getLog(params)`: 获取特定日志条目
- `getLogTransports()`: 获取已配置的日志传输

### 遥测

- `getTelemetry(params)`: 获取遥测数据

## 错误处理

客户端包含针对失败请求的内置重试逻辑：

- 用指数退避自动重试失败请求
- 可配置重试次数和退避时间
- 达到最大重试次数后抛出错误

## 内部实现

客户端在内部使用本地 `fetch` API 进行 HTTP 请求。所有请求都自动处理：

- JSON 序列化/反序列化
- 带有指数退避的重试逻辑
- 自定义请求头管理
- 错误处理

## 许可证

MIT
