"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore(state => state.initialize);
  const initialized = useAuthStore(state => state.initialized);

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, []); // 空依赖项数组，只在组件挂载时执行一次

  return <>{children}</>;
} 