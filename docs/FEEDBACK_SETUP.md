# 文档反馈表单 - Airtable 设置指南

## 概述

反馈表单现已使用 Airtable 集成实现。按照以下步骤设置数据收集。

## 所需环境变量

将这些添加到您的 `.env.local` 文件中：

```bash
# 必需：您的 Airtable 个人访问令牌
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX

# 必需：您的 Airtable Base ID（以 'app' 开头）
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX

# 可选：表名（默认为 "Feedback"）
# 使用 Airtable 中的确切表名 - 空格可以
AIRTABLE_TABLE_NAME=Docs Feedback
```

## Airtable 设置步骤

### 1. 创建 Airtable Base

1. 前往 [Airtable](https://airtable.com) 并创建一个新 base
2. 将其命名为类似 "Docs Feedback"

### 2. 创建反馈表

创建一个名为 "Feedback"（或 "Docs Feedback" - 都可以）的表，包含以下列：

| 列名             | 字段类型     | 描述                           |
| ----------------- | ------------ | ------------------------------ |
| **Feedback ID**   | 单行文本     | 唯一标识符                     |
| **Feedback Text** | 长文本       | 实际的反馈内容                 |
| **Rating**        | 数字         | 星级评分（1-5）                |
| **Email**         | 邮箱         | 用户邮箱（可选）               |
| **Page URL**      | URL          | 反馈来自哪个文档页面           |
| **User Agent**    | 长文本       | 浏览器/设备信息                |
| **Client IP**     | 单行文本     | 用户 IP 地址                   |
| **Timestamp**     | 日期和时间   | 反馈提交时间                   |
| **Source**        | 单行文本     | 始终为 "docs"                  |
| **Status**        | 单选         | New, In Review, Responded, Closed |
| **Created Date**  | 日期         | 仅日期（YYYY-MM-DD）           |

### 3. 获取您的 API 凭据

#### 获取 API 密钥：

1. 前往 https://airtable.com/create/tokens
2. 创建一个新的个人访问令牌
3. 给它起个名字如 "Docs Feedback"
4. 添加这些范围：
   - `data.records:read`
   - `data.records:write`
5. 添加对您的反馈 base 的访问权限
6. 复制令牌（以 `pat` 开头）

#### 获取 Base ID：

1. 前往 https://airtable.com/api
2. 选择您的反馈 base
3. 您的 base ID 显示在 URL 和文档中（以 `app` 开头）

### 4. 配置环境

创建或更新您的 `.env.local` 文件：

```bash
AIRTABLE_API_KEY=your_token_here
AIRTABLE_BASE_ID=your_base_id_here
AIRTABLE_TABLE_NAME=Feedback
```

### 5. 测试集成

1. 启动您的开发服务器：`npm run dev`
2. 前往任何文档页面
3. 点击底部的 "Question? Give us feedback"
4. 提交测试反馈
5. 检查您的 Airtable base 以查看数据

## 功能

### 存储的内容：

- ✅ 用户反馈文本
- ✅ 星级评分（1-5）
- ✅ 用户邮箱（可选）
- ✅ 反馈页面的 URL
- ✅ 浏览器/设备信息
- ✅ 时间戳
- ✅ 唯一反馈 ID
- ✅ 状态跟踪

### 错误处理：

- 如果 Airtable 失败，反馈会记录到控制台（回退方案）
- 用户仍会收到成功消息
- 详细的错误日志用于调试

### UI 功能：

- 抽屉式表单（从右侧滑出）
- 星级评分组件
- 表单验证
- 加载状态
- 成功/错误反馈
- 移动端响应式

## 故障排除

### 常见问题：

1. **"Airtable configuration missing"**
   - 检查您的 `.env.local` 文件是否存在
   - 验证 `AIRTABLE_API_KEY` 和 `AIRTABLE_BASE_ID` 是否已设置
   - 添加环境变量后重启开发服务器

2. **"422 Unprocessable Entity"**
   - Airtable 中的列名与 API 调用不匹配
   - 验证所有列都存在且具有正确的字段类型

3. **"401 Unauthorized"**
   - API 密钥不正确或已过期
   - 令牌没有对该 base 的访问权限
   - 检查令牌范围是否包含读/写权限

4. **"403 Forbidden - Invalid permissions or model not found"**
   - API 令牌没有对该 base 的访问权限
   - 表名不存在或拼写错误
   - 令牌范围不足
   - **最常见：** 检查您的 `AIRTABLE_TABLE_NAME` 是否完全匹配（区分大小写）

5. **"404 Not Found"**
   - Base ID 不正确
   - 表名不匹配（检查 `AIRTABLE_TABLE_NAME`）

### 调试模式：

检查服务器控制台的详细日志：

- 🚀 发送到 Airtable 的请求
- ✅ 成功存储
- ❌ 错误详情

## 生产部署

在生产环境中，请确保：

1. 在您的托管平台上设置环境变量
2. 使用生产 Airtable base（与开发环境分离）
3. 考虑为 API 端点设置速率限制
4. 设置失败提交的监控

## 替代存储选项

API 设计为可扩展。您可以轻松添加：

- 数据库存储（PostgreSQL、MongoDB）
- 邮件通知
- Webhook 集成
- 多个存储后端

只需修改 `sendToAirtable` 函数或在 API 路由中添加额外的存储函数。