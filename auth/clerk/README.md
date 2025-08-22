# @mastra/auth-clerk

适用于 Clerk 的 Mastra 认证提供者，实现 Clerk 认证与 Mastra 应用的无缝集成。

## 安装

```bash
npm install @mastra/auth-clerk
# 或者
yarn add @mastra/auth-clerk
# 或者
pnpm add @mastra/auth-clerk
```

## 用法

```typescript
import { Mastra } from '@mastra/core';
import { MastraAuthClerk } from '@mastra/auth-clerk';

// 初始化 Clerk 认证提供者
const clerkAuth = new MastraAuthClerk({
  jwksUri: 'your-jwks-uri',
  secretKey: 'your-secret-key',
  publishableKey: 'your-publishable-key',
});

// 或者使用环境变量
const clerkAuth = new MastraAuthClerk();

// 在 Mastra 中启用认证
const mastra = new Mastra({
  ...
  server: {
    experimental_auth: clerkAuth,
  },
});
```

## 配置

该包可以通过构造函数选项或环境变量进行配置：

### 环境变量

- `CLERK_JWKS_URI`: 您的 Clerk 实例的 JWKS URI
- `CLERK_SECRET_KEY`: 您的 Clerk 密钥
- `CLERK_PUBLISHABLE_KEY`: 您的 Clerk 可发布密钥

### 构造函数选项

```typescript
interface MastraAuthClerkOptions {
  jwksUri?: string;
  secretKey?: string;
  publishableKey?: string;
}
```

## 功能特性

- 使用 Clerk 的 JWKS 进行 JWT token 验证
- 用户认证和授权
- 组织成员资格验证
- 与 Mastra 认证系统的无缝集成

## API

### `authenticateToken(token: string): Promise<ClerkUser | null>`

验证 JWT token 并返回关联的用户（如果有效）。

### `authorizeUser(user: ClerkUser): Promise<boolean>`

通过验证用户的组织成员资格来检查用户是否被授权。

## 许可证

MIT
