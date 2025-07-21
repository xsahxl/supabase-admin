# 企业后台管理系统

基于 Supabase 的企业后台管理系统，提供完整的用户认证和企业信息管理功能。

## 功能特性

### 用户认证系统
- ✅ **用户注册** - 完整的注册流程，包含邮箱验证
- ✅ **密码强度验证** - 实时密码强度检测
- ✅ **用户协议确认** - 注册时必须同意用户协议
- ✅ **用户登录** - 安全的登录系统
- ✅ **记住登录状态** - 可选的记住登录功能
- ✅ **忘记密码** - 邮件重置密码功能
- ✅ **登录日志记录** - 记录用户登录历史

### 用户信息管理
- ✅ **个人信息编辑** - 修改姓名、手机号等信息
- ✅ **密码修改** - 安全的密码修改功能
- ✅ **头像上传** - 支持头像上传和预览
- ✅ **登录设备管理** - 查看登录设备历史

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5.x
- **样式**: TailwindCSS 3.x
- **状态管理**: React Hooks
- **表单处理**: React Hook Form + Zod
- **图标**: Lucide React
- **后端**: Supabase (PostgreSQL + Auth + Storage)

## 快速开始

### 1. 安装依赖

```bash
cd apps/enterprise-admin
pnpm install
```

### 2. 环境配置

创建 `.env.local` 文件并配置以下环境变量：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── auth/             # 认证相关组件
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   └── UserProfileForm.tsx
│   └── ui/               # UI 基础组件
│       ├── Button.tsx
│       └── Input.tsx
└── lib/                  # 工具函数
    ├── auth.ts           # 认证相关函数
    ├── validation.ts     # 表单验证
    └── utils.ts          # 通用工具函数
```

## 功能说明

### 用户注册
- 支持邮箱注册
- 实时密码强度检测
- 用户协议确认
- 邮箱验证流程

### 用户登录
- 邮箱密码登录
- 记住登录状态
- 忘记密码功能
- 登录日志记录

### 用户信息管理
- 个人信息编辑
- 密码修改
- 头像上传
- 登录设备查看

## 安全特性

- 密码强度验证
- 邮箱验证
- 登录日志记录
- 安全的密码重置流程
- 用户协议确认

## 开发指南

### 添加新组件

1. 在 `src/components/` 下创建新组件
2. 使用 TypeScript 和 TailwindCSS
3. 遵循现有的组件结构

### 添加新功能

1. 在 `src/lib/` 下添加相关工具函数
2. 在 `src/lib/validation.ts` 中添加表单验证
3. 创建对应的 React 组件

## 部署

### Vercel 部署

1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署

### 其他平台

支持部署到任何支持 Next.js 的平台。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License 