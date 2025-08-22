# @mastra/fastembed

此包提供了一个 FastEmbed 嵌入模型集成，用于与 Mastra Memory 一起使用。

**注意：** 此功能以前直接包含在 `@mastra/core` 中。它已被移到这个单独的包中，因为 `fastembed-js` 依赖于大型本地依赖（如 `onnxruntime-node`）。将其分离可以使不需要 FastEmbed 的用户保持 `@mastra/core` 的轻量级。

## 安装

```bash
pnpm add @mastra/fastembed
```

## 用法

```typescript
import { Memory } from '@mastra/memory';
import { fastembed } from '@mastra/fastembed';

const memory = new Memory({
  // ... 其他内存选项
  embedder: fastembed,
});

// 现在您可以将此内存实例与 Agent 一起使用
// const agent = new Agent({ memory, ... });
```

此包封装了 `fastembed-js` 库，以提供与 AI SDK 和 Mastra 兼容的嵌入模型。