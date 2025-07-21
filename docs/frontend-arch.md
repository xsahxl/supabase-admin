# 前端架构文档

## 1. 技术栈概述

### 1.1 核心技术
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5.x
- **样式**: TailwindCSS 3.x
- **状态管理**: Zustand 4.x
- **表单处理**: React Hook Form + Zod
- **HTTP客户端**: Axios
- **图标**: Lucide React
- **日期处理**: date-fns
- **工具库**: lodash-es

### 1.2 开发工具
- **包管理**: pnpm
- **代码规范**: ESLint + Prettier
- **类型检查**: TypeScript
- **测试**: Jest + React Testing Library
- **构建工具**: Turbopack
- **部署**: Vercel

## 2. 项目结构

### 2.1 企业后台结构
```
apps/enterprise-admin/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证相关页面
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/       # 主应用页面
│   │   ├── dashboard/
│   │   ├── enterprise/
│   │   ├── documents/
│   │   ├── contacts/
│   │   └── profile/
│   ├── api/               # API 路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # 组件
│   ├── ui/               # 基础UI组件
│   ├── forms/            # 表单组件
│   ├── layout/           # 布局组件
│   └── business/         # 业务组件
├── hooks/                # 自定义Hooks
├── lib/                  # 工具库
│   ├── api/             # API客户端
│   ├── auth/            # 认证相关
│   ├── utils/           # 工具函数
│   └── validations/     # 验证规则
├── stores/              # 状态管理
├── types/               # 类型定义
└── public/              # 静态资源
```

### 2.2 Admin后台结构
```
apps/admin-panel/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证相关页面
│   │   ├── login/
│   │   └── invite/
│   ├── (dashboard)/       # 主应用页面
│   │   ├── dashboard/
│   │   ├── enterprises/
│   │   ├── users/
│   │   ├── invitations/
│   │   └── settings/
│   ├── api/               # API 路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # 组件
│   ├── ui/               # 基础UI组件
│   ├── forms/            # 表单组件
│   ├── layout/           # 布局组件
│   └── admin/            # 管理组件
├── hooks/                # 自定义Hooks
├── lib/                  # 工具库
├── stores/               # 状态管理
├── types/                # 类型定义
└── public/               # 静态资源
```

### 2.3 共享包结构
```
packages/
├── ui/                   # UI组件库
│   ├── components/       # 基础组件
│   ├── hooks/           # 共享Hooks
│   ├── utils/           # 工具函数
│   └── index.ts         # 导出文件
├── utils/               # 工具函数包
│   ├── api/            # API工具
│   ├── auth/           # 认证工具
│   ├── validation/     # 验证工具
│   └── index.ts        # 导出文件
└── types/              # 类型定义包
    ├── api.ts          # API类型
    ├── auth.ts         # 认证类型
    ├── enterprise.ts   # 企业类型
    └── index.ts        # 导出文件
```

## 3. 组件设计

### 3.1 组件分类

#### 3.1.1 基础UI组件 (packages/ui)
```typescript
// Button 组件
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

// Input 组件
interface InputProps {
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value?: string;
  onChange?: (value: string) => void;
}

// Modal 组件
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

#### 3.1.2 表单组件
```typescript
// 企业信息表单
interface EnterpriseFormProps {
  initialData?: Enterprise;
  onSubmit: (data: EnterpriseFormData) => void;
  loading?: boolean;
}

// 审核表单
interface ReviewFormProps {
  enterpriseId: string;
  onReview: (data: ReviewData) => void;
  loading?: boolean;
}
```

#### 3.1.3 布局组件
```typescript
// 侧边栏
interface SidebarProps {
  user: User;
  navigation: NavigationItem[];
  collapsed: boolean;
  onToggle: () => void;
}

// 顶部导航
interface HeaderProps {
  user: User;
  onLogout: () => void;
  notifications: Notification[];
}
```

### 3.2 组件设计原则
- **单一职责**: 每个组件只负责一个功能
- **可复用性**: 组件应该可以在不同场景下复用
- **可组合性**: 组件应该可以组合成更复杂的组件
- **可测试性**: 组件应该易于测试
- **可访问性**: 组件应该支持无障碍访问

## 4. 状态管理

### 4.1 Zustand Store 设计

#### 4.1.1 认证状态
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,
  isAuthenticated: false,
  
  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await authAPI.login({ email, password });
      set({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
        loading: false
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  
  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  }
}));
```

#### 4.1.2 企业状态
```typescript
interface EnterpriseState {
  enterprise: Enterprise | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchEnterprise: () => Promise<void>;
  updateEnterprise: (data: Partial<Enterprise>) => Promise<void>;
  submitForReview: () => Promise<void>;
  clearError: () => void;
}

const useEnterpriseStore = create<EnterpriseState>((set, get) => ({
  enterprise: null,
  loading: false,
  error: null,
  
  fetchEnterprise: async () => {
    set({ loading: true });
    try {
      const enterprise = await enterpriseAPI.getMyEnterprise();
      set({ enterprise, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  updateEnterprise: async (data) => {
    set({ loading: true });
    try {
      const updated = await enterpriseAPI.updateEnterprise(data);
      set({ enterprise: updated, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));
```

#### 4.1.3 Admin状态
```typescript
interface AdminState {
  enterprises: Enterprise[];
  pagination: Pagination;
  filters: EnterpriseFilters;
  loading: boolean;
  
  // Actions
  fetchEnterprises: (filters?: EnterpriseFilters) => Promise<void>;
  reviewEnterprise: (id: string, review: ReviewData) => Promise<void>;
  updateFilters: (filters: Partial<EnterpriseFilters>) => void;
}

const useAdminStore = create<AdminState>((set, get) => ({
  enterprises: [],
  pagination: { page: 1, limit: 20, total: 0 },
  filters: { status: 'all', search: '' },
  loading: false,
  
  fetchEnterprises: async (filters) => {
    set({ loading: true });
    try {
      const response = await adminAPI.getEnterprises(filters);
      set({
        enterprises: response.enterprises,
        pagination: response.pagination,
        loading: false
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  }
}));
```

### 4.2 状态持久化
```typescript
// 持久化配置
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
```

## 5. API 集成

### 5.1 API 客户端配置
```typescript
// lib/api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
```

### 5.2 API 服务层
```typescript
// lib/api/enterprise.ts
export const enterpriseAPI = {
  getMyEnterprise: () => 
    apiClient.get('/enterprises/me'),
    
  updateEnterprise: (data: Partial<Enterprise>) =>
    apiClient.put('/enterprises/me', data),
    
  submitForReview: () =>
    apiClient.post('/enterprises/me/submit'),
    
  getReviewHistory: () =>
    apiClient.get('/enterprises/me/reviews'),
    
  uploadDocument: (file: File, type: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', type);
    return apiClient.post('/enterprises/me/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

// lib/api/admin.ts
export const adminAPI = {
  getEnterprises: (params?: EnterpriseFilters) =>
    apiClient.get('/admin/enterprises', { params }),
    
  getEnterprise: (id: string) =>
    apiClient.get(`/admin/enterprises/${id}`),
    
  reviewEnterprise: (id: string, review: ReviewData) =>
    apiClient.post(`/admin/enterprises/${id}/review`, review),
    
  getStatistics: () =>
    apiClient.get('/admin/statistics/reviews'),
    
  inviteUser: (data: InviteData) =>
    apiClient.post('/admin/invitations', data)
};
```

## 6. 路由设计

### 6.1 企业后台路由
```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-72">
        <Header />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// 路由配置
const routes = [
  {
    path: '/dashboard',
    name: '仪表板',
    icon: HomeIcon,
    component: DashboardPage
  },
  {
    path: '/enterprise',
    name: '企业信息',
    icon: BuildingIcon,
    component: EnterprisePage
  },
  {
    path: '/documents',
    name: '企业证件',
    icon: DocumentIcon,
    component: DocumentsPage
  },
  {
    path: '/contacts',
    name: '联系人',
    icon: UsersIcon,
    component: ContactsPage
  },
  {
    path: '/profile',
    name: '个人设置',
    icon: UserIcon,
    component: ProfilePage
  }
];
```

### 6.2 Admin后台路由
```typescript
// 路由配置
const adminRoutes = [
  {
    path: '/dashboard',
    name: '仪表板',
    icon: HomeIcon,
    component: AdminDashboardPage
  },
  {
    path: '/enterprises',
    name: '企业管理',
    icon: BuildingIcon,
    component: EnterprisesPage
  },
  {
    path: '/users',
    name: '用户管理',
    icon: UsersIcon,
    component: UsersPage
  },
  {
    path: '/invitations',
    name: '邀请管理',
    icon: MailIcon,
    component: InvitationsPage
  },
  {
    path: '/settings',
    name: '系统设置',
    icon: SettingsIcon,
    component: SettingsPage
  }
];
```

## 7. 表单处理

### 7.1 React Hook Form + Zod 集成
```typescript
// lib/validations/enterprise.ts
import { z } from 'zod';

export const enterpriseSchema = z.object({
  name: z.string().min(2, '企业名称至少2个字符'),
  type: z.string().min(1, '请选择企业类型'),
  industry: z.string().optional(),
  founded_date: z.string().optional(),
  registered_capital: z.number().min(0, '注册资本不能为负数'),
  business_scope: z.string().min(10, '经营范围至少10个字符'),
  address: z.string().min(5, '地址至少5个字符'),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入正确的手机号'),
  email: z.string().email('请输入正确的邮箱'),
  website: z.string().url('请输入正确的网址').optional(),
  description: z.string().min(20, '企业简介至少20个字符')
});

export type EnterpriseFormData = z.infer<typeof enterpriseSchema>;

// 表单组件
export function EnterpriseForm({ initialData, onSubmit, loading }: EnterpriseFormProps) {
  const form = useForm<EnterpriseFormData>({
    resolver: zodResolver(enterpriseSchema),
    defaultValues: initialData
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>企业名称</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* 其他字段... */}
      
      <Button type="submit" loading={loading}>
        保存
      </Button>
    </form>
  );
}
```

## 8. 样式系统

### 8.1 TailwindCSS 配置
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
};
```

### 8.2 组件样式
```typescript
// 基础按钮样式
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary"
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
```

## 9. 错误处理

### 9.1 错误边界
```typescript
// components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // 发送错误到监控服务
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              出现了一些问题
            </h2>
            <p className="text-gray-600 mb-4">
              我们正在努力修复这个问题，请稍后再试
            </p>
            <Button onClick={() => window.location.reload()}>
              刷新页面
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 9.2 全局错误处理
```typescript
// lib/error-handler.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    toast.error(error.message);
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('发生未知错误');
  }
  
  // 记录错误日志
  console.error('Application error:', error);
};
```

## 10. 性能优化

### 10.1 代码分割
```typescript
// 动态导入组件
const EnterpriseForm = dynamic(() => import('@/components/forms/EnterpriseForm'), {
  loading: () => <div>加载中...</div>
});

const AdminDashboard = dynamic(() => import('@/components/admin/Dashboard'), {
  loading: () => <div>加载中...</div>
});
```

### 10.2 图片优化
```typescript
// 使用 Next.js Image 组件
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={60}
  priority
  className="object-contain"
/>
```

### 10.3 缓存策略
```typescript
// API 缓存
const useEnterprise = (id: string) => {
  return useQuery({
    queryKey: ['enterprise', id],
    queryFn: () => enterpriseAPI.getEnterprise(id),
    staleTime: 5 * 60 * 1000, // 5分钟
    cacheTime: 10 * 60 * 1000  // 10分钟
  });
};
```

## 11. 测试策略

### 11.1 单元测试
```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 11.2 集成测试
```typescript
// __tests__/pages/enterprise.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { EnterprisePage } from '@/app/(dashboard)/enterprise/page';

describe('EnterprisePage', () => {
  it('loads and displays enterprise data', async () => {
    render(<EnterprisePage />);
    
    await waitFor(() => {
      expect(screen.getByText('企业信息')).toBeInTheDocument();
    });
  });
});
```

## 12. 部署配置

### 12.1 Vercel 配置
```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

### 12.2 环境变量
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-project.supabase.co/rest/v1
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

## 13. 监控和分析

### 13.1 性能监控
```typescript
// lib/analytics.ts
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  // 发送事件到分析服务
  console.log('Track event:', event, properties);
};

export const trackPageView = (path: string) => {
  trackEvent('page_view', { path });
};

export const trackError = (error: Error, context?: string) => {
  trackEvent('error', {
    message: error.message,
    stack: error.stack,
    context
  });
};
```

### 13.2 用户行为分析
```typescript
// hooks/useAnalytics.ts
export const useAnalytics = () => {
  const trackEvent = useCallback((event: string, properties?: Record<string, any>) => {
    // 实现事件跟踪
  }, []);

  const trackPageView = useCallback((path: string) => {
    trackEvent('page_view', { path });
  }, [trackEvent]);

  return { trackEvent, trackPageView };
};
``` 