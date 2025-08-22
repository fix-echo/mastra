# Mastra 参考文档

这是为社区成员（和 LLM！）创建新参考文档和编辑现有文档的指南。

Mastra 按照其核心概念的相同结构组织参考文档：`CLI`、`LLMs 和模型`、`Agents`、`Engines`、`RAG`、`可观察性`。每个函数都有自己的页面，例如 `src/pages/reference/agents/createTool.mdx`。

我们尽量避免创建类，因为这不太符合 TypeScript 的风格，但它们也有自己的页面。

以下是关于函数参考文档的指南。它们展示了 `Parameters` 和 `Returns`，使用 <PropertiesTable> 组件列出选项、类型和默认值。

---

## 1. 标题和简要描述

在每个参考页面开始时，使用清晰的标题和简短的段落描述函数、类或功能的作用以及用户为什么需要它。

```markdown
# MyFunction 参考

Mastra 中的 MyFunction 实用程序允许您在将数据传递给引擎之前转换数据。
```

---

## 2. 使用示例

提供一个简洁的使用示例或代码片段，展示如何在典型的 Mastra 项目中导入和使用此函数或功能。

```typescript
import { MyFunction } from "@mastra/core";

const result = MyFunction({
  data: "some data",
  options: {
    verbose: true,
  },
});
```

---

## 3. 参数

在"参数"标题下，列出函数的输入参数，包括任何嵌套属性。使用 <PropertiesTable> 组件提供关于每个参数的结构化信息，例如其类型、是否可选和默认值。

例如：

```mdx
## 参数

<PropertiesTable
  content={[
    {
      name: "data",
      type: "string",
      description: "要转换的输入数据。",
      isOptional: false,
    },
    {
      name: "options",
      type: "object",
      description: "修改 MyFunction 行为的附加选项。",
      isOptional: true,
      defaultValue: "{}",
    },
  ]}
/>
```

如果 `options` 对象有自己的属性，您可以创建一个单独的 <PropertiesTable> 来描述它们：

```mdx
### options

<PropertiesTable
  content={[
    {
      name: "verbose",
      type: "boolean",
      description: "当为 'true' 时启用详细日志记录。",
      isOptional: true,
      defaultValue: "false",
    },
  ]}
/>
```

---

## 4. 返回值

如果您的函数（或类方法）返回一个值，请创建一个"返回值"标题。简要描述函数返回的内容，并在返回对象有附加属性时使用 <PropertiesTable>。

```mdx
## 返回值

<PropertiesTable
  content={[
    {
      name: "transformedData",
      type: "string",
      description:
        "应用函数逻辑后的最终转换数据。",
    },
    {
      name: "metadata",
      type: "object",
      description: "关于转换的附加信息。",
    },
  ]}
/>
```

## 5. 附加说明或示例

如果有高级用例、边缘情况或性能考虑，请在单独的部分中添加它们。如果它们提供额外的清晰度，请考虑引用相关文件或代码部分。

````markdown
## 附加示例

对于更高级的用法，请参见以下文件中的"transformDataSync"：

```ts filename="src/examples/advancedUsage/transformDataSync.ts"
import { MyFunction } from "@mastra/core";

export async function transformDataSync(data: string) {
  const result = await MyFunction({
    data,
    options: { verbose: false },
  });
  return result;
}
```
````

## 6. 相关文档交叉链接

在可能的情况下，链接到任何其他相关的参考——比如与该功能密切相关的其他方法或类。这有助于用户发现相关功能。

```markdown
### 相关

- [引擎配置](/guide/reference/engine.mdx)
- [Agent 类参考](/guide/reference/agent.mdx)
```

## 结论

通过一致地遵循这些指南，您可以确保 Mastra 的参考文档保持清晰、易于导航，并提供社区成员有效使用 Mastra 所需的所有基本细节。

- 以简洁的**描述**开始。
- 提供**使用示例**。
- 在 `<PropertiesTable>` 中呈现**参数**。
- 在另一个 `<PropertiesTable>` 中显示**返回值**（如果适用）。
- 为高级用法包含**附加示例**或**说明**。
- **交叉链接**到相关部分或功能。