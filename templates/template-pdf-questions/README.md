# PDF 转问题生成器

一个 Mastra 模板，演示了**如何防止token限制**，通过从大型数据集生成 AI 摘要，然后将摘要作为工具调用的输出进行传递。

> **🎯 核心学习点**：此模板展示了如何使用大上下文窗口模型（OpenAI GPT-4.1 Mini）作为"摘要层"，将大型文档压缩成重点摘要，实现无token限制的高效下游处理。

## 概述

此模板展示了一种与大型文档和LLM协作的关键架构模式：

**🚨 问题所在**：大型 PDF 可能包含 50,000+ 个 tokens，这会使上下文窗口不堪重负，并花费数千个 token 来处理。

**✅ 解决方案**：使用具有大上下文窗口的模型（OpenAI GPT-4.1 Mini）来生成重点摘要，然后使用这些摘要进行下游处理。

### 工作流程

1. **输入**: PDF URL
2. **下载和摘要**: 获取 PDF，提取文本，然后使用 OpenAI GPT-4.1 Mini 生成 AI 摘要
3. **生成问题**: 从摘要（而非全文）创建有针对性的问题

### 核心优势

- **📉 Token 减少**: 80-95% 的 token 用量降低
- **🎯 更高质量**: 来自关键洞察的更有针对性的问题
- **💰 成本节省**: 显著降低处理成本
- **⚡ 更快处理**: 摘要处理速度远快于全文处理

## 先决条件

- Node.js 20.9.0 或更高版本
- OpenAI API 密钥（用于摘要和问题生成）

## 设置

1. **克隆并安装依赖项：**

   ```bash
   git clone <repository-url>
   cd template-pdf-questions
   pnpm install
   ```

2. **设置环境变量：**

   ```bash
   cp .env.example .env
   # 编辑 .env 文件并添加您的 API 密钥
   ```

   ```env
   OPENAI_API_KEY="your-openai-api-key-here"
   ```

3. **运行示例：**

   ```bash
   npx tsx example.ts
   ```

## 🏗️ 架构模式：Token 限制保护

此模板演示了一种在 LLM 应用中处理大型数据集的关键模式：

### 挑战所在

在处理大型文档（PDF、报告、转录本）时，您经常会遇到：

- **Token 限制**: 文档可能超出上下文窗口
- **高成本**: 重复处理 50,000+ 个 token 非常昂贵
- **质量下降**: LLM 在处理极长输入时性能变差
- **处理缓慢**: 大型输入需要更长的处理时间

### 解决方案：摘要层

不要在您的流水线中传递原始数据：

1. **使用大上下文窗口模型**（OpenAI GPT-4.1 Mini）消化完整内容
2. **生成重点摘要**，捕获关键信息
3. **将摘要传递给下游处理**，而不是原始数据

### Implementation Details

```typescript
// ❌ BAD: Pass full text through pipeline
const questions = await generateQuestions(fullPdfText); // 50,000 tokens!

// ✅ GOOD: Summarize first, then process
const summary = await summarizeWithGPT41Mini(fullPdfText); // 2,000 tokens
const questions = await generateQuestions(summary); // Much better!
```

### When to Use This Pattern

- **Large documents**: PDFs, reports, transcripts
- **Batch processing**: Multiple documents
- **Cost optimization**: Reduce token usage
- **Quality improvement**: More focused processing
- **Chain operations**: Multiple LLM calls on same data

## Usage

### Using the Workflow

```typescript
import { mastra } from './src/mastra/index';

const run = await mastra.getWorkflow('pdfToQuestionsWorkflow').createRunAsync();

// Using a PDF URL
const result = await run.start({
  inputData: {
    pdfUrl: 'https://example.com/document.pdf',
  },
});

console.log(result.result.questions);
```

### Using the PDF Questions Agent

```typescript
import { mastra } from './src/mastra/index';

const agent = mastra.getAgent('pdfQuestionsAgent');

// The agent can handle the full process with natural language
const response = await agent.stream([
  {
    role: 'user',
    content: 'Please download this PDF and generate questions from it: https://example.com/document.pdf',
  },
]);

for await (const chunk of response.textStream) {
  console.log(chunk);
}
```

### Using Individual Tools

```typescript
import { mastra } from './src/mastra/index';
import { pdfFetcherTool } from './src/mastra/tools/download-pdf-tool';
import { generateQuestionsFromTextTool } from './src/mastra/tools/generate-questions-from-text-tool';

// Step 1: Download PDF and generate summary
const pdfResult = await pdfFetcherTool.execute({
  context: { pdfUrl: 'https://example.com/document.pdf' },
  mastra,
  runtimeContext: new RuntimeContext(),
});

console.log(`Downloaded ${pdfResult.fileSize} bytes from ${pdfResult.pagesCount} pages`);
console.log(`Generated ${pdfResult.summary.length} character summary`);

// Step 2: Generate questions from summary
const questionsResult = await generateQuestionsFromTextTool.execute({
  context: {
    extractedText: pdfResult.summary,
    maxQuestions: 10,
  },
  mastra,
  runtimeContext: new RuntimeContext(),
});

console.log(questionsResult.questions);
```

### Expected Output

```javascript
{
  status: 'success',
  result: {
    questions: [
      "What is the main objective of the research presented in this paper?",
      "Which methodology was used to collect the data?",
      "What are the key findings of the study?",
      // ... more questions
    ],
    success: true
  }
}
```

## Architecture

### Components

