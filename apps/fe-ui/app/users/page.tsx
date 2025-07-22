"use client";

import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser, checkIsSuperAdmin, getCurrentUser } from '@/lib/services/user';
import type { User } from '@/lib/types/user';
import { UserForm } from '@/components/user/user-form';
import { UserCard } from '@/components/user/user-card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'next/navigation';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // 检查当前用户权限
      const currentUserData = await getCurrentUser();
      setCurrentUser(currentUserData);

      if (!currentUserData) {
        setError('未获取到用户信息');
        return;
      }

      const isAdmin = await checkIsSuperAdmin();
      setIsSuperAdmin(isAdmin);

      if (isAdmin) {
        // 超级管理员可以查看所有用户
        const data = await getUsers();
        setUsers(data);
      } else {
        // 普通用户只能查看自己的信息
        setUsers(currentUserData ? [currentUserData] : []);
      }
    } catch (err: any) {
      setError(err.message || '加载用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    if (!isSuperAdmin) {
      alert('只有超级管理员可以创建新用户');
      return;
    }
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (user: User) => {
    // 普通用户只能编辑自己的信息
    if (!isSuperAdmin && user.id !== currentUser?.id) {
      alert('您只能编辑自己的信息');
      return;
    }
    setEditing(user);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!isSuperAdmin) {
      alert('只有超级管理员可以删除用户');
      return;
    }

    // 不能删除自己
    if (id === currentUser?.id) {
      alert('不能删除自己的账户');
      return;
    }

    if (!window.confirm('确定要删除该用户吗？')) return;

    setLoading(true);
    try {
      await deleteUser(id);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || '删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    setFormLoading(true);
    try {
      if (editing) {
        await updateUser(editing.id, data);
      } else {
        // 创建新用户时需要提供auth_user_id
        // 这里需要先创建auth用户，然后获取auth_user_id
        // 简化处理，实际项目中可能需要更复杂的逻辑
        await createUser(data);
      }
      setShowForm(false);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setFormLoading(false);
    }
  };



  if (loading && users.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">用户管理</h1>
        {isSuperAdmin && (
          <Button
            onClick={handleAdd}
            aria-label="新增用户"
            tabIndex={0}
          >
            新增用户
          </Button>
        )}
      </div>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      {!isSuperAdmin && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-800 text-sm">
            您当前以普通用户身份登录，只能查看和编辑自己的信息。
          </p>
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="text-gray-400">暂无用户信息</div>
      )}

      <div className="grid gap-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            currentUserId={currentUser?.id}
            isSuperAdmin={isSuperAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" role="dialog" aria-modal="true">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              aria-label="关闭表单"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowForm(false); }}
            >
              ×
            </button>
            <UserForm
              initialData={editing || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
              loading={formLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage; 