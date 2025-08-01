-- 初始数据库架构迁移
-- 创建时间: 2024-01-01
-- 描述: 创建企业管理系统的基础表结构和安全策略
-- 使用 Supabase Auth 进行认证，业务数据存储在 public.users

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- 用于生成UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- 用于密码加密

-- ========================================
-- 1. 用户相关表
-- ========================================

-- 用户表 - 存储业务相关的用户信息
CREATE TABLE users (
  -- 主键：使用UUID确保全局唯一性
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 关联到 auth.users 表
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 用户类型：定义用户在系统中的角色和权限
  -- user: 普通用户，可以管理自己的企业信息
  -- admin: 管理员，可以审核企业信息
  -- super_admin: 超级管理员，拥有所有权限
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'admin', 'super_admin')),
  
  -- 头像URL：用户头像图片的存储地址
  avatar_url TEXT,
  
  -- 用户邮箱，唯一且必填
  email VARCHAR(255) NOT NULL UNIQUE,
  
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
-- 2. 企业相关表
-- ========================================

-- 企业表 - 存储企业的基本信息
CREATE TABLE enterprises (
  -- 主键
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 用户ID：关联到认证用户，一对一关系
  auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
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
  UNIQUE(auth_user_id)
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
-- 4. 索引创建
-- ========================================

-- 用户表索引
CREATE INDEX idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 企业表索引
CREATE INDEX idx_enterprises_auth_user_id ON enterprises(auth_user_id);
CREATE INDEX idx_enterprises_status ON enterprises(status);
CREATE INDEX idx_enterprises_created_at ON enterprises(created_at);
CREATE INDEX idx_enterprises_name ON enterprises(name);
CREATE INDEX idx_enterprises_status_created_at ON enterprises(status, created_at);
CREATE INDEX idx_enterprises_pending ON enterprises(id) WHERE status = 'pending';

-- 审核记录表索引
CREATE INDEX idx_review_records_enterprise_id ON review_records(enterprise_id);
CREATE INDEX idx_review_records_reviewer_id ON review_records(reviewer_id);
CREATE INDEX idx_review_records_created_at ON review_records(created_at);
CREATE INDEX idx_review_records_enterprise_created ON review_records(enterprise_id, created_at);

-- ========================================
-- 5. 视图创建
-- ========================================

-- 企业信息视图 - 聚合企业相关的所有信息
CREATE VIEW enterprise_details AS
SELECT
  e.*,
  au.email as user_email
FROM enterprises e
LEFT JOIN auth.users au ON e.auth_user_id = au.id;

-- 审核统计视图 - 统计审核员的工作情况
CREATE VIEW review_statistics AS
SELECT
  reviewer_id,
  au.email as reviewer_email,
  COUNT(*) as total_reviews,
  COUNT(CASE WHEN action = 'approve' THEN 1 END) as approved_count,
  COUNT(CASE WHEN action = 'reject' THEN 1 END) as rejected_count
FROM review_records rr
LEFT JOIN auth.users au ON rr.reviewer_id = au.id
GROUP BY reviewer_id, au.email;

-- ========================================
-- 6. 存储过程创建
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
-- 7. 触发器创建
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

-- 当 auth.users 表有新用户注册时，自动创建对应的业务用户记录
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, role, email)
  VALUES (
    NEW.id,
    'user', -- 默认为普通用户类型
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
