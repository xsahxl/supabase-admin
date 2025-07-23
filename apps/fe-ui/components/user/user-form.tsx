"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import type { User } from '@/lib/types/user';

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: Omit<User, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const roleOptions = [
  { value: 'user', label: '普通用户' },
  { value: 'admin', label: '管理员' },
  { value: 'super_admin', label: '超级管理员' }
];

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    email: '',
    role: 'user' as 'user' | 'admin' | 'super_admin',
    phone: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        status: initialData.status,
        email: initialData.email || '',
        role: initialData.role,
        phone: initialData.phone || '',
        avatar_url: initialData.avatar_url || ''
      });
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证必填字段
    if (!formData.email.trim()) {
      alert('邮箱是必填字段');
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('请输入有效的邮箱地址');
      return;
    }

    try {
      await onSubmit({
        ...formData,
        auth_user_id: initialData?.auth_user_id || '' // 创建时需要提供auth_user_id
      });
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">邮箱 *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="请输入邮箱"
            required
            disabled={loading}
            aria-label="用户邮箱"
            tabIndex={0}
          />
        </div>

        <div>
          <Label htmlFor="role">角色</Label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="用户角色"
            tabIndex={0}
          >
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="phone">电话</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="请输入电话号码"
            disabled={loading}
            aria-label="用户电话"
            tabIndex={0}
          />
        </div>

        <div>
          <Label htmlFor="avatar_url">头像URL</Label>
          <Input
            id="avatar_url"
            type="url"
            value={formData.avatar_url}
            onChange={(e) => handleInputChange('avatar_url', e.target.value)}
            placeholder="请输入头像URL"
            disabled={loading}
            aria-label="头像URL"
            tabIndex={0}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            onClick={onCancel}
            disabled={loading}
            variant="outline"
            aria-label="取消"
            tabIndex={0}
          >
            取消
          </Button>
          <Button
            type="submit"
            disabled={loading}
            aria-label="保存用户"
            tabIndex={0}
          >
            {loading ? '保存中...' : '保存'}
          </Button>
        </div>
      </form>
    </Card>
  );
}; 