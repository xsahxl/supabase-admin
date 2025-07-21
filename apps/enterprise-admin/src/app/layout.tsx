import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '企业管理系统',
  description: '基于 Supabase 的企业管理系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
} 