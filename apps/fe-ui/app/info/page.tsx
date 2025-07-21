"use client"
import { useAuthStore } from "@/stores/auth";
import AuthGuard from "@/components/AuthGuard";

const Info = () => {
  const { user } = useAuthStore();

  const userInfo = {
    id: user?.id,
    email: user?.email,
  };

  return (
    <AuthGuard>
      <div className="p-4 bg-white rounded shadow max-w-md mx-auto mt-8">
        <h2 className="text-lg font-bold mb-4">用户信息</h2>
        <div className="mb-2">
          <span className="font-semibold">ID：</span>
          <span>{userInfo.id}</span>
        </div>
        <div>
          <span className="font-semibold">邮箱：</span>
          <span>{userInfo.email}</span>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Info;