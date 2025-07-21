'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validation';
import { forgotPassword } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ForgotPasswordFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSuccess,
  onError,
  onBackToLogin,
}) => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      await forgotPassword(data.email);
      setEmailSent(true);
      onSuccess();
    } catch (error: any) {
      onError(error.message || '发送重置密码邮件失败');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="form-container">
          <div className="card shadow-medium p-8 bounce-in">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="form-title text-green-600">邮件已发送</h2>
              <p className="form-subtitle mt-4">
                我们已向您的邮箱发送了重置密码的链接，请查收邮件并按照提示重置密码。
              </p>
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 提示：如果收件箱中没有收到邮件，请检查垃圾邮件文件夹
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Button
                onClick={onBackToLogin}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回登录
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="form-container">
        <div className="card shadow-medium p-8 slide-up">
          {/* Logo 和标题 */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="form-title text-gradient">忘记密码</h1>
            <p className="form-subtitle">请输入您的邮箱地址，我们将发送重置密码的链接</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(handleForgotPassword)}>
            {/* 邮箱输入 */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱地址
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  className="input-field pl-10 pr-4 py-3"
                  placeholder="请输入您的邮箱地址"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* 发送按钮 */}
            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 text-base font-semibold shadow-soft hover:shadow-medium transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 mr-2"></div>
                  发送中...
                </div>
              ) : (
                '发送重置链接'
              )}
            </Button>

            {/* 返回登录 */}
            <div className="text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors flex items-center justify-center mx-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                返回登录
              </button>
            </div>
          </form>

          {/* 底部装饰 */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              安全重置 · 企业级保护
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm; 