# NEW是什么？
_Exported on 2025/7/22 at GMT+8 8:43:22 from Cursor (1.2.2)_

---

**User**

NEW是什么？

---

**Cursor**

在 PostgreSQL 中，`NEW` 是一个特殊的变量，用于在触发器函数中引用正在被插入或更新的行数据。

让我解释一下在你的代码中 `NEW` 的作用：


在你的代码中，`NEW` 出现在两个触发器函数中：

## 1. `update_updated_at_column()` 函数中的 `NEW`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();  -- 这里使用 NEW
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

在这个函数中：
- `NEW` 代表**正在被更新的行数据**
- `NEW.updated_at = NOW()` 意思是：将当前正在更新的行的 `updated_at` 字段设置为当前时间
- 这个触发器在 `BEFORE UPDATE` 时执行，所以 `NEW` 包含更新后的新数据

## 2. `handle_new_user()` 函数中的 `NEW`

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, role, first_name, last_name)
  VALUES (
    NEW.id,  -- 这里使用 NEW
    'user',
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

在这个函数中：
- `NEW` 代表**刚刚插入到 `auth.users` 表的新行数据**
- `NEW.id` 是刚插入的用户的 ID
- `NEW.raw_user_meta_data` 是用户的元数据
- 这个触发器在 `AFTER INSERT` 时执行，所以 `NEW` 包含刚插入的数据

## 总结

`NEW` 是 PostgreSQL 触发器中的特殊变量：
- **在 INSERT 触发器中**：`NEW` 包含即将插入或刚插入的新行数据
- **在 UPDATE 触发器中**：`NEW` 包含更新后的新数据，`OLD` 包含更新前的旧数据
- **在 DELETE 触发器中**：没有 `NEW`，只有 `OLD` 包含即将删除的数据

你的代码中第277行的 `NEW.id` 就是在获取刚插入到 `auth.users` 表的用户ID，用于在 `public.users` 表中创建对应的业务用户记录。

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();  -- 这里使用 NEW
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, role, first_name, last_name)
  VALUES (
    NEW.id,  -- 这里使用 NEW
    'user',
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```


在 Supabase/Postgres RLS 策略中，USING 和 WITH CHECK 的作用不同：
USING：决定“谁可以操作哪些行”。比如：auth_user_id = auth.uid()，表示用户只能操作自己的数据。
WITH CHECK：决定“用户能把数据改成什么样”。比如：防止用户把自己的 role 改成 super_admin。
对于“不能编辑角色”这个需求：
USING 只需要判断用户是不是在操作自己的行（auth_user_id = auth.uid()），不需要判断 role 字段。
WITH CHECK 才需要判断 role 字段，防止用户修改自己的角色。
总结：
USING 只管“能不能操作这行”。
WITH CHECK 才管“能不能把这行改成什么样”。
