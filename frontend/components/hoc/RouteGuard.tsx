'use client';

import { ComponentType, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import useMenuItems from '@/hooks/api-hooks/useMenuItems';

import { useRouter } from 'next/navigation';

interface IRouteGuard {
  children: React.ReactNode;
}

const RouteGuard: React.FC<IRouteGuard> = ({ children }) => {
  const { menuItems, isLoading } = useMenuItems();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading) {
      const isValidRoute = menuItems.some((item) => item.href === pathname);
      if (!isValidRoute) {
        router.replace('/404');
      }
    }
  }, [menuItems, isLoading, pathname, router]);

  return isMounted && !isLoading ? <>{children}</> : null;
};

export default RouteGuard;
