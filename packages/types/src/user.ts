// 用户类型枚举
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

// 用户状态枚举
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

// 用户基础信息
export interface User {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  createdBy?: string;
  metadata?: Record<string, any>;
}

// 用户档案信息
export interface UserProfile {
  id: string;
  userId: string;
  companyName?: string;
  jobTitle?: string;
  department?: string;
  bio?: string;
  website?: string;
  location?: string;
  timezone?: string;
  language: string;
  notificationPreferences: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// 用户创建参数
export interface CreateUserParams {
  email: string;
  password: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// 用户更新参数
export interface UpdateUserParams {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}

// 用户登录参数
export interface LoginParams {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 用户注册参数
export interface RegisterParams {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  acceptTerms: boolean;
}

// 密码重置参数
export interface ResetPasswordParams {
  email: string;
}

// 密码更新参数
export interface UpdatePasswordParams {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
} 