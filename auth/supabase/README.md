# @mastra/auth-supabase

适用于 Mastra 的 Supabase 认证集成，使用 Supabase 的认证系统提供无缝的认证和授权功能。

## 安装

```bash
npm install @mastra/auth-supabase
# 或者
yarn add @mastra/auth-supabase
# 或者
pnpm add @mastra/auth-supabase
```

## 用法

```typescript
import { Mastra } from '@mastra/core';
import { MastraAuthSupabase } from '@mastra/auth-supabase';

// 使用环境变量初始化
const auth = new MastraAuthSupabase();

// 或者使用显式配置初始化
const auth = new MastraAuthSupabase({
  url: 'your-supabase-url',
  anonKey: 'your-supabase-anon-key',
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

该包可以通过两种方式配置：

1. **环境变量**:
   - `SUPABASE_URL`: 您的 Supabase 项目 URL
   - `SUPABASE_ANON_KEY`: 您的 Supabase 匿名密钥

2. **构造函数选项**:
   ```typescript
   interface MastraAuthSupabaseOptions {
     url?: string;
     anonKey?: string;
   }
   ```

## 功能特性

- **认证**: 验证用户 token 并从 Supabase 获取用户信息
- **授权**: 基于用户在 Supabase 中的角色检查用户权限
- **类型安全**: 完整的 TypeScript 支持和适当的类型定义
- **环境变量支持**: 通过环境变量轻松配置

## API

### `authenticateToken(token: string)`

验证用户 token，如果有效则返回用户信息。

### `authorizeUser(user: User)`

检查用户是否具有所需权限（目前检查管理员状态）。

## 要求

- Node.js 16 或更高版本
- 已启用认证的 Supabase 项目
- Supabase URL 和匿名密钥

## 许可

Elastic-2.0
