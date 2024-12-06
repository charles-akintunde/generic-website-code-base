'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import usePage from '../../hooks/api-hooks/use-page';
import { IPageMenuItem, IUserInfo } from '../../types/componentInterfaces';
import { hasPermission, transformToUserInfo } from '../../utils/helper';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import {
  setUIActiveUser,
  setUIIsUserEditingMode,
} from '../../store/slice/userSlice';
import {
  setFecthingPageData,
  setPageContents,
} from '../../store/slice/pageSlice';
import { appConfig } from '../../utils/appConfig';
import { useGetActiveUserQuery } from '../../api/authApi';
import { EUserRole } from '../../types/enums';

interface IRouteGuardProps {
  children: React.ReactNode;
}

const capitalizeTitle = (text: string) =>
  text
    .toLowerCase()
    .split('-') 
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) 
    .join(' ');


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
  const {
    data: activeUserData,
    isError: hasActiveUserFetchError,
    isSuccess: isActiveUserFetchSuccess,
    isLoading: isActiveUserFetchLoading,
    refetch: activePageRefetch,
  } = useGetActiveUserQuery();
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

  // useEffect(() => {
  //   if (activeUserData?.data) {
  //     const userProfile: IUserInfo = transformToUserInfo(activeUserData?.data);

  //     dispatch(
  //       setUIActiveUser({
  //         uiFullName: `${userProfile.uiFirstName} ${userProfile.uiLastName}`,
  //         uiInitials: userProfile.uiFirstName[0] + userProfile.uiLastName[0],
  //         uiIsAdmin: userProfile.uiRole.includes(EUserRole.Admin),
  //         uiIsSuperAdmin: userProfile.uiRole.includes(EUserRole.SuperAdmin),
  //         uiIsLoading: isActiveUserFetchLoading,
  //         uiId: userProfile.id,
  //         uiCanEdit:
  //           userProfile.uiRole.includes(EUserRole.Admin) ||
  //           userProfile.uiRole.includes(EUserRole.SuperAdmin),
  //         uiRole: userProfile.uiRole,
  //         uiPhotoURL: userProfile.uiPhoto,
  //       })
  //     );
  //   } else {
  //     dispatch(
  //       setUIActiveUser({
  //         uiId: null,
  //         uiFullName: '',
  //         uiInitials: '',
  //         uiIsAdmin: false,
  //         uiIsLoading: isActiveUserFetchLoading,
  //         uiIsSuperAdmin: false,
  //         uiCanEdit: false,
  //         uiRole: [EUserRole.Public],
  //         uiPhotoURL: null,
  //       })
  //     );
  //   }
  // }, [activeUserData, pathname]);

  useEffect(() => {
    if (currentPage) {
      const lastSegment = pathname.split('/').filter(Boolean).pop();
  
      const capitalizeTitle = (text: string) =>
        text
          .toLowerCase()
          .split('-') 
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
  
      const title = lastSegment
        ? capitalizeTitle(decodeURIComponent(lastSegment))
        : capitalizeTitle(currentPage.pageName);
  
      document.title = `${appConfig.appName} - ${title}`;
  
      const metaDescription = document.querySelector('meta[name="description"]');
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
        ogTitle.setAttribute('content', title);
      }
  
      const ogDescription = document.querySelector(
        'meta[property="og:description"]'
      );
      if (ogDescription) {
        ogDescription.setAttribute(
          'content',
          currentPage.description || 'Default description for social media sharing'
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
        pathname.split('/')[1].startsWith('profile') ||
        pathname.startsWith('/confirm-user/account-creation') ||
        pathname.startsWith('/confirm-user/reset-password') ||
        isExistingRoute({ allAppRoutes: allAppRoutes, pathname: pathname }) ||
        isExistingRoute({
          allAppRoutes: allAppRoutes,
          pathname: `/${pathname.split('/')[1]}`,
        });
      if (!isValidRoute) {
        router.replace('/error?type=404');
      } else {
        // if (
        //   !hasPermission(
        //     uiActiveUserRole,
        //     currentPage?.pagePermission as string[]
        //   )
        // ) {
        //   console.log(
        //     uiActiveUserRole,
        //     currentPage?.pagePermission,
        //     'LLLLLLLLLLLLLLL'
        //   );
        //   console.log('Accessed Denied!!!');
        //   router.replace('/access-denied');
        // }
      }
    }
    dispatch(
      setUIIsUserEditingMode({
        uiIsUserEditingMode: false,
        uiEditorInProfileMode: false,
        uiIsAdminInEditingMode: false,
        uiIsPageContentEditingMode: false
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
