# 测试带 Memory 的 Agent

让我们在 playground 中测试我们 agent 的 memory 功能：

1. 确保您的开发服务器正在运行 `npm run dev`
2. 在 http://localhost:4111/ 打开 playground
3. 通过询问交易相关问题开始与您的 agent 对话
4. 然后，问一个引用之前对话的后续问题，例如：
   - "What was that largest transaction again?"
   - "Can you categorize those Amazon purchases we talked about?"
   - "How does my spending this month compare to what you showed me earlier?"

您的 agent 现在应该能够记住之前的对话并提供更具上下文的回复。

启用 memory 后，您的 agent 现在可以在多次交互中保持上下文，创造更自然和有帮助的用户体验。这对于金融助手尤为重要，因为用户可能想要参考之前的信息或在之前的对话基础上继续。
