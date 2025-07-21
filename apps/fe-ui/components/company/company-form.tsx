'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Company, CreateCompanyData, UpdateCompanyData, CompanyStatus } from '@/lib/types/company';

interface CompanyFormProps {
  company?: Company;
  onSubmit: (data: CreateCompanyData | UpdateCompanyData, action: 'save' | 'submit') => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CompanyForm = ({ company, onSubmit, onCancel, isLoading = false }: CompanyFormProps) => {
  const [formData, setFormData] = useState({
    name: company?.name || '',
    logo_url: company?.logo_url || '',
    description: company?.description || '',
    details: company?.details || '',
    address: company?.address || '',
    website: company?.website || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData, 'save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForReview = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证必填字段
    if (!formData.name.trim()) {
      alert('请输入企业名称');
      return;
    }

    // 验证网站 URL 格式
    if (formData.website && !isValidUrl(formData.website)) {
      alert('请输入有效的网站地址');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData, 'submit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isFormValid = formData.name.trim() &&
    (!formData.website || isValidUrl(formData.website));

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{company ? '编辑企业' : '创建企业'}</CardTitle>
        <CardDescription>
          {company ? '修改企业信息' : '添加新的企业信息'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitForReview} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">企业名称 *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="请输入企业名称"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              type="url"
              value={formData.logo_url}
              onChange={(e) => handleInputChange('logo_url', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">简述</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="请输入企业简述"
              className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">详情</Label>
            <textarea
              id="details"
              value={formData.details}
              onChange={(e) => handleInputChange('details', e.target.value)}
              placeholder="请输入企业详细信息"
              className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">地址</Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="请输入企业地址"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">官网</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading || isSubmitting}
            >
              取消
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSaveDraft}
              disabled={isLoading || isSubmitting}
            >
              {isSubmitting ? '保存中...' : '保存草稿'}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isSubmitting || !isFormValid}
            >
              {isSubmitting ? '提交中...' : '提交审核'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanyForm; 