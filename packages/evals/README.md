# @mastra/evals

一个全面的评估框架，用于从多个维度评估 AI 模型输出。

## 安装

```bash
npm install @mastra/evals
```

## 概述

`@mastra/evals` 提供了一套评估指标，用于评估 AI 模型输出。该包包括基于 LLM 和基于 NLP 的指标，支持对 AI 响应进行自动化和模型辅助评估。

## 功能

### 基于 LLM 的指标

1. **答案相关性**
   - 评估答案对输入问题的解答程度
   - 考虑不确定性加权以获得更细致的评分
   - 返回详细的评分理由

2. **偏差检测**
   - 识别模型输出中的潜在偏差
   - 分析观点和陈述中的偏差指标
   - 提供检测到的偏差的解释
   - 可配置的评分尺度

3. **上下文精确度和相关性**
   - 评估响应对提供上下文的使用程度
   - 评估上下文使用的准确性
   - 测量上下文与响应的相关性
   - 分析响应中的上下文位置

4. **忠实度**
   - 验证响应是否忠实于提供的上下文
   - 检测幻觉或编造的信息
   - 根据提供的上下文评估声明
   - 提供忠实度违规的详细分析

5. **提示对齐**
   - 测量响应遵循给定指令的程度
   - 评估对多个指令标准的遵守情况
   - 提供每个指令的评分
   - 支持自定义指令集

6. **毒性**
   - 检测响应中的有毒或有害内容
   - 提供毒性判断的详细理由
   - 可配置的评分阈值
   - 考虑输入和输出上下文

### 基于 NLP 的指标

1. **完整性**
   - 分析响应的结构完整性
   - 识别输入要求中缺失的元素
   - 提供详细的元素覆盖分析
   - 跟踪输入-输出元素比率

2. **内容相似度**
   - 测量输入和输出之间的文本相似度
   - 可配置大小写和空白敏感性
   - 返回标准化的相似度分数
   - 使用字符串比较算法确保准确性

3. **关键词覆盖率**
   - 跟踪输出中来自输入的关键术语的存在
   - 提供详细的关键词匹配统计
   - 计算覆盖率比率
   - 用于确保全面响应

## 用法

### 基本示例

```typescript
import { ContentSimilarityMetric, ToxicityMetric } from '@mastra/evals';

// 初始化指标
const similarityMetric = new ContentSimilarityMetric({
  ignoreCase: true,
  ignoreWhitespace: true,
});

const toxicityMetric = new ToxicityMetric({
  model: openai('gpt-4'),
  scale: 1, // 可选：调整评分尺度
});

// 评估输出
const input = 'What is the capital of France?';
const output = 'Paris is the capital of France.';

const similarityResult = await similarityMetric.measure(input, output);
const toxicityResult = await toxicityMetric.measure(input, output);

console.log('相似度分数:', similarityResult.score);
console.log('毒性分数:', toxicityResult.score);
```

### 上下文感知评估

```typescript
import { FaithfulnessMetric } from '@mastra/evals';

// 使用上下文初始化
const faithfulnessMetric = new FaithfulnessMetric({
  model: openai('gpt-4'),
  context: ['Paris is the capital of France', 'Paris has a population of 2.2 million'],
  scale: 1,
});

// 根据上下文评估响应
const result = await faithfulnessMetric.measure(
  'Tell me about Paris',
  'Paris is the capital of France with 2.2 million residents',
);

console.log('忠实度分数:', result.score);
console.log('理由:', result.reason);
```

## 指标结果

每个指标返回一个标准化的结果对象，包含：

- `score`: 标准化分数（通常为 0-1）
- `info`: 评估的详细信息
- 额外的指标特定数据（例如，匹配的关键词、缺失的元素）

一些指标还提供：

- `reason`: 分数的详细解释
- `verdicts`: 构成最终分数的个别判断

## 遥测和日志记录

该包包括内置的遥测和日志记录功能：

- 通过 Mastra Storage 自动评估跟踪
- 与 OpenTelemetry 集成进行性能监控
- 详细的评估追踪用于调试

```typescript
import { attachListeners } from '@mastra/evals';

// 启用基本评估跟踪
await attachListeners();

// 在 Mastra Storage 中存储评估（如果启用了存储）
await attachListeners(mastra);
// 注意：使用内存存储时，评估仅限于测试过程。
// 使用文件存储时，评估会被持久化，稍后可以查询。
```

## 环境变量

基于 LLM 的指标所需：

- `OPENAI_API_KEY`: 用于访问 OpenAI 模型
- 根据需要的其他提供商密钥（Cohere、Anthropic 等）

## 包导出

```typescript
// 主包导出
import { evaluate } from '@mastra/evals';
// NLP 特定指标
import { ContentSimilarityMetric } from '@mastra/evals/nlp';
```

## 相关联包

- `@mastra/core`: 核心框架功能
- `@mastra/engine`: LLM 执行引擎
- `@mastra/mcp`: Model Context Protocol 集成