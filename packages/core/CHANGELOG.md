# @mastra/core

## 0.14.0-alpha.4

### 补丁变更

- 0a7f675: Client JS vnext 方法
- 12cae67: 修复：向评分器添加 threadId 和 resourceId
- 5a37d0c: 修复与 p-map 导入相关的开发服务器错误
- 4bde0cb: 允许在工作流中重命名 .map 函数
- 1a80071: 循环代码和测试
- 36a3be8: Agent 处理器测试
- 361757b: 执行方法
- 2bb9955: 模型循环变更
- 2454423: generateVNext 和 streamVNext
- a44d91e: 消息列表变更
- dfb91e9: 服务器处理程序
- a741dde: generateVNext 管道
- 7cb3fc0: 修复循环测试
- 195eabb: 处理 Mastra 流
- b78b95b: 在 playground 中支持 generateVNext

## 0.14.0-alpha.3

### 补丁变更

- 227c7e6: 在内存操作中将 console.log 替换为 logger.debug
- fd3a3eb: 添加 runExperments 以在测试套件或 CI 中运行评分器
- a8f129d: "初步添加实验性 AI 可观察性跟踪功能。"

## 0.14.0-alpha.2

## 0.14.0-alpha.1

### 次要变更

- 3b5fec7: 在内部 MessageList 中添加了 AIV5 支持，这是在最新 Mastra 中完全支持 AIV5 的前奏

### 补丁变更

- 6faaee5: 重新设计 agent Processor API 以包含输出处理器。在 agent.streamVNext 和 agent.generate 中添加了 structuredOutput 属性以替换 experimental_output。将处理器的导入移动到 @mastra/core/processors。添加了 6 个新的输出处理器：BatchParts、StructuredOutputProcessor、TokenLimiter、SystemPromptScrubber、ModerationProcessor、PiiDetectorProcessor。
- 4232b14: 修复 V5 消息转换期间提供者元数据保留问题

  在 AI SDK V5 和内部 V2 格式之间转换消息时，现在可以正确保留提供者元数据（providerMetadata 和 callProviderMetadata）。这确保了提供者特定信息在消息转换过程中不会丢失。

- a89de7e: 添加了一个新的代理循环和流工作流系统，同时致力于 AI SDK v5 支持。
- cf4f357: 使用 Cloudflare 部署器时，您可能会看到 `[duplicate-case]` 警告。内部原因已修复。
- a722c0b: 添加了一个补丁来过滤掉通过旧内存错误存储在数据库中的系统消息（该错误已在很久以前修复，参见问题 6689）。从旧版本升级且仍有该错误的用户在从数据库检索内存消息时会出现错误

## 0.13.3-alpha.0

### 补丁变更

- c30bca8: 修复简单工作流中 do while 恢复-挂起时的数据丢失问题

## 0.13.2

### 补丁变更

- d5330bf: 允许在创建代理后更新代理模型
- 2e74797: 修复当工具结果消息与工具调用消息分开到达或从数据库恢复消息时工具参数丢失的问题。工具调用现在可以在所有场景中正确保留其参数。
- 8388649: 在 vnext 代理网络中允许消息数组
- a239d41: 将 A2A 语法更新为 v0.3.0
- dd94a26: 不依赖完整语言模型进行模式兼容
- 3ba6772: MastraModelInput
- b5cf2a3: 在代理调用期间始终提供系统消息
- 2fff911: 修复 vnext 工作内存工具模式与不兼容模型的问题
- b32c50d: 按来源过滤分数
- 63449d0: 更改 `bundle`、`lint` 和内部 `getToolsInputOptions` 的函数签名，将 `toolsPaths` TypeScript 类型从 `string[]` 扩展为 `(string | string[])[]`。
- 121a3f8: 修复了调用 `agent.stream` 时遥测日志显示承诺状态的问题
- ec510e7: 工具输入验证现在将错误作为工具结果返回而不是抛出，允许代理理解验证失败并使用修正的参数重试。
- Updated dependencies [dd94a26]
- Updated dependencies [2fff911]
- Updated dependencies [ae2eb63]
  - @mastra/schema-compat@0.10.7

## 0.13.1

### 补丁变更

- cd0042e: 修复代理对话中无法访问工具调用历史的问题

  当将 v2 消息（带有组合工具调用和文本）转换为 v1 格式以进行内存存储时，拆分消息都保留了相同的 ID。这导致稍后的消息在添加回 MessageList 时替换了早期的消息，丢失了工具历史。

  修复通过为拆分消息追加 `__split-N` 后缀来添加 ID 去重，并防止消息在格式之间重新转换时出现双重后缀。

## 0.13.0

### 次要变更

- ea0c5f2: 更新评分器 API

### 补丁变更

