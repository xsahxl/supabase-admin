"use client";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";

type AuthGuardProps = { children: ReactNode };

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !loading && !user) {
      router.replace("/auth/login");
    }
  }, [initialized, loading, user, router]);

  // 如果还在初始化或加载中，显示加载状态
  if (!initialized || loading) {
    return <div className="flex items-center justify-center h-screen text-gray-500">加载中...</div>;
  }

  // 如果未登录，不渲染内容（正在跳转）
  if (!user) {
    return null;
  }

  // 已登录，渲染子组件
  return <>{children}</>;
};

export default AuthGuard; 