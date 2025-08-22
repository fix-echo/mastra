# Mastra CLI

![Mastra Cli](https://github.com/mastra-ai/mastra/blob/main/packages/cli/mastra-cli.png)

Mastra 是用于构建 AI Agents 和助手的 Typescript 框架。世界上一些最大的公司使用它来构建内部 AI 自动化工具和面向客户的 Agents。

这是 CLI 包，允许您：

- 创建新项目
- 启动 Mastra 开发服务器
- 部署到 Hono 服务器，或无服务器环境如 Cloudflare Workers 或 Vercel

## 安装 Mastra CLI

```bash copy
npm i -g mastra
```

## 命令

### Init

`mastra init` 用于初始化新项目。

这会在 `src` 下创建一个 mastra 目录，包含一个 `index.ts` 入口点和一个包含两个示例 Agents 的 `agent` 目录。

```text
project-root/
├── src/
   ├── app/
   └── mastra/
       ├── agents/
       │   └── agents.ts
       └── index.ts
```

### Dev

`mastra dev`

这会启动一个本地开发服务器，为所有 Agents 和 Workflows 托管 `REST` 端点。它还有一个用于测试它们的聊天界面。

该服务器对于测试和开发 Agents、Workflows 和集成非常有用，而无需部署您的应用程序。

服务器在 `http://localhost:3000` 可用。

### Build

`mastra build`

此命令为部署到不同环境而构建您的 Mastra 项目。构建过程：

1. 读取您的 Mastra 配置
2. 为您的目标环境生成优化文件
3. 将它们输出到构建目录

选项：

```bash
--dir     包含 Mastra 文件的目录 (默认: src/mastra)
```

使用示例：

```bash
# 使用默认目录构建
mastra build

# 从自定义目录构建
mastra build --dir path/to/mastra
```

构建输出由您的 Mastra 实例的部署器配置决定：

```typescript
const mastra = new Mastra({
  deployer: {
    type: 'HONO', // 目标环境 (HONO, EXPRESS, NEXT)
    // 环境特定选项
  },
});
```

### Lint

`mastra lint`

验证您的 Mastra 项目结构和代码。

选项：

```bash
--root    您的根文件夹路径
--tools   要包含的工具文件路径的逗号分隔列表
```

使用示例：

```bash
# Lint 默认目录
mastra lint
```

# 遥测

此 CLI 收集匿名使用数据（无个人/敏感信息）以帮助改进 Mastra。这包括：

- 使用的命令
- 命令执行时间
- 错误发生次数
- 系统信息（操作系统、Node 版本）

要选择退出：

1. 在命令中添加 `MASTRA_TELEMETRY_DISABLED=1`

## 本地开发

1. 克隆仓库
2. 运行 `pnpm i` 安装依赖