- **`pdfToQuestionsWorkflow`**: Main workflow orchestrating the process
- **`textQuestionAgent`**: Mastra agent specialized in generating educational questions
- **`pdfQuestionAgent`**: Complete agent that can handle the full PDF to questions pipeline

### Tools

- **`pdfFetcherTool`**: Downloads PDF files from URLs, extracts text, and generates AI summaries
- **`generateQuestionsFromTextTool`**: Generates comprehensive questions from summarized content

### Workflow Steps

1. **`download-and-summarize-pdf`**: Downloads PDF from provided URL and generates AI summary
2. **`generate-questions-from-summary`**: Creates comprehensive questions from the AI summary

## Features

- ✅ **Token Limit Protection**: Demonstrates how to handle large datasets without hitting context limits
- ✅ **80-95% Token Reduction**: AI summarization drastically reduces processing costs
- ✅ **Large Context Window**: Uses OpenAI GPT-4.1 Mini to handle large documents efficiently
- ✅ **Zero System Dependencies**: Pure JavaScript solution
- ✅ **Single API Setup**: OpenAI for both summarization and question generation
- ✅ **Fast Text Extraction**: Direct PDF parsing (no OCR needed for text-based PDFs)
- ✅ **Educational Focus**: Generates focused learning questions from key insights
- ✅ **Multiple Interfaces**: Workflow, Agent, and individual tools available

## How It Works

### Text Extraction Strategy

This template uses a **pure JavaScript approach** that works for most PDFs:

1. **Text-based PDFs** (90% of cases): Direct text extraction using `pdf2json`
   - ⚡ Fast and reliable
   - 🔧 No system dependencies
   - ✅ Works out of the box

2. **Scanned PDFs**: Would require OCR, but most PDFs today contain embedded text

### Why This Approach?

- **Simplicity**: No GraphicsMagick, ImageMagick, or other system tools needed
- **Speed**: Direct text extraction is much faster than OCR
- **Reliability**: Works consistently across different environments
- **Educational**: Easy for developers to understand and modify
- **Single Path**: One clear workflow with no complex branching

## Configuration

### Environment Variables

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### Customization

You can customize the question generation by modifying the `textQuestionAgent`:

```typescript
export const textQuestionAgent = new Agent({
  name: 'Generate questions from text agent',
  instructions: `
    You are an expert educational content creator...
    // Customize instructions here
  `,
  model: openai('gpt-4o'),
});
```

## Development

### Project Structure

```text
src/mastra/
├── agents/
│   ├── pdf-question-agent.ts       # PDF processing and question generation agent
│   └── text-question-agent.ts      # Text to questions generation agent
├── tools/
│   ├── download-pdf-tool.ts         # PDF download tool
│   ├── extract-text-from-pdf-tool.ts # PDF text extraction tool
│   └── generate-questions-from-text-tool.ts # Question generation tool
├── workflows/
│   └── generate-questions-from-pdf-workflow.ts # Main workflow
├── lib/
│   └── util.ts                      # Utility functions including PDF text extraction
└── index.ts                         # Mastra configuration
```

### Testing

```bash
# Run with a test PDF
export OPENAI_API_KEY="your-api-key"
npx tsx example.ts
```

## Common Issues

### "OPENAI_API_KEY is not set"

- Make sure you've set the environment variable
- Check that your API key is valid and has sufficient credits

### "Failed to download PDF"

- Verify the PDF URL is accessible and publicly available
- Check network connectivity
- Ensure the URL points to a valid PDF file
- Some servers may require authentication or have restrictions

### "No text could be extracted"

- The PDF might be password-protected
- Very large PDFs might take longer to process
- Scanned PDFs without embedded text won't work (rare with modern PDFs)

### "Context length exceeded" or Token Limit Errors

- **Solution**: Use a smaller PDF file (under ~5-10 pages)
- **Automatic Truncation**: The tool automatically uses only the first 4000 characters for very large documents
- **Helpful Errors**: Clear messages guide you to use smaller PDFs when needed

## What Makes This Template Special

### 🎯 **True Simplicity**

- Single dependency for PDF processing (`pdf2json`)
- No system tools or complex setup required
- Works immediately after `pnpm install`
- Multiple usage patterns (workflow, agent, tools)

### ⚡ **Performance**

- Direct text extraction (no image conversion)
- Much faster than OCR-based approaches
- Handles reasonably-sized documents efficiently

### 🔧 **Developer-Friendly**

- Pure JavaScript/TypeScript
- Easy to understand and modify
- Clear separation of concerns
- Simple error handling with helpful messages

### 📚 **Educational Value**

- Generates multiple question types
- Covers different comprehension levels
- Perfect for creating study materials

## 🚀 Broader Applications

This token limit protection pattern can be applied to many other scenarios:

### Document Processing

- **Legal documents**: Summarize contracts before analysis
- **Research papers**: Extract key findings before comparison
- **Technical manuals**: Create focused summaries for specific topics

### Content Analysis

- **Social media**: Summarize large thread conversations
- **Customer feedback**: Compress reviews before sentiment analysis
- **Meeting transcripts**: Extract action items and decisions

### Data Processing

- **Log analysis**: Summarize error patterns before classification
- **Survey responses**: Compress feedback before theme extraction
- **Code reviews**: Summarize changes before generating reports

### Implementation Tips

- Use **OpenAI GPT-4.1 Mini** for initial summarization (large context window)
- Pass **summaries** to downstream tools, not raw data
- **Chain summaries** for multi-step processing
- **Preserve metadata** (file size, page count) for context

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
