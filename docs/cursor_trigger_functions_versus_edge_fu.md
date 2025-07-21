# Trigger functions versus edge functions
_Exported on 2025/7/21 at GMT+8 12:54:54 from Cursor (1.2.2)_

---

**User**

trigger vs edge function

---

**Cursor**

我来为您详细解释 Supabase 中 Trigger 和 Edge Function 的区别和使用场景。


## Supabase Trigger vs Edge Function 对比

### 1. 基本概念

**Database Triggers（数据库触发器）**
- 在数据库层面执行，与数据变更紧密耦合
- 使用 SQL/PL/pgSQL 编写
- 在事务中执行，确保数据一致性

**Edge Functions（边缘函数）**
- 在应用层面执行，可以调用外部 API
- 使用 TypeScript/JavaScript 编写
- 独立于数据库事务执行

### 2. 执行环境对比

| 特性 | Database Triggers | Edge Functions |
|------|------------------|----------------|
| 执行环境 | PostgreSQL 数据库 | Deno 运行时 |
| 编程语言 | SQL/PL/pgSQL | TypeScript/JavaScript |
| 执行时机 | 数据变更时立即执行 | 可配置执行时机 |
| 事务性 | 在数据库事务中执行 | 独立执行 |
| 性能 | 极高（微秒级） | 较高（毫秒级） |

### 3. 使用场景对比

**Database Triggers 适用场景：**
- 数据完整性约束
- 自动计算字段
- 审计日志记录
- 数据同步
- 自动更新时间戳

**Edge Functions 适用场景：**
- 调用外部 API
- 发送邮件/短信通知
- 复杂的业务逻辑处理
- 数据转换和格式化
- 第三方服务集成

### 4. 代码示例对比

**Database Trigger 示例（当前项目中的使用）：**

```sql
-- 自动更新时间戳触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 用户注册时自动创建业务用户
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, user_type, first_name, last_name)
  VALUES (
    NEW.id,
    'enterprise',
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Edge Function 示例：**

```typescript
// 企业审核通过后发送通知
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { enterprise_id, action, reviewer_email } = await req.json()
  
  if (action === 'approve') {
    // 发送邮件通知
    await sendApprovalEmail(enterprise_id, reviewer_email)
    
    // 调用外部 API
    await notifyExternalService(enterprise_id)
  }
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})

async function sendApprovalEmail(enterpriseId: string, reviewerEmail: string) {
  // 邮件发送逻辑
}

async function notifyExternalService(enterpriseId: string) {
  // 外部服务调用逻辑
}
```

### 5. 性能考虑

**Database Triggers:**
- ✅ 执行速度极快（微秒级）
- ✅ 在事务中执行，保证数据一致性
- ✅ 资源消耗低
- ❌ 无法调用外部服务
- ❌ 复杂业务逻辑处理能力有限

**Edge Functions:**
- ✅ 可以调用外部 API
- ✅ 支持复杂的业务逻辑
- ✅ 可以发送通知
- ❌ 执行延迟较高（毫秒级）
- ❌ 独立于数据库事务

### 6. 最佳实践建议

**何时使用 Database Triggers：**
1. 数据完整性约束
2. 自动计算字段（如更新时间戳）
3. 审计日志记录
4. 数据同步和复制
5. 简单的数据转换

**何时使用 Edge Functions：**
1. 需要调用外部 API
2. 发送邮件/短信通知
3. 复杂的业务逻辑处理
4. 数据格式转换
5. 第三方服务集成

### 7. 在当前项目中的应用建议

基于您的项目结构，建议：

**继续使用 Database Triggers 的场景：**
- ✅ 自动更新时间戳（已实现）
- ✅ 用户注册时创建业务用户（已实现）
- ✅ 企业状态变更时的审计日志

**考虑使用 Edge Functions 的场景：**
- �� 企业审核通过后发送邮件通知
- 📧 用户注册后发送欢迎邮件
- 🔗 企业信息变更后同步到外部系统
- �� 生成复杂的统计报告

### 8. 混合使用策略

最佳实践是结合使用两者：

```sql
-- 在触发器中调用 Edge Function
CREATE OR REPLACE FUNCTION notify_enterprise_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新企业状态
  UPDATE enterprises SET status = 'approved' WHERE id = NEW.enterprise_id;
  
  -- 通过 Edge Function 发送通知
  PERFORM net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/notify-approval',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer your-anon-key"}',
    body := json_build_object('enterprise_id', NEW.enterprise_id, 'action', NEW.action)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

这样既保证了数据操作的性能，又能实现复杂的业务逻辑和外部服务调用。

```sql
-- 自动更新时间戳触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 用户注册时自动创建业务用户
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, user_type, first_name, last_name)
  VALUES (
    NEW.id,
    'enterprise',
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

```typescript
// 企业审核通过后发送通知
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { enterprise_id, action, reviewer_email } = await req.json()
  
  if (action === 'approve') {
    // 发送邮件通知
    await sendApprovalEmail(enterprise_id, reviewer_email)
    
    // 调用外部 API
    await notifyExternalService(enterprise_id)
  }
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})

async function sendApprovalEmail(enterpriseId: string, reviewerEmail: string) {
  // 邮件发送逻辑
}

async function notifyExternalService(enterpriseId: string) {
  // 外部服务调用逻辑
}
```

```sql
-- 在触发器中调用 Edge Function
CREATE OR REPLACE FUNCTION notify_enterprise_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新企业状态
  UPDATE enterprises SET status = 'approved' WHERE id = NEW.enterprise_id;
  
  -- 通过 Edge Function 发送通知
  PERFORM net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/notify-approval',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer your-anon-key"}',
    body := json_build_object('enterprise_id', NEW.enterprise_id, 'action', NEW.action)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

