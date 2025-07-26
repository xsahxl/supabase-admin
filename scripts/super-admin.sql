-- docker exec -i supabase_db_supabase-admin psql -U postgres -d postgres < scripts/super-admin.sql 
UPDATE users 
SET role = 'super_admin'
WHERE auth_user_id = (SELECT id FROM auth.users WHERE email = 'xsahxl@126.com');