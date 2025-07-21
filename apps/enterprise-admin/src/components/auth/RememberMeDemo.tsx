'use client';

import React from 'react';
import { isRememberMeEnabled, getRememberedEmail, clearRememberMe } from '@/lib/auth';

const RememberMeDemo: React.FC = () => {
  const [rememberedEmail, setRememberedEmail] = React.useState<string | null>(null);
  const [isEnabled, setIsEnabled] = React.useState(false);

  React.useEffect(() => {
    // 检查记住登录状态
    setIsEnabled(isRememberMeEnabled());
    setRememberedEmail(getRememberedEmail());
  }, []);

  const handleClearRememberMe = () => {
    clearRememberMe();
    setIsEnabled(false);
    setRememberedEmail(null);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium text-blue-900 mb-2">记住登录状态演示</h3>
      <div className="space-y-2 text-sm text-blue-800">
        <p><strong>当前状态:</strong> {isEnabled ? '已启用' : '未启用'}</p>
        {rememberedEmail && (
          <p><strong>记住的邮箱:</strong> {rememberedEmail}</p>
        )}
        <p><strong>工作原理:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>当用户勾选"记住登录状态"时，邮箱地址会保存到 localStorage</li>
          <li>下次访问登录页面时，会自动填充邮箱并勾选复选框</li>
          <li>用户登出时会清除记住的状态</li>
          <li>数据仅存储在浏览器本地，不会发送到服务器</li>
        </ul>
        {isEnabled && (
          <button
            onClick={handleClearRememberMe}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
          >
            清除记住状态
          </button>
        )}
      </div>
    </div>
  );
};

export default RememberMeDemo; 