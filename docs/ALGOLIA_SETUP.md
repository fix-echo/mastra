# Algolia 搜索设置

此文档站点已从 Pagefind 迁移至 Algolia 以实现搜索功能。按照以下步骤设置 Algolia 搜索。

## 先决条件

1. Algolia 账户（在 [algolia.com](https://www.algolia.com/) 注册）
2. 具有搜索索引的 Algolia 应用程序

## 环境变量

在 `docs` 目录中创建一个 `.env` 文件，包含以下变量：

```bash
# 搜索功能所需
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_algolia_search_api_key
```

## 获取您的 Algolia 凭据

1. **App ID**: 在您的 Algolia 仪表板中找到，位于 "Settings" → "API Keys" 下
2. **Search API Key**: 同一位置的公共仅搜索 API 密钥

## 索引配置

搜索钩子默认期望一个名为 `crawler_mastra crawler` 的索引。您可以通过在搜索选项中传递 `indexName` 来自定义此设置：

```typescript
const searchOptions: AlgoliaSearchOptions = {
  indexName: "crawler_mastra crawler",
  hitsPerPage: 20,
  attributesToRetrieve: ["title", "content", "url", "hierarchy"],
  attributesToHighlight: ["title", "content"],
  highlightPreTag: "<mark>",
  highlightPostTag: "</mark>",
};
```

## 索引您的内容

您需要设置一个过程来索引您的文档内容。这可以通过以下方式完成：

1. **Algolia Crawler**: 自动化网页爬取
2. **DocSearch**: Algolia 的文档专用解决方案
3. **自定义索引脚本**: 使用 Algolia API

我们目前有一个网络爬虫每天索引网站内容。