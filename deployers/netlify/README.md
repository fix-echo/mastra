# @mastra/deployer-netlify

用于 Mastra 应用程序的 Netlify 部署器。

## 特性

- 将 Mastra 应用部署到 Netlify Functions
- 自动站点创建和配置
- 支持使用 Edge Functions 的无服务器函数
- 零配置的部署流程

## 安装

```bash
pnpm add @mastra/deployer-netlify
```

## 用法

Netlify 部署器作为 Mastra 框架的一部分使用：

```typescript
import { Mastra } from '@mastra/core';
import { NetlifyDeployer } from '@mastra/deployer-netlify';

const deployer = new NetlifyDeployer({
  scope: 'your-team-id',
  projectName: 'your-project-name',
  token: 'your-netlify-token',
});

const mastra = new Mastra({
  deployer,
  // ... 其他 Mastra 配置选项
});
```

## 配置

### 构造函数选项

- `scope` (必需): 您的 Netlify 团队标识名或 ID
- `projectName`: 您的 Netlify 站点名称（如果尚不存在将被创建）
- `token`: 您的 Netlify 身份验证令牌

## 项目结构

部署器会自动创建如下结构：

```
your-project/
├── netlify/
│   └── functions/
│       └── api/
└── netlify.toml
```

### netlify.toml 配置

部署器会创建包含以下默认设置的 `netlify.toml`:

```toml
[functions]
node_bundler = "esbuild"
directory = "/netlify/functions"

[[redirects]]
force = true
from = "/*"
status = 200
to = "/.netlify/functions/api/:splat"
```

## 环境变量

环境变量通过以下方式自动处理：

- 项目中的 `.env` 文件
- 通过 Mastra 配置传递的环境变量
- Netlify 的环境变量 UI 界面

## 部署流程

部署器将执行以下步骤：

1. 如果站点不存在则创建新站点
2. 使用您的环境变量配置站点
3. 将您的应用程序部署到 Netlify Functions
