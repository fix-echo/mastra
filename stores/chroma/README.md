# @mastra/chroma

使用官方 `chromadb` 客户端的 Chroma 向量存储实现，增加了维度验证、集合管理和文档存储功能。

## 安装

```bash
npm install @mastra/chroma
```

## 初始化

### 本地或自主部署

要运行 Chroma 服务器，请使用 [Chroma CLI](https://docs.trychroma.com/docs/cli/db)。安装此包后即可使用。

```shell
chroma run
```

您将在 `localhost:8000` 上运行一个 Chroma 服务器。

```typescript
import { ChromaVector } from '@mastra/chroma';

const vectorStore = new ChromaVector();
```

如果您使用不同的配置本地运行 Chroma 服务器，或者自己[部署](https://docs.trychroma.com/guides/deploy/client-server-mode) Chroma 服务器，您可以用特定的连接详情配置 `ChromaVector` 实例：

```typescript
import { ChromaVector } from '@mastra/chroma';

const vectorStore = new ChromaVector({
  host: 'your-host-address',
  port: 8000,
  ssl: false,
  headers: {}, // 要发送的任何 HTTP 头部,
});
```

### Chroma Cloud

提供您的 Chroma Cloud API 密钥、租户和数据库。

您可以使用 [Chroma CLI](https://docs.trychroma.com/docs/cli/db) 将这些都设为环境变量：`chroma db connect [DB-NAME] --env-file`。

```typescript
import { ChromaVector } from '@mastra/chroma';

const vectorStore = new ChromaVector({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE,
});
```

## 使用方法

```typescript

// 创建新的集合
await vectorStore.createIndex({ indexName: 'myCollection', dimension: 1536, metric: 'cosine' });

// 添加带文档的向量
const vectors = [[0.1, 0.2, ...], [0.3, 0.4, ...]];
const metadata = [{ text: 'doc1' }, { text: 'doc2' }];
const documents = ['full text 1', 'full text 2'];
const ids = await vectorStore.upsert({
  indexName: 'myCollection',
  vectors,
  metadata,
  documents, // 存储原始文本
});

// 使用文档过滤查询向量
const results = await vectorStore.query({
  indexName: 'myCollection',
  queryVector: [0.1, 0.2, ...],
  topK: 10, // topK
  filter: { text: { $eq: 'doc1' } }, // 元数据过滤器
  includeVector: false, // includeVector
  documentFilter: { $contains: 'specific text' } // 文档内容过滤器
});
```

## 功能特性

- 支持余弦、欧几里德和点积度量的向量相似性搜索
- 文档存储和检索
- 文档内容过滤
- 严格的向量维度验证
- 基于集合的组织方式
- 元数据过滤支持
- 查询结果中可选包含向量
- 为向量自动生成 UUID
- 内置集合缓存以获得性能
- 基于 chromadb 客户端构建

## 方法

- `createIndex({ indexName, dimension, metric? })`: 创建新集合
- `upsert({ indexName, vectors, metadata?, ids?, documents? })`: 添加或更新向量，可选文档存储
- `query({ indexName, queryVector, topK?, filter?, includeVector?, documentFilter? })`: 搜索相似向量，可选文档过滤
- `listIndexes()`: 列出所有集合
- `describeIndex(indexName)`: 获取集合统计信息
- `deleteIndex(indexName)`: 删除集合

## 查询响应格式

查询结果包括：

- `id`: 向量 ID
- `score`: 距离/相似性评分
- `metadata`: 关联元数据
- `document`: 原始文档文本（如已存储）
- `vector`: 原始向量（如 includeVector 为 true）

## 相关链接

- [Chroma 文档](https://docs.trychroma.com/)
- [Chroma API 参考](https://docs.trychroma.com/api/client)
