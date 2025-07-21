import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    const supabase = createClient();

    // 获取初始用户状态
    const { data: { user } } = await supabase.auth.getUser();
    set({ user, loading: false, initialized: true });

    // 监听认证状态变化
    supabase.auth.onAuthStateChange((event, session) => {
      set({
        user: session?.user ?? null,
        loading: false
      });
    });
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // 状态会通过 onAuthStateChange 自动更新
  },
})); 