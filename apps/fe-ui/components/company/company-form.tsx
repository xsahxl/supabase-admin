'use client';

import React, { useState } from 'react';
import type { Enterprise } from '../../lib/types/enterprise';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

export type CompanyFormProps = {
  initialData?: Partial<Enterprise>;
  onSubmit: (data: Omit<Enterprise, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel?: () => void;
  loading?: boolean;
};

const defaultForm: Omit<Enterprise, 'id' | 'created_at' | 'updated_at'> = {
  auth_user_id: '',
  name: '',
  type: '',
  industry: '',
  founded_date: '',
  registered_capital: 0,
  business_scope: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  description: '',
  status: 'draft',
  is_public: false,
  submitted_at: '',
  approved_at: '',
  approved_by: '',
  metadata: {},
};

export const CompanyForm: React.FC<CompanyFormProps> = ({ initialData, onSubmit, onCancel, loading }) => {
  console.log('CompanyForm', initialData);
  const [form, setForm] = useState<Omit<Enterprise, 'id' | 'created_at' | 'updated_at'>>({
    ...defaultForm,
    ...initialData,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const name = target.name;
    if (target instanceof HTMLInputElement) {
      if (target.type === 'checkbox') {
        setForm((prev) => ({
          ...prev,
          [name]: target.checked,
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          [name]: target.value,
        }));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: target.value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.type || !form.address) {
      setError('企业名称、类型、地址为必填项');
      return;
    }
    setError(null);
    console.log('handleSubmit', form);
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="企业信息表单">
      <div>
        <Label htmlFor="name">企业名称 *</Label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="mt-1"
          aria-required="true"
        />
      </div>
      <div>
        <Label htmlFor="type">企业类型 *</Label>
        <Input
          id="type"
          name="type"
          value={form.type}
          onChange={handleChange}
          required
          className="mt-1"
          aria-required="true"
        />
      </div>
      <div>
        <Label htmlFor="industry">所属行业</Label>
        <Input
          id="industry"
          name="industry"
          value={form.industry || ''}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="founded_date">成立日期</Label>
        <Input
          id="founded_date"
          name="founded_date"
          type="date"
          value={form.founded_date || ''}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="registered_capital">注册资本</Label>
        <Input
          id="registered_capital"
          name="registered_capital"
          type="number"
          value={form.registered_capital || ''}
          onChange={handleChange}
          className="mt-1"
          min={0}
        />
      </div>
      <div>
        <Label htmlFor="business_scope">经营范围</Label>
        <textarea
          id="business_scope"
          name="business_scope"
          value={form.business_scope || ''}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 p-2"
          rows={2}
        />
      </div>
      <div>
        <Label htmlFor="address">企业地址 *</Label>
        <Input
          id="address"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          className="mt-1"
          aria-required="true"
        />
      </div>
      <div>
        <Label htmlFor="phone">联系电话</Label>
        <Input
          id="phone"
          name="phone"
          value={form.phone || ''}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="email">企业邮箱</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={form.email || ''}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="website">企业网站</Label>
        <Input
          id="website"
          name="website"
          value={form.website || ''}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="description">企业描述</Label>
        <textarea
          id="description"
          name="description"
          value={form.description || ''}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 p-2"
          rows={2}
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          id="is_public"
          name="is_public"
          type="checkbox"
          checked={form.is_public}
          onChange={handleChange}
          className="h-4 w-4"
          aria-checked={form.is_public}
        />
        <Label htmlFor="is_public">对外公开企业信息</Label>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex space-x-2">
        <Button type="submit" aria-label="提交企业信息" disabled={loading}>
          {loading ? '提交中...' : '提交'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} aria-label="取消">
            取消
          </Button>
        )}
      </div>
    </form>
  );
};

export default CompanyForm; 