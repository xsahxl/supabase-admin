// 注意：需要安装 @supabase/supabase-js 包
// npm install @supabase/supabase-js

// 创建 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 临时类型定义，实际使用时需要安装 @supabase/supabase-js
interface SupabaseClient {
  auth: {
    signInWithPassword: (params: { email: string; password: string }) => Promise<any>;
    signUp: (params: any) => Promise<any>;
    signOut: () => Promise<any>;
    getUser: () => Promise<any>;
    onAuthStateChange: (callback: (event: string, session: any) => void) => any;
  };
  from: (table: string) => any;
}

// 临时实现，实际使用时需要导入真实的 Supabase 客户端
export const supabase: SupabaseClient = {} as SupabaseClient;

// 用户类型定义
export interface User {
  id: string;
  auth_user_id: string;
  user_type: 'enterprise' | 'admin' | 'super_admin';
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

// 登录函数
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // 获取用户业务信息
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', data.user?.id)
      .single();

    if (userError) {
      throw userError;
    }

    return {
      user: data.user,
      userProfile: userData,
      session: data.session,
    };
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

// 注册函数
export const signUp = async (email: string, password: string, userData: {
  first_name?: string;
  last_name?: string;
  user_type?: 'enterprise' | 'admin' | 'super_admin';
}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name,
        },
      },
    });

    if (error) {
      throw error;
    }

    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
};

// 登出函数
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('登出失败:', error);
    throw error;
  }
};

// 获取当前用户信息
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

// 检查用户权限
export const checkUserPermission = (userProfile: User, requiredType: 'admin' | 'super_admin') => {
  if (!userProfile) return false;

  const permissionLevels = {
    'enterprise': 1,
    'admin': 2,
    'super_admin': 3,
  };

  const userLevel = permissionLevels[userProfile.user_type];
  const requiredLevel = permissionLevels[requiredType];

  return userLevel >= requiredLevel;
};

// 监听认证状态变化
export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange(async (event: string, session: any) => {
    if (event === 'SIGNED_IN' && session?.user) {
      // 获取用户业务信息
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single();

      callback({
        authUser: session.user,
        userProfile,
        session,
      });
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    }
  });
}; 