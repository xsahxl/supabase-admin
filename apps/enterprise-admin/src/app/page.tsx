'use client';

import React, { useState, useEffect } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import LoginForm from '@/components/auth/LoginForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import UserProfileForm from '@/components/auth/UserProfileForm';
import { getCurrentUser, logoutUser } from '@/lib/auth';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

type AuthView = 'login' | 'register' | 'forgot-password' | 'profile';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 检查用户登录状态
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setCurrentView('profile');
      }
    } catch (error) {
      console.error('检查认证状态失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setCurrentView('profile');
    setSuccess('登录成功');
    setError(null);
  };

  const handleLoginError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess(null);
  };

  const handleRegisterSuccess = () => {
    setSuccess('注册成功，请查收邮件验证您的账户');
    setError(null);
    setCurrentView('login');
  };

  const handleRegisterError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess(null);
  };

  const handleForgotPasswordSuccess = () => {
    setSuccess('重置密码邮件已发送，请查收邮件');
    setError(null);
  };

  const handleForgotPasswordError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess(null);
  };

  const handleUpdateSuccess = () => {
    setSuccess('更新成功');
    setError(null);
  };

  const handleUpdateError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setCurrentView('login');
      setSuccess('已退出登录');
      setError(null);
    } catch (error: any) {
      setError(error.message || '退出登录失败');
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 消息提示 */}
      {(error || success) && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-medium mb-2 fade-in">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{error}</p>
                </div>
                <button
                  onClick={clearMessages}
                  className="text-red-400 hover:text-red-600 transition-colors ml-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-medium mb-2 fade-in">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{success}</p>
                </div>
                <button
                  onClick={clearMessages}
                  className="text-green-400 hover:text-green-600 transition-colors ml-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 用户已登录 */}
      {user && currentView === 'profile' && (
        <div className="min-h-screen">
          {/* 顶部导航栏 */}
          <div className="bg-white shadow-soft border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">企</span>
                  </div>
                  <h1 className="text-xl font-semibold text-gray-900">企业管理系统</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    欢迎，{user?.userProfile?.first_name} {user?.userProfile?.last_name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 用户信息管理 */}
          <div className="py-8">
            <UserProfileForm
              user={user}
              onUpdateSuccess={handleUpdateSuccess}
              onUpdateError={handleUpdateError}
            />
          </div>
        </div>
      )}

      {/* 认证页面 */}
      {!user && (
        <>
          {currentView === 'login' && (
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              onLoginError={handleLoginError}
              onSwitchToRegister={() => setCurrentView('register')}
              onForgotPassword={() => setCurrentView('forgot-password')}
            />
          )}

          {currentView === 'register' && (
            <RegisterForm
              onRegisterSuccess={handleRegisterSuccess}
              onRegisterError={handleRegisterError}
              onSwitchToLogin={() => setCurrentView('login')}
            />
          )}

          {currentView === 'forgot-password' && (
            <ForgotPasswordForm
              onSuccess={handleForgotPasswordSuccess}
              onError={handleForgotPasswordError}
              onBackToLogin={() => setCurrentView('login')}
            />
          )}
        </>
      )}
    </div>
  );
} 