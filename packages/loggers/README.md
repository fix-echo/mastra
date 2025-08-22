# @mastra/loggers

Mastra 的日志传输实现集合，扩展了来自 `@mastra/core` 的 `LoggerTransport` 类。

## 安装

```bash
npm install @mastra/loggers
```

## 可用的传输

### 文件传输

将日志写入本地文件系统的传输。

```typescript
import { FileTransport } from '@mastra/loggers';

const fileLogger = new FileTransport({
  path: '/path/to/logs/app.log',
});
```

#### 配置

- `path`: 日志文件的绝对路径（必须存在）

#### 功能

- 追加模式日志记录
- 自动流清理
- JSON 日志解析
- 按运行 ID 查询日志
- 基于流的实现

### Upstash 传输

将日志发送到 Upstash Redis 的传输，具有批处理和自动修剪功能。

```typescript
import { UpstashTransport } from '@mastra/loggers';

const upstashLogger = new UpstashTransport({
  upstashUrl: 'https://your-instance.upstash.io',
  upstashToken: 'your-token',
  listName: 'application-logs', // 可选
  maxListLength: 10000, // 可选
  batchSize: 100, // 可选
  flushInterval: 10000, // 可选
});
```

#### 配置

必需：

- `upstashUrl`: 您的 Upstash Redis 实例 URL
- `upstashToken`: 您的 Upstash 认证令牌

可选：

- `listName`: 用于日志的 Redis 列表名称（默认：'application-logs'）
- `maxListLength`: 要保留的最大日志数（默认：10000）
- `batchSize`: 一批发送的日志数（默认：100）
- `flushInterval`: 刷新尝试之间的毫秒数（默认：10000）

#### 功能

- 批量日志写入
- 自动日志轮换（LTRIM）
- 可配置的缓冲区大小
- 失败时自动重试
- 按运行 ID 查询日志
- JSON 日志格式化
- 时间戳自动注入
- 带最终刷新的优雅关闭

## 与 Mastra Core 一起使用

两种传输都实现了来自 `@mastra/core` 的 `LoggerTransport` 接口：

```typescript
import { Logger } from '@mastra/core/logger';
import { FileTransport, UpstashTransport } from '@mastra/loggers';

// 创建传输
const fileTransport = new FileTransport({
  path: '/var/log/app.log',
});

const upstashTransport = new UpstashTransport({
  upstashUrl: process.env.UPSTASH_URL!,
  upstashToken: process.env.UPSTASH_TOKEN!,
});

// 使用多个传输创建日志记录器
const logger = new Logger({
  transports: [fileTransport, upstashTransport],
});

// 记录消息
logger.info('Hello world', { metadata: 'value' });

// 查询日志
const allLogs = await fileTransport.getLogs();
const runLogs = await upstashTransport.getLogsByRunId({ runId: 'abc-123' });
```

## 日志消息格式

两种传输都以以下结构的 JSON 格式处理日志消息：

```typescript
interface BaseLogMessage {
  time?: number; // 时间戳（如果不存在则自动注入）
  level?: string; // 日志级别
  msg?: {
    // 消息内容
    runId?: string; // 用于分组日志的可选运行 ID
    [key: string]: any;
  };
  [key: string]: any;
}
```

## 错误处理

两种传输都包含强大的错误处理：

- 文件传输：
  - 验证文件路径存在性
  - 处理流错误
  - 销毁时优雅清理

- Upstash 传输：
  - 验证必需配置
  - 重试失败的批次
  - 在中断期间缓冲日志
  - 带最终刷新的优雅关闭

## 相关链接

- [Upstash Redis 文档](https://docs.upstash.com/redis)
- [Node.js 流文档](https://nodejs.org/api/stream.html)