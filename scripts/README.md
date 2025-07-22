# 数据库策略脚本说明

## 概述

本目录包含用于配置数据库Row Level Security (RLS) 策略的SQL脚本。

## 脚本文件

### 1. `1_policy.sql` - 企业表策略
- 为 `enterprises` 表配置RLS策略
- 用户只能查看和管理自己的企业信息
- 超级管理员可以查看所有企业信息

### 2. `2_users_policy.sql` - 用户表策略
- 为 `users` 表配置RLS策略
- 实现用户权限分级管理
- **已优化：移除重复的权限定义**

### 3. `3_test_users_policy.sql` - 策略测试脚本
- 用于验证RLS策略是否正常工作
- 包含测试步骤和示例

## 用户表策略说明

### 策略设计（优化后）

1. **用户只能查看自己的信息**
   - 普通用户只能查看自己的用户信息
   - **优化：移除了重复的super_admin权限（由策略3覆盖）**

2. **用户不能编辑自己的角色信息**
   - 通过策略确保用户不能修改自己的 `role` 字段
   - 即使用户尝试更新，也会被策略阻止

3. **role为user的不可编辑users表**
   - 普通用户只能更新自己的基本信息
   - 不能对其他用户进行任何操作

4. **role为super_admin的可以编辑users表**
   - 超级管理员可以对所有用户进行所有操作
   - 包括查看、创建、更新、删除用户

### 权限层级（优化后）

| 角色 | 查看权限 | 编辑权限 | 管理权限 | 策略覆盖 |
|------|----------|----------|----------|----------|
| user | 自己的信息 | 自己的信息（除role） | 无 | 策略1+2 |
| admin | 所有用户信息 | 无 | 无 | 策略4 |
| super_admin | 所有用户信息 | 所有用户信息 | 所有用户信息 | 策略3（覆盖所有） |

### 策略优化说明

**优化前的问题：**
- 策略1中重复定义了super_admin的SELECT权限
- 策略3已经包含了super_admin的所有权限需求
- 存在重复的子查询，影响性能

**优化后的改进：**
- 移除了策略1中重复的super_admin权限定义
- 策略3统一管理super_admin的所有权限
- 减少了重复的子查询，提高性能
- 策略职责更清晰，避免冲突

### 应用方法

```bash
# 应用企业表策略
docker exec -i supabase_db_supabase-admin psql -U postgres -d postgres < scripts/1_policy.sql

# 应用用户表策略（已优化）
docker exec -i supabase_db_supabase-admin psql -U postgres -d postgres < scripts/2_users_policy.sql

# 测试策略
docker exec -i supabase_db_supabase-admin psql -U postgres -d postgres < scripts/3_test_users_policy.sql
```

### 策略验证

应用策略后，可以通过以下方式验证：

1. **查看策略状态**
```sql
SELECT 
  policyname,
  permissive,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users' 
ORDER BY policyname;
```

2. **查看RLS状态**
```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'users';
```

### 注意事项

1. **策略优先级**
   - 多个策略同时存在时，使用OR逻辑
   - 策略按创建顺序评估
   - **优化后：策略3覆盖super_admin的所有权限**

2. **性能考虑**
   - 策略中的子查询会影响性能
   - **优化后：减少了重复的子查询**
   - 建议在相关字段上创建索引

3. **测试建议**
   - 在生产环境应用前，先在测试环境验证
   - 确保所有用户角色都能正常访问所需数据
   - **优化后：策略更清晰，测试更容易**

4. **故障排除**
   - 如果策略不生效，检查RLS是否启用
   - 检查策略语法是否正确
   - 验证用户认证状态
   - **优化后：策略冲突更少**

## 迁移文件

对应的数据库迁移文件位于 `supabase/migrations/004_users_policy.sql`，可以通过以下命令应用：

```bash
supabase db push
```

## 安全建议

1. **定期审查策略**
   - 定期检查策略是否符合业务需求
   - 移除不再需要的策略
   - **优化后：策略更清晰，审查更容易**

2. **监控访问日志**
   - 监控数据库访问日志
   - 及时发现异常访问

3. **备份策略配置**
   - 定期备份策略配置
   - 确保可以快速恢复

4. **文档维护**
   - 及时更新策略文档
   - 记录策略变更原因
   - **优化后：文档已更新，反映最新策略** 