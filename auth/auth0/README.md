# @mastra/auth-auth0

用于 Auth0 集成的 Mastra 认证提供者。该包通过 Auth0 的 JWT token 提供无缝的认证和授权。

## 安装

```bash
npm install @mastra/auth-auth0
# 或者
yarn add @mastra/auth-auth0
# 或者
pnpm add @mastra/auth-auth0
```

## 用法

```typescript
import { Mastra } from '@mastra/core';
import { MastraAuthAuth0 } from '@mastra/auth-auth0';

// 使用配置初始化
const auth0Provider = new MastraAuthAuth0({
  domain: 'your-tenant.auth0.com',
  audience: 'your-api-identifier',
});

// 或者使用环境变量
const auth0Provider = new MastraAuthAuth0();

// 在 Mastra 中启用认证
const mastra = new Mastra({
  ...
  server: {
    experimental_auth: auth0Provider,
  },
});
```

## 配置

该包可以通过构造函数选项或环境变量进行配置：

### 构造函数选项

```typescript
interface MastraAuthAuth0Options {
  domain?: string; // 您的 Auth0 域名
  audience?: string; // 您的 Auth0 API 标识符
}
```

### 环境变量

- `AUTH0_DOMAIN`: 您的 Auth0 域名 (例如: 'your-tenant.auth0.com')
- `AUTH0_AUDIENCE`: 您的 Auth0 API 标识符

## 功能特性

- 使用 Auth0 的 JWKS 进行 JWT token 验证
- 根据 Auth0 的发行者自动验证 token
- Audience 验证
- 类型安全的用户负载

## 示例

```typescript
import { MastraAuthAuth0 } from '@mastra/auth-auth0';

const auth0Provider = new MastraAuthAuth0({
  domain: 'your-tenant.auth0.com',
  audience: 'your-api-identifier',
});

// 验证 token
const user = await auth0Provider.authenticateToken('your-jwt-token');

// 授权用户
const isAuthorized = await auth0Provider.authorizeUser(user);
```

## 要求

- Node.js 16 或更高版本
- Auth0 账户和已配置的应用程序
- 有效的 Auth0 域名和 API 标识符

## 许可

MIT
