'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import usePage from '@/hooks/api-hooks/usePage';

interface IRouteGuard {
  children: React.ReactNode;
}

const RouteGuard: React.FC<IRouteGuard> = ({ children }) => {
  const { allAppRoutes } = usePage();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (allAppRoutes && allAppRoutes.length > 0) {
      const isValidRoute =
        allAppRoutes.some((item) => item.href === pathname) ||
        pathname.startsWith('/confirm-user/account-creation') ||
        pathname.startsWith('/confirm-user/reset-password');
      if (!isValidRoute) {
        router.replace('/404');
      }
    }
  }, [allAppRoutes, pathname, router]);
  return allAppRoutes && allAppRoutes.length > 0 ? <>{children}</> : null;
};

export default RouteGuard;
