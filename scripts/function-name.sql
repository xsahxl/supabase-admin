-- 查看函数的完整定义
SELECT 
    p.proname as function_name,
    p.prosrc as source_code
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'