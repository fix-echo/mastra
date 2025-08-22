# @mastra/deployer

Mastra 应用程序的核心部署基础设施，处理构建、打包和部署过程。

## 安装

```bash
npm install @mastra/deployer
```

## 概述

`@mastra/deployer` 包为 Mastra 应用程序提供基础部署基础设施。它处理：

- 项目构建和打包
- 依赖管理
- 环境配置
- 开发和生产部署

## 用法

```typescript
import { Deployer } from '@mastra/deployer';

// 创建部署器实例
const deployer = new Deployer({
  dir: '/path/to/project',
  type: 'Deploy', // 或 'Dev' 用于开发模式
});

// 安装依赖
await deployer.install();

// 写入 package.json
await deployer.writePackageJson();

// 获取 Mastra 实例
const { mastra } = await deployer.getMastra();
```

## 配置

### 必需参数

- `dir`: 项目目录路径
- `type`: 部署类型 ('Deploy' 或 'Dev')

## 功能

### 项目结构管理

- 创建和管理 `.mastra` 目录
- 处理 package.json 生成和更新
- 管理项目依赖

### 依赖管理

- 自动依赖安装
- 工作区依赖解析
- @mastra 包的版本管理

### 环境处理

- 支持多个环境文件：
  - `.env`
  - `.env.development`
  - `.env.local`
- 环境变量验证和处理

### 构建过程

- 项目打包
- 资源管理
- 源代码转换

### 开发支持

- 开发服务器配置
- 热重载功能
- 调试日志

## 项目结构

部署器创建和管理以下结构：

```
your-project/
├── .mastra/
│   ├── package.json
│   ├── mastra.mjs
│   └── index.mjs
├── .env
├── .env.development
├── .env.local
└── package.json
```

## Package.json 管理

部署器自动管理 `.mastra/package.json` 中的依赖：

```json
{
  "name": "server",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@mastra/loggers": "latest",
    "hono": "4.6.17",
    "@hono/node-server": "^1.13.7",
    "superjson": "^2.2.2",
    "zod-to-json-schema": "^3.24.1"
  }
}
```

## 方法

### `install()`

安装和更新项目依赖。

### `writePackageJson()`

生成或更新 .mastra 目录中的 package.json。

### `getMastra()`

返回项目的 Mastra 实例。

### `getMastraPath()`

返回 .mastra 目录的路径。

## 错误处理

部署器包含对以下内容的全面错误处理：

- 依赖安装失败
- 文件系统操作
- 环境配置问题
- 构建过程错误

## 日志记录

通过 @mastra/core 的内置日志支持：

- 调试信息
- 安装进度
- 构建状态
- 错误报告

## 相关包

- `@mastra/core`: 核心 Mastra 功能
- `@mastra/loggers`: 日志基础设施
- 部署器实现：
  - `@mastra/deployer-cloudflare`
  - 其他平台特定的部署器