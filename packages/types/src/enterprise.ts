// 企业状态枚举
export enum EnterpriseStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

// 企业类型枚举
export enum EnterpriseType {
  LIMITED_LIABILITY = 'limited_liability',
  JOINT_STOCK = 'joint_stock',
  PARTNERSHIP = 'partnership',
  SOLE_PROPRIETORSHIP = 'sole_proprietorship',
  FOREIGN_INVESTED = 'foreign_invested',
  OTHER = 'other',
}

// 企业基础信息
export interface Enterprise {
  id: string;
  userId: string;
  name: string;
  type: EnterpriseType;
  industry?: string;
  foundedDate?: Date;
  registeredCapital?: number;
  businessScope?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  status: EnterpriseStatus;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  approvedAt?: Date;
  approvedBy?: string;
  metadata?: Record<string, any>;
}

// 企业证件信息
export interface EnterpriseDocument {
  id: string;
  enterpriseId: string;
  documentType: string;
  documentName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 企业联系人信息
export interface EnterpriseContact {
  id: string;
  enterpriseId: string;
  name: string;
  position?: string;
  phone: string;
  email: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 企业创建参数
export interface CreateEnterpriseParams {
  name: string;
  type: EnterpriseType;
  industry?: string;
  foundedDate?: Date;
  registeredCapital?: number;
  businessScope?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
}

// 企业更新参数
export interface UpdateEnterpriseParams {
  name?: string;
  type?: EnterpriseType;
  industry?: string;
  foundedDate?: Date;
  registeredCapital?: number;
  businessScope?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
}

// 企业提交审核参数
export interface SubmitEnterpriseParams {
  enterpriseId: string;
}

// 企业审核参数
export interface ReviewEnterpriseParams {
  enterpriseId: string;
  status: EnterpriseStatus;
  reviewComment?: string;
}

// 企业查询参数
export interface EnterpriseQueryParams {
  status?: EnterpriseStatus;
  type?: EnterpriseType;
  industry?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 