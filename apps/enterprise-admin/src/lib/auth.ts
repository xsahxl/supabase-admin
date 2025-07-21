import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// 创建 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 密码强度验证
export const validatePasswordStrength = (password: string) => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('密码长度至少8位');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('密码必须包含至少一个大写字母');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('密码必须包含至少一个小写字母');
  }

  if (!/\d/.test(password)) {
    errors.push('密码必须包含至少一个数字');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('密码必须包含至少一个特殊字符');
  }

  return {
    isValid: errors.length === 0,
    errors,
    score: Math.max(0, 5 - errors.length)
  };
};

// 邮箱验证
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 用户注册
export const registerUser = async (userData: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptTerms: boolean;
}) => {
  try {
    // 验证邮箱
    if (!validateEmail(userData.email)) {
      throw new Error('邮箱格式不正确');
    }

    // 验证密码强度
    const passwordValidation = validatePasswordStrength(userData.password);
    if (!passwordValidation.isValid) {
      throw new Error(`密码强度不足: ${passwordValidation.errors.join(', ')}`);
    }

    // 验证用户协议
    if (!userData.acceptTerms) {
      throw new Error('请先同意用户协议');
    }

    // 注册用户 - 触发器会自动创建用户业务信息
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
        },
      },
    });

    if (error) {
      throw error;
    }

    return { user: data.user, session: data.session };
  } catch (error: any) {
    console.error('注册失败:', error);
    throw error;
  }
};

// 用户登录
export const loginUser = async (email: string, password: string, rememberMe = false) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // 如果选择记住登录状态，将用户信息存储到 localStorage
    if (rememberMe && data.session) {
      try {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', email);
        // 注意：不要存储敏感信息如密码
      } catch (storageError) {
        console.warn('无法保存记住登录状态:', storageError);
      }
    } else {
      // 如果不记住登录状态，清除相关存储
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('userEmail');
    }

    // 获取用户业务信息
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', data.user?.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    // 记录登录日志
    if (data.user) {
      await supabase
        .from('login_logs')
        .insert({
          user_id: data.user.id,
          login_time: new Date().toISOString(),
          ip_address: 'client_ip', // 实际应用中需要获取真实IP
          user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
          remember_me: rememberMe,
        });
    }

    return {
      user: data.user,
      userProfile,
      session: data.session,
    };
  } catch (error: any) {
    console.error('登录失败:', error);
    throw error;
  }
};

// 忘记密码
export const forgotPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('发送重置密码邮件失败:', error);
    throw error;
  }
};

// 重置密码
export const resetPassword = async (newPassword: string) => {
  try {
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(`密码强度不足: ${passwordValidation.errors.join(', ')}`);
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('重置密码失败:', error);
    throw error;
  }
};

// 更新用户信息
export const updateUserProfile = async (userId: string, userData: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        avatar_url: userData.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('auth_user_id', userId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('更新用户信息失败:', error);
    throw error;
  }
};

// 修改密码
export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    // 验证当前密码
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('用户未登录');
    }

    // 验证新密码强度
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(`密码强度不足: ${passwordValidation.errors.join(', ')}`);
    }

    // 更新密码
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('修改密码失败:', error);
    throw error;
  }
};

// 上传头像
export const uploadAvatar = async (file: File, userId: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // 获取文件URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // 更新用户头像
    await updateUserProfile(userId, { avatarUrl: publicUrl });

    return { avatarUrl: publicUrl };
  } catch (error: any) {
    console.error('上传头像失败:', error);
    throw error;
  }
};

// 获取登录设备列表
export const getLoginDevices = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('login_logs')
      .select('*')
      .eq('user_id', userId)
      .order('login_time', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('获取登录设备失败:', error);
    throw error;
  }
};

// 登出
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }

    // 清除记住登录状态
    clearRememberMe();
  } catch (error: any) {
    console.error('登出失败:', error);
    throw error;
  }
};

// 检查是否记住登录状态
export const isRememberMeEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('rememberMe') === 'true';
};

// 获取记住的邮箱
export const getRememberedEmail = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userEmail');
};

// 清除记住登录状态
export const clearRememberMe = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('rememberMe');
  localStorage.removeItem('userEmail');
};

// 获取当前用户
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // 获取用户业务信息
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (profileError) {
      console.error('获取用户信息失败:', profileError);
      return null;
    }

    return {
      authUser: user,
      userProfile,
    };
  } catch (error) {
    console.error('获取当前用户失败:', error);
    return null;
  }
}; 