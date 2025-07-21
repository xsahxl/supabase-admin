# API 设计文档

## 1. API 概述

### 1.1 设计原则

- RESTful API 设计
- 统一的响应格式
- 完善的错误处理
- 版本控制
- 认证和授权
- 请求限流

### 1.2 基础信息

- **基础URL**: `https://your-project.supabase.co/rest/v1`
- **认证方式**: Bearer Token (JWT)
- **内容类型**: `application/json`
- **字符编码**: UTF-8

### 1.3 响应格式

```typescript
// 成功响应
{
  "success": true,
  "data": any,
  "message": string,
  "timestamp": string
}

// 错误响应
{
  "success": false,
  "error": {
    "code": string,
    "message": string,
    "details": any
  },
  "timestamp": string
}
```

## 2. 认证 API

### 2.1 用户注册

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "user_type": "enterprise",
  "first_name": "张",
  "last_name": "三",
  "phone": "13800138000"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "user_type": "enterprise",
      "email_verified": false
    },
    "message": "注册成功，请查收验证邮件"
  }
}
```

### 2.2 用户登录

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "user_type": "enterprise",
      "first_name": "张",
      "last_name": "三"
    },
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

### 2.3 刷新令牌

```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "refresh_token"
}
```

### 2.4 用户登出

```http
POST /auth/logout
Authorization: Bearer {access_token}
```

## 3. 企业用户 API

### 3.1 企业信息管理

#### 3.1.1 获取企业信息

```http
GET /enterprises/me
Authorization: Bearer {access_token}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "示例企业有限公司",
    "type": "有限责任公司",
    "industry": "科技",
    "founded_date": "2020-01-01",
    "registered_capital": 1000000.0,
    "business_scope": "软件开发、技术服务",
    "address": "北京市朝阳区xxx街道xxx号",
    "phone": "010-12345678",
    "email": "contact@example.com",
    "website": "https://example.com",
    "description": "企业简介",
    "status": "draft",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### 3.1.2 创建企业信息

```http
POST /enterprises
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "示例企业有限公司",
  "type": "有限责任公司",
  "industry": "科技",
  "founded_date": "2020-01-01",
  "registered_capital": 1000000.00,
  "business_scope": "软件开发、技术服务",
  "address": "北京市朝阳区xxx街道xxx号",
  "phone": "010-12345678",
  "email": "contact@example.com",
  "website": "https://example.com",
  "description": "企业简介"
}
```

#### 3.1.3 更新企业信息

```http
PUT /enterprises/me
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "更新后的企业名称",
  "phone": "010-87654321"
}
```

#### 3.1.4 提交审核

```http
POST /enterprises/me/submit
Authorization: Bearer {access_token}
```

#### 3.1.5 获取审核历史

```http
GET /enterprises/me/reviews
Authorization: Bearer {access_token}
```

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "action": "approve",
      "status_before": "pending",
      "status_after": "approved",
      "comments": "审核通过",
      "reviewer": {
        "id": "uuid",
        "email": "admin@example.com",
        "first_name": "管理员"
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 3.2 企业证件管理

#### 3.2.1 上传证件

```http
POST /enterprises/me/documents
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

{
  "document_type": "business_license",
  "document_name": "营业执照",
  "file": "file_data"
}
```

#### 3.2.2 获取证件列表

```http
GET /enterprises/me/documents
Authorization: Bearer {access_token}
```

#### 3.2.3 删除证件

```http
DELETE /enterprises/me/documents/{document_id}
Authorization: Bearer {access_token}
```

### 3.3 企业联系人管理

#### 3.3.1 添加联系人

```http
POST /enterprises/me/contacts
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "联系人姓名",
  "phone": "13800138000",
  "email": "contact@example.com",
  "position": "经理",
  "is_primary": true
}
```

#### 3.3.2 获取联系人列表

```http
GET /enterprises/me/contacts
Authorization: Bearer {access_token}
```

#### 3.3.3 更新联系人

```http
PUT /enterprises/me/contacts/{contact_id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "更新后的姓名",
  "phone": "13900139000"
}
```

#### 3.3.4 删除联系人

```http
DELETE /enterprises/me/contacts/{contact_id}
Authorization: Bearer {access_token}
```

## 4. Admin API

### 4.1 企业审核管理

#### 4.1.1 获取企业列表

```http
GET /admin/enterprises
Authorization: Bearer {access_token}
```

**查询参数**:

- `status`: 企业状态筛选
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `search`: 搜索关键词
- `sort_by`: 排序字段
- `sort_order`: 排序方向 (asc/desc)

**响应**:

```json
{
  "success": true,
  "data": {
    "enterprises": [
      {
        "id": "uuid",
        "name": "示例企业有限公司",
        "user": {
          "email": "user@example.com",
          "first_name": "张",
          "last_name": "三"
        },
        "status": "pending",
        "created_at": "2024-01-01T00:00:00Z",
        "submitted_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "total_pages": 5
    }
  }
}
```

#### 4.1.2 获取企业详情

```http
GET /admin/enterprises/{enterprise_id}
Authorization: Bearer {access_token}
```

#### 4.1.3 审核企业

```http
POST /admin/enterprises/{enterprise_id}/review
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "action": "approve", // approve, reject, suspend
  "comments": "审核意见",
  "review_data": {
    "additional_notes": "额外说明"
  }
}
```

#### 4.1.4 获取审核统计

```http
GET /admin/statistics/reviews
Authorization: Bearer {access_token}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "total_enterprises": 1000,
    "pending_count": 50,
    "approved_count": 800,
    "rejected_count": 100,
    "suspended_count": 50,
    "approval_rate": 0.8,
    "avg_review_time": 3600
  }
}
```

### 4.2 用户管理

#### 4.2.1 获取用户列表

```http
GET /admin/users
Authorization: Bearer {access_token}
```

**查询参数**:

- `user_type`: 用户类型筛选
- `status`: 用户状态筛选
- `page`: 页码
- `limit`: 每页数量
- `search`: 搜索关键词

#### 4.2.2 邀请用户

```http
POST /admin/invitations
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "email": "newadmin@example.com",
  "user_type": "admin",
  "expires_in_hours": 24
}
```

#### 4.2.3 获取邀请列表

```http
GET /admin/invitations
Authorization: Bearer {access_token}
```

#### 4.2.4 取消邀请

```http
DELETE /admin/invitations/{invitation_id}
Authorization: Bearer {access_token}
```

### 4.3 系统管理

#### 4.3.1 获取系统设置

```http
GET /admin/settings
Authorization: Bearer {access_token}
```

#### 4.3.2 更新系统设置

```http
PUT /admin/settings/{key}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "value": "new_value",
  "description": "设置说明"
}
```

## 5. 通用 API

### 5.1 用户信息

#### 5.1.1 获取当前用户信息

```http
GET /users/me
Authorization: Bearer {access_token}
```

#### 5.1.2 更新用户信息

```http
PUT /users/me
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "first_name": "新名字",
  "last_name": "新姓氏",
  "phone": "13900139000"
}
```

#### 5.1.3 修改密码

```http
PUT /users/me/password
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "current_password": "oldPassword",
  "new_password": "newPassword"
}
```

### 5.2 文件上传

#### 5.2.1 上传文件

```http
POST /files/upload
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

{
  "file": "file_data",
  "folder": "enterprise_documents"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "file_url": "https://storage.example.com/path/to/file.pdf",
    "file_name": "document.pdf",
    "file_size": 1024000,
    "mime_type": "application/pdf"
  }
}
```

### 5.3 系统信息

#### 5.3.1 获取系统状态

```http
GET /system/status
```

**响应**:

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "uptime": 86400,
    "database": "connected",
    "storage": "available"
  }
}
```

## 6. 错误码定义

### 6.1 通用错误码

- `400`: 请求参数错误
- `401`: 未授权
- `403`: 禁止访问
- `404`: 资源不存在
- `409`: 资源冲突
- `422`: 数据验证失败
- `429`: 请求过于频繁
- `500`: 服务器内部错误

### 6.2 业务错误码

- `1001`: 邮箱已存在
- `1002`: 密码强度不足
- `1003`: 验证码错误
- `1004`: 企业信息不完整
- `1005`: 企业已存在
- `1006`: 状态不允许操作
- `1007`: 邀请已过期
- `1008`: 权限不足

## 7. 请求限流

### 7.1 限流规则

- 认证接口: 5次/分钟
- 普通接口: 100次/分钟
- 文件上传: 10次/分钟
- Admin接口: 200次/分钟

### 7.2 限流响应

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "429",
    "message": "请求过于频繁，请稍后再试",
    "retry_after": 60
  }
}
```

## 8. WebSocket API

### 8.1 实时通知

```javascript
// 连接WebSocket
const socket = new WebSocket(
  'wss://your-project.supabase.co/realtime/v1/websocket'
);

// 订阅企业状态变更
socket.send(
  JSON.stringify({
    event: 'phx_join',
    topic: 'enterprise_status',
    payload: { user_id: 'user_uuid' },
  })
);

// 接收通知
socket.onmessage = event => {
  const data = JSON.parse(event.data);
  if (data.event === 'enterprise_status_changed') {
    console.log('企业状态已变更:', data.payload);
  }
};
```

## 9. API 版本控制

### 9.1 版本策略

- 在URL中包含版本号: `/api/v1/`
- 向后兼容原则
- 废弃通知机制

### 9.2 版本迁移

```http
# 旧版本 (已废弃)
GET /api/v1/enterprises

# 新版本
GET /api/v2/enterprises
```

## 10. 测试 API

### 10.1 健康检查

```http
GET /health
```

### 10.2 API 文档

```http
GET /docs
```

### 10.3 测试数据

```http
POST /test/seed
Authorization: Bearer {admin_token}
```

## 11. 监控和日志

### 11.1 访问日志

- 记录所有API请求
- 包含请求时间、IP、用户ID、响应时间
- 错误日志单独记录

### 11.2 性能监控

- 响应时间统计
- 错误率监控
- 并发用户数
- 数据库连接数

### 11.3 告警机制

- 错误率超过阈值
- 响应时间过长
- 服务不可用
- 数据库连接异常
