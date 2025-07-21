"use client";

import React, { useEffect, useState } from 'react';
import { getEnterprises, createEnterprise, updateEnterprise, deleteEnterprise } from '@/lib/services/enterprise';
import type { Enterprise } from '@/lib/types/enterprise';
import { CompanyForm } from '@/components/company/company-form';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';

const CompanyPage: React.FC = () => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Enterprise | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchEnterprises = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEnterprises();
      setEnterprises(data);
    } catch (err: any) {
      setError(err.message || '加载企业信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnterprises();
  }, []);

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (enterprise: Enterprise) => {
    setEditing(enterprise);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除该企业吗？')) return;
    setLoading(true);
    try {
      await deleteEnterprise(id);
      await fetchEnterprises();
    } catch (err: any) {
      setError(err.message || '删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: Omit<Enterprise, 'id' | 'created_at' | 'updated_at'>) => {
    setFormLoading(true);
    // 清理时间戳字段的空字符串
    const cleanedData = { ...data };
    ['submitted_at', 'approved_at'].forEach((key) => {
      if ((cleanedData as any)[key] === '') {
        (cleanedData as any)[key] = null;
      }
    });
    try {
      if (editing) {
        await updateEnterprise(editing.id, cleanedData);
      } else {
        // 直接从 store 获取 user_id
        const user = useAuthStore.getState().user;
        const user_id = user?.id;
        if (!user_id) throw new Error('未获取到当前用户信息');
        await createEnterprise({ ...cleanedData, user_id });
      }
      setShowForm(false);
      await fetchEnterprises();
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">企业管理</h1>
        <Button onClick={handleAdd} aria-label="新增企业" tabIndex={0}>
          新增企业
        </Button>
      </div>
      {loading && <div className="text-gray-500">加载中...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {!loading && enterprises.length === 0 && <div className="text-gray-400">暂无企业信息</div>}
      <div className="grid gap-4">
        {enterprises.map((enterprise) => (
          <div key={enterprise.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold text-lg">{enterprise.name}</div>
              <div className="text-sm text-gray-500">类型：{enterprise.type} | 状态：{enterprise.status}</div>
              <div className="text-sm text-gray-500">地址：{enterprise.address}</div>
              {enterprise.industry && <div className="text-sm text-gray-500">行业：{enterprise.industry}</div>}
              {enterprise.phone && <div className="text-sm text-gray-500">电话：{enterprise.phone}</div>}
              {enterprise.email && <div className="text-sm text-gray-500">邮箱：{enterprise.email}</div>}
              {enterprise.website && <div className="text-sm text-gray-500">网站：{enterprise.website}</div>}
              {enterprise.description && <div className="text-sm text-gray-500">简介：{enterprise.description}</div>}
            </div>
            <div className="flex space-x-2 mt-2 md:mt-0">
              <Button onClick={() => handleEdit(enterprise)} aria-label="编辑企业" tabIndex={0}>
                编辑
              </Button>
              <Button onClick={() => handleDelete(enterprise.id)} aria-label="删除企业" tabIndex={0} variant="destructive">
                删除
              </Button>
            </div>
          </div>
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
            <CompanyForm
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

export default CompanyPage; 