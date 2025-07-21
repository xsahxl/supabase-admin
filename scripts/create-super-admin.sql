-- 创建超级管理员用户的 SQL 脚本
-- 使用 Supabase 标准的认证方式
-- 
-- 执行方法：
-- docker exec -i supabase_db_supabase-admin psql -U postgres -d postgres < scripts/create-super-admin.sql
-- 
-- 或者使用 Supabase Studio:
-- 1. 访问 http://localhost:54323
-- 2. 登录后进入 SQL Editor
-- 3. 复制粘贴此脚本并执行

-- ========================================
-- 1. 确保必要的扩展已启用
-- ========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- 用于生成UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- 用于密码加密

-- ========================================
-- 2. 插入到 auth.users 表（如果不存在）
-- ========================================

INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  raw_user_meta_data
)
SELECT 
  gen_random_uuid() as id,
  (SELECT id FROM auth.instances LIMIT 1) as instance_id,
  'authenticated' as aud,
  'authenticated' as role,
  'admin@example.com' as email,
  crypt('admin123', gen_salt('bf')) as encrypted_password,
  now() as email_confirmed_at,
  now() as created_at,
  now() as updated_at,
  '' as confirmation_token,
  '' as email_change,
  '' as email_change_token_new,
  '' as recovery_token,
  '{"first_name": "系统", "last_name": "管理员"}'::jsonb as raw_user_meta_data
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@example.com'
);

-- ========================================
-- 3. 手动更新用户类型为超级管理员
-- ========================================
-- 触发器会自动创建 users 表记录，但默认为 enterprise 类型
-- 这里手动更新为 super_admin 类型

UPDATE users 
SET role = 'super_admin'
WHERE auth_user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@example.com'
);

-- ========================================
-- 4. 验证创建结果
-- ========================================

SELECT 
  u.id,
  u.auth_user_id,
  u.role,
  u.first_name,
  u.last_name,
  au.email,
  u.created_at,
  '超级管理员创建成功' as status
FROM users u
JOIN auth.users au ON u.auth_user_id = au.id
WHERE au.email = 'admin@example.com';

-- ========================================
-- 5. 显示登录信息
-- ========================================

SELECT 
  'admin@example.com' as email,
  'admin123' as password,
  'super_admin' as user_type,
  '系统 管理员' as display_name,
  '请使用以上凭据登录系统' as note; 