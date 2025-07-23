import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/lib/types/user';

interface UserCardProps {
  user: User;
  currentUserId?: string;
  isSuperAdmin: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  currentUserId,
  isSuperAdmin,
  onEdit,
  onDelete
}) => {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return '超级管理员';
      case 'admin': return '管理员';
      case 'user': return '普通用户';
      default: return role;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '活跃';
      case 'inactive': return '非活跃';
      case 'suspended': return '已暂停';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canEdit = isSuperAdmin || user.id === currentUserId;
  const canDelete = isSuperAdmin && user.id !== currentUserId;

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="font-semibold text-lg text-gray-900">
              {user.email}
            </div>
            <Badge className={getStatusColor(user.status)}>
              {getStatusLabel(user.status)}
            </Badge>
            <Badge variant="outline" className="border-blue-200 text-blue-700">
              {getRoleLabel(user.role)}
            </Badge>
          </div>

          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="font-medium w-16">邮箱:</span>
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center">
                <span className="font-medium w-16">电话:</span>
                <span>{user.phone}</span>
              </div>
            )}
            <div className="flex items-center">
              <span className="font-medium w-16">创建时间:</span>
              <span>{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
            {user.last_login_at && (
              <div className="flex items-center">
                <span className="font-medium w-16">最后登录:</span>
                <span>{new Date(user.last_login_at).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 ml-4">
          {canEdit && (
            <Button
              onClick={() => onEdit(user)}
              size="sm"
              variant="outline"
              aria-label="编辑用户"
              tabIndex={0}
            >
              编辑
            </Button>
          )}
          {canDelete && (
            <Button
              onClick={() => onDelete(user.id)}
              size="sm"
              variant="destructive"
              aria-label="删除用户"
              tabIndex={0}
            >
              删除
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}; 