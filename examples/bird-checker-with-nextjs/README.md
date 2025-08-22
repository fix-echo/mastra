# 鸟类检测器

一个 Next.js 应用程序，从 [Unsplash](https://unsplash.com/) 获取与选定查询匹配的随机图像，并使用 [Mastra AI 代理](https://mastra.ai/docs/agents/overview) 来确定是否是鸟类。

## 功能特性

- 🕊️ 从 Unsplash 获取与选定查询匹配的随机图像
- 🤖 返回结构化响应的 AI 代理
- 🎨 具有语法高亮的现代 UI

## 前提条件

- Node.js 18+
- pnpm（推荐）或 npm
- Anthropic API 密钥
- Unsplash 访问密钥

## 快速开始

1. 克隆仓库：

```bash
git clone <repository-url>
cd bird-checker-with-nextjs
```

2. 安装依赖项：

```bash
pnpm install
```

3. 复制环境变量文件：

```bash
cp .env.example .env.local
```

4. 配置环境变量：

```env
# 获取图像所需
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# AI 处理所需
ANTHROPIC_API_KEY=your_anthropic_key
```

5. 启动开发服务器：

```bash
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用程序。

## 使用方法

1. 点击任意查询标签 - 野生动物 | 羽毛 | 飞行 | 鸟类

## 贡献

欢迎贡献！请随时提交拉取请求。

## 部署地址

[https://bird-checker.vercel.app](https://bird-checker.vercel.app)

## 许可证

[MIT](LICENSE)
