-- 初始数据库架构迁移
-- 创建时间: 2024-01-01
-- 描述: 创建企业管理系统的基础表结构和安全策略

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- 用于生成UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- 用于密码加密

-- ========================================
-- 1. 用户相关表
-- ========================================

-- 用户表 - 存储系统所有用户的基本信息
CREATE TABLE users (
  -- 主键：使用UUID确保全局唯一性，避免ID冲突
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 邮箱：用户登录凭证，全局唯一
  email VARCHAR(255) UNIQUE NOT NULL,
  
  -- 密码哈希：存储加密后的密码，不存储明文
  password_hash VARCHAR(255) NOT NULL,
  
  -- 用户类型：定义用户在系统中的角色和权限
  -- enterprise: 企业用户，可以管理自己的企业信息
  -- admin: 管理员，可以审核企业信息
  -- super_admin: 超级管理员，拥有所有权限
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('enterprise', 'admin', 'super_admin')),
  
  
  -- 邮箱验证状态：标识用户邮箱是否已验证
  email_verified BOOLEAN DEFAULT FALSE,
  
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
  metadata JSONB DEFAULT '{}'
);



-- ========================================
-- 2. 企业相关表
-- ========================================

-- 企业表 - 存储企业的基本信息
CREATE TABLE enterprises (
  -- 主键
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 用户ID：关联到users表，一对一关系
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- 企业名称：企业的正式名称
  name VARCHAR(255) NOT NULL,
  
  -- 企业类型：企业的法律类型
  type VARCHAR(100) NOT NULL,
  
  -- 所属行业：企业的主要业务领域
  industry VARCHAR(100),
  
  -- 成立日期：企业的成立时间
  founded_date DATE,
  
  -- 注册资本：企业的注册资本金额
  registered_capital DECIMAL(15,2),
  
  -- 经营范围：企业的主要业务范围
  business_scope TEXT,
  
  -- 企业地址：企业的注册地址
  address TEXT NOT NULL,
  
  -- 联系电话：企业的联系电话
  phone VARCHAR(20),
  
  -- 企业邮箱：企业的联系邮箱
  email VARCHAR(255),
  
  -- 企业网站：企业的官方网站
  website VARCHAR(255),
  
  -- 企业描述：企业的详细介绍
  description TEXT,
  
  -- 审核状态：企业的审核状态
  -- draft: 草稿状态，企业信息未提交审核
  -- pending: 待审核状态，已提交等待审核
  -- approved: 已通过状态，审核通过可以正常使用
  -- rejected: 已拒绝状态，审核未通过
  -- suspended: 已下架状态，企业被下架无法使用
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'suspended')),
  
  -- 是否公开：控制企业信息是否对外公开
  is_public BOOLEAN DEFAULT FALSE,
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 提交时间：企业信息提交审核的时间
  submitted_at TIMESTAMP WITH TIME ZONE,
  
  -- 审核通过时间：企业审核通过的时间
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- 审核人：审核通过的管理员
  approved_by UUID REFERENCES users(id),
  
  -- 元数据：存储额外的企业信息
  metadata JSONB DEFAULT '{}',
  
  -- 确保一个用户只能有一个企业
  UNIQUE(user_id)
);





-- ========================================
-- 3. 审核相关表
-- ========================================

