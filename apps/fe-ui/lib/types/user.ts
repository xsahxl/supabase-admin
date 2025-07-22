export type User = {
  id: string;
  auth_user_id: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  metadata?: any;
};

export type CreateUserData = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export type UpdateUserData = Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>; 