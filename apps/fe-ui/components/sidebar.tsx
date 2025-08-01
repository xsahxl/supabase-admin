"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, KeyboardEvent } from "react";

const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
  if (event.key === "Enter" || event.key === " ") {
    event.currentTarget.click();
  }
};

const Sidebar: FC = () => {
  const pathname = usePathname();
  const isCompaniesActive = pathname === '/company';
  const isUsersActive = pathname === '/users';
  const isNewsActive = pathname === '/news';
  return (
    <nav
      className="flex flex-col w-64 h-screen bg-gray-100 border-r border-gray-200 p-4 fixed left-0 top-16 z-20"
      aria-label="侧边导航"
    >
      <Link
        href="/company"
        className={`block py-3 px-4 rounded-lg font-medium transition-colors duration-150 focus:outline-none ${isCompaniesActive
          ? 'bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600'
          : 'text-gray-800 hover:bg-gray-200 focus:bg-gray-200'
          }`}
        tabIndex={0}
        aria-label="企业信息"
        onKeyDown={handleKeyDown}
      >
        企业信息
      </Link>
      <Link
        href="/users"
        className={`block py-3 px-4 rounded-lg font-medium transition-colors duration-150 focus:outline-none mt-2 ${isUsersActive
          ? 'bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600'
          : 'text-gray-800 hover:bg-gray-200 focus:bg-gray-200'
          }`}
        tabIndex={0}
        aria-label="用户管理"
        onKeyDown={handleKeyDown}
      >
        用户管理
      </Link>
      <Link
        href="/news"
        className={`block py-3 px-4 rounded-lg font-medium transition-colors duration-150 focus:outline-none mt-2 ${isNewsActive
          ? 'bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600'
          : 'text-gray-800 hover:bg-gray-200 focus:bg-gray-200'
          }`}
      >
        新闻管理
      </Link>
    </nav>
  );
};

export default Sidebar; 