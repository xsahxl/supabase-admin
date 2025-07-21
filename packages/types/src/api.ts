// API 响应基础结构
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: number;
}

// 分页响应结构
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 列表响应结构
export interface ListResponse<T> {
  data: T[];
  total: number;
}

// 错误响应结构
export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  code: number;
  details?: Record<string, any>;
}

// 成功响应结构
export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// 文件上传响应
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// 认证响应
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    userType: string;
    status: string;
  };
  session: {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  };
}

// 统计响应
export interface StatsResponse {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  suspended: number;
  trend: {
    date: string;
    count: number;
  }[];
} 