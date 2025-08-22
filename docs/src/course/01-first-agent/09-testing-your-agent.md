# 测试您的 Agent

现在让我们在 playground 中测试我们的 agent：

1. 确保您的开发服务器正在运行 `npm run dev`
2. 在 http://localhost:4111/ 打开 playground
3. 您应该在 agent 列表中看到您的 "Financial Assistant Agent"
4. 尝试发送类似 "Hello, can you help me analyze my spending?" 的消息

此时，您的 agent 可以回复基本问题，但无法访问任何交易数据。在下一步中，我们将创建一个自定义工具来从 Google Sheet 获取交易数据。

在 playground 中测试您的 agent 是开发过程中的重要步骤。它允许您查看您的 agent 如何响应不同的输入，并在将其部署到生产环境之前识别需要解决的任何问题。
