'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import usePage from '@/hooks/api-hooks/use-page';
import { IPageMenuItem } from '@/types/componentInterfaces';
import { hasPermission, reloadPage } from '@/utils/helper';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { setUIIsUserEditingMode } from '@/store/slice/userSlice';
import { setFecthingPageData, setPageContents } from '@/store/slice/pageSlice';

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
  return allAppRoutes.some(
    (item) => item.href === decodeURIComponent(pathname)
  );
};

const RouteGuard: React.FC<IRouteGuardProps> = ({ children }) => {
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const uiActiveUserRole = String(uiActiveUser.uiRole);
  const uiIsLoading = uiActiveUser.uiIsLoading;
  const dispatch = useAppDispatch();
  const { allAppRoutes } = usePage();
  const router = useRouter();
  const pathname = usePathname();
  const currentPage = allAppRoutes.find(
    (item) =>
      item.href === decodeURIComponent(`/${pathname.split('/')[1]}`) ||
      item.href.startsWith(decodeURIComponent(`/${pathname.split('/')[1]}`))
  );

  useEffect(() => {
    if (uiIsLoading || !currentPage) return;
    if (allAppRoutes && allAppRoutes.length > 0) {
      const isValidRoute =
        pathname.split('/')[1].startsWith('user-profile') ||
        pathname.startsWith('/confirm-user/account-creation') ||
        pathname.startsWith('/confirm-user/reset-password') ||
        isExistingRoute({ allAppRoutes: allAppRoutes, pathname: pathname }) ||
        isExistingRoute({
          allAppRoutes: allAppRoutes,
          pathname: `/${pathname.split('/')[1]}`,
        });
      if (!isValidRoute) {
        router.replace('/404');
      } else {
        if (
          !hasPermission(
            uiActiveUserRole,
            currentPage?.pagePermission as string[]
          )
        ) {
          router.replace('/access-denied');
        }
      }
    }
    dispatch(
      setUIIsUserEditingMode({
        uiIsUserEditingMode: false,
        uiEditorInProfileMode: false,
      })
    );

    dispatch(setPageContents([]));

    dispatch(
      setFecthingPageData({
        fetchedPage: null,
        isPageFetchLoading: true,
        hasPageFetchError: false,
        pageFetchError: undefined,
      })
    );
  }, [allAppRoutes, pathname, router, uiIsLoading, currentPage]);

  return allAppRoutes && allAppRoutes.length > 0 ? <>{children}</> : null;
};

export default RouteGuard;
