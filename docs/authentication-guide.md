# 认证系统使用指南

## 概述

本系统使用 Supabase Auth 进行用户认证，并将业务数据存储在 `public.users` 表中。

## 架构设计

### 1. 表结构关系

```
auth.users (Supabase 内置)
├── id (UUID) - 认证用户ID
├── email (VARCHAR) - 用户邮箱
├── encrypted_password (VARCHAR) - 加密密码
└── raw_user_meta_data (JSONB) - 用户元数据

public.users (业务表)
├── id (UUID) - 业务用户ID
├── auth_user_id (UUID) - 关联到 auth.users.id
├── user_type (VARCHAR) - 用户类型
├── first_name (VARCHAR) - 名字
├── last_name (VARCHAR) - 姓氏
└── ... (其他业务字段)
```

### 2. 认证流程

1. **用户注册**：通过 Supabase Auth 注册
2. **自动创建业务记录**：触发器自动在 `public.users` 创建记录
3. **用户登录**：通过 Supabase Auth 登录
4. **获取业务信息**：根据 `auth_user_id` 获取业务数据

## 使用方法

### 1. 安装依赖

```bash
# 安装 Supabase 客户端
npm install @supabase/supabase-js
```

### 2. 环境配置

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 创建管理员用户

#### 方法一：通过 Supabase 控制台

1. **创建认证用户**：
   - 打开 Supabase 控制台
   - 进入 Authentication > Users
   - 点击 "Add User"
   - 填写邮箱（如：`admin@example.com`）和密码
   - 确认邮箱（如果需要）

2. **创建业务用户记录**：
   - 进入 SQL Editor
   - 执行以下 SQL：

```sql
-- 查看刚创建的认证用户
SELECT id, email, created_at FROM auth.users WHERE email = 'admin@example.com';

-- 创建超级管理员业务记录
INSERT INTO users (auth_user_id, user_type, first_name, last_name)
SELECT 
  id as auth_user_id,
  'super_admin' as user_type,
  '系统' as first_name,
  '管理员' as last_name
FROM auth.users 
WHERE email = 'admin@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM users WHERE auth_user_id = auth.users.id
  );

-- 验证创建结果
SELECT 
  u.user_type,
  u.first_name,
  u.last_name,
  au.email
FROM users u
JOIN auth.users au ON u.auth_user_id = au.id
WHERE au.email = 'admin@example.com';
```

#### 方法二：通过 API 创建

```typescript
import { supabase } from '@supabase-admin/utils/auth-client';

// 创建管理员用户
const createAdmin = async (email: string, password: string) => {
  // 1. 创建认证用户
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) throw authError;

  // 2. 创建业务用户记录
  const { error: userError } = await supabase
    .from('users')
    .insert({
      auth_user_id: authData.user.id,
      user_type: 'super_admin',
      first_name: '系统',
      last_name: '管理员',
    });

  if (userError) throw userError;
};
```

### 4. 前端登录实现

```typescript
import { signIn, getCurrentUser } from '@supabase-admin/utils/auth-client';

// 登录
const handleLogin = async (email: string, password: string) => {
  try {
    const result = await signIn(email, password);
    
    // 检查权限
    if (result.userProfile?.user_type === 'super_admin' || 
        result.userProfile?.user_type === 'admin') {
      // 登录成功，跳转到管理后台
      router.push('/admin/dashboard');
    } else {
      alert('您没有访问管理后台的权限');
    }
  } catch (error) {
    console.error('登录失败:', error);
  }
};

// 获取当前用户
const getCurrentUserInfo = async () => {
  const userData = await getCurrentUser();
  if (userData) {
    console.log('当前用户:', userData.userProfile);
  }
};
```

### 5. 权限控制

```typescript
import { checkUserPermission } from '@supabase-admin/utils/auth-client';

// 检查管理员权限
const isAdmin = checkUserPermission(userProfile, 'admin');

// 检查超级管理员权限
const isSuperAdmin = checkUserPermission(userProfile, 'super_admin');
```

## 安全策略

### 1. Row Level Security (RLS)

所有表都启用了 RLS，确保用户只能访问自己的数据：

- **用户表**：用户只能查看/更新自己的信息
- **企业表**：企业用户只能管理自己的企业
- **审核记录表**：企业用户只能查看自己企业的审核记录

### 2. 权限级别

```typescript
const permissionLevels = {
  'enterprise': 1,    // 企业用户
  'admin': 2,         // 管理员
  'super_admin': 3,   // 超级管理员
};
```

### 3. 自动同步

当用户在 `auth.users` 中注册时，触发器会自动在 `public.users` 中创建对应的业务记录。

## 常见问题

### Q: 如何修改用户类型？

```sql
-- 将用户升级为管理员
UPDATE users 
SET user_type = 'admin' 
WHERE auth_user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
```

### Q: 如何删除用户？

```sql
-- 删除业务用户记录（auth.users 会自动删除）
DELETE FROM users WHERE auth_user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
```

### Q: 如何重置密码？

通过 Supabase Auth 的密码重置功能，无需手动处理。

## 最佳实践

1. **始终使用 Supabase Auth 进行认证**
2. **通过 `auth_user_id` 关联两个表**
3. **使用 RLS 策略保护数据安全**
4. **在应用层检查用户权限**
5. **定期备份用户数据** 