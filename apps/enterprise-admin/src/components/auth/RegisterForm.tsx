'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, CheckCircle, XCircle, Building2, User, Mail, Lock, Shield } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '@/lib/validation';
import { registerUser, validatePasswordStrength } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onRegisterError: (error: string) => void;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSuccess,
  onRegisterError,
  onSwitchToLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    isValid: boolean;
    errors: string[];
    score: number;
  }>({ isValid: false, errors: [], score: 0 });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const watchedPassword = watch('password');

  // 监听密码变化，实时验证强度
  React.useEffect(() => {
    if (watchedPassword) {
      setPasswordStrength(validatePasswordStrength(watchedPassword));
    }
  }, [watchedPassword]);

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        acceptTerms: data.acceptTerms,
      });
      onRegisterSuccess();
    } catch (error: any) {
      onRegisterError(error.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score <= 1) return '很弱';
    if (score <= 2) return '弱';
    if (score <= 3) return '一般';
    if (score <= 4) return '强';
    return '很强';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="form-container">
        <div className="card shadow-medium p-8 slide-up">
          {/* Logo 和标题 */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="form-title text-gradient">企业用户注册</h1>
            <p className="form-subtitle">创建您的企业账户，开始您的业务之旅</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(handleRegister)}>
            {/* 姓名 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  姓
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    className="input-field pl-10 pr-4 py-3"
                    placeholder="请输入您的姓"
                    {...register('firstName')}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  名
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    className="input-field pl-10 pr-4 py-3"
                    placeholder="请输入您的名"
                    {...register('lastName')}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* 邮箱 */}
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

            {/* 密码 */}
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

              {/* 密码强度指示器 */}
              {watchedPassword && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Shield className="w-4 h-4 mr-1" />
                      密码强度:
                    </span>
                    <span className={`font-medium ${passwordStrength.isValid ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  {passwordStrength.errors.length > 0 && (
                    <div className="space-y-1">
                      {passwordStrength.errors.map((error, index) => (
                        <div key={index} className="flex items-center text-sm text-red-600">
                          <XCircle className="h-4 w-4 mr-1" />
                          {error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* 确认密码 */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                确认密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input-field pl-10 pr-12 py-3"
                  placeholder="请再次输入密码"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* 用户协议 */}
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
                    {...register('acceptTerms')}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptTerms" className="text-gray-700">
                    我已阅读并同意{' '}
                    <a href="/terms" className="text-primary-600 hover:text-primary-700 underline">
                      用户协议
                    </a>
                    {' '}和{' '}
                    <a href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                      隐私政策
                    </a>
                  </label>
                  {errors.acceptTerms && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.acceptTerms.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 注册按钮 */}
            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 text-base font-semibold shadow-soft hover:shadow-medium transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 mr-2"></div>
                  注册中...
                </div>
              ) : (
                '注册'
              )}
            </Button>

            {/* 登录链接 */}
            <div className="text-center">
              <span className="text-gray-600">已有账户？</span>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-primary-600 hover:text-primary-700 font-medium ml-1 transition-colors"
              >
                立即登录
              </button>
            </div>
          </form>

          {/* 底部装饰 */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              安全注册 · 企业级保护
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 