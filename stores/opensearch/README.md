# @mastra/opensearch

使用官方 @opensearch-project/opensearch SDK 的 OpenSearch 向量存储实现

## 安装

```bash
pnpm add @mastra/opensearch
```

## 使用方法

```typescript
import { OpenSearchVector } from '@mastra/opensearch';

const vectorStore = new OpenSearchVector('http://localhost:9200');

// 创建索引
await vectorStore.createIndex({ indexName: 'my-collection', dimension: 1536, metric: 'cosine' });

## 配置

必需：

- `url`: 您的 OpenSearch 实例 URL

## 功能特性

- 支持余弦、欧几里德和点积度量的向量相似性搜索
- 元数据过滤
- 查询结果中可选包含向量
- 为向量自动生成 UUID
- 基于 @opensearch-project/opensearch SDK 构建

## 距离度量

支持以下距离度量：

- `cosine` → 余弦距离
- `euclidean` → 欧几里德距离
- `dotproduct` → 点积

## 方法

- `createIndex({ indexName, dimension, metric? })`: 创建新集合
- `upsert({ indexName, vectors, metadata?, ids? })`: 添加或更新向量
- `query({ indexName, queryVector, topK?, filter?, includeVector? })`: 搜索相似向量
- `listIndexes()`: 列出所有集合
- `describeIndex(indexName)`: 获取集合统计信息
- `deleteIndex(indexName)`: 删除集合

## 相关链接

- [OpenSearch 文档](https://opensearch.org/docs/latest/about/)
- [OpenSearch REST API 参考](https://opensearch.org/docs/latest/api-reference/)
