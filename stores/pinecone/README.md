# @mastra/pinecone

用于 Pinecone 的向量存储实现，使用官方 @pinecone-database/pinecone SDK 并添加了遥测支持。

## 安装

```bash
pnpm add @mastra/pinecone
```

## 使用方法

```typescript
import { PineconeVector } from '@mastra/pinecone';

const vectorStore = new PineconeVector(
  'your-api-key',
  'optional-environment-url'
);

// 创建新索引
await vectorStore.createIndex({ indexName: 'my-index', dimension: 1536, metric: 'cosine' });

// 添加向量
const vectors = [[0.1, 0.2, ...], [0.3, 0.4, ...]];
const metadata = [{ text: 'doc1' }, { text: 'doc2' }];
const ids = await vectorStore.upsert({ indexName: 'my-index', vectors, metadata });

// 查询向量
const results = await vectorStore.query({
  indexName: 'my-index',
  queryVector: [0.1, 0.2, ...],
  topK: 10, // topK
  filter: { text: { $eq: 'doc1' } }, // 可选过滤
  includeVector: false, // includeValues
});
```

## 配置

必需：

- `apiKey`: 您的 Pinecone API 密钥

可选：

- `environment`: 您的 Pinecone 环境 URL（控制器主机 URL）

## 功能特性

- AWS（us-east-1）上的无服务器部署
- 支持余弦、欧几里德和点积度量的向量相似性搜索
- 大型 upserts 的自动批处理（每请求 100 个向量）
- 内置遥测支持
- 元数据过滤
- 查询结果中可选包含向量
- 为向量自动生成 UUID
- 基于 @pinecone-database/pinecone SDK 构建

## 方法

- `createIndex({indexName, dimension, metric?})`: 创建新索引
- `upsert({indexName, vectors, metadata?, ids?})`: 添加或更新向量
- `query({indexName, queryVector, topK?, filter?, includeVector?})`: 搜索相似向量
- `listIndexes()`: 列出所有索引
- `describeIndex(indexName)`: 获取索引统计信息
- `deleteIndex(indexName)`: 删除索引

## 相关链接

- [Pinecone 文档](https://docs.pinecone.io/)
- [Pinecone Node.js SDK](https://github.com/pinecone-io/pinecone-ts-client)
