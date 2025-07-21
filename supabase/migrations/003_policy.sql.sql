alter table "public"."enterprises" enable row level security;

alter table "public"."users" enable row level security;

-- 普通用户只能访问自己的
CREATE POLICY "Users can view their own data"
ON public.enterprises
FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'role' = 'user' AND user_id = auth.uid())
);

-- 超级管理员可以访问所有
CREATE POLICY "Super admin can view all data"
ON public.enterprises
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'super_admin'
);



