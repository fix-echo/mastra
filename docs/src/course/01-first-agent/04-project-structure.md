# 验证项目结构

让我们检查您的项目是否具有正确的结构。您应该具有：

1. 一个 `src/mastra` 目录，包含：
   - `index.ts` - 您的 Mastra 项目的主要入口点
   - `agents/` - 包含单个 agent 文件的目录
   - `tools/` - 包含单个 tool 文件的目录
   - `workflows/` - 包含单个 workflow 文件的目录

如果 CLI 创建了您的项目，您应该看到如下文件：

- `agents/weather-agent.ts` - 示例 weather agent
- `tools/weather-tool.ts` - 示例 weather tool
- `workflows/weather-workflow.ts` - 示例 weather workflow

这个结构很重要，因为它遵循了 Mastra 组织代码的约定。`index.ts` 文件是您的 Mastra 项目的主要入口点，而 `agents` 和 `tools` 目录分别包含您的 agents 和 tools 的定义。
