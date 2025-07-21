// 公司状态枚举
export type CompanyStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';

// 公司状态中文映射
export const COMPANY_STATUS_LABELS: Record<CompanyStatus, string> = {
  draft: '草稿',
  pending: '待审核',
  approved: '审核通过',
  rejected: '审核不通过',
  archived: '已下架'
};

// 公司状态颜色映射
export const COMPANY_STATUS_COLORS: Record<CompanyStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  archived: 'bg-gray-100 text-gray-600'
};

// 企业类型定义
export interface Company {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  details?: string;
  address?: string;
  website?: string;
  status: CompanyStatus;
  status_updated_at: string;
  created_at: string;
  updated_at: string;
}

// 创建企业时的数据类型（不包含自动生成的字段）
export interface CreateCompanyData {
  name: string;
  logo_url?: string;
  description?: string;
  details?: string;
  address?: string;
  website?: string;
  status?: CompanyStatus;
}

// 更新企业时的数据类型（所有字段都是可选的）
export interface UpdateCompanyData {
  name?: string;
  logo_url?: string;
  description?: string;
  details?: string;
  address?: string;
  website?: string;
  status?: CompanyStatus;
}

// 企业列表查询参数
export interface CompanyListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CompanyStatus;
  sort_by?: 'name' | 'created_at' | 'status_updated_at';
  sort_order?: 'asc' | 'desc';
} 