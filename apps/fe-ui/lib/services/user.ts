import { createClient } from '../supabase/client';
import type { User, CreateUserData, UpdateUserData } from '../types/user';

const supabase = createClient();

// 获取所有用户（仅超级管理员）
export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as User[];
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();

  if (error) throw error;
  return data as User;
};

// 创建用户
export const createUser = async (userData: CreateUserData): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();
  if (error) throw error;
  return data as User;
};

// 更新用户
export const updateUser = async (id: string, userData: UpdateUserData): Promise<User> => {
  console.log('updateUser', id, userData);
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as User;
};

// 删除用户
export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// 检查当前用户是否为超级管理员
export const checkIsSuperAdmin = async (): Promise<boolean> => {
  const currentUser = await getCurrentUser();
  return currentUser?.role === 'super_admin';
}; 