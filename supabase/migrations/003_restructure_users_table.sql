-- 重构用户表以正确关联 auth.users
-- 将认证功能交给 Supabase Auth，业务数据存储在 public.users

-- ========================================
-- 1. 备份现有数据
-- ========================================

-- 创建临时表保存现有数据
CREATE TEMP TABLE users_backup AS 
SELECT * FROM users;

-- ========================================
-- 2. 删除旧的用户表
-- ========================================

-- 删除依赖的视图和函数
DROP VIEW IF EXISTS enterprise_details;
DROP VIEW IF EXISTS review_statistics;

-- 删除触发器
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- 删除表
DROP TABLE IF EXISTS users CASCADE;

-- ========================================
-- 3. 创建新的用户表结构
-- ========================================

-- 用户表 - 存储业务相关的用户信息
CREATE TABLE users (
  -- 主键：使用UUID确保全局唯一性
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 关联到 auth.users 表
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 用户类型：定义用户在系统中的角色和权限
  -- enterprise: 企业用户，可以管理自己的企业信息
  -- admin: 管理员，可以审核企业信息
  -- super_admin: 超级管理员，拥有所有权限
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('enterprise', 'admin', 'super_admin')),
  
  -- 头像URL：用户头像图片的存储地址
  avatar_url TEXT,
  
  -- 用户姓名：分为名和姓，便于国际化
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  
  -- 电话号码：用户联系方式
  phone VARCHAR(20),
  
  -- 时间戳：记录记录的创建和更新时间
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 最后登录时间：用于安全审计和用户活跃度分析
  last_login_at TIMESTAMP WITH TIME ZONE,
  
  -- 创建者：记录用户的创建者，用于审计追踪
  -- 自关联到users表，超级管理员创建管理员，管理员创建企业用户
  created_by UUID REFERENCES users(id),
  
  -- 元数据：存储额外的用户信息，使用JSONB格式便于扩展
  metadata JSONB DEFAULT '{}',
  
  -- 确保一个 auth_user_id 只能对应一个业务用户
  UNIQUE(auth_user_id)
);

-- ========================================
-- 4. 重新创建索引
-- ========================================

-- 用户表索引
CREATE INDEX idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ========================================
-- 5. 重新创建触发器
-- ========================================

-- 为新的用户表添加更新时间戳触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 6. 创建自动同步触发器
-- ========================================

-- 当 auth.users 表有新用户注册时，自动创建对应的业务用户记录
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, user_type, first_name, last_name)
  VALUES (
    NEW.id,
    'enterprise', -- 默认为企业用户类型
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ========================================
-- 7. 重新创建视图
-- ========================================

-- 企业信息视图 - 聚合企业相关的所有信息
CREATE VIEW enterprise_details AS
SELECT
  e.*,
  u.first_name,
  u.last_name,
  au.email as user_email
FROM enterprises e
LEFT JOIN users u ON e.user_id = u.id
LEFT JOIN auth.users au ON u.auth_user_id = au.id;

-- 审核统计视图 - 统计审核员的工作情况
CREATE VIEW review_statistics AS
SELECT
  reviewer_id,
  u.first_name,
  u.last_name,
  au.email as reviewer_email,
  COUNT(*) as total_reviews,
  COUNT(CASE WHEN action = 'approve' THEN 1 END) as approved_count,
  COUNT(CASE WHEN action = 'reject' THEN 1 END) as rejected_count
FROM review_records rr
LEFT JOIN users u ON rr.reviewer_id = u.id
LEFT JOIN auth.users au ON u.auth_user_id = au.id
GROUP BY reviewer_id, u.first_name, u.last_name, au.email;

-- ========================================
-- 8. 更新 RLS 策略
-- ========================================

-- 用户表 RLS - 控制用户数据的访问权限
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 删除现有策略（如果存在）
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Super admins can view all users" ON users;

-- 用户只能查看自己的信息
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth_user_id = auth.uid());

-- 用户只能更新自己的信息
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth_user_id = auth.uid());

-- 超级管理员可以查看所有用户
CREATE POLICY "Super admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_user_id = auth.uid() AND user_type = 'super_admin'
    )
  );

-- 企业表 RLS - 控制企业数据的访问权限
ALTER TABLE enterprises ENABLE ROW LEVEL SECURITY;

-- 删除现有策略（如果存在）
DROP POLICY IF EXISTS "Enterprise users can view own enterprise" ON enterprises;
DROP POLICY IF EXISTS "Enterprise users can update own enterprise" ON enterprises;
DROP POLICY IF EXISTS "Enterprise users can insert own enterprise" ON enterprises;
DROP POLICY IF EXISTS "Admins can update enterprise status" ON enterprises;

-- 企业用户只能查看自己的企业
CREATE POLICY "Enterprise users can view own enterprise" ON enterprises
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_user_id = auth.uid() AND user_type IN ('admin', 'super_admin')
    )
  );

-- 企业用户只能更新自己的企业
CREATE POLICY "Enterprise users can update own enterprise" ON enterprises
  FOR UPDATE USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- 企业用户只能插入自己的企业
CREATE POLICY "Enterprise users can insert own enterprise" ON enterprises
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- Admin 用户可以更新企业状态
CREATE POLICY "Admins can update enterprise status" ON enterprises
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_user_id = auth.uid() AND user_type IN ('admin', 'super_admin')
    )
  );

-- 审核记录表 RLS - 控制审核记录的访问权限
ALTER TABLE review_records ENABLE ROW LEVEL SECURITY;

-- 删除现有策略（如果存在）
DROP POLICY IF EXISTS "Enterprise users can view own review records" ON review_records;
DROP POLICY IF EXISTS "Admins can insert review records" ON review_records;

-- 企业用户只能查看自己企业的审核记录
CREATE POLICY "Enterprise users can view own review records" ON review_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enterprises e
      JOIN users u ON e.user_id = u.id
      WHERE e.id = enterprise_id AND u.auth_user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_user_id = auth.uid() AND user_type IN ('admin', 'super_admin')
    )
  );

-- Admin 用户可以插入审核记录
CREATE POLICY "Admins can insert review records" ON review_records
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_user_id = auth.uid() AND user_type IN ('admin', 'super_admin')
    )
  );

-- ========================================
-- 9. 创建超级管理员（通过 SQL 直接插入）
-- ========================================

-- 注意：这里需要手动在 Supabase Auth 中创建用户
-- 然后通过 SQL 插入业务用户记录

-- 示例：创建超级管理员（需要先通过 Auth API 创建用户）
-- INSERT INTO users (auth_user_id, user_type, first_name, last_name)
-- VALUES (
--   'auth-user-id-here', -- 需要替换为实际的 auth.users 中的 ID
--   'super_admin',
--   '系统',
--   '管理员'
-- );

COMMIT; 