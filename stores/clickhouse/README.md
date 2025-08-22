# @mastra/clickhouse

用于 Mastra 的 Clickhouse 实现，为线程、消息和工作流快照提供高效的存储能力。

## 安装

```bash
npm install @mastra/clickhouse
```

## 前提条件

- Clickhouse 服务器（推荐使用 21.8 或更高版本）
- Node.js 16 或更高版本

## 使用方法

```typescript
import { ClickhouseStore } from '@mastra/clickhouse';

const store = new ClickhouseStore({
  url: 'http://localhost:8123',
  username: 'default',
  password: 'password',
});

// 创建线程
await store.saveThread({
  id: 'thread-123',
  resourceId: 'resource-456',
  title: 'My Thread',
  metadata: { key: 'value' },
  createdAt: new Date(),
  updatedAt: new Date(),
});

// 向线程添加消息
await store.saveMessages([
  {
    id: 'msg-789',
    threadId: 'thread-123',
    role: 'user',
    type: 'text',
    content: [{ type: 'text', text: 'Hello' }],
    createdAt: new Date(),
  },
]);

// 查询线程和消息
const savedThread = await store.getThreadById({ threadId: 'thread-123' });
const messages = await store.getMessages({ threadId: 'thread-123' });

// 清理
await store.close();
```

## 配置

Clickhouse 存储可以使用以下配置进行初始化：

```typescript
type ClickhouseConfig = {
  url: string; // Clickhouse HTTP 接口 URL
  username: string; // 数据库用户名
  password: string; // 数据库密码
};
```

## 功能特性

### 存储功能

- 支持 JSON 的线程和消息存储
- 高效的批量操作
- 丰富的元数据支持
- 时间戳跟踪
- 工作流快照持久化
- 针对高容量数据摄入优化
- 使用 Clickhouse 的 MergeTree 和 ReplacingMergeTree 引擎以获得最佳性能

### 表引擎

存储为不同类型的数据使用不同的表引擎：

- `MergeTree()`: 用于消息、追踪和评估
- `ReplacingMergeTree()`: 用于线程和工作流快照

## 存储方法

### 线程操作

- `saveThread(thread)`: 创建或更新线程
- `getThreadById({ threadId })`: 根据 ID 获取线程
- `updateThread({ id, title, metadata })`: 更新线程标题和元数据
- `deleteThread({ threadId })`: 删除线程及其消息

### 消息操作

- `saveMessages(messages)`: 保存多条消息
- `getMessages({ threadId, selectBy? })`: 获取线程的消息，可选过滤
- `deleteMessages(messageIds)`: 删除特定消息

### 工作流操作

- `persistWorkflowSnapshot({ workflowName, runId, snapshot })`: 保存工作流状态
- `loadWorkflowSnapshot({ workflowName, runId })`: 加载工作流状态

## 数据类型

存储支持以下数据类型：

- `text`: 字符串
- `timestamp`: DateTime64(3)
- `uuid`: 字符串
- `jsonb`: 字符串（JSON 序列化）
- `integer`: Int64
- `bigint`: Int64

## 相关链接

- [Clickhouse 文档](https://clickhouse.com/docs)
- [Clickhouse Node.js 客户端](https://github.com/clickhouse/clickhouse-js)