- cb36de0: 依赖更新：
  - 更新依赖 [`hono@^4.8.11` ↗︎](https://www.npmjs.com/package/hono/v/4.8.11)（从 `^4.8.9`，在 `dependencies` 中）
- d0496e6: 依赖更新：
  - 更新依赖 [`hono@^4.8.12` ↗︎](https://www.npmjs.com/package/hono/v/4.8.12)（从 `^4.8.11`，在 `dependencies` 中）
- a82b851: 从代理跟踪中排除 getVoice、getScorers
- 41a0a0e: 修复了一个小错误，其中 ID 生成器没有正确绑定到 MessageList 的实例
- 2871020: 更新 safelyParseJSON 以在处理解析时检查参数值
- 94f4812: 延迟初始化 Run 的 `AbortController`
- e202b82: 向 Memory 类添加 getThreadsByResourceIdPaginated
- e00f6a0: 修复了从 v2->v1 消息转换时不会正确将文本和工具调用部分拆分为多条消息的问题
- 4a406ec: 修复 TypeScript 声明文件导入以确保正确的 ESM 兼容性
- b0e43c1: 修复了分支工作流步骤即使在成功恢复和执行后仍保持"挂起"状态的问题。
- 5d377e5: 修复 runtimeContext 值的跟踪"
- 1fb812e: 修复了并行工作流执行中的错误，其中恢复多个挂起的并行步骤中的一个会错误地完成整个并行块。修复确保在并行工作流中从挂起恢复时正确执行和状态管理。
- 35c5798: 添加对 transpilePackages 选项的支持
- Updated dependencies [4a406ec]
  - @mastra/schema-compat@0.10.6

## 0.12.1

### 补丁变更

- 33dcb07: 依赖更新：
  - 更新依赖 [`@opentelemetry/auto-instrumentations-node@^0.62.0` ↗︎](https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node/v/0.62.0)（从 `^0.59.0`，在 `dependencies` 中）
  - 更新依赖 [`@opentelemetry/exporter-trace-otlp-grpc@^0.203.0` ↗︎](https://www.npmjs.com/package/@opentelemetry/exporter-trace-otlp-grpc/v/0.203.0)（从 `^0.201.1`，在 `dependencies` 中）
  - 更新依赖 [`@opentelemetry/exporter-trace-otlp-http@^0.203.0` ↗︎](https://www.npmjs.com/package/@opentelemetry/exporter-trace-otlp-http/v/0.203.0)（从 `^0.201.1`，在 `dependencies` 中）
  - 更新依赖 [`@opentelemetry/otlp-exporter-base@^0.203.0` ↗︎](https://www.npmjs.com/package/@opentelemetry/otlp-exporter-base/v/0.203.0)（从 `^0.201.1`，在 `dependencies` 中）
  - 更新依赖 [`@opentelemetry/otlp-transformer@^0.203.0` ↗︎](https://www.npmjs.com/package/@opentelemetry/otlp-transformer/v/0.203.0)（从 `^0.201.1`，在 `dependencies` 中）
  - 更新依赖 [`@opentelemetry/sdk-node@^0.203.0` ↗︎](https://www.npmjs.com/package/@opentelemetry/sdk-node/v/0.203.0)（从 `^0.201.1`，在 `dependencies` 中）
  - 更新依赖 [`@opentelemetry/semantic-conventions@^1.36.0` ↗︎](https://www.npmjs.com/package/@opentelemetry/semantic-conventions/v/1.36.0)（从 `^1.34.0`，在 `dependencies` 中）
- d0d9500: 修复了 AWS Bedrock 期望消息列表开头有用户消息的问题
- d30b1a0: 移除未使用的 js-tiktoken
- bff87f7: 修复从数据库获取的 v1 消息在 llm 上下文窗口中无法正确显示工具调用的历史问题
- b4a8df0: 修复了内存实例未向 Mastra 注册且未使用自定义 ID 生成器的问题

## 0.12.0

### 次要变更

- 2ecf658: 添加了在创建 Mastra 实例时提供自定义 ID 生成器的选项。如果未提供生成器，则使用 UUID 作为回退来生成 ID。

### 补丁变更

- 510e2c8: 依赖更新：
  - 更新依赖 [`radash@^12.1.1` ↗︎](https://www.npmjs.com/package/radash/v/12.1.1)（从 `^12.1.0`，在 `dependencies` 中）
- 2f72fb2: 依赖更新：
  - 更新依赖 [`xstate@^5.20.1` ↗︎](https://www.npmjs.com/package/xstate/v/5.20.1)（从 `^5.19.4`，在 `dependencies` 中）
- 27cc97a: 依赖更新：
  - 更新依赖 [`hono@^4.8.9` ↗︎](https://www.npmjs.com/package/hono/v/4.8.9)（从 `^4.8.4`，在 `dependencies` 中）
- 3f89307: 改进 registerApiRoute 验证
- 9eda7d4: 将 createMockModel 移动到测试范围。这防止了测试依赖泄漏到生产代码中。
- 9d49408: 修复嵌套工作流恢复后的条件分支执行。现在条件分支在恢复期间会正确重新评估其条件，确保只有正确的分支执行。
- 41daa63: 线程不再在消息生成完成前创建，以避免在失败时在存储中留下孤立的空线程
- ad0a58b: 预制输入处理器的增强
- 254a36b: 在动态代理参数中暴露 mastra 实例
- 7a7754f: 快速跟进评分器修复输入类型，提高 llm 评分器可靠性，修复 UI 显示 0 分数
- fc92d80: 修复：GenerateReturn 类型
- e0f73c6: 使评分器运行的输入可选
- 0b89602: 通过防止恢复数据重用来修复工作流反馈循环崩溃

  修复了包含挂起步骤的循环（dountil/dowhile）工作流错误地在迭代中重用恢复数据的问题。这导致人机交互工作流在恢复后崩溃或跳过挂起点。

  修复确保在步骤完成（非挂起状态）后清除恢复数据，允许后续循环迭代正确挂起以等待新输入。

  修复 #6014

- 4d37822: 修复从快照恢复后保留工作流输入属性