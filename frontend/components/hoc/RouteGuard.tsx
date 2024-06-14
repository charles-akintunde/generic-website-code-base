'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import useMenuItems from '@/hooks/api-hooks/useMenuItems';
import { useRouter } from 'next/navigation';

interface IRouteGuard {
  children: React.ReactNode;
}

const RouteGuard: React.FC<IRouteGuard> = ({ children }) => {
  const { menuItems, isLoading } = useMenuItems(); // Removed isLoading
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if menuItems data is available
    if (menuItems && menuItems.length > 0) {
      const isValidRoute =
        menuItems.some((item) => item.href === pathname) ||
        pathname.startsWith('/confirm-user/account-creation') ||
        pathname.startsWith('/confirm-user/reset-password');
      if (!isValidRoute) {
        router.replace('/404');
      }
    }
  }, [menuItems, pathname, router]); // Include menuItems, pathname, and router

  // Render children only when menuItems data is ready
  return menuItems && menuItems.length > 0 ? <>{children}</> : null;
};

export default RouteGuard;
