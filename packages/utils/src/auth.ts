// 认证相关工具函数

// 存储键名
const AUTH_TOKEN_KEY = 'auth_token';
const USER_INFO_KEY = 'user_info';

// 用户信息接口
export interface UserInfo {
  id: string;
  email: string;
  role: string;
  status: string;
  firstName?: string;
  lastName?: string;
}

// 会话信息接口
export interface SessionInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

// 获取存储的认证令牌
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

// 设置认证令牌
export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

// 清除认证令牌
export const clearAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// 获取用户信息
export const getUserInfo = (): UserInfo | null => {
  if (typeof window === 'undefined') return null;
  const userInfo = localStorage.getItem(USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
};

// 设置用户信息
export const setUserInfo = (userInfo: UserInfo): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
};

// 清除用户信息
export const clearUserInfo = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_INFO_KEY);
};

// 检查是否已认证
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;

  // 检查令牌是否过期
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiresAt = payload.exp * 1000; // 转换为毫秒
    return Date.now() < expiresAt;
  } catch {
    return false;
  }
};

// 检查用户权限
export const hasPermission = (requiredRole: string): boolean => {
  const userInfo = getUserInfo();
  if (!userInfo) return false;

  // 超级管理员拥有所有权限
  if (userInfo.role === 'super_admin') return true;

  // 检查具体权限
  return userInfo.role === requiredRole;
};

// 检查是否为管理员
export const isAdmin = (): boolean => {
  return hasPermission('admin') || hasPermission('super_admin');
};

// 检查是否为企业用户
export const isEnterpriseUser = (): boolean => {
  return hasPermission('enterprise');
};

// 登出
export const logout = (): void => {
  clearAuthToken();
  clearUserInfo();

  // 重定向到登录页
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

// 格式化用户显示名称
export const formatUserName = (userInfo: UserInfo): string => {
  if (userInfo.firstName && userInfo.lastName) {
    return `${userInfo.firstName} ${userInfo.lastName}`;
  }
  if (userInfo.firstName) {
    return userInfo.firstName;
  }
  return userInfo.email;
};

// 获取用户类型显示名称
export const getRoleDisplayName = (role: string): string => {
  const typeMap: Record<string, string> = {
    enterprise: '企业用户',
    admin: '管理员',
    super_admin: '超级管理员',
  };
  return typeMap[role] || role;
}; 