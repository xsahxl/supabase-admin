-- 测试数据迁移
-- 创建时间: 2024-01-01
-- 描述: 插入测试数据用于开发和测试

-- 插入测试用户
INSERT INTO users (id, email, password_hash, user_type, first_name, last_name, email_verified, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@example.com', '$2a$10$example_hash', 'super_admin', '系统', '管理员', true, 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'reviewer@example.com', '$2a$10$example_hash', 'admin', '审核', '员', true, 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'enterprise1@example.com', '$2a$10$example_hash', 'enterprise', '张三', '企业', true, 'active'),
('550e8400-e29b-41d4-a716-446655440004', 'enterprise2@example.com', '$2a$10$example_hash', 'enterprise', '李四', '企业', true, 'active');

-- 插入用户档案
INSERT INTO user_profiles (user_id, company_name, job_title, department) VALUES
('550e8400-e29b-41d4-a716-446655440001', '系统管理', '系统管理员', '技术部'),
('550e8400-e29b-41d4-a716-446655440002', '审核部门', '审核专员', '审核部'),
('550e8400-e29b-41d4-a716-446655440003', '测试企业1', '总经理', '管理部'),
('550e8400-e29b-41d4-a716-446655440004', '测试企业2', '副总经理', '管理部');

-- 插入测试企业
INSERT INTO enterprises (id, user_id, name, type, industry, address, phone, email, status, submitted_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '测试科技有限公司', '有限责任公司', '信息技术', '北京市朝阳区测试路123号', '010-12345678', 'contact@test1.com', 'pending', NOW()),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '示例贸易有限公司', '股份有限公司', '贸易', '上海市浦东新区示例路456号', '021-87654321', 'contact@test2.com', 'draft', NULL);

-- 插入企业联系人
INSERT INTO enterprise_contacts (enterprise_id, name, phone, email, position, is_primary) VALUES
('660e8400-e29b-41d4-a716-446655440001', '张三', '13800138001', 'zhangsan@test1.com', '总经理', true),
('660e8400-e29b-41d4-a716-446655440001', '王五', '13800138002', 'wangwu@test1.com', '财务总监', false),
('660e8400-e29b-41d4-a716-446655440002', '李四', '13800138003', 'lisi@test2.com', '副总经理', true);

-- 插入企业证件
INSERT INTO enterprise_documents (enterprise_id, document_type, document_name, file_url, file_size, mime_type) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'business_license', '营业执照', 'https://example.com/documents/business_license_1.pdf', 1024000, 'application/pdf'),
('660e8400-e29b-41d4-a716-446655440001', 'tax_certificate', '税务登记证', 'https://example.com/documents/tax_certificate_1.pdf', 512000, 'application/pdf'),
('660e8400-e29b-41d4-a716-446655440002', 'business_license', '营业执照', 'https://example.com/documents/business_license_2.pdf', 1024000, 'application/pdf');

-- 插入审核记录
INSERT INTO review_records (enterprise_id, reviewer_id, action, status_before, status_after, comments) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'approve', 'pending', 'approved', '企业信息完整，证件齐全，审核通过');

-- 插入邀请记录
INSERT INTO invitations (email, invited_by, user_type, token, status, expires_at) VALUES
('newadmin@example.com', '550e8400-e29b-41d4-a716-446655440001', 'admin', 'invite_token_123', 'pending', NOW() + INTERVAL '7 days');

COMMIT; 