# 测试您的 Tool

让我们在 playground 中测试我们的工具和 agent：

1. 确保您的开发服务器正在运行 `npm run dev`
2. 在 http://localhost:4111/ 打开 playground
3. 您可以在 Tools 标签中直接测试工具以确保其正常工作
4. 然后，尝试问您的 agent 问题，例如：
   - "Can you show me my recent transactions?"
   - "How much did I spend on Amazon?"
   - "What was my largest transaction this month?"

您的 agent 现在应该能够获取交易数据并回答相关问题。但是，它还没有记忆功能，因此不会记住之前的对话。我们将在下一步中添加这个功能。

在 playground 中直接测试您的工具是在将其与您的 agent 集成之前验证其是否正常工作的好方法。这有助于您识别并修复工具本身的任何问题，然后再排查 agent 使用工具的潜在问题。
