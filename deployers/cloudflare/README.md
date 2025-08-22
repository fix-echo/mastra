# @mastra/deployer-cloudflare

适用于 Mastra 应用的 Cloudflare Workers 部署器。

## 功能特性

- 部署 Mastra 应用到 Cloudflare Workers
- 配置自定义域名和路由
- 支持 worker 命名空间
- 环境变量自动配置

## 安装

```bash
pnpm add @mastra/deployer-cloudflare
```

## 用法

Cloudflare 部署器作为 Mastra 框架的一部分使用：

```typescript
import { Mastra } from '@mastra/core';
import { CloudflareDeployer } from '@mastra/deployer-cloudflare';

const deployer = new CloudflareDeployer({
  scope: 'your-account-id',
  projectName: 'your-project-name',
  routes: [
    {
      pattern: 'example.com/*',
      zone_name: 'example.com',
      custom_domain: true,
    },
  ],
  workerNamespace: 'your-namespace',
  auth: {
    apiToken: 'your-api-token',
    apiEmail: 'your-email',
  },
});

const mastra = new Mastra({
  deployer,
  // ... 其他 Mastra 配置选项
});
```

## 配置

### 构造函数选项

- `scope` (必需): 您的 Cloudflare 账户 ID
- `projectName`: 您的 worker 项目名称
- `routes`: 您的 worker 路由配置数组
  - `pattern`: 要匹配的 URL 模式
  - `zone_name`: 域名区域名称
  - `custom_domain`: 是否使用自定义域名
- `workerNamespace`: 您的 worker 命名空间
- `auth`: Cloudflare 认证详情
  - `apiToken`: 您的 Cloudflare API token
  - `apiEmail`: 您的 Cloudflare 账户邮箱

## 环境变量

部署器将自动从以下位置加载环境变量：

- 项目中的 `.env` 文件
- 通过 Mastra 配置传递的环境变量

## 路由

路由可以配置为基于 URL 模式和域名将流量定向到您的 worker：

```typescript
const routes = [
  {
    pattern: 'api.example.com/*',
    zone_name: 'example.com',
    custom_domain: true,
  },
  {
    pattern: 'example.com/api/*',
    zone_name: 'example.com',
  },
];
```

每个路由需要：

- `pattern`: 要匹配的 URL 模式
- `zone_name`: 域名区域名称
- `custom_domain`: (可选) 设置为 true 以使用自定义域名

## 要求

- 已启用 Workers 的 Cloudflare 账户
- 具有适当权限的 API token
- 在 Cloudflare 中配置的域名（用于自定义域名）
