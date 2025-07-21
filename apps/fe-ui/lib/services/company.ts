import { createClient } from '@/lib/supabase/client';
import { Company, CreateCompanyData, UpdateCompanyData, CompanyListParams, CompanyStatus } from '@/lib/types/company';

const supabase = createClient();

// 获取企业列表
export const getCompanies = async (params: CompanyListParams = {}) => {
  const { page = 1, limit = 10, search, status, sort_by = 'created_at', sort_order = 'desc' } = params;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('companies')
    .select('*', { count: 'exact' });

  // 添加搜索条件
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // 添加状态过滤
  if (status) {
    query = query.eq('status', status);
  }

  // 添加排序
  query = query.order(sort_by, { ascending: sort_order === 'asc' });

  // 添加分页
  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw new Error(`获取企业列表失败: ${error.message}`);
  }

  return {
    companies: data as Company[],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  };
};

// 根据 ID 获取企业详情
export const getCompanyById = async (id: string): Promise<Company> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`获取企业详情失败: ${error.message}`);
  }

  return data as Company;
};

// 创建企业
export const createCompany = async (companyData: CreateCompanyData): Promise<Company> => {
  // 如果没有指定状态，默认为草稿
  const dataToInsert = {
    ...companyData,
    status: companyData.status || 'draft'
  };

  const { data, error } = await supabase
    .from('companies')
    .insert(dataToInsert)
    .select()
    .single();

  if (error) {
    throw new Error(`创建企业失败: ${error.message}`);
  }

  return data as Company;
};

// 更新企业
export const updateCompany = async (id: string, companyData: UpdateCompanyData): Promise<Company> => {
  const { data, error } = await supabase
    .from('companies')
    .update(companyData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`更新企业失败: ${error.message}`);
  }

  return data as Company;
};

// 更新企业状态
export const updateCompanyStatus = async (id: string, status: CompanyStatus): Promise<Company> => {
  const { data, error } = await supabase
    .from('companies')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`更新企业状态失败: ${error.message}`);
  }

  return data as Company;
};

// 删除企业
export const deleteCompany = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`删除企业失败: ${error.message}`);
  }
}; 