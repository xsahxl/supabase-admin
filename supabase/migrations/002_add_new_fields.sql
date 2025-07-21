-- 迁移文件：添加新字段
-- 创建时间: 2024-01-02
-- 描述: 为现有表添加新字段，保留原有数据

-- ========================================
-- 示例1：为 users 表添加新字段
-- # 方法1：重置数据库（会删除数据）
-- supabase db reset

-- # 方法2：直接执行 SQL（推荐）
-- docker exec supabase_db_supabase-admin psql -U postgres -d postgres -c "ALTER TABLE users ADD COLUMN nickname VARCHAR(50);"
-- docker exec supabase_db_supabase-admin psql -U postgres -d postgres -c "ALTER TABLE users DROP COLUMN nickname;"
-- ========================================

-- 添加一个简单的可选字段
ALTER TABLE users ADD COLUMN nickname VARCHAR(50);

-- 删除 users 表中的 nickname 字段
ALTER TABLE users DROP COLUMN nickname;