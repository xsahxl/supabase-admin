-- supabase db diff --schema public --file 003_policy.sql 
-- docker exec -i supabase_db_supabase-admin psql -U postgres -d postgres < scripts/1_policy.sql 
-- enterprises表 开启策略
ALTER TABLE public.enterprises ENABLE ROW LEVEL SECURITY;
drop policy "users can view their own data only" on "public"."enterprises";


create policy "users can view their own data only"
on "public"."enterprises"
as permissive
for all
to authenticated
using (
  user_id = auth.uid()
  OR auth.uid() IN (SELECT auth_user_id FROM users WHERE role = 'super_admin')
)



