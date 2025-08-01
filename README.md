# 企业管理系统

基于 Supabase 的企业管理系统，包含企业后台和运营管理后台。

## 项目概述

本项目是一个完整的企业管理系统，主要包含两个子系统：

1. **企业后台管理系统** - 面向企业用户
2. **Admin 运营后台** - 面向运营管理人员

## 核心功能

### 企业后台管理系统

- 企业用户注册和登录
- 企业信息管理（一个账户只能管理一个企业）
- 草稿保存和审核提交
- 企业状态跟踪

### Admin 运营后台

- 邀请制登录系统
- 企业信息审核
- 企业状态管理
- 运营数据统计

## 技术栈

### 后端

- **Supabase** - 数据库、认证、实时功能
- **PostgreSQL** - 主数据库
- **Edge Functions** - 服务端逻辑

### 前端

- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **TailwindCSS** - 样式框架
- **Zustand** - 状态管理
- **React Hook Form** - 表单管理

## 项目结构

```
supabase-test/
├── docs/                    # 项目文档
│   ├── requirements.md      # 需求分析
│   ├── database-design.md   # 数据库设计
│   ├── api-design.md        # API设计
│   ├── frontend-arch.md     # 前端架构
│   └── deployment.md        # 部署方案
├── supabase/               # Supabase 配置
│   ├── migrations/         # 数据库迁移
│   ├── functions/          # Edge Functions
│   └── config.toml         # Supabase 配置
├── apps/                   # 前端应用
│   ├── enterprise-admin/   # 企业后台
│   └── admin-panel/        # 运营后台
├── packages/               # 共享包
│   ├── ui/                 # UI 组件库
│   ├── utils/              # 工具函数
│   └── types/              # 类型定义
└── README.md               # 项目说明
```

## 快速开始

### 环境要求

- Node.js 18+
- pnpm 8+
- Supabase CLI
- Git

### 安装步骤

1. 克隆项目

```bash
git clone <repository-url>
cd supabase-admin
```

2. 运行自动设置脚本

```bash
./scripts/setup.sh
```

或者手动执行以下步骤：

```bash
# 安装依赖
pnpm install

# 启动 Supabase 本地开发环境
supabase start

# 应用数据库迁移
supabase db reset

# 生成 TypeScript 类型
supabase gen types typescript --local > packages/types/src/database.ts

# 构建共享包
pnpm --filter @supabase-admin/types build
pnpm --filter @supabase-admin/utils build
pnpm --filter @supabase-admin/ui build
```

3. 配置环境变量

复制 `env.example` 到 `.env.local` 并配置必要的环境变量。

4. 运行开发环境

```bash
pnpm dev
```

### 服务访问

设置完成后，可以访问以下服务：

- **Supabase Studio**: http://localhost:54323
- **API**: http://localhost:54321
- **数据库**: localhost:54322
- **邮件测试**: http://localhost:54324

### 默认管理员凭据

- **Email**: `supabase_admin@admin.com`
- **Password**: `this_password_is_insecure_and_should_be_updated`

## 开发指南

详细的开发指南请参考 `docs/` 目录下的文档：

- [需求分析](./docs/requirements.md)
- [数据库设计](./docs/database-design.md)
- [API设计](./docs/api-design.md)
- [前端架构](./docs/frontend-arch.md)
- [部署方案](./docs/deployment.md)

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
