-- supabase db diff --schema public --file 003_policy.sql 
drop policy "users can view their own data" on "public"."enterprises";

create policy "users can view their own data only"
on "public"."enterprises"
as permissive
for all
to authenticated
using (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND ((users.role)::text = 'super_admin'::text))))));



