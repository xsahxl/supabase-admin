# Supabase 配置说明

本目录包含 Supabase 项目的配置文件和数据库迁移。

## 目录结构

```
supabase/
├── config.toml          # Supabase 配置文件
├── migrations/          # 数据库迁移文件
│   ├── 001_initial_schema.sql  # 初始数据库架构
│   └── 002_test_data.sql       # 测试数据
└── functions/           # Edge Functions (待添加)
```

## 快速开始

### 1. 安装 Supabase CLI

```bash
# 使用 npm
npm install -g supabase

# 或使用 Homebrew (macOS)
brew install supabase/tap/supabase
```

### 2. 启动本地开发环境

```bash
# 启动所有服务
supabase start

# 查看服务状态
supabase status
```

### 3. 应用数据库迁移

```bash
# 应用所有迁移
supabase db reset

# 或应用特定迁移
supabase db push
```

### 4. 查看数据库

访问 Supabase Studio: http://localhost:54323

默认凭据:
- Email: `supabase_admin@admin.com`
- Password: `this_password_is_insecure_and_should_be_updated`

## 数据库架构

### 主要表结构

1. **users** - 用户表
   - 支持多种用户类型: enterprise, admin, super_admin
   - 包含认证和基本信息

2. **enterprises** - 企业表
   - 企业基本信息
   - 状态管理: draft, pending, approved, rejected, suspended

3. **enterprise_documents** - 企业证件表
   - 支持多种证件类型
   - 文件上传和验证

4. **enterprise_contacts** - 企业联系人表
   - 多联系人支持
   - 主要联系人标记

5. **review_records** - 审核记录表
   - 审核历史追踪
   - 审核意见和状态变更

### 安全策略

所有表都启用了 Row Level Security (RLS):

- **用户表**: 用户只能访问自己的信息
- **企业表**: 企业用户只能访问自己的企业，管理员可以访问所有
- **审核表**: 企业用户只能查看自己的审核记录，管理员可以管理所有

### 索引优化

- 为常用查询字段创建了索引
- 包含复合索引和部分索引
- 优化了查询性能

## 开发工作流

### 创建新的迁移

```bash
# 创建新的迁移文件
supabase migration new migration_name

# 编辑生成的 SQL 文件
# 然后应用迁移
supabase db push
```

### 数据库变更

1. 创建迁移文件
2. 编写 SQL 语句
3. 测试迁移
4. 提交到版本控制

### 重置数据库

```bash
# 重置数据库并应用所有迁移
supabase db reset

# 重新生成类型
supabase gen types typescript --local > ../packages/types/src/database.ts
```

## 环境变量

复制 `env.example` 到 `.env.local` 并配置以下变量:

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# 数据库配置
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
```

## 测试数据

`002_test_data.sql` 包含测试数据:

- 超级管理员用户
- 审核员用户
- 示例企业数据
- 企业联系人和证件

## 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 停止所有服务
   supabase stop
   
   # 重新启动
   supabase start
   ```

2. **迁移失败**
   ```bash
   # 重置数据库
   supabase db reset
   ```

3. **权限问题**
   ```bash
   # 检查 RLS 策略
   supabase db diff
   ```

### 日志查看

```bash
# 查看 API 日志
supabase logs api

# 查看数据库日志
supabase logs db
```

## 生产部署

### 1. 创建生产项目

```bash
# 创建新的 Supabase 项目
supabase projects create project-name
```

### 2. 链接项目

```bash
# 链接到远程项目
supabase link --project-ref your-project-ref
```

### 3. 部署迁移

```bash
# 推送迁移到生产环境
supabase db push
```

### 4. 部署 Edge Functions

```bash
# 部署所有函数
supabase functions deploy
```

## 监控和维护

### 数据库监控

- 使用 Supabase Dashboard 监控性能
- 定期检查慢查询
- 监控存储使用情况

### 备份策略

- 启用自动备份
- 定期测试恢复流程
- 监控备份状态

## 相关文档

- [Supabase 官方文档](https://supabase.com/docs)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) 