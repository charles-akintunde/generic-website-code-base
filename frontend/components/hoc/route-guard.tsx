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
import { appConfig } from '@/utils/appConfig';
import useUserInfo from '@/hooks/api-hooks/use-user-info';
import { routes } from './layout/menu-items';

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

const findPage = (
  routes: IPageMenuItem[],
  pathname: string
): IPageMenuItem | undefined => {
  const decodedPath = decodeURIComponent(`/${pathname.split('/')[1]}`);

  for (const item of routes) {
    if (
      item.href === decodedPath ||
      (item.href && item.href.startsWith(decodedPath))
    ) {
      return item;
    }

    if (item.children && item.children.length > 0) {
      const matchingChild = item.children.find((child) => {
        const childDecodedPath = decodeURIComponent(
          `/${pathname.split('/')[1]}`
        );
        return (
          child.href === childDecodedPath ||
          (child.href && child.href.startsWith(childDecodedPath))
        );
      });

      if (matchingChild) {
        return matchingChild;
      }
    }
  }

  return undefined;
};

const RouteGuard: React.FC<IRouteGuardProps> = ({ children }) => {
  const { activePageRefetch } = useUserInfo();
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const uiActiveUserRole = String(uiActiveUser.uiRole);
  const uiIsLoading = uiActiveUser.uiIsLoading;
  const dispatch = useAppDispatch();
  const { allAppRoutes } = usePage();
  const router = useRouter();
  const pathname = usePathname();
  const currentPage = findPage(allAppRoutes, pathname);

  // const currentPage = allAppRoutes.find(
  //   (item) =>
  //     item.href === decodeURIComponent(`/${pathname.split('/')[1]}`) ||
  //     item.href.startsWith(decodeURIComponent(`/${pathname.split('/')[1]}`))
  // );

  useEffect(() => {
    if (currentPage) {
      document.title = `${currentPage.pageName} | ${appConfig.appName}`;

      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          'content',
          currentPage.description || 'Default description for SEO'
        );
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = currentPage.description || 'Default description for SEO';
        document.head.appendChild(meta);
      }

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', currentPage.pageName);
      }

      const ogDescription = document.querySelector(
        'meta[property="og:description"]'
      );
      if (ogDescription) {
        ogDescription.setAttribute(
          'content',
          currentPage.description ||
            'Default description for social media sharing'
        );
      }

      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
        ogUrl.setAttribute('content', `${appConfig.appURL}${currentPage.href}`);
      }
    }
  }, [pathname, currentPage]);

  useEffect(() => {
    if (uiIsLoading || !currentPage) return;
    if (allAppRoutes && allAppRoutes.length > 0) {
      const isValidRoute =
        currentPage ||
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

    activePageRefetch();

    routes.forEach((route) => {
      router.prefetch(route.href);
    });
  }, [allAppRoutes, pathname, router, uiIsLoading, currentPage]);

  return allAppRoutes && allAppRoutes.length > 0 ? <>{children}</> : null;
};

export default RouteGuard;
