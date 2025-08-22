# @mastra/auth-firebase

适用于 Mastra 应用的 Firebase 认证集成包。该包为 Firebase Authentication 和 Firestore 的用户认证和授权提供无缝集成。

## 安装

```bash
npm install @mastra/auth-firebase
# 或者
yarn add @mastra/auth-firebase
# 或者
pnpm add @mastra/auth-firebase
```

## 功能特性

- Firebase Authentication 集成
- 基于 Firestore 的用户授权
- 支持服务账户凭据
- 自动 token 验证
- 通过 Firestore 的用户访问控制

## 用法

```typescript
import { Mastra } from '@mastra/core';
import { MastraAuthFirebase } from '@mastra/auth-firebase';

// 使用默认配置初始化
const auth = new MastraAuthFirebase();

// 或者使用自定义选项
const auth = new MastraAuthFirebase({
  serviceAccount: 'path/to/service-account.json',
  databaseId: 'your-database-id',
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

该包可以通过构造函数选项或环境变量进行配置：

### 构造函数选项

- `serviceAccount`: Firebase 服务账户 JSON 文件路径
- `databaseId`: Firestore 数据库 ID

### 环境变量

- `FIREBASE_SERVICE_ACCOUNT`: Firebase 服务账户 JSON 文件路径
- `FIRESTORE_DATABASE_ID` 或 `FIREBASE_DATABASE_ID`: Firestore 数据库 ID

## 用户授权

该包使用 Firestore 管理用户访问。它期望一个名为 `user_access` 的集合，其中文档以用户 UID 作为键。该集合中是否存在文档决定了用户是否被授权。

## 许可证

Elastic-2.0
