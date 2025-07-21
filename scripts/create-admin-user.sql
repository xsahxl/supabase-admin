-- 创建管理员用户的 SQL 脚本
-- 直接插入到 auth.users 表，触发器会自动同步到 users 表

-- 1. 插入到 auth.users 表（如果不存在）
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

-- 2. 手动更新用户类型为超级管理员（因为触发器默认创建为enterprise类型）
UPDATE users 
SET user_type = 'super_admin'
WHERE auth_user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@example.com'
);

-- 3. 验证创建结果
SELECT 
  u.id,
  u.auth_user_id,
  u.user_type,
  u.first_name,
  u.last_name,
  au.email,
  u.created_at
FROM users u
JOIN auth.users au ON u.auth_user_id = au.id
WHERE au.email = 'admin@example.com'; 