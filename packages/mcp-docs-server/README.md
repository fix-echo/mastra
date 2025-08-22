# @mastra/mcp-docs-server

一个 Model Context Protocol (MCP) 服务器，为 AI 助手提供对 Mastra.ai 完整知识库的直接访问。这包括支持 MDX 的全面文档、一系列生产就绪的代码示例、技术博客文章和详细的包变更日志。该服务器与流行的 AI 开发环境（如 Cursor 和 Windsurf）以及 Mastra Agents 集成，可以轻松构建具备文档感知能力的 AI 助手，提供关于 Mastra.ai 生态系统的准确、最新信息。

## 安装

### 在 Cursor 中

在项目根目录创建或更新 `.cursor/mcp.json`：

MacOS/Linux

```json
{
  "mcpServers": {
    "mastra": {
      "command": "npx",
      "args": ["-y", "@mastra/mcp-docs-server"]
    }
  }
}
```

Windows

```json
{
  "mcpServers": {
    "mastra": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@mastra/mcp-docs-server"]
    }
  }
}
```

这将使所有 Mastra 文档工具在您的 Cursor 工作区中可用。
请注意，MCP 服务器默认不会启用。您需要前往 Cursor 设置 -> MCP 设置并点击 Mastra MCP 服务器上的 "enable"。

### 在 Windsurf 中

创建或更新 `~/.codeium/windsurf/mcp_config.json`：

MacOS/Linux

```json
{
  "mcpServers": {
    "mastra": {
      "command": "npx",
      "args": ["-y", "@mastra/mcp-docs-server"]
    }
  }
}
```

Windows

```json
{
  "mcpServers": {
    "mastra": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@mastra/mcp-docs-server"]
    }
  }
}
```

这将使所有 Mastra 文档工具在您的 Windsurf 工作区中可用。
请注意，Windsurf MCP 工具调用效果不佳。添加此配置后，您需要完全退出并重新打开 Windsurf。
如果工具调用失败，您需要进入 Windsurf MCP 设置并重新启动 MCP 服务器。

### 在 Mastra Agent 中

```typescript
import { MCPClient } from '@mastra/mcp';
import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';

// 使用文档服务器配置 MCP
const mcp = new MCPClient({
  servers: {
    mastra: {
      command: 'npx',
      args: ['-y', '@mastra/mcp-docs-server'],
    },
  },
});

// 创建一个可以访问所有文档工具的 Agent
const agent = new Agent({
  name: 'Documentation Assistant',
  instructions: 'You help users find and understand Mastra.ai documentation.',
  model: openai('gpt-4'),
  tools: await mcp.getTools(),
});

// 或在 generate/stream 中动态使用工具集
const response = await agent.stream('Show me the quick start example', {
  toolsets: await mcp.getToolsets(),
});
```

## 工具

### 文档工具 (`mastraDocs`)

- 通过请求特定路径获取 Mastra.ai 文档
- 探索一般指南和 API 参考文档
- 当请求的路径未找到时自动列出可用路径

### 示例工具 (`mastraExamples`)

- 访问展示 Mastra.ai 实现模式的代码示例
- 列出所有可用示例
- 获取特定示例的详细源代码

### 博客工具 (`mastraBlog`)

- 访问技术博客文章和文章
- 文章经过适当格式化，包含代码块处理
- 支持博客元数据中的各种日期格式

### 变更工具 (`mastraChanges`)

- 访问包变更日志
- 列出所有可用的包变更日志
- 获取特定包的详细变更日志内容