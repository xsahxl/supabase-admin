"use client"

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./sidebar";

const ConditionalSidebar = () => {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      if (isAuthPage) {
        mainElement.classList.remove('ml-64');
        mainElement.classList.add('ml-0');
      } else {
        mainElement.classList.remove('ml-0');
        mainElement.classList.add('ml-64');
      }
    }
  }, [isAuthPage]);

  if (isAuthPage) {
    return null;
  }

  return <Sidebar />;
};

export default ConditionalSidebar; 