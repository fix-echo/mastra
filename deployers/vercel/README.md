# @mastra/deployer-vercel

适用于 Mastra 应用的 Vercel 部署器。

## 功能特性

- 部署 Mastra 应用到 Vercel
- 零配置 serverless 部署
- 环境变量自动同步
- 支持生产、预览和开发环境
- 使用 Edge Functions 的即时全球部署

## 安装

```bash
pnpm add @mastra/deployer-vercel
```

## 用法

Vercel 部署器作为 Mastra 框架的一部分使用：

```typescript
import { Mastra } from '@mastra/core';
import { VercelDeployer } from '@mastra/deployer-vercel';

const deployer = new VercelDeployer({
  teamSlug: 'your-team-slug',
  projectName: 'your-project-name',
  token: 'your-vercel-token',
});

const mastra = new Mastra({
  deployer,
  // ... 其他 Mastra 配置选项
});
```

## 配置

### 构造函数选项

- `teamSlug` (必需): 您的 Vercel 团队 slug
- `projectName`: 您的 Vercel 项目名称（如果不存在将创建）
- `token`: 您的 Vercel API token（用于认证的必需项）

## 项目结构

部署器创建：

```
your-project/
├── vercel.json     # 部署配置
└── index.mjs       # 应用入口点
```

### vercel.json 配置

默认配置：

```json
{
  "version": 2,
  "installCommand": "npm install --omit=dev",
  "builds": [
    {
      "src": "index.mjs",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["**"]
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.mjs"
    }
  ]
}
```

## 环境变量

通过以下方式自动处理环境变量：

- 项目中的 `.env` 文件
- 通过 Mastra 配置传递的环境变量
- Vercel 的环境变量 UI

## 部署流程

部署器：

1. 使用必要文件配置您的项目
2. 使用 CLI 部署到 Vercel
3. 同步环境变量以便将来部署
