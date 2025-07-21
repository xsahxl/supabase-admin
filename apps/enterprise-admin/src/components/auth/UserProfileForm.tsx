'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Camera, X, Check } from 'lucide-react';
import { updateProfileSchema, changePasswordSchema, type UpdateProfileFormData, type ChangePasswordFormData } from '@/lib/validation';
import { updateUserProfile, changePassword, uploadAvatar, getLoginDevices } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface UserProfileFormProps {
  user: any;
  onUpdateSuccess: () => void;
  onUpdateError: (error: string) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  user,
  onUpdateSuccess,
  onUpdateError,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'devices'>('profile');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.userProfile?.avatar_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.userProfile?.first_name || '',
      lastName: user?.userProfile?.last_name || '',
      phone: user?.userProfile?.phone || '',
    },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  // 加载登录设备列表
  React.useEffect(() => {
    if (activeTab === 'devices' && user?.authUser?.id) {
      loadLoginDevices();
    }
  }, [activeTab, user?.authUser?.id]);

  const loadLoginDevices = async () => {
    try {
      const devicesData = await getLoginDevices(user.authUser.id);
      setDevices(devicesData || []);
    } catch (error) {
      console.error('加载登录设备失败:', error);
    }
  };

  const handleProfileUpdate = async (data: UpdateProfileFormData) => {
    setLoading(true);
    try {
      await updateUserProfile(user.authUser.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
      onUpdateSuccess();
    } catch (error: any) {
      onUpdateError(error.message || '更新个人信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (data: ChangePasswordFormData) => {
    setLoading(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      passwordForm.reset();
      onUpdateSuccess();
    } catch (error: any) {
      onUpdateError(error.message || '修改密码失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 上传
    try {
      const result = await uploadAvatar(file, user.authUser.id);
      setAvatarPreview(result.avatarUrl);
      onUpdateSuccess();
    } catch (error: any) {
      onUpdateError(error.message || '上传头像失败');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const formatDeviceInfo = (userAgent: string) => {
    // 简单的设备信息解析
    if (userAgent.includes('Mobile')) return '移动设备';
    if (userAgent.includes('iPad')) return 'iPad';
    if (userAgent.includes('Mac')) return 'Mac';
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Linux')) return 'Linux';
    return '未知设备';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg">
        {/* 头像部分 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="头像"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Camera className="w-8 h-8" />
                  </div>
                )}
              </div>
              <button
                onClick={handleAvatarClick}
                className="absolute -bottom-1 -right-1 bg-primary-600 text-white rounded-full p-1 hover:bg-primary-700"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {user?.userProfile?.first_name} {user?.userProfile?.last_name}
              </h3>
              <p className="text-sm text-gray-500">{user?.authUser?.email}</p>
            </div>
          </div>
        </div>

        {/* 标签页 */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              个人信息
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'password'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              修改密码
            </button>
            <button
              onClick={() => setActiveTab('devices')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'devices'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              登录设备
            </button>
          </nav>
        </div>

        {/* 内容区域 */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="姓"
                  type="text"
                  error={profileForm.formState.errors.firstName?.message}
                  {...profileForm.register('firstName')}
                />
                <Input
                  label="名"
                  type="text"
                  error={profileForm.formState.errors.lastName?.message}
                  {...profileForm.register('lastName')}
                />
              </div>
              <Input
                label="手机号"
                type="tel"
                error={profileForm.formState.errors.phone?.message}
                {...profileForm.register('phone')}
              />
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                {loading ? '保存中...' : '保存个人信息'}
              </Button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-6">
              <div className="relative">
                <Input
                  label="当前密码"
                  type={showCurrentPassword ? 'text' : 'password'}
                  error={passwordForm.formState.errors.currentPassword?.message}
                  {...passwordForm.register('currentPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="新密码"
                  type={showNewPassword ? 'text' : 'password'}
                  error={passwordForm.formState.errors.newPassword?.message}
                  {...passwordForm.register('newPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="确认新密码"
                  type={showConfirmPassword ? 'text' : 'password'}
                  error={passwordForm.formState.errors.confirmPassword?.message}
                  {...passwordForm.register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                {loading ? '修改中...' : '修改密码'}
              </Button>
            </form>
          )}

          {activeTab === 'devices' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">登录设备</h3>
              <div className="space-y-3">
                {devices.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDeviceInfo(device.user_agent)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(device.login_time).toLocaleString('zh-CN')}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {device.ip_address}
                    </div>
                  </div>
                ))}
                {devices.length === 0 && (
                  <p className="text-gray-500 text-center py-8">暂无登录记录</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm; 