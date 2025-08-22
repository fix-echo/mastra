# @mastra/astra

用于 DataStax Astra DB 的向量存储实现，使用 Cassandra 的向量搜索功能提供向量相似性搜索能力。

## 安装

```bash
npm install @mastra/astra
```

## 使用方法

```typescript
import { AstraVector } from '@mastra/astra';

const vectorStore = new AstraVector({
  token: 'your-astra-token',
  endpoint: 'your-astra-endpoint',
  keyspace: 'your-keyspace' // 可选
});

// 创建新集合
await vectorStore.createIndex({ indexName: 'myCollection', dimension: 1536, metric: 'cosine' });

// 添加向量
const vectors = [[0.1, 0.2, ...], [0.3, 0.4, ...]];
const metadata = [{ text: 'doc1' }, { text: 'doc2' }];
const ids = await vectorStore.upsert({ indexName: 'myCollection', vectors, metadata });

// 查询向量
const results = await vectorStore.query({
  indexName: 'myCollection',
  queryVector: [0.1, 0.2, ...],
  topK: 10, // topK
  filter: { text: { $eq: 'doc1' } }, // 可选过滤
  includeVector: false // includeVectors
});
```

## 配置

Astra DB 向量存储需要：

- `token`: 您的 Astra DB 令牌
- `endpoint`: 您的 Astra DB 端点
- `keyspace`: （可选）要使用的键空间

## 功能特性

- 支持余弦、欧几里德和点积度量的向量相似性搜索
- 元数据过滤支持
- 批量向量 upsert 操作
- 集合管理（创建、列出、描述、删除）
- 查询结果中可选包含向量
- 为向量自动生成 UUID
- 基于 @datastax/astra-db-ts 客户端构建

## 方法

- `createIndex({ indexName, dimension, metric? })`: 创建新集合
- `upsert({ indexName, vectors, metadata?, ids })`: 添加或更新向量
- `query({ indexName, queryVector, topK?, filter?, includeVector? })`: 搜索相似向量
- `listIndexes()`: 列出所有集合
- `describeIndex(indexName)`: 获取集合统计信息
- `deleteIndex(indexName)`: 删除集合

## 相关链接

- [Astra DB 向量搜索文档](https://docs.datastax.com/en/astra-db/docs/vector-search.html)
- [Astra DB API 参考](https://docs.datastax.com/en/astra-db-serverless/api-reference/documents.html)
