# 如何添加新模板

要将新模板添加到 `templates/` 目录，请按以下步骤操作：

## 1. 创建新模板文件夹

- 在 `templates/` 目录内，创建一个以模板命名的新文件夹（例如 `my-new-template/`）。

## 2. 必需文件

您的模板文件夹**必须**包含以下文件：

### a. `package.json`

- 在您的代码/配置中使用 `@ai-sdk/openai` 作为 LLM 提供程序。
- 所有 `@mastra/*` 依赖项应在 `dependencies` 部分设置为 `"latest"`。
- `mastra` devDependency 应在一个 `devDependencies` 部分设置为 `"latest"`。
- `description` 字段应清晰描述模板的作用。

**示例：**

```json
{
  "name": "my-new-template",
  "version": "1.0.0",
  "description": "一个演示如何使用 Mastra 构建 OpenAI 驱动的代理的模板。",
  "main": "index.js",
  "license": "ISC",
  "type": "module",

  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "mastra dev"
  },
  "dependencies": {
    "@mastra/core": "latest",
    "zod": "^3.25.67",
    "@mastra/loggers": "latest",
    "@ai-sdk/openai": "^1.3.23"
  },
  "devDependencies": {
    "@types/node": "^24.0.4",
    "mastra": "latest",
    "typescript": "^5.8.3"
  }
}
```

### b. `.env.example`

- 列出所有必需的环境变量，如 API 密钥和配置值。
- 对机密或必需字段使用 `***` 作为默认值。

**示例：**

```
OPENAI_API_KEY=***
OTHER_REQUIRED_VARIABLE=***
```

### c. `README.md`

- 清晰解释模板的作用、概览和任何设置步骤。
- 提及模板使用 OpenAI 作为 LLM 提供程序。
- 列出所有必需的环境变量及其用途。

**示例：**

```markdown
# 我的新模板

这个模板演示如何使用 Mastra 与 OpenAI 作为 LLM 提供程序构建代理。

## 概览

模板的概览。

## 设置

1. 将 `.env.example` 复制到 `.env` 并填写您的 API 密钥。
2. 安装依赖项：`pnpm install`
3. 运行项目：`pnpm dev`。

## 环境变量

- `OPENAI_API_KEY`：您的 OpenAI API 密钥。[https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- `OTHER_REQUIRED_VARIABLE`：描述此变量的用途。
```

## 3. 额外建议

- 包含运行模板所需的任何脚本或配置文件。
- 保持代码清洁且注释充分。
- 提交前先测试您的模板。

---

通过遵循这些步骤，您将确保您的模板易于使用且与存储库的其余部分保持一致。
