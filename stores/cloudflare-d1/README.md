# @mastra/cloudflare-d1

用于 Cloudflare D1 SQL 数据库的 Mastra 存储适配器，支持线程、消息、工作流、评估和追踪等数据的持久化存储，提供强健的 SQL 功能。

## 功能特性

- 使用 SQL 表格存储线程和消息
- 通过 SQL 查询实现真正的排序和过滤
- 支持丰富的元数据存储（JSON 编码）
- 为所有记录提供时间戳跟踪
- 工作流快照持久化
- 追踪和评估数据存储
- 高效的批量操作（支持预处理语句）
- 元数据和自定义字段的自动 JSON 序列化/反序列化
- 所有操作都包含错误处理和日志记录
- 支持 Cloudflare Workers D1 绑定和 REST API

## 前提条件

- 拥有启用了 D1 的 Cloudflare 账户访问权限
- 已创建并配置好 D1 数据库
- 使用 Workers 绑定：需要配置了 D1 绑定的 Worker
- 使用 REST API：需要具备 D1 权限的 Cloudflare API 令牌

## 安装

```bash
pnpm add @mastra/cloudflare-d1
```

## 使用方法

### 使用 Workers D1 绑定

```typescript
import { D1Store } from '@mastra/cloudflare-d1';

const store = new D1Store({
  binding: env.DB, // 来自 Worker 环境的 D1Database 绑定
  tablePrefix: 'mastra_', // 可选
});
```

### 使用 REST API

```typescript
import { D1Store } from '@mastra/cloudflare-d1';

const store = new D1Store({
  accountId: '<your-account-id>',
  databaseId: '<your-d1-database-id>',
  apiToken: '<your-api-token>',
  tablePrefix: 'mastra_', // 可选
});
```

或者您可以传入您想要的任何客户端实现

```typescript
import { D1Store } from '@mastra/cloudflare-d1';

const store = new D1Store({
  client: {
    query: ({ sql, params }) => {
      // 执行操作
    },
  },
  tablePrefix: 'mastra_', // 可选
});
```

## 支持的方法

### 线程操作

- `saveThread(thread)`: 创建或更新线程
- `getThreadById({ threadId })`: 根据 ID 获取线程
- `getThreadsByResourceId({ resourceId })`: 获取与资源关联的所有线程
- `updateThread({ id, title, metadata })`: 更新线程的标题和/或元数据
- `deleteThread({ threadId })`: 删除线程及其所有消息

### 消息操作

- `saveMessages({ messages })`: 批量操作保存多条消息（使用预处理语句）
- `getMessages({ threadId, selectBy? })`: 获取线程的消息，可选过滤（例如最后 N 条，包含周围消息）

### 工作流操作

- `persistWorkflowSnapshot({ workflowName, runId, snapshot })`: 保存给定工作流/运行的工作流状态
- `loadWorkflowSnapshot({ workflowName, runId })`: 加载已持久化的工作流状态

### 追踪/评估操作

- `getTraces({ name?, scope?, page, perPage, attributes? })`: 查询追踪记录，可选过滤和分页
- `getEvalsByAgentName({ agentName, type? })`: 按代理名称查询评估结果

### 实用工具

- `clearTable({ tableName })`: 从逻辑表中删除所有记录
- `batchInsert({ tableName, records })`: 批量插入多条记录
- `insert({ tableName, record })`: 向表中插入单条记录

---

## 数据类型

D1 存储支持以下数据类型：

- `text`: 字符串
- `timestamp`: ISO8601 字符串（与 Date 相互转换）
- `uuid`: 字符串
- `jsonb`: JSON 编码的对象
- `integer`: 整数（用于内部计数器等）

所有元数据和自定义字段都会自动序列化/反序列化为 JSON。

---

## 配置参考

| 选项        | 类型       | 描述                                 |
| ----------- | ---------- | ------------------------------------ |
| binding     | D1Database | D1 Workers 绑定（用于 Workers）      |
| accountId   | string     | Cloudflare 账户 ID（用于 REST API）  |
| databaseId  | string     | D1 数据库 ID（用于 REST API）        |
| apiToken    | string     | Cloudflare API 令牌（用于 REST API） |
| tablePrefix | string     | 所有表名的可选前缀                   |

---

## 表/命名空间映射

每个逻辑 Mastra 表映射到 D1 中的 SQL 表（带有可选前缀）：

- `mastra_threads` — 存储线程
- `mastra_messages` — 存储消息
- `mastra_workflow_snapshot` — 存储工作流快照
- `mastra_evals` — 存储评估
- `mastra_traces` — 存储追踪

（前缀可通过 `tablePrefix` 配置。）

---

## 限制

- 不支持多语句事务（D1 目前只支持每条查询单个语句）
- 不支持高级 SQL 连接（D1 基于 SQLite，但某些功能可能受限）
- 批量操作是按块处理，并非真正的原子操作
- 某些 REST API 操作可能比 Workers 绑定更慢
- D1 处于公测阶段，可能有不断演进的限制
- 无向量搜索功能
- 注意：D1 有特定的限制和行为，请参考官方 Cloudflare D1 文档了解更多信息。

## 清理/断开连接

不需要显式清理，连接由平台管理。