-- 审核记录表 - 记录企业审核的完整历史
CREATE TABLE review_records (
  -- 主键
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 企业ID：关联到enterprises表，一对多关系
  enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
  
  -- 审核员ID：关联到users表，多对一关系
  reviewer_id UUID NOT NULL REFERENCES users(id),
  
  -- 审核动作：审核员执行的具体动作
  -- approve: 通过审核
  -- reject: 拒绝审核
  -- suspend: 下架企业
  action VARCHAR(20) NOT NULL CHECK (action IN ('approve', 'reject', 'suspend')),
  
  -- 审核意见：审核员的审核意见
  comments TEXT,
  
  -- 审核时间
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- ========================================
-- 4. 邀请相关表
-- ========================================



-- ========================================
-- 5. 日志相关表
-- ========================================





-- ========================================
-- 6. 系统配置表
-- ========================================



-- ========================================
-- 7. 索引创建
-- ========================================

-- 用户表索引
CREATE INDEX idx_users_email ON users(email);                    -- 邮箱查询索引
CREATE INDEX idx_users_user_type ON users(user_type);           -- 用户类型查询索引
CREATE INDEX idx_users_created_at ON users(created_at);         -- 创建时间查询索引



-- 企业表索引
CREATE INDEX idx_enterprises_user_id ON enterprises(user_id);     -- 用户ID查询索引
CREATE INDEX idx_enterprises_status ON enterprises(status);       -- 企业状态查询索引
CREATE INDEX idx_enterprises_created_at ON enterprises(created_at); -- 创建时间查询索引
CREATE INDEX idx_enterprises_name ON enterprises(name);           -- 企业名称查询索引
CREATE INDEX idx_enterprises_status_created_at ON enterprises(status, created_at); -- 状态和创建时间复合索引
CREATE INDEX idx_enterprises_pending ON enterprises(id) WHERE status = 'pending'; -- 待审核企业索引





-- 审核记录表索引
CREATE INDEX idx_review_records_enterprise_id ON review_records(enterprise_id); -- 企业ID查询索引
CREATE INDEX idx_review_records_reviewer_id ON review_records(reviewer_id);     -- 审核员ID查询索引
CREATE INDEX idx_review_records_created_at ON review_records(created_at);       -- 创建时间查询索引
CREATE INDEX idx_review_records_enterprise_created ON review_records(enterprise_id, created_at); -- 企业和创建时间复合索引



-- ========================================
-- 8. 视图创建
-- ========================================

-- 企业信息视图 - 聚合企业相关的所有信息
CREATE VIEW enterprise_details AS
SELECT
  e.*,
  u.email as user_email,                    -- 用户邮箱
  u.first_name,                             -- 用户名字
  u.last_name                               -- 用户姓氏
FROM enterprises e
LEFT JOIN users u ON e.user_id = u.id;

-- 审核统计视图 - 统计审核员的工作情况
CREATE VIEW review_statistics AS
SELECT
  reviewer_id,                              -- 审核员ID
  u.email as reviewer_email,                -- 审核员邮箱
  COUNT(*) as total_reviews,                -- 总审核数量
  COUNT(CASE WHEN action = 'approve' THEN 1 END) as approved_count,    -- 通过数量
  COUNT(CASE WHEN action = 'reject' THEN 1 END) as rejected_count,     -- 拒绝数量
  AVG(review_time_seconds) as avg_review_time_seconds -- 平均审核时间
FROM (
  SELECT 
    reviewer_id,
    action,
    EXTRACT(EPOCH FROM (created_at - LAG(created_at) OVER (PARTITION BY reviewer_id ORDER BY created_at))) as review_time_seconds
  FROM review_records
) rr
LEFT JOIN users u ON rr.reviewer_id = u.id
GROUP BY reviewer_id, u.email;

-- ========================================
-- 9. 存储过程创建
-- ========================================

-- 企业状态更新存储过程 - 统一处理企业状态变更
CREATE OR REPLACE FUNCTION update_enterprise_status(
  p_enterprise_id UUID,                     -- 企业ID参数
  p_action VARCHAR(20),                     -- 审核动作参数
  p_reviewer_id UUID,                       -- 审核员ID参数
  p_comments TEXT DEFAULT NULL              -- 审核意见参数
)
RETURNS VOID AS $$
BEGIN
  -- 更新企业状态
  UPDATE enterprises
  SET
    status = CASE 
      WHEN p_action = 'approve' THEN 'approved'
      WHEN p_action = 'reject' THEN 'rejected'
      WHEN p_action = 'suspend' THEN 'suspended'
    END,
    updated_at = NOW(),
    approved_at = CASE WHEN p_action = 'approve' THEN NOW() ELSE approved_at END,
    approved_by = CASE WHEN p_action = 'approve' THEN p_reviewer_id ELSE approved_by END
  WHERE id = p_enterprise_id;

  -- 记录审核记录
  INSERT INTO review_records (
    enterprise_id,
    reviewer_id,
    action,
    comments
  ) VALUES (
    p_enterprise_id,
    p_reviewer_id,
    p_action,
    p_comments
  );
END;
$$ LANGUAGE plpgsql;



-- ========================================
-- 10. 触发器创建
-- ========================================

-- 更新时间戳触发器函数 - 自动更新updated_at字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为所有表添加更新时间戳触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enterprises_updated_at BEFORE UPDATE ON enterprises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();



-- ========================================
-- 11. Row Level Security (RLS) 策略
-- ========================================

-- 用户表 RLS - 控制用户数据的访问权限
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的信息
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- 用户只能更新自己的信息
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 超级管理员可以查看所有用户
CREATE POLICY "Super admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND user_type = 'super_admin'
    )
  );



-- 企业表 RLS - 控制企业数据的访问权限
ALTER TABLE enterprises ENABLE ROW LEVEL SECURITY;

-- 企业用户只能查看自己的企业
CREATE POLICY "Enterprise users can view own enterprise" ON enterprises
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND user_type IN ('admin', 'super_admin')
    )
  );

-- 企业用户只能更新自己的企业
CREATE POLICY "Enterprise users can update own enterprise" ON enterprises
  FOR UPDATE USING (user_id = auth.uid());

-- 企业用户只能插入自己的企业
CREATE POLICY "Enterprise users can insert own enterprise" ON enterprises
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admin 用户可以更新企业状态
CREATE POLICY "Admins can update enterprise status" ON enterprises
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND user_type IN ('admin', 'super_admin')
    )
  );





-- 审核记录表 RLS - 控制审核记录的访问权限
ALTER TABLE review_records ENABLE ROW LEVEL SECURITY;

-- 企业用户只能查看自己企业的审核记录
CREATE POLICY "Enterprise users can view own review records" ON review_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enterprises
      WHERE id = enterprise_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND user_type IN ('admin', 'super_admin')
    )
  );

-- Admin 用户可以插入审核记录
CREATE POLICY "Admins can insert review records" ON review_records
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND user_type IN ('admin', 'super_admin')
    )
  );



-- ========================================
-- 12. 初始数据插入
-- ========================================

-- 创建超级管理员用户
-- 注意：密码需要在应用层进行哈希处理，这里使用占位符
INSERT INTO users (
  email, 
  password_hash, 
  user_type, 
  first_name, 
  last_name, 
  email_verified,
  created_at
) VALUES (
  'admin@example.com', 
  'temporary_password_hash_placeholder',  -- 需要在应用层替换为真实的哈希密码
  'super_admin', 
  '系统', 
  '管理员', 
  true,
  NOW()
) ON CONFLICT (email) DO NOTHING;  -- 如果邮箱已存在则不插入

COMMIT; 