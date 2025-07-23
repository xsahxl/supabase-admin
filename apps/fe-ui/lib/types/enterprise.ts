export type Enterprise = {
  id: string;
  auth_user_id: string; // 认证用户ID
  name: string;
  type: string;
  industry?: string;
  founded_date?: string;
  registered_capital?: number;
  business_scope?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended';
  is_public: boolean;
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  approved_at?: string;
  approved_by?: string;
  metadata?: Record<string, any>;
}; 