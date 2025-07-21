# 部署方案文档

## 1. 部署架构概述

### 1.1 整体架构
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   企业后台      │    │   Admin后台     │    │   Supabase      │
│   (Vercel)      │◄──►│   (Vercel)      │◄──►│   (Cloud)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   监控服务      │
                       │   (Sentry)      │
                       └─────────────────┘
```

### 1.2 技术栈
- **前端部署**: Vercel
- **后端服务**: Supabase
- **数据库**: PostgreSQL (Supabase)
- **文件存储**: Supabase Storage
- **CDN**: Vercel Edge Network
- **监控**: Sentry
- **域名**: Cloudflare

## 2. 环境配置

### 2.1 开发环境
```bash
# .env.development
NEXT_PUBLIC_API_URL=http://localhost:54321/rest/v1
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
NEXTAUTH_SECRET=your-dev-secret
NEXTAUTH_URL=http://localhost:3000
```

### 2.2 测试环境
```bash
# .env.staging
NEXT_PUBLIC_API_URL=https://your-staging-project.supabase.co/rest/v1
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key
NEXTAUTH_SECRET=your-staging-secret
NEXTAUTH_URL=https://staging.yourapp.com
```

### 2.3 生产环境
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://your-production-project.supabase.co/rest/v1
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://yourapp.com
```

## 3. Supabase 配置

### 3.1 项目创建
```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录 Supabase
supabase login

# 创建新项目
supabase projects create your-project-name

# 初始化本地项目
supabase init
```

### 3.2 数据库迁移
```bash
# 创建迁移文件
supabase migration new create_initial_schema

# 应用迁移
supabase db push

# 生成类型
supabase gen types typescript --local > types/database.ts
```

### 3.3 环境变量配置
```bash
# 设置环境变量
supabase secrets set SUPABASE_URL=your-project-url
supabase secrets set SUPABASE_ANON_KEY=your-anon-key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3.4 Edge Functions 部署
```bash
# 部署所有函数
supabase functions deploy

# 部署单个函数
supabase functions deploy auth-callback
```

## 4. Vercel 部署配置

### 4.1 项目配置
```json
// vercel.json
{
  "version": 2,
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "NEXTAUTH_URL": "@nextauth-url"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### 4.2 企业后台部署
```bash
# 部署到 Vercel
vercel --prod

# 或使用 GitHub 集成
# 1. 连接 GitHub 仓库
# 2. 配置环境变量
# 3. 自动部署
```

### 4.3 Admin后台部署
```bash
# 部署到不同的 Vercel 项目
vercel --prod --name admin-panel
```

## 5. 域名和SSL配置

### 5.1 域名配置
```bash
# 企业后台域名
enterprise.yourapp.com

# Admin后台域名
admin.yourapp.com

# API域名
api.yourapp.com
```

### 5.2 SSL证书
- Vercel 自动提供 SSL 证书
- 支持 HTTP/2 和 HTTP/3
- 自动续期

### 5.3 DNS配置
```bash
# A 记录
enterprise.yourapp.com -> Vercel IP
admin.yourapp.com -> Vercel IP

# CNAME 记录
www.yourapp.com -> yourapp.com
```

## 6. 监控和日志

### 6.1 Sentry 配置
```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', 'yourapp.com']
    })
  ]
});
```

### 6.2 错误监控
```typescript
// 捕获未处理的错误
window.addEventListener('error', (event) => {
  Sentry.captureException(event.error);
});

// 捕获未处理的 Promise 拒绝
window.addEventListener('unhandledrejection', (event) => {
  Sentry.captureException(event.reason);
});
```

### 6.3 性能监控
```typescript
// 监控页面加载性能
export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    Sentry.metrics.increment('web_vital', {
      value: metric.value,
      tags: {
        name: metric.name,
        rating: metric.rating
      }
    });
  }
}
```

## 7. 数据库备份策略

### 7.1 自动备份
```sql
-- 创建备份策略
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 每日全量备份
SELECT cron.schedule('daily-backup', '0 2 * * *', 'SELECT pg_dump(...)');

-- 每小时增量备份
SELECT cron.schedule('hourly-backup', '0 * * * *', 'SELECT pg_dump(...)');
```

### 7.2 备份验证
```bash
# 验证备份文件
pg_restore --list backup.dump

# 测试恢复
pg_restore --dry-run backup.dump
```

### 7.3 备份存储
- 本地存储
- 云存储 (AWS S3, Google Cloud Storage)
- 异地备份

## 8. 安全配置

### 8.1 网络安全
```typescript
// 安全头配置
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

### 8.2 环境变量安全
```bash
# 敏感信息加密
NEXTAUTH_SECRET=$(openssl rand -base64 32)
SUPABASE_SERVICE_ROLE_KEY=encrypted-key

# 环境变量验证
if [ -z "$NEXTAUTH_SECRET" ]; then
  echo "Error: NEXTAUTH_SECRET is not set"
  exit 1
fi
```

### 8.3 数据库安全
```sql
-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprises ENABLE ROW LEVEL SECURITY;

-- 创建安全策略
CREATE POLICY "Users can only access own data" ON users
  FOR ALL USING (auth.uid() = id);
```

## 9. 性能优化

### 9.1 CDN配置
```typescript
// 静态资源缓存
const staticCacheHeaders = [
  {
    source: '/static/(.*)',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable'
      }
    ]
  }
];
```

### 9.2 图片优化
```typescript
// Next.js 图片优化
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={60}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 9.3 代码分割
```typescript
// 动态导入
const EnterpriseForm = dynamic(() => import('@/components/EnterpriseForm'), {
  loading: () => <div>加载中...</div>,
  ssr: false
});
```

## 10. 部署流程

### 10.1 自动化部署
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 10.2 部署检查清单
- [ ] 代码审查通过
- [ ] 测试通过
- [ ] 环境变量配置正确
- [ ] 数据库迁移完成
- [ ] 监控配置正确
- [ ] 备份策略验证
- [ ] 安全配置检查

### 10.3 回滚策略
```bash
# 快速回滚到上一个版本
vercel --prod --rollback

# 或指定版本
vercel --prod --rollback-to=deployment-id
```

## 11. 监控和告警

### 11.1 系统监控
```typescript
// 健康检查端点
export async function GET() {
  try {
    // 检查数据库连接
    await supabase.from('users').select('count').limit(1);
    
    // 检查外部服务
    const response = await fetch('https://api.external.com/health');
    
    return Response.json({ status: 'healthy' });
  } catch (error) {
    return Response.json({ status: 'unhealthy', error: error.message }, { status: 500 });
  }
}
```

### 11.2 性能监控
```typescript
// 监控关键指标
const metrics = {
  pageLoadTime: performance.now(),
  apiResponseTime: responseTime,
  errorRate: errorCount / totalRequests,
  userSessions: activeUsers
};

// 发送到监控服务
sendMetrics(metrics);
```

### 11.3 告警配置
```typescript
// 告警规则
const alertRules = {
  errorRate: { threshold: 0.05, duration: '5m' },
  responseTime: { threshold: 2000, duration: '1m' },
  downtime: { threshold: 0, duration: '1m' }
};

// 告警通知
const notifyAlert = (alert: Alert) => {
  // 发送邮件、短信、Slack 通知
};
```

## 12. 灾难恢复

### 12.1 恢复计划
1. **数据恢复**: 从备份恢复数据库
2. **应用恢复**: 重新部署应用
3. **配置恢复**: 恢复环境变量和配置
4. **监控恢复**: 恢复监控和告警系统

### 12.2 恢复时间目标 (RTO)
- 数据恢复: 4小时
- 应用恢复: 1小时
- 完全恢复: 6小时

### 12.3 恢复点目标 (RPO)
- 数据丢失: 1小时
- 配置丢失: 0小时

## 13. 成本优化

### 13.1 资源使用监控
```typescript
// 监控资源使用
const resourceUsage = {
  databaseConnections: activeConnections,
  storageUsage: usedStorage,
  bandwidthUsage: dataTransfer,
  functionExecutions: functionCalls
};
```

### 13.2 成本优化策略
- 使用 CDN 减少带宽成本
- 优化数据库查询减少计算成本
- 使用缓存减少 API 调用
- 定期清理无用数据

### 13.3 预算告警
```typescript
// 设置预算告警
const budgetAlerts = {
  monthly: 1000,
  daily: 50,
  hourly: 5
};

// 监控成本
if (currentCost > budgetAlerts.daily) {
  sendBudgetAlert('Daily budget exceeded');
}
```

## 14. 维护和更新

### 14.1 定期维护
- 每周: 安全更新检查
- 每月: 性能优化检查
- 每季度: 架构审查

### 14.2 更新策略
```bash
# 依赖更新
npm audit fix
npm update

# 数据库更新
supabase db diff
supabase migration new update_schema
supabase db push
```

### 14.3 文档更新
- API 文档更新
- 部署文档更新
- 用户手册更新 