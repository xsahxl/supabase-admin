-- 使用 PostgreSQL 内置函数生成密码哈希
-- 方法一：使用 pgcrypto 扩展的 crypt 函数

-- 确保 pgcrypto 扩展已启用
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 生成密码哈希的 SQL 语句
-- 这里使用 SHA-256 哈希，生产环境建议使用更安全的算法

-- 查看当前管理员密码哈希
SELECT 
  email,
  password_hash,
  '当前哈希值' as status
FROM users 
WHERE email = 'admin@example.com';

-- 生成新的密码哈希（密码：admin123）
-- 使用 encode 和 digest 函数生成 SHA-256 哈希
UPDATE users 
SET password_hash = encode(digest('admin123' || 'supabase-salt-2024', 'sha256'), 'hex')
WHERE email = 'admin@example.com';

-- 验证更新结果
SELECT 
  email,
  password_hash,
  '更新后哈希值' as status
FROM users 
WHERE email = 'admin@example.com';

-- 验证密码的函数（可以在应用层使用）
CREATE OR REPLACE FUNCTION verify_password(
  input_password TEXT,
  stored_hash TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  -- 使用相同的盐值生成哈希并比较
  RETURN encode(digest(input_password || 'supabase-salt-2024', 'sha256'), 'hex') = stored_hash;
END;
$$ LANGUAGE plpgsql;

-- 测试密码验证函数
SELECT 
  'admin123' as test_password,
  verify_password('admin123', password_hash) as is_valid,
  '密码验证测试' as test_type
FROM users 
WHERE email = 'admin@example.com';

COMMIT; 