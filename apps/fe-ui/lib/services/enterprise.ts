import { createClient } from '../supabase/client';
import type { Enterprise } from '../types/enterprise';

const supabase = createClient();

export const getEnterprises = async (): Promise<Enterprise[]> => {
  const { data, error } = await supabase
    .from('enterprises')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Enterprise[];
};

export const createEnterprise = async (enterprise: Omit<Enterprise, 'id' | 'created_at' | 'updated_at'>): Promise<Enterprise> => {
  console.log('createEnterprise', enterprise);
  // 过滤掉所有值为 "" 或 null 的字段
  const cleanEnterprise: any = Object.fromEntries(
    Object.entries(enterprise).filter(([_, value]) => value !== '' && value !== null)
  );
  // registered_capital 转为数字类型
  if (typeof cleanEnterprise.registered_capital === 'string') {
    cleanEnterprise.registered_capital = Number(cleanEnterprise.registered_capital);
  }
  const { data, error } = await supabase
    .from('enterprises')
    .insert([cleanEnterprise])
    .select()
    .single();
  if (error) throw error;
  return data as Enterprise;
};

export const updateEnterprise = async (id: string, enterprise: Partial<Enterprise>): Promise<Enterprise> => {
  const { data, error } = await supabase
    .from('enterprises')
    .update(enterprise)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Enterprise;
};

export const deleteEnterprise = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('enterprises')
    .delete()
    .eq('id', id);
  if (error) throw error;
}; 