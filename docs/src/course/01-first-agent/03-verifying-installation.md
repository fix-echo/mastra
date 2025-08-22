# 验证您的 Mastra 安装

在开始构建我们的 agent 之前，让我们确保您设置了正确的开发环境。让我们检查您是否安装了 Node.js 18.x 或更高版本。

然后，让我们检查 package.json 中是否有 @mastra/core，并且是否有 src/mastra 目录。如果有，您可以跳过此步骤。

如果您尚未安装 Mastra，可以通过运行以下命令进行安装：

```bash
npm -y create mastra@latest
```

如果您确实需要安装 mastra，请按照屏幕上的提示操作，并确保：

- 选择安装 Agents 和 Workflows
- 同意安装 tools
- 为您的 model 选择 OpenAI、Anthropic 或 Google
- 同意添加示例

您还需要将您的 OpenAI、Anthropic 或 Google API key 添加到项目中。
