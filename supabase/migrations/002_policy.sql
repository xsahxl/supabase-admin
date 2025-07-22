-- supabase db diff --schema public --file 003_policy.sql 
-- docker exec -i supabase_db_supabase-admin psql -U postgres -d postgres < supabase/migrations/003_policy.sql 

-- 创建检查超级管理员权限的函数
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE auth_user_id = auth.uid() 
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- enterprises表 开启策略
ALTER TABLE public.enterprises ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users can view their own data only" ON public.enterprises;


CREATE POLICY "users can view their own data only"
ON public.enterprises
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
  auth_user_id = auth.uid()
  OR is_super_admin()
);

-- ========================================
-- users表 RLS策略
-- ========================================

-- 启用users表的RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 删除可能存在的旧策略
DROP POLICY IF EXISTS "users can view own profile" ON public.users;
DROP POLICY IF EXISTS "super_admin can manage all users" ON public.users;

-- 策略1: 用户只能查看自己的信息
CREATE POLICY "users can view own profile" 
ON public.users
AS PERMISSIVE
FOR SELECT 
TO authenticated
USING (
  auth_user_id = auth.uid()
);


-- 策略2: 超级管理员可以管理所有用户
CREATE POLICY "super_admin can manage all users" 
ON public.users
AS PERMISSIVE
FOR ALL 
TO authenticated
USING (
  is_super_admin()
)
WITH CHECK (
  is_super_admin()
);