# 贡献指南

## 开发环境设置

### 前置要求

- Node.js 18+
- pnpm 8+
- Git

### 安装步骤

1. 克隆项目

```bash
git clone <repository-url>
cd supabase-admin
```

2. 安装依赖

```bash
pnpm install
```

3. 复制环境变量

```bash
cp env.example .env.local
```

4. 配置环境变量
   编辑 `.env.local` 文件，填入相应的配置值。

## 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 配置
- 使用函数式组件和 Hooks
- 遵循 React 最佳实践

### 提交规范

- 使用语义化提交信息
- 提交前自动运行 lint 和 format
- 每个提交只包含一个功能或修复

### 分支策略

- `main`: 主分支，用于生产环境
- `develop`: 开发分支，用于集成测试
- `feature/*`: 功能分支
- `hotfix/*`: 热修复分支

## 开发流程

### 1. 创建功能分支

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### 2. 开发功能

- 编写代码
- 添加测试
- 更新文档

### 3. 提交代码

```bash
git add .
git commit -m "feat: add your feature description"
```

### 4. 推送到远程

```bash
git push origin feature/your-feature-name
```

### 5. 创建 Pull Request

- 在 GitHub 上创建 PR
- 填写 PR 描述
- 等待代码审查

## 测试

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定包的测试
pnpm --filter <package-name> test

# 运行测试并监听变化
pnpm test:watch
```

### 测试覆盖率

```bash
pnpm test:coverage
```

## 构建

### 开发环境

```bash
pnpm dev
```

### 生产构建

```bash
pnpm build
```

## 部署

### 开发环境

```bash
pnpm dev
```

### 测试环境

```bash
pnpm build
pnpm start
```

### 生产环境

通过 CI/CD 自动部署到 Vercel。

## 问题报告

### Bug 报告

1. 使用 GitHub Issues
2. 提供详细的复现步骤
3. 包含错误信息和截图
4. 说明环境信息

### 功能请求

1. 描述功能需求
2. 说明使用场景
3. 提供设计建议

## 代码审查

### 审查要点

- 代码质量和可读性
- 功能完整性
- 测试覆盖率
- 性能影响
- 安全性考虑

### 审查流程

1. 自动检查 (CI/CD)
2. 代码审查
3. 测试验证
4. 合并到主分支

## 发布流程

### 版本管理

- 使用语义化版本号
- 更新 CHANGELOG.md
- 创建 Git 标签

### 发布步骤

1. 更新版本号
2. 更新 CHANGELOG
3. 创建发布分支
4. 运行测试
5. 合并到 main
6. 创建 Git 标签
7. 部署到生产环境

## 联系方式

如有问题，请通过以下方式联系：

- GitHub Issues
- 项目讨论区
- 邮件联系
