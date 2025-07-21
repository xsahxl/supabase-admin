'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Building2, Lock, Mail } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/lib/validation';
import { loginUser, isRememberMeEnabled, getRememberedEmail } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface LoginFormProps {
  onLoginSuccess: (userData: any) => void;
  onLoginError: (error: string) => void;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onLoginError,
  onSwitchToRegister,
  onForgotPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // 检查是否有记住的邮箱
  React.useEffect(() => {
    if (isRememberMeEnabled()) {
      const rememberedEmail = getRememberedEmail();
      if (rememberedEmail) {
        setValue('email', rememberedEmail);
        setValue('rememberMe', true);
      }
    }
  }, [setValue]);

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const result = await loginUser(data.email, data.password, data.rememberMe);
      onLoginSuccess(result);
    } catch (error: any) {
      onLoginError(error.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="form-container">
        <div className="card shadow-medium p-8 fade-in">
          {/* Logo 和标题 */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="form-title text-gradient">企业用户登录</h1>
            <p className="form-subtitle">登录您的企业账户，开始管理您的业务</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
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
                  placeholder="请输入邮箱地址"
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

            {/* 密码输入 */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-10 pr-12 py-3"
                  placeholder="请输入密码"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* 记住登录和忘记密码 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
                  {...register('rememberMe')}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  记住登录状态
                </label>
              </div>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                忘记密码？
              </button>
            </div>

            {/* 登录按钮 */}
            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 text-base font-semibold shadow-soft hover:shadow-medium transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 mr-2"></div>
                  登录中...
                </div>
              ) : (
                '登录'
              )}
            </Button>

            {/* 注册链接 */}
            <div className="text-center">
              <span className="text-gray-600">还没有账户？</span>
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-primary-600 hover:text-primary-700 font-medium ml-1 transition-colors"
              >
                立即注册
              </button>
            </div>
          </form>

          {/* 底部装饰 */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              安全登录 · 企业级保护
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 