'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import usePage from '@/hooks/api-hooks/use-page';
import { IPageMenuItem } from '@/types/componentInterfaces';

interface IRouteGuardProps {
  children: React.ReactNode;
}

interface isExistingRouteProps {
  allAppRoutes: IPageMenuItem[];
  pathname: string;
}

const isExistingRoute: React.FC<isExistingRouteProps> = ({
  allAppRoutes,
  pathname,
}) => {
  return allAppRoutes.some((item) => item.href === pathname);
};

const RouteGuard: React.FC<IRouteGuardProps> = ({ children }) => {
  const { allAppRoutes } = usePage();
  const router = useRouter();
  const pathname = usePathname();

  console.log(pathname.split('/')[1], " pathname: pathname.split('/')[0]");

  useEffect(() => {
    if (allAppRoutes && allAppRoutes.length > 0) {
      const isValidRoute =
        isExistingRoute({ allAppRoutes: allAppRoutes, pathname: pathname }) ||
        pathname.startsWith('/confirm-user/account-creation') ||
        pathname.startsWith('/confirm-user/reset-password') ||
        isExistingRoute({
          allAppRoutes: allAppRoutes,
          pathname: `/${pathname.split('/')[1]}`,
        });
      if (!isValidRoute) {
        router.replace('/404');
      }
    }
  }, [allAppRoutes, pathname, router]);
  return allAppRoutes && allAppRoutes.length > 0 ? <>{children}</> : null;
};

export default RouteGuard;
