# Create Mastra

开始使用 Mastra 最简单的方法是使用 `create-mastra`。这个 CLI 工具使您能够快速开始构建新的 Mastra 应用程序，并为您设置好一切。

## 用法

使用 npx：

```bash
npx create-mastra@latest
```

使用 npm：

```bash
npm create mastra@latest
```

使用 yarn：

```bash
yarn create mastra
```

使用 pnpm：

```bash
pnpm create mastra
```

## 选项

- `--default` - 使用默认设置快速开始（src 目录、OpenAI、无示例）
- `-c, --components <components>` - 组件的逗号分隔列表（agents、tools、workflows）
- `-l, --llm <model-provider>` - 默认模型提供商（openai、anthropic、groq、google 或 cerebras）
- `-e, --example` - 包含示例代码

## 示例

使用默认设置创建新项目
npx create-mastra@latest --default
创建具有特定组件和 LLM 提供商的项目
npx create-mastra@latest -c agents,tools -l anthropic
创建包含示例代码的项目
npx create-mastra@latest --example

## 包含内容

生成的项目将包含：

- src 目录中配置的 Mastra 设置
- 选定的组件（agents、tools、workflows）
- 为您选择的 LLM 提供商配置的环境
- TypeScript 配置
- 示例代码（如果选择了）

## 系统要求

- Node.js 20 或更高版本
- 支持 MacOS、Windows 和 Linux