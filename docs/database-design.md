# 数据库设计文档

## 1. 数据库概述

### 1.1 设计原则

- 遵循第三范式，避免数据冗余
- 使用 UUID 作为主键，提高安全性
- 实施 Row Level Security (RLS) 策略
- 建立完善的索引策略
- 记录所有重要操作的时间戳

### 1.2 数据库版本

- PostgreSQL 15+
- Supabase 扩展支持

## 2. 表结构设计

### 2.1 用户相关表

#### 2.1.1 users (用户表)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'admin', 'super_admin')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  email_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id),
  metadata JSONB DEFAULT '{}'
);

-- 索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### 2.1.2 user_profiles (用户档案表)

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  job_title VARCHAR(100),
  department VARCHAR(100),
  bio TEXT,
  website VARCHAR(255),
  location VARCHAR(255),
  timezone VARCHAR(50),
  language VARCHAR(10) DEFAULT 'zh-CN',
  notification_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 索引
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
```

### 2.2 企业相关表

#### 2.2.1 enterprises (企业表)

```sql
CREATE TABLE enterprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  industry VARCHAR(100),
  founded_date DATE,
  registered_capital DECIMAL(15,2),
  business_scope TEXT,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'suspended')),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES users(id),
  metadata JSONB DEFAULT '{}',
  UNIQUE(auth_user_id)
);

-- 索引
CREATE INDEX idx_enterprises_auth_user_id ON enterprises(auth_user_id);
CREATE INDEX idx_enterprises_status ON enterprises(status);
CREATE INDEX idx_enterprises_created_at ON enterprises(created_at);
CREATE INDEX idx_enterprises_name ON enterprises(name);
```

#### 2.2.2 enterprise_documents (企业证件表)

```sql
CREATE TABLE enterprise_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_enterprise_documents_enterprise_id ON enterprise_documents(enterprise_id);
CREATE INDEX idx_enterprise_documents_type ON enterprise_documents(document_type);
```

#### 2.2.3 enterprise_contacts (企业联系人表)

```sql
CREATE TABLE enterprise_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  position VARCHAR(100),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_enterprise_contacts_enterprise_id ON enterprise_contacts(enterprise_id);
```

### 2.3 审核相关表

#### 2.3.1 review_records (审核记录表)

```sql
CREATE TABLE review_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(20) NOT NULL CHECK (action IN ('approve', 'reject', 'suspend')),
  status_before VARCHAR(20) NOT NULL,
  status_after VARCHAR(20) NOT NULL,
  comments TEXT,
  review_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_review_records_enterprise_id ON review_records(enterprise_id);
CREATE INDEX idx_review_records_reviewer_id ON review_records(reviewer_id);
CREATE INDEX idx_review_records_created_at ON review_records(created_at);
```

#### 2.3.2 review_templates (审核模板表)

```sql
CREATE TABLE review_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_review_templates_is_active ON review_templates(is_active);
```

### 2.4 邀请相关表

#### 2.4.1 invitations (邀请表)

```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  invited_by UUID NOT NULL REFERENCES users(id),
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'super_admin')),
  token VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  accepted_by UUID REFERENCES users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_status ON invitations(status);
CREATE INDEX idx_invitations_expires_at ON invitations(expires_at);
```

### 2.5 日志相关表

#### 2.5.1 audit_logs (审计日志表)

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

#### 2.5.2 login_logs (登录日志表)

```sql
CREATE TABLE login_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason VARCHAR(255)
);

-- 索引
CREATE INDEX idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX idx_login_logs_login_at ON login_logs(login_at);
CREATE INDEX idx_login_logs_success ON login_logs(success);
```

### 2.6 系统配置表

#### 2.6.1 system_settings (系统设置表)

```sql
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_system_settings_key ON system_settings(key);
```

## 3. 视图设计

### 3.1 企业信息视图

```sql
CREATE VIEW enterprise_details AS
SELECT
  e.*,
  u.email as user_email,
  u.first_name,
  u.last_name,
  up.company_name as user_company,
  COUNT(ed.id) as document_count,
  COUNT(ec.id) as contact_count
FROM enterprises e
LEFT JOIN users u ON e.auth_user_id = u.auth_user_id
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN enterprise_documents ed ON e.id = ed.enterprise_id
LEFT JOIN enterprise_contacts ec ON e.id = ec.enterprise_id
GROUP BY e.id, u.email, u.first_name, u.last_name, up.company_name;
```

### 3.2 审核统计视图

```sql
CREATE VIEW review_statistics AS
SELECT
  reviewer_id,
  u.email as reviewer_email,
  COUNT(*) as total_reviews,
  COUNT(CASE WHEN action = 'approve' THEN 1 END) as approved_count,
  COUNT(CASE WHEN action = 'reject' THEN 1 END) as rejected_count,
  AVG(EXTRACT(EPOCH FROM (created_at - LAG(created_at) OVER (PARTITION BY reviewer_id ORDER BY created_at)))) as avg_review_time_seconds
FROM review_records rr
LEFT JOIN users u ON rr.reviewer_id = u.id
GROUP BY reviewer_id, u.email;
```

## 4. 存储过程

### 4.1 企业状态更新存储过程

```sql
CREATE OR REPLACE FUNCTION update_enterprise_status(
  p_enterprise_id UUID,
  p_new_status VARCHAR(20),
  p_reviewer_id UUID,
  p_comments TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_old_status VARCHAR(20);
BEGIN
  -- 获取当前状态
  SELECT status INTO v_old_status
  FROM enterprises
  WHERE id = p_enterprise_id;

  -- 更新企业状态
  UPDATE enterprises
  SET
    status = p_new_status,
    updated_at = NOW(),
    approved_at = CASE WHEN p_new_status = 'approved' THEN NOW() ELSE approved_at END,
    approved_by = CASE WHEN p_new_status = 'approved' THEN p_reviewer_id ELSE approved_by END
  WHERE id = p_enterprise_id;

  -- 记录审核记录
  INSERT INTO review_records (
    enterprise_id,
    reviewer_id,
    action,
    status_before,
    status_after,
    comments
  ) VALUES (
    p_enterprise_id,
    p_reviewer_id,
    CASE
      WHEN p_new_status = 'approved' THEN 'approve'
      WHEN p_new_status = 'rejected' THEN 'reject'
      WHEN p_new_status = 'suspended' THEN 'suspend'
    END,
    v_old_status,
    p_new_status,
    p_comments
  );
END;
$$ LANGUAGE plpgsql;
```

### 4.2 邀请过期清理存储过程

```sql
CREATE OR REPLACE FUNCTION cleanup_expired_invitations()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE invitations
  SET status = 'expired'
  WHERE status = 'pending' AND expires_at < NOW();

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;
```

## 5. 触发器

### 5.1 更新时间戳触发器

```sql
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
CREATE TRIGGER update_enterprise_documents_updated_at BEFORE UPDATE ON enterprise_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enterprise_contacts_updated_at BEFORE UPDATE ON enterprise_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_review_templates_updated_at BEFORE UPDATE ON review_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invitations_updated_at BEFORE UPDATE ON invitations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5.2 审计日志触发器

```sql
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values)
    VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values)
    VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 为重要表添加审计触发器
CREATE TRIGGER audit_enterprises_trigger AFTER INSERT OR UPDATE OR DELETE ON enterprises FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_review_records_trigger AFTER INSERT OR UPDATE OR DELETE ON review_records FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

## 6. Row Level Security (RLS) 策略

### 6.1 用户表 RLS

```sql
-- 启用 RLS
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
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );
```

### 6.2 企业表 RLS

```sql
-- 启用 RLS
ALTER TABLE enterprises ENABLE ROW LEVEL SECURITY;

-- 企业用户只能查看自己的企业
CREATE POLICY "Enterprise users can view own enterprise" ON enterprises
  FOR SELECT USING (
    auth_user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- 企业用户只能更新自己的企业
CREATE POLICY "Enterprise users can update own enterprise" ON enterprises
  FOR UPDATE USING (auth_user_id = auth.uid());

-- 企业用户只能插入自己的企业
CREATE POLICY "Enterprise users can insert own enterprise" ON enterprises
  FOR INSERT WITH CHECK (auth_user_id = auth.uid());

-- Admin 用户可以更新企业状态
CREATE POLICY "Admins can update enterprise status" ON enterprises
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );
```

### 6.3 审核记录表 RLS

```sql
-- 启用 RLS
ALTER TABLE review_records ENABLE ROW LEVEL SECURITY;

-- 企业用户只能查看自己企业的审核记录
CREATE POLICY "Enterprise users can view own review records" ON review_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enterprises
      WHERE id = enterprise_id AND auth_user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Admin 用户可以插入审核记录
CREATE POLICY "Admins can insert review records" ON review_records
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );
```

## 7. 索引优化策略

### 7.1 复合索引

```sql
-- 企业状态和创建时间复合索引
CREATE INDEX idx_enterprises_status_created_at ON enterprises(status, created_at);

-- 审核记录企业ID和创建时间复合索引
CREATE INDEX idx_review_records_enterprise_created ON review_records(enterprise_id, created_at);

-- 用户类型和状态复合索引
CREATE INDEX idx_users_type_status ON users(role, status);
```

### 7.2 部分索引

```sql
-- 只对活跃用户建立索引
CREATE INDEX idx_users_active ON users(email) WHERE status = 'active';

-- 只对待审核企业建立索引
CREATE INDEX idx_enterprises_pending ON enterprises(id) WHERE status = 'pending';
```

## 8. 数据备份策略

### 8.1 自动备份

- 每日全量备份
- 每小时增量备份
- 备份保留 30 天

### 8.2 备份验证

- 定期恢复测试
- 备份完整性检查
- 性能影响监控

## 9. 性能监控

### 9.1 关键指标

- 查询响应时间
- 并发连接数
- 索引使用率
- 表大小增长

### 9.2 监控查询

```sql
-- 慢查询监控
SELECT
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- 表大小监控
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```
