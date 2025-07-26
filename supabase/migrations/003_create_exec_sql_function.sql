-- 创建执行SQL的RPC函数
-- 注意：这个函数需要谨慎使用，因为它可以执行任意SQL

CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- 为service_role用户授予执行权限
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role; 