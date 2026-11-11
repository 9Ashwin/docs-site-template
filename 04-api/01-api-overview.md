# API 总览

这一页是 API 类页面的骨架：先写约定（前缀、认证、错误格式），再按资源分节列端点表。

## 约定 {#conventions}

| 项目 | 值 |
| --- | --- |
| 前缀 | `/api/v1`（示例，按自己的服务填写） |
| 认证 | `Authorization: Bearer <token>` |
| 错误格式 | RFC 7807 Problem JSON |
| 分页 | `?limit=` 与 `?cursor=` |

## 端点 {#endpoints}

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET | `/api/v1/items` | 列出条目 |
| POST | `/api/v1/items` | 创建条目 |
| GET | `/api/v1/items/{id}` | 读取条目 |

## 示例 {#example}

```bash
curl -s https://example.com/api/v1/items \\
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "items": [{ "id": "item_1", "name": "example" }],
  "next_cursor": null
}
```

## 相关文档

- [功能总览](../03-features/01-overview.md)
- [开发指南](../06-development/01-dev-guide.md)
