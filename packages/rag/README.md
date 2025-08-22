# @mastra/rag

检索增强生成 (RAG) 模块包含文档处理和嵌入工具。

## 安装

```bash
npm install @mastra/rag
```

## 组件

### Document

`MDocument` 类表示带有相关元数据的文本内容：

```typescript
import { MDocument } from '@mastra/rag';

const doc = new MDocument({
  text: 'Document content',
  metadata: { source: 'example.txt' },
});
```

[文档](https://mastra.ai/reference/rag/document)