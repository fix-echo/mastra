# @mastra/auth-workos

适用于 Mastra 的 WorkOS 认证提供者，在您的应用中实现 WorkOS 认证和授权的无缝集成。

## 功能特性

- 🔐 WorkOS 认证集成
- 👥 用户管理和组织成员支持
- 🔑 使用 WorkOS JWKS 的 JWT token 验证
- 👮‍♂️ 基于角色的授权和管理员角色支持

## 安装

```bash
npm install @mastra/auth-workos
# 或者
yarn add @mastra/auth-workos
# 或者
pnpm add @mastra/auth-workos
```

## 用法

```typescript
import { Mastra } from '@mastra/core';
import { MastraAuthWorkos } from '@mastra/auth-workos';

// 使用环境变量初始化
const auth = new MastraAuthWorkos();

// 或者使用显式配置初始化
const auth = new MastraAuthWorkos({
  apiKey: 'your_workos_api_key',
  clientId: 'your_workos_client_id',
});

// 在 Mastra 中启用认证
const mastra = new Mastra({
  ...
  server: {
    experimental_auth: auth,
  },
});
```

## 配置

该包需要以下配置：

### 环境变量

- `WORKOS_API_KEY`: 您的 WorkOS API 密钥
- `WORKOS_CLIENT_ID`: 您的 WorkOS 客户端 ID

### 选项

您还可以在初始化提供者时直接提供这些值：

```typescript
interface MastraAuthWorkosOptions {
  apiKey?: string;
  clientId?: string;
}
```

## API

### `authenticateToken(token: string): Promise<WorkosUser | null>`

使用 WorkOS JWKS 验证 JWT token，如果有效则返回用户信息。

### `authorizeUser(user: WorkosUser): Promise<boolean>`

通过验证用户组织成员资格和角色来检查用户是否具有管理员权限。

## 许可证

MIT